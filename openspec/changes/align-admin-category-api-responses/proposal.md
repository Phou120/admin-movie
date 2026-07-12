## Why

The admin Category module (`src/modules/admin/category`) does not correctly consume the backend API responses. Two concrete defects:

1. **Backend error messages are swallowed.** On failed create/update/delete the UI shows the generic Axios string (`error.message`, e.g. *"Request failed with status code 409"*) instead of the backend's real message, which lives at `error.response.data.message`. This matters now because the backend is adding a rule that **blocks deleting a category still used by videos** — the user must see *why* the delete was rejected, but today they never will.

2. **Pagination is mis-mapped.** `loadCategories()` reads `paginate.currentPage`, but the backend pagination envelope has no such key — it returns `{ total, total_pages, limit, page }`. The result is `pagination.current = undefined`, and when `pagination` is absent the code throws `Cannot read properties of undefined (reading 'currentPage')` (currently hidden by a `catch`).

## What Changes

- Read the backend message from `error.response.data.message` (with a safe fallback) everywhere the Category module reports an error — create, update, delete, and load.
- Fix the pagination mapping to the backend contract: `page` → `current`, `limit` → `pageSize`, `total` → `total`; guard against a missing `pagination` object.
- Audit all four Category API calls in `composible/index.ts` (`fetchAll`, `createCategory`, `updateCategory`, `deleteCategoryById`) against the backend contract (`/api/categories` GET/POST, `/api/categories/:id` PUT/DELETE) and confirm request/response shapes line up.
- Surface the "category in use" rejection (HTTP 409/400 from the backend) as a clear, localized notification rather than a generic failure.

Non-goals: no visual redesign of the category screen; no new backend endpoints (the delete-guard itself is a separate backend change).

## Capabilities

### New Capabilities
- `admin-category-api-integration`: How the admin Category screen calls the backend category API and how it maps successful responses (data + pagination envelope) and error responses (backend `message`) into the UI.

### Modified Capabilities
<!-- None: no existing spec files in openspec/specs/ define category behavior. -->

## Impact

- **Code (frontend, admin-movie):**
  - `src/modules/admin/category/category.vue` — `loadCategories` pagination mapping + guard; `submitAdd`/`submitUpdate`/`deleteCategory` error extraction.
  - `src/modules/admin/category/composible/index.ts` — verify the four API calls; optionally centralize backend-message extraction.
  - Optionally `src/common/utils/notification.ts` / `src/common/configuration/axios.config.ts` — a shared helper to read `error.response.data.message`.
- **Backend contract consumed:** `GET/POST /api/categories`, `PUT/DELETE /api/categories/:id`; response envelope `{ status_code, message, data, pagination:{ total, total_pages, limit, page } }`; error envelope `{ statusCode, message, ... }`.
- **Depends on / complements:** backend change `block-category-delete-when-in-use` (produces the 409/400 + message this UI must display).
- No dependency, routing, or auth changes.
