## 1. Shared error-message helper

- [x] 1.1 Add `getApiErrorMessage(error: unknown, fallback: string): string` in `src/common/utils/api-error.ts` that returns `error?.response?.data?.message` when present, joins it with `", "` if it is a string array, and returns `fallback` otherwise
- [x] 1.2 Export it and confirm it is importable from the category module

## 2. Fix pagination mapping in category.vue

- [x] 2.1 In `loadCategories`, map from the backend envelope: `current = pagination?.page ?? page`, `pageSize = pagination?.limit ?? limit`, `total = pagination?.total ?? 0`
- [x] 2.2 Guard the mapping so a response with no `pagination` object renders rows without throwing `Cannot read properties of undefined (reading 'currentPage')`
- [x] 2.3 Remove the now-obsolete `paginate.currentPage` reference

## 3. Surface backend error messages

- [x] 3.1 In `submitAdd` (create) `catch`, show `getApiErrorMessage(error, t(<fallback>))` instead of `(error as Error).message`
- [x] 3.2 In `submitUpdate` (update) `catch`, use the helper with a localized fallback
- [x] 3.3 In `deleteCategory` (delete) `catch`, use the helper so the "category in use" rejection message is displayed and the list is left unchanged
- [x] 3.4 In `loadCategories` `catch`, surface a user-visible error (not just `console.error`) using the helper

## 4. Audit the composible against the backend contract

- [x] 4.1 Verify `fetchAll` → `GET /api/categories` with `page`, `limit`, `search` params and that it returns the full envelope (`data` + `pagination`)
- [x] 4.2 Verify `createCategory` → `POST /api/categories` body `{ name, description }` returns envelope with `message`
- [x] 4.3 Verify `updateCategory` → `PUT /api/categories/:id` and `deleteCategoryById` → `DELETE /api/categories/:id` return the envelope
- [x] 4.4 Document any mismatch found; keep `composible` returning `response.data` unchanged

## 5. Verify against the running backend

- [x] 5.1 List: confirm pagination (page 2, limit 5, total) renders correctly and no console error fires after create
- [x] 5.2 Create + update: confirm backend success `message` shows and the list refreshes
- [x] 5.3 Delete happy path: confirm the category is removed and success `message` shows
- [x] 5.4 Delete blocked path: with a category referenced by a video (once `block-category-delete-when-in-use` is active, or by simulating a 409), confirm the backend `message` is displayed and the row stays
- [x] 5.5 `pnpm build` (vue-tsc) passes with no type errors
