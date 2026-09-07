# URL state and list behavior

## Choose one owner

- React starter: installed `nuqs`, `NuqsAdapter` from `nuqs/adapters/react` in `src/main.tsx`. Do not add a router merely for filters.
- Next starter and fullstack web: installed `nuqs`, `nuqs/adapters/next/app` in root layout. Keep layout/server data on the server; only the hook consumer is client-side.
- CRM: existing TanStack Router search APIs. Use route-owned `validateSearch`, `Route.useSearch` and functional `navigate({ search: previous => ... })` for new features. Do not mix nuqs and TanStack writes for the same keys. No nuqs dependency is needed here.
- This is a starter policy, not permission to migrate an existing consumer project without impact analysis.

## Source of truth

Applied shareable filters, search, page/page size, sorting and navigable tabs belong in search params. Hover, open popover, form draft and unsent sensitive input stay local. Do not mirror applied filters in useState/Zustand and synchronize two stores with effects. A local search draft is allowed; define when it becomes applied and resync it on history navigation.

Define each feature's keys, defaults, parser, serialization and API mapping together in its model/lib layer. Reuse shared helpers without moving business schemas into primitives or route files. Multiple lists must namespace their keys. Preserve unrelated params and hash; clear only owned keys. Never mutate the router's search object.

## Validation and updates

- URL input is untrusted. Validate finite safe integers, page >= 1, page-size bounds, enum sort columns/direction and expected arrays/booleans. TypeScript casts and `parseInt` alone are not runtime validation.
- Starter nuqs parsers use q <= 200 characters, page <= 1,000,000, limit in 10/20/50/100, order asc/desc. These are explicit starter defaults, not an invented API contract; adjust in feature schemas when the backend differs. Missing/invalid values fall back; duplicate scalar keys use the first value. Do not silently coerce malformed IDs.
- Update filters + page reset in ONE transaction. Filter/sort/page-size changes reset page to 1. Pagination alone preserves filters. Concurrent writers must merge from current state, not captured snapshots.
- Remove default/empty owned values where compatible with existing links. Do not automatically rewrite malformed URLs on mount without deciding canonical/history behavior.
- Choose replace for typing/filter refinements; use push for meaningful page/tab navigation where Back should restore state. Document exceptions. Keep scroll position for list refinements.
- Search draft/request debounce is separate from nuqs URL throttling. Debounce text, not checkbox/page clicks. Cancel/ignore stale responses and avoid duplicate effects fetching the same query.
- Use normalized filters, sort, pagination and tenant/user scope in query keys. Invalidate impacted data after mutations. Never let old responses replace a newer search.
- Do not encode secrets, tokens, private form data or sensitive free text in URLs; browser history, analytics and referrers may expose them. URL state is not authorization.
- Date-only filters must have explicit inclusive/exclusive boundary and timezone rules. Do not turn a local calendar date into UTC accidentally. Use the API's documented range semantics.

## nuqs reference implementation

Web root contains `src/lib/search-params.ts` (server-safe parsers/loader/serializer) and `src/hooks/use-list-search.ts` (client hook). In fullstack these paths are under `apps/web/`.

Use `useListSearch()` for client-fetched lists; `state` supplies normalized inputs. `setFilters({ q, limit, order })` resets page atomically, `setPage(n)` pushes history, `reset()` removes only owned params. This helper does not fetch data or claim to be a ready dashboard.

For a Next server-driven list use `useListSearch({ serverDriven: true })` so changes notify the server (`shallow: false`). Parse the awaited page `searchParams` with `loadSearchParams` before calling the data layer. Shared parsers import `nuqs/server`, never a client-only module. Wrap statically rendered hook consumers in an appropriate Suspense boundary and verify production build; adding NuqsAdapter alone does not require turning the whole layout into a Client Component.

For a text input use a local draft and debounced application to `setFilters`; define flush on Enter and cancellation/resynchronization on Back/Forward. The generic hook intentionally does not guess that UX. API validation and authorization remain server responsibilities.

## CRM compatibility

`usePaginationQuery` validates page/limit and uses one functional navigation per update; size changes reset page. Its legacy URL defaults remain page=1, limit=10, with a maximum size of 100. Keep existing URLs compatible.

`useAppSearchParams` and `useDateRangeFilters` are legacy compatibility helpers, not the schema pattern for new routes. Inspect their consumers before migration; new filters need route-owned validation and an atomic patch/reset. Do not assume a cast in a legacy helper guarantees validation or that every old helper has been migrated.

## Other state safeguards

Use stable entity IDs for selection; distinguish server pagination from client filtering; never pretend sorting one downloaded page sorts the entire dataset. Define selection across filters/pages and removal of stale selections. Keep money units/precision and date formats consistent with the API. Loading, empty, error, permission-denied and stale-data states are different. Do not install a store, query library or form framework unless the feature actually requires it.

## Proof

Test direct URL/reload, Back/Forward, clearing defaults, unrelated keys/hash, Unicode, duplicate/malformed params, atomic filter+page changes, size reset, rapid typing and stale responses. For server lists prove URL changes actually refetch the intended dataset. A parser unit test does not prove browser history or backend authorization.

Run `pnpm test:query` in React/Next or `pnpm --filter @template/web test:query` in fullstack (Node 22.18+ or 24 supports the TypeScript test imports). CRM: `pnpm exec vitest run src/shared/hooks/useAppSearchParams/usePaginationQuery.test.tsx`. Then follow `.codex-harness/VERIFICATION.md`.

References: [nuqs adapters](https://nuqs.dev/docs/adapters), [options](https://nuqs.dev/docs/options), [server usage](https://nuqs.dev/docs/server-side), [testing](https://nuqs.dev/docs/testing). Verify installed versions before copying newer examples.
