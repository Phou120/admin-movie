## 1. Create User button loading (addUser.vue)

- [x] 1.1 Bind `:loading="submitting"` on the Create User submit button (the primary `submit-btn` with `html-type="submit"`)
- [x] 1.2 Wrap `onFinish` in `try/catch/finally`: keep `submitting = true` at the start, reset `submitting = false` in `finally`
- [x] 1.3 In the `catch`, show the backend error message (`error?.response?.data?.message`) with a localized fallback instead of leaving the button stuck

## 2. Update User button loading (updateUser.vue)

- [x] 2.1 Verify the Update User submit button already binds `:loading="submitting"` and that `onFinish` resets it in `finally` — confirm no change needed

## 3. Verify

- [x] 3.1 Create form: submitting shows a spinner + disabled button; on success it navigates to the user list
- [x] 3.2 Create failure: button returns to normal and the backend error message is displayed
- [x] 3.3 Double-submit is prevented while a request is running
- [x] 3.4 Update form: same loading behavior confirmed
- [x] 3.5 `pnpm build` (vue-tsc) passes with no new type errors
