> Historical verification snapshot. Current release status: [community-release.md](community-release.md).

# Дополнение: профильные skills и URL-state

Статус: выполнено локально; публикация не выполнялась.

| Репозиторий | Всего skills | URL-state |
|---|---:|---|
| React | 40 | nuqs 2.10.1 |
| Next | 42 | nuqs 2.10.1 |
| CRM | 42 | существующий TanStack Router |
| Fullstack | 55 | nuqs 2.10.1 только в web |
| Hub | 4 | bootstrap + три maintainer-skills |

Добавлены все 20 согласованных ролей по профилям, плюс общий url-state. Это локальные suite-owned инструкции, не скачанные неизвестные marketplace-пакеты. Общий исходник — kit/domain-skills, распределение — kit/skill-profiles.json. Вход через AGENTS/manifest и portable adapters; весь каталог не загружается на каждую задачу.

Правила охватывают URL-фильтры, пагинацию, сортировку, history, безопасные parsers, атомарные изменения, query keys, debounce/cancellation, приватность, даты и границы ответственности. README обновлены на русском, технические skills/rules оставлены на английском по ранее выбранному правилу.

Проверки: 42/42 Node-теста hub; manifest/adapter/drift во всех четырёх; pnpm verify во всех четырёх; 12 nuqs parser-тестов (по 4) и 3 CRM regression-теста. Локальный browser smoke четырёх стартовых экранов на 1440/390 px. На трёх временных страницах проверены реальные nuqs filter/reset/history/reload/invalid params, а в Next/fullstack — server refresh. Временные страницы и их dev type-cache удалены, свои серверы остановлены.

CRM исправления ограничены usePaginationQuery и его тестовым окружением: одно обновление, валидация чисел, merge со свежим state. Другие compatibility helpers не выданы за мигрированные. В legacy router boundary сохранён локальный type escape, новые feature routes должны объявлять validateSearch.

Не проверено: бизнес-API/БД, полная миграция старых CRM-фильтров, live cross-model compliance, новый remote CI и anonymous HTTPS генерация новой версии. Старые registry refs/commits намеренно сохранены. Отдельные install warnings об устаревшем ESLint/транзитивных зависимостях не исправлялись посторонним upgrade. Лицензии прежних сторонних references не менялись и не сертифицировались этим расширением.

Backout: откатить только расширение skills/URL-state и соответствующие lockfile hunks, не предыдущую работу; данных/миграций нет. Next: при явной команде публикации выпустить исходники и синхронно обновить registry ref/commit/skills, затем проверить HTTPS generation и CI.
