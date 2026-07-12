## Context

The admin Category screen (`src/modules/admin/category/category.vue`) talks to the backend through `composible/index.ts`, which wraps a shared Axios instance (`src/common/configuration/axios.config.ts`). That Axios instance already has a response interceptor that handles 401 globally and re-throws every other error. Component-level `catch` blocks currently report `(error as Error).message`, which for an `AxiosError` is the generic *"Request failed with status code N"* — the backend's real message in `error.response.data.message` is never read.

Separately, `loadCategories` maps `paginate.currentPage`, but the backend envelope is `{ status_code, message, data, pagination: { total, total_pages, limit, page } }` — there is no `currentPage`, so `pagination.current` becomes `undefined`, and a missing `pagination` throws inside the `catch`.

The backend is introducing a rule that rejects deleting a category still referenced by videos (separate change `block-category-delete-when-in-use`), returning a standard error envelope with a human-readable `message`. The UI must display it.

## Goals / Non-Goals

**Goals:**
- Show the backend `message` for every failed Category operation, with a safe fallback.
- Map the backend pagination envelope correctly and never throw on a missing `pagination`.
- Keep the fix localized and reusable via a small shared helper so other admin modules can adopt the same pattern.

**Non-Goals:**
- No UI/visual redesign of the category screen.
- No change to the backend or its response contract.
- No refactor of the global Axios interceptor's 401 behavior.

## Decisions

- **Add a shared `getApiErrorMessage(error, fallback)` helper** (e.g. in `src/common/utils/`) that reads `error?.response?.data?.message` (string or array) and returns `fallback` otherwise. Rationale: the same generic-message bug exists across admin modules; a single helper fixes it consistently and is trivially testable. *Alternative considered:* transform the error inside the Axios response interceptor into a normalized `Error(message)`. Rejected for now because it changes global behavior for every module at once and risks masking status codes other handlers rely on.
- **Fix pagination mapping in `loadCategories`**: `current: pagination?.page ?? page`, `pageSize: pagination?.limit ?? limit`, `total: pagination?.total ?? 0`, guarding the whole block when `pagination` is absent. Rationale: matches the confirmed backend contract and removes the latent crash. *Alternative:* change the backend to emit `currentPage`. Rejected — the backend contract is shared by other consumers and is out of scope.
- **Localized fallback strings** via the existing i18n (`t(...)`) so fallback messages respect the lo/en switch, consistent with the rest of the module.
- **Keep `composible/index.ts` returning `response.data`** (the full envelope) unchanged; the fixes live in the component and the helper. Rationale: minimizes surface area and preserves callers that read `.message`/`.data`/`.pagination`.

## Risks / Trade-offs

- [Backend `message` may be an array (class-validator returns `string[]`)] → the helper normalizes: if `message` is an array, join with `", "`; if string, use as-is.
- [Other admin modules share the same generic-message bug but are out of scope here] → the helper is written generically so follow-up changes can adopt it without rework; this change only wires it into Category.
- [The delete-guard backend change may not be deployed yet] → the UI change is backward-compatible: if the backend still returns a generic error, the fallback message is shown; once the guard ships, the real message appears automatically.

## Migration Plan

1. Add `getApiErrorMessage` helper + unit-friendly logic.
2. Wire it into `category.vue` `catch` blocks (create/update/delete/load).
3. Fix the pagination mapping and add the missing-`pagination` guard.
4. Verify against the running backend (list, create, update, delete, and a forced error) — no rollback concerns; pure frontend, revertible by reverting the commit.

## Open Questions

- Should the shared helper live in `common/utils/notification.ts` (co-located with the notify functions) or a new `common/utils/api-error.ts`? Default: new `api-error.ts` for single responsibility; final placement decided at implementation.
