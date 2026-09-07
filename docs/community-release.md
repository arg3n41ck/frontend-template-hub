# Готовность к выпуску — 2026-09-07

**Статус: исходные шаблоны v0.3.0 опубликованы; hub v0.4.0 содержит проверенные source pins. Публикация разрешена пользователем, лицензии не менялись.**

## Что очищено

- CRM: удалены неиспользуемая локальная копия tailwind-merge, два example-маршрута, устаревший readme/ с неверной структурой/командами. Актуальный источник — docs/; добавлен проверяемый deployment guide. Route tree пересоздан штатным Vite-плагином.
- Fullstack: удалён устаревший executable behaviour-check.sh; ссылка в historical reference заменена на текущие project checks. Обязательные skills/wiki/graph, UI/UX-базы и portable forwarding files сохранены.
- Пять репозиториев: общий блок .gitignore защищает env-файлы, локальные настройки, Python/AI/build/test caches; .env.example остаётся доступен для Git. Hub больше не зависит от личного .git/info/exclude.
- CRM Dockerfile теперь копирует preinstall checker и pnpm workspace policy до установки; .dockerignore исключает секреты, зависимости и агентский runtime из build context. Docker runtime-проверка не выполнена: daemon недоступен.

## Зависимости

- CRM: Axios 1.20.0, Vite 6.4.3, совместимые исправления транзитивных зависимостей. Для старых закреплённых TanStack/Solid зависимостей добавлен ограниченный override seroval<1.5.3 → 1.6.4 с условием удаления.
- Остальные шаблоны: исправлена транзитивная qs до 6.16.0 там, где требовалось. Nuqs и архитектура не менялись.
- Production audit: 0 advisories во всех четырёх приложениях.
- Full audit: 0 advisories во всех четырёх приложениях. CRM мигрирован на Vitest/UI/Istanbul 4.1.11, Happy DOM 20.14.0 и единый Storybook 10.6.0; peers check без конфликтов. Полный audit и Storybook/coverage добавлены в CRM CI.
- Источники изменений: [Axios releases](https://github.com/axios/axios/releases), [Seroval releases](https://github.com/lxsmnsyc/seroval/releases), [qs changelog](https://github.com/ljharb/qs/blob/main/CHANGELOG.md). Audit — снимок базы advisories, не гарантия отсутствия уязвимостей.

## Проверки

- Все четыре: frozen-lockfile install без lifecycle scripts и pnpm verify проходят после обновлений.
- Hub: 44 Node-теста; 3 Graphify adapter-теста; registry validation; четыре kit/manifest/adapter checks.
- Генерация четырёх актуальных локальных Git snapshots: пустой HOME, каталог с пробелами, точная provenance, отсутствие origin/исходной истории, standalone AI-check и выборочные маршруты. Отдельная проверка опубликованных HTTPS-тегов описана ниже.
- Browser: production builds, главные экраны при 1440/390 px; без pageerror/переполнения. Удалённые CRM URL показывают Not Found. Предыдущая проверка nuqs filter/reset/Back/Forward/server-refresh описана в skills-url-state-report.md; cleanup её не заменяет.
- Новый release-preflight проверяет публикуемые working-tree файлы и общий ignore policy. Тесты проверяют свежий Git checkout без maintainer exclusions и принудительно tracked .env. Это ограниченный scanner: не аудит всей Git-истории/всех форматов секретов.
- Публикация выполняется без force-push и изменения существующих тегов; source templates публикуются раньше hub registry.

## Release gates

| Пункт | Состояние |
|---|---|
| Малые проверяемые изменения / сохранение пользовательского кода | Scoped cleanup + security dependencies; предыдущая работа сохранена |
| Rollback | Вернуть только scoped удаления/изменения, не reset всего дерева; данных/миграций нет |
| Isolation | Локальные snapshots/preview; production не затрагивался |
| Tests/build/browser | Пройдены в указанном объёме |
| Production dependency audit | Пройден |
| CRM development supply chain | Миграция завершена: полный audit0, peers0, verify/coverage/Storybook build/browser PASS |
| Лицензирование community distribution | **Не подтверждено: root license отсутствует, права на старые сторонние references требуют проверки; прежнее решение не менять лицензии соблюдено** |
| Docker / PostgreSQL E2E | Не проверены, daemon недоступен |
| Cross-provider AI compliance | Нет live benchmark; проверены только routing/contracts |
| Observability / CI | GitHub Actions всех пяти репозиториев PASS; deploy не выполнялся |
| Ownership | Hub: registry/kit/generator; CRM: shared helper/router/toolchain; Next/React/fullstack: source templates. Самопроверка, независимого review не было |

## Выпуск v0.3.0 / hub v0.4.0

Точные ref/commit/skills находятся в `registry/templates.json`; источник inventory — опубликованный `.ai/workflows.json`. Старые теги не перемещались. Созданные ранее проекты автоматически не обновляются.

| Исходник | Commit | Skills |
|---|---|---|
| React | 57df8c351680387820a889db7fb9c4a360575c12 | 40 |
| Next | 2d829b7145ad8cb788c5dadc05bb7983638ff834 | 42 |
| CRM | f3f72786b9e182baf5f2698b16c6ceb8b42e9686 | 42 |
| Fullstack | 264661baaffcaccb5f83ea83420f645c4ffa9a9c | 55 |

Анонимная HTTPS-генерация всех четырёх опубликованных тегов: PASS (пустой HOME, отключённые credentials/system/global Git config, каталог с пробелами, exact provenance, 40/42/42/55 skills, portable adapters, no origin/history, standalone AI check). Remote CI проверяется отдельно; локальные результаты не заменяют GitHub Actions. Backout: additive commit либо registry pin на прежний проверенный тег; никаких force-push/перемещений тегов.

## Проверка миграции CRM

Frozen install и полный verify проходят. Storybook manager/обе stories проверены в браузере вместе с основным CRM-экраном; устранены неразрешённый @ alias и отсутствие Tailwind utility styles в preview. Coverage работает, statements2.3% — существующие3 теста, не полное покрытие. Предупреждения служебного Storybook bundle не скрывались. Источники миграции: [Storybook10](https://storybook.js.org/docs/releases/migration-guide), [consolidated packages](https://storybook.js.org/docs/releases/migration-guide-from-older-version), [Vitest](https://vitest.dev/guide/migration/).

## Итог публикации

- Source branch/tag pushes выполнены атомарно: main + v0.3.0; существующие теги не менялись.
- Hub main опубликован; анонимно клонирован с GitHub и из него успешно созданы все четыре проекта. Не использовались локальные source repositories или credentials.
- GitHub Actions: [React](https://github.com/arg3n41ck/frontend-template-react/actions/runs/34098851937), [Next](https://github.com/arg3n41ck/frontend-template-next/actions/runs/34098856316), [CRM](https://github.com/arg3n41ck/template-crm/actions/runs/34098861406), [Fullstack](https://github.com/arg3n41ck/frontend-template-fullstack/actions/runs/34098865827), [Hub code release](https://github.com/arg3n41ck/frontend-template-hub/actions/runs/34099011963) — PASS. Последний hub release commit закрывает только документацию/task context; его отдельный CI доступен в Actions.
- Локально повторены pnpm verify во всех приложениях, 44 hub Node-теста, 3 Graphify adapter-теста и release-preflight всех пяти.
- Не заявляется production-ready: Docker/PostgreSQL E2E, полный бизнес-test coverage, cross-model reasoning benchmark и distribution rights остаются непроверенными. Лицензии не менялись.
- Следующий пользователь может клонировать hub v0.4.0 по HTTPS и дать ИИ ТЗ: AGENTS.md направит выбор через актуальный registry. npm package или глобальная установка не требуются.
