## Context

`payment.vue` renders the payment status in the `status` column slot as an `<a-dropdown>` whose menu items call `updateStatus(record.id, status.value)` → `updatePaymentStatus`. The component imports no auth helper. The app already has `useAuth()` exposing `can(action, resource)`, which builds the permission string `${action}-${resource}` and checks it against the user's permissions, with super-admin bypassing all checks (`useAuth.ts`). The matching backend permission `approve-payment` exists. Other modules (e.g. category) already gate controls with `can('update', 'category')` etc., so this follows an established pattern.

## Goals / Non-Goals

**Goals:**
- Only `approve-payment` holders (and super-admins) can change a payment's status from the UI.
- Users without it still see the status (read-only), and can still view/filter the list.
- Defense-in-depth: the action function itself refuses to run without the permission.

**Non-Goals:**
- No backend/endpoint change; the server remains the real authority.
- No change to the status filter select, table, or status colors/labels.

## Decisions

- **Gate at the control, not just the handler.** Wrap the status column: `v-if="can('approve','payment')"` renders the existing interactive `<a-dropdown>`; `v-else` renders a plain `<a-tag>` with the same `getStatusColor`/`getStatusLabel` but no dropdown/cursor. Rationale: users without permission shouldn't see an actionable affordance; showing the status read-only preserves information. *Alternative:* disable the menu items only. Rejected — a disabled-but-visible dropdown is worse UX and still implies the action exists.
- **Compute `can` once in setup.** Destructure `const { can } = useAuth()` and use it in the template (and in `updateStatus`). Consistent with the category module.
- **Guard `updateStatus`.** Early return `if (!can('approve','payment')) return;` before calling the API. Rationale: hiding UI is not enforcement; this prevents accidental/other-path invocation. Note this is still client-side only — the backend must enforce too (out of scope).

## Risks / Trade-offs

- [Client-side checks are bypassable] → acknowledged; this is UX/affordance, not security. The backend `PUT /payments/status/:id` remains the authority. Documented in the proposal.
- [Permissions must be loaded before render] → `useAuth` initializes from stored auth on creation; super-admin bypass covers the common admin case. If permissions load late, worst case a control briefly hides/shows — acceptable and consistent with other gated modules.

## Migration Plan

1. Import `useAuth`, destructure `can` in `payment.vue`.
2. Add `v-if/v-else` to the status column (interactive dropdown vs read-only tag).
3. Add the early-return guard in `updateStatus`.
4. Verify in browser with a permitted vs non-permitted account (or by toggling stored permissions), plus `pnpm build`.

## Open Questions

- None. (`approve-payment` is the confirmed permission string; super-admin bypass is existing behavior.)
