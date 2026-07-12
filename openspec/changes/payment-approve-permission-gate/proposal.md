## Why

On the admin Payments screen (`src/modules/admin/payment/payment.vue`) any authenticated admin can change a payment's status (approve / reject / mark success) via the per-row status dropdown — the component has **no permission check at all** (it never imports `useAuth`). The backend already defines an `approve-payment` permission, so the UI should honor it: only users granted `approve-payment` should be able to change a payment's status. Right now the control is exposed to everyone who can view the page.

## What Changes

- Import `useAuth` in `payment.vue` and use `can('approve', 'payment')` (which resolves to the `approve-payment` permission).
- Gate the **per-row status-change dropdown** (the `status` column at ~line 399, whose menu items call `updateStatus(record.id, status.value)`):
  - Users **with** `approve-payment` see the interactive dropdown (unchanged behavior).
  - Users **without** it see a plain, read-only status tag (same color/label, no dropdown, not clickable).
- Add a defensive guard inside `updateStatus()` so it no-ops if the user lacks `approve-payment`, even if the control is reached some other way.
- The status **filter** select (lines 330-352) is intentionally left as-is — it is a read/filter control, not the approve action.

Non-goals: no backend change (the `approve-payment` permission already exists); no change to how permissions are loaded; no redesign of the payments table.

## Capabilities

### New Capabilities
- `admin-payment-status-authorization`: Client-side authorization of the payment status-change action on the admin Payments screen, gated by the `approve-payment` permission.

### Modified Capabilities
<!-- None: no existing spec files under openspec/specs/ describe payment authorization. -->

## Impact

- **Code (frontend, admin-movie):**
  - `src/modules/admin/payment/payment.vue` — import `useAuth`; `v-if/v-else` on the status column dropdown vs a read-only tag; early-return guard in `updateStatus`.
- **Permission consumed:** `approve-payment` (via `can('approve', 'payment')` from `src/common/composables/useAuth.ts`; super-admin bypasses all checks).
- No routing, dependency, or backend changes. Note: this is UI-side enforcement only — the backend `PUT /payments/status/:id` endpoint remains the real authority.
