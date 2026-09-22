# Template Agent

**Один раз установите AI-skill — затем агент сам выбирает и создаёт подходящий starter.**

`@argenalimbaev/template-agent` — публичный Node.js CLI и каталог независимых frontend-шаблонов. Шаблоны не лежат внутри npm-пакета: каждый имеет свой GitHub-репозиторий, rules, skills, wiki и проверку.

## Быстрый старт

Нужны Node.js 22.14+ и Git.

### Автоматически в Codex или Claude Code

```bash
npx --yes @argenalimbaev/template-agent@1 setup
```

После установки CLI покажет краткий success-screen и следующий шаг. Перезапустите coding-agent, если новый skill не появился сразу. Затем можно написать:

> Создай CRM-проект `sales-crm` с готовым dashboard. API уже существует.

Агент прочитает актуальный каталог, выберет `crm-dashboard`, назовёт причину и выполнит CLI-команду. Он уточнит вопрос только при настоящей неоднозначности, несовместимых требованиях или отсутствии подходящего шаблона.

### Вручную в любом терминале

```bash
npx --yes @argenalimbaev/template-agent@1 create
```

CLI спросит ровно две вещи: шаблон из списка и имя проекта. В интерактивном терминале номера, подсказки и success-screen подсвечиваются; JSON и неинтерактивный вывод остаются plain text.

Или без вопросов:

```bash
npx --yes @argenalimbaev/template-agent@1 create sales-crm --template crm-dashboard
```

Для других package managers:

```bash
pnpm dlx @argenalimbaev/template-agent@1 create
bunx @argenalimbaev/template-agent@1 create
```

## Terminal UX

В обычном терминале CLI показывает компактные экраны: выбор template с цветными номерами, статус установки global skill, создание проекта и конкретные команды запуска.

```text
╭─ ✦ Template Agent ────────────────╮
│ ✓ Проект создан
╰───────────────────────────────────╯

Дальше:
  cd './sales-crm'
  pnpm install
  pnpm dev
```

- `--json` всегда печатает только JSON без ANSI-кодов — для скриптов и агентов.
- Ошибки в интерактивном терминале выделяются красным, а успех — зелёным.
- `NO_COLOR=1` отключает цвета, не меняя команды и результат.
- Вне TTY (CI, pipe) CLI не добавляет цветовые коды.

## Доступные starters

| ID | Когда выбирать | Не содержит |
| --- | --- | --- |
| `react-vite` | Простая React-вёрстка или небольшой SPA без SSR | dashboard, backend, router |
| `next` | Явно нужен Next.js, SSR или public content site | dashboard, Nest API |
| `crm-dashboard` | Готовый CRM/admin SPA и отдельный существующий API | production auth, backend |
| `fullstack-next-nest` | Свой Next.js + NestJS + PostgreSQL в одном проекте | готовый CRM dashboard |

Точный состав каталога не зашит в skill: смотрите его через `template-agent list --json`.

## Что гарантирует CLI

- выбирает только `enabled` templates из проверенного registry;
- клонирует immutable tag и сверяет точный commit;
- проверяет skills и AI-contract исходного template;
- не перезаписывает существующие папки, файлы или symlink;
- создаёт новый Git history без template origin по умолчанию;
- не устанавливает зависимости, не запускает hooks и не отправляет telemetry;
- оставляет `.template-provenance.json` для проверки происхождения.

Созданный проект — независимый snapshot. Он **никогда** не обновляется автоматически.

## Команды обслуживания

```bash
# Проверить среду, skill и catalog
npx --yes @argenalimbaev/template-agent@1 doctor

# Обновить catalog cache и установленный managed skill
npx --yes @argenalimbaev/template-agent@1 update

# Узнать, есть ли новый template release для созданного проекта
npx --yes @argenalimbaev/template-agent@1 check ./sales-crm

# Удалить только skill, созданный Template Agent
npx --yes @argenalimbaev/template-agent@1 uninstall --purge-cache
```

`setup` не перезаписывает чужой skill с тем же именем. В Codex skill устанавливается в `$HOME/.agents/skills`, в Claude Code — в `~/.claude/skills` или `CLAUDE_CONFIG_DIR`. Cursor, browser-chat и другие среды без поддерживаемого global-skill используют ручный CLI. Чат без shell/filesystem может только показать команду, но не создать файлы на вашем компьютере.

## Обновления и безопасность

- CLI сам не обновляется в фоне. Вызов `npx …@1` явно использует актуальный совместимый major.
- Catalog ищет последний immutable GitHub Release `catalog-v*`, хранит валидный local cache и при offline использует cache/fallback registry.
- Новый template: новый tag в его репозитории → exact commit в registry → `catalog-v*` release. npm-пакет обновляется только при изменении CLI или registry-контракта.
- Стандартный каталог разрешает first-party public HTTPS sources. Будущие сторонние sources потребуют явного `--allow-third-party`.
- Не передавайте токены, пароли или коды 2FA в brief, registry или issue. Private sources требуют собственных credentials пользователя.

## Для maintainers

Hub хранит selector/generator и metadata, но не копии skills. Canonical skills остаются в `.ai/skills` каждого template; registry лишь сверяет их inventory.

- [Архитектура](docs/architecture.md)
- [Расширение каталога](docs/extending.md)
- [Совместимость и ограничения](docs/compatibility.md)
- [Публикация catalog и npm CLI](docs/publishing.md)
- [Проверка](docs/verification.md)

Перед release: `npm run verify && npm run pack:check`.

## Лицензирование

Публичность репозитория не является лицензией на использование. До распространения нужно проверить лицензии source repositories и сторонних skills. Эта версия не меняет лицензию автоматически.
