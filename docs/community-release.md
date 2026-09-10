# Готовность к выпуску — 2026-09-10

**Статус: исходные шаблоны v0.4.0 опубликованы; hub v0.5.0 содержит точные проверенные pins. Публикация разрешена пользователем, лицензии не менялись.**

## Изменения

- Все frontend-шаблоны используют единые границы `app/modules/shared`; у fullstack frontend расположен в `apps/web`, а Next.js сохраняет тонкие App Router routes в `src/app`.
- Базовые shadcn-компоненты находятся в `shared/ui/shadcn`; `components.json` и `pnpm ui:add` направляют новые компоненты туда же. Остальной каталог подключается по требованию и не лежит в исходниках.
- Общая CRM-палитра отделена от семантических light/dark tokens. shadcn использует семантические переменные, а `test:theme` запрещает raw registry colors.
- CRM dashboard переведён с ручных sidebar/menu/tooltip компонентов на shadcn Sidebar, Sheet, Tooltip, Collapsible, DropdownMenu и Avatar. Сохранены desktop collapse, mobile navigation и доступные подписи.
- Next.js обновлён до 16.3.4 в Next/fullstack; dependency overrides закрывают найденные advisories.

## Проверки

- Все четыре исходника: frozen-lockfile install, `pnpm verify`, `pnpm audit`, AI context check и `pnpm ui:check hover-card` — PASS.
- Theme contract: 3/3 в каждом frontend; CRM Vitest 5/5, coverage, peers и Storybook build — PASS.
- Browser smoke: React, Next, CRM и fullstack web на desktop/mobile без horizontal overflow и console errors; primary token вычисляется как `#fddb2b`. Next/fullstack hydration warning устранён.
- Source GitHub Actions `verify` и `AI contract` для точных release commits — PASS.
- Hub registry validation, 42 Node-теста, Graphify adapter tests, anonymous HTTPS generation всех четырёх templates и release-preflight пяти repositories — PASS.

## Release pins

| Исходник | Tag | Commit | Skills |
|---|---|---|---|
| React | v0.4.0 | 33ebe51a8297bbf85f8e6aa100ed199a73ebaeaf | 40 |
| Next | v0.4.0 | ba57088a121887c2809304b1da6589f23a421aae | 42 |
| CRM | v0.4.0 | 745cb18e0651ae07a0c307160df31bc93c792569 | 42 |
| Fullstack | v0.4.0 | dcc6d55ea362d094dc1bad88a540618969420bf3 | 55 |

Старые теги не перемещались. Созданные ранее проекты автоматически не обновляются. Backout: новый additive commit либо возврат registry pin на прежний проверенный тег; force-push не применяется.

## Остаточные риски

- Root license и права на старые сторонние references для community distribution не подтверждены; лицензии в этом выпуске не менялись.
- Docker/PostgreSQL E2E fullstack не повторялся; API unit/build и web checks прошли.
- Полный бизнес-test coverage и cross-model benchmark не заявляются.
