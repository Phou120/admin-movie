## Context

Both admin user forms use Ant Design Vue's `<a-form @finish="onFinish">` with a primary submit button. `updateUser.vue` already binds `:loading="submitting"` and wraps `onFinish` in `try/catch/finally` (sets `submitting=true`, resets in `finally`, shows `error.response.data.message`). `addUser.vue` declares the same `submitting` ref and sets it to `true`, but never binds it to the button and never resets it, and its `onFinish` has no error handling. The fix is to align `addUser.vue` with the pattern already proven in `updateUser.vue`.

## Goals / Non-Goals

**Goals:**
- Create User button shows a loading spinner and is disabled during the request, cleared on settle.
- On create failure, reset the button and surface the backend message.
- Keep create and update behavior identical.

**Non-Goals:**
- No form redesign, no validation changes, no composible/backend changes.

## Decisions

- **Reuse the `updateUser.vue` pattern verbatim in `addUser.vue`.** Bind `:loading="submitting"` on the submit button and wrap `onFinish` in `try { submitting = true; ... } catch { show error } finally { submitting = false }`. Rationale: consistency with an already-working implementation; lowest risk. *Alternative:* extract a shared `useSubmit` composable. Rejected as over-engineering for a two-call-site fix; can be revisited if more forms need it.
- **Error message source:** read `error?.response?.data?.message` with a localized fallback (matching `updateUser.vue`), so failures are visible rather than leaving a stuck spinner.
- **Ant Design semantics:** `a-button` with `:loading="true"` renders a spinner and blocks its own click, which combined with the `submitting` guard prevents double submits.

## Risks / Trade-offs

- [`onFinish` currently `router.push`es on success, so the button unmounts before `finally` matters on the happy path] → still add `finally` so the failure path resets correctly; harmless on success.
- [Backend `message` may be an array] → use the same extraction/fallback approach as the rest of the module; fall back to a localized string.

## Migration Plan

1. Bind `:loading="submitting"` on the Create User submit button.
2. Add `try/catch/finally` to `addUser.vue` `onFinish`.
3. Verify `updateUser.vue` still conforms (no change).
4. Manually verify in the browser: spinner appears on submit, clears on error with a message, and blocks double submit.

## Open Questions

- None.
