import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validatePackageManifest } from './package-preflight.mjs';

test('published package has no install lifecycle scripts', () => {
  const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.doesNotThrow(() => validatePackageManifest(manifest));
  assert.throws(() => validatePackageManifest({ ...manifest, scripts: { ...manifest.scripts, postinstall: 'bad' } }), /lifecycle/i);
});
