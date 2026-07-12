## Why

On the admin **Create User** form (`src/modules/admin/user/components/addUser.vue`) the submit button shows no loading state while the request is in flight. A user can double-click and submit twice, and there is no visual feedback that the request is running. The form even declares a `submitting` ref and sets it to `true`, but it is never bound to the button and never reset, so on error the form is left in a stuck state with no message. The **Edit User** form (`updateUser.vue`) already does this correctly (`:loading="submitting"` + try/catch/finally) — this change brings create up to the same behavior.

## What Changes

- Bind `:loading="submitting"` to the Create User submit button so it shows a spinner and is disabled while the create request runs.
- Wrap `addUser.vue`'s `onFinish` in `try/catch/finally`: keep `submitting = true` during the call, reset it in `finally`, and show the backend error message (`error.response.data.message`) on failure instead of silently leaving the button spinning.
- Verify the Edit User button/handler already conforms (no change expected) so both create and update behave consistently.

Non-goals: no redesign of the user form; no change to backend endpoints or the `useUsers` composible; no change to field validation.

## Capabilities

### New Capabilities
- `admin-user-form-submission`: Submit-time behavior of the admin user create/update forms — button loading state, double-submit prevention, and error feedback while the request is in flight.

### Modified Capabilities
<!-- None: no existing spec files under openspec/specs/ describe user-form behavior. -->

## Impact

- **Code (frontend, admin-movie):**
  - `src/modules/admin/user/components/addUser.vue` — bind `:loading` on the submit button; add `try/catch/finally` to `onFinish`.
  - `src/modules/admin/user/components/updateUser.vue` — verify-only; already conforms.
- **Backend contract consumed:** error envelope `{ statusCode, message, ... }` (read `error.response.data.message`).
- No dependency, routing, or auth changes.
