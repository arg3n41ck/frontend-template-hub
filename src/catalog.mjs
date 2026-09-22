import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { dirname, join } from 'node:path';
import { validateRegistry } from '../scripts/registry.mjs';
import { compareSemver } from './semver.mjs';

export const CLI_VERSION = '1.0.1';
export const CATALOG_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
export const MAX_CATALOG_BYTES = 1024 * 1024;
export const DEFAULT_RELEASE_API_URL = 'https://api.github.com/repos/arg3n41ck/frontend-template-hub/releases?per_page=100';

export function defaultCacheDirectory({ home = homedir(), env = process.env, os = platform() } = {}) {
  if (os === 'darwin') return join(home, 'Library', 'Caches', 'template-agent');
  if (os === 'win32') return join(env.LOCALAPPDATA || join(home, 'AppData', 'Local'), 'template-agent', 'Cache');
  return join(env.XDG_CACHE_HOME || join(home, '.cache'), 'template-agent');
}

function catalogFile(cacheDirectory) {
  return join(cacheDirectory, 'catalog.json');
}

function readCatalogFile(file) {
  return validateRegistry(JSON.parse(readFileSync(file, 'utf8')));
}

function ensureCompatible(registry, cliVersion) {
  if (registry.minCliVersion && compareSemver(cliVersion, registry.minCliVersion) < 0) {
    throw new Error(`Catalog requires CLI ${registry.minCliVersion} or newer; run npx @argenalimbaev/template-agent@1 update.`);
  }
  return registry;
}

function saveCatalog(cacheDirectory, registry) {
  mkdirSync(cacheDirectory, { recursive: true });
  const file = catalogFile(cacheDirectory);
  const temporary = `${file}.${process.pid}.tmp`;
  writeFileSync(temporary, JSON.stringify(registry, null, 2) + '\n', { mode: 0o600 });
  renameSync(temporary, file);
}

async function readResponseJson(response, label) {
  if (!response.ok) throw new Error(`${label} returned HTTP ${response.status}.`);
  const length = Number(response.headers.get('content-length') || '0');
  if (length > MAX_CATALOG_BYTES) throw new Error(`${label} is too large.`);
  const text = await response.text();
  if (Buffer.byteLength(text) > MAX_CATALOG_BYTES) throw new Error(`${label} is too large.`);
  return JSON.parse(text);
}

async function fetchRemoteCatalog({ fetchImpl, releaseApiUrl, timeoutMs }) {
  const signal = AbortSignal.timeout(timeoutMs);
  const releasesResponse = await fetchImpl(releaseApiUrl, {
    headers: { accept: 'application/vnd.github+json', 'user-agent': 'template-agent' },
    signal,
  });
  const releases = await readResponseJson(releasesResponse, 'Catalog release endpoint');
  if (!Array.isArray(releases)) throw new Error('Catalog release endpoint returned an invalid payload.');
  const release = releases.find(item => !item.draft && !item.prerelease && /^catalog-v\d+\.\d+\.\d+$/.test(item.tag_name));
  const asset = release?.assets?.find(item => item.name === 'templates.json' && typeof item.browser_download_url === 'string');
  if (!asset) throw new Error('No published catalog-v release with templates.json was found.');
  const assetUrl = new URL(asset.browser_download_url);
  if (assetUrl.protocol !== 'https:') throw new Error('Catalog asset must use HTTPS.');
  const catalogResponse = await fetchImpl(assetUrl.href, {
    headers: { accept: 'application/json', 'user-agent': 'template-agent' },
    signal,
  });
  return validateRegistry(await readResponseJson(catalogResponse, 'Catalog asset'));
}

export async function resolveCatalog({
  bundledRegistry,
  cacheDirectory = defaultCacheDirectory(),
  releaseApiUrl = DEFAULT_RELEASE_API_URL,
  fetchImpl = globalThis.fetch,
  cliVersion = CLI_VERSION,
  forceRefresh = false,
  timeoutMs = 10_000,
  now = Date.now(),
} = {}) {
  if (!bundledRegistry) throw new Error('Bundled catalog is required.');
  const cached = catalogFile(cacheDirectory);
  if (!forceRefresh && existsSync(cached) && now - statSync(cached).mtimeMs < CATALOG_CACHE_TTL_MS) {
    try {
      return { registry: ensureCompatible(readCatalogFile(cached), cliVersion), source: 'cache', stale: false };
    } catch (error) {
      if (/requires CLI/.test(error.message)) throw error;
      // A damaged cache is never trusted.
    }
  }
  try {
    const registry = ensureCompatible(await fetchRemoteCatalog({ fetchImpl, releaseApiUrl, timeoutMs }), cliVersion);
    saveCatalog(cacheDirectory, registry);
    return { registry, source: 'remote', stale: false };
  } catch (error) {
    if (/requires CLI/.test(error.message)) throw error;
    if (existsSync(cached)) {
      try {
        return { registry: ensureCompatible(readCatalogFile(cached), cliVersion), source: 'cache', stale: true, warning: error.message };
      } catch (cacheError) {
        if (/requires CLI/.test(cacheError.message)) throw cacheError;
        // Fall through to the bundled release.
      }
    }
    return { registry: ensureCompatible(validateRegistry(bundledRegistry), cliVersion), source: 'bundled', stale: true, warning: error.message };
  }
}
