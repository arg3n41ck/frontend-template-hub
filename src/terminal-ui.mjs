export function shouldUseColor({ isTTY, json = false, noColor = false }) {
  return !!isTTY && !json && !noColor;
}

export function terminalPalette(color) {
  const paint = (code, value) => color ? `\x1b[${code}m${value}\x1b[0m` : value;
  return {
    accent: value => paint('96', value),
    bold: value => paint('1', value),
    success: value => paint('32', value),
    warning: value => paint('33', value),
    danger: value => paint('31', value),
    muted: value => paint('2', value),
  };
}

function panel(title, color) {
  const ui = terminalPalette(color);
  return [
    ui.accent('╭─ ✦ Template Agent ────────────────╮'),
    `${ui.accent('│')} ${ui.success('✓')} ${ui.bold(title)}`,
    ui.accent('╰───────────────────────────────────╯'),
  ].join('\n');
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

export function formatCliError(message, { color = false } = {}) {
  return terminalPalette(color).danger(`ERROR: ${message}`);
}

export function formatTemplates(templates, { color = false, interactive = false } = {}) {
  const ui = terminalPalette(color);
  const lines = templates.flatMap((entry, index) => [
    `${ui.warning(String(index + 1))}  ${ui.bold(entry.name)} ${ui.muted(`(${entry.id})`)}`,
    `   ${ui.muted(entry.description)}`,
  ]);
  if (!interactive) return lines.join('\n');
  return [
    ui.accent('✦ Новый проект'),
    ui.muted('Выбери template. Нужны только номер и название проекта.'),
    '',
    ...lines,
    '',
    `${ui.accent('Введите номер')}: `,
  ].join('\n');
}

export function formatCreateSuccess({ target, entry, color = false }) {
  const ui = terminalPalette(color);
  return [
    panel('Проект создан', color),
    `${ui.muted('Template:')} ${ui.bold(entry.name)} ${ui.muted(`(${entry.id})`)}`,
    `${ui.muted('Папка:')} ${target}`,
    '',
    ui.accent('Дальше:'),
    `  cd ${shellQuote(target)}`,
    '  pnpm install',
    '  pnpm dev',
  ].join('\n');
}

export function formatCreatePreview({ target, entry, color }) {
  const ui = terminalPalette(color);
  return [
    panel('Проверка создания', color),
    `${ui.muted('Template:')} ${ui.bold(entry.name)} ${ui.muted(`(${entry.id})`)}`,
    `${ui.muted('Папка:')} ${target}`,
    ui.warning('Файлы не созданы: включён --dry-run.'),
  ].join('\n');
}

export function formatSkillSummary({ skills, action, dryRun, color }) {
  const ui = terminalPalette(color);
  const installed = skills.some(item => item.status === 'installed' || item.status === 'updated');
  const title = dryRun
    ? `Проверка: ${action}`
    : action === 'setup'
      ? installed ? 'AI-skill готов' : 'AI-skill уже актуален'
      : 'AI-skill удалён';
  const details = skills.map(item => `  ${ui.muted('•')} ${ui.bold(item.client)}: ${item.status}`).join('\n');
  const next = action === 'setup'
    ? ['','Перезапусти Codex или Claude Code, если skill не появился сразу.', 'Затем просто опиши новый проект — агент выберет подходящий template.']
    : [];
  return [panel(title, color), details, ...next].filter(Boolean).join('\n');
}

export function formatDoctor(result, color) {
  const ui = terminalPalette(color);
  const state = value => value ? ui.success('✓') : ui.danger('✗');
  return [
    panel(result.ok ? 'Среда готова' : 'Среда требует внимания', color),
    `${state(result.node.supported)} Node.js ${result.node.version}`,
    `${state(result.git.supported)} Git`,
    `${ui.muted('Catalog:')} ${result.catalog.source}${result.catalog.stale ? ' (stale)' : ''}`,
  ].join('\n');
}

export function formatUpdate(result, color) {
  const ui = terminalPalette(color);
  return [
    panel('Catalog обновлён', color),
    `${ui.muted('Источник:')} ${result.catalog.source}`,
    result.skills.length ? `${ui.muted('Skills:')} ${result.skills.map(item => `${item.client} — ${item.status}`).join(', ')}` : ui.muted('Skills: поддерживаемые клиенты не найдены.'),
  ].join('\n');
}

export function formatProjectCheck(result, color) {
  const ui = terminalPalette(color);
  return [
    panel(result.updateAvailable ? 'Есть обновление template' : 'Template актуален', color),
    `${ui.muted('Проект:')} ${result.project}`,
    `${ui.muted('Template:')} ${result.template}`,
  ].join('\n');
}
