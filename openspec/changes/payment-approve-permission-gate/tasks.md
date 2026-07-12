## 1. Wire up permission check

- [ ] 1.1 Import `useAuth` in `payment.vue` and destructure `const { can } = useAuth()`

## 2. Gate the per-row status control

- [ ] 2.1 In the `status` column slot, wrap the existing `<a-dropdown>` with `v-if="can('approve', 'payment')"`
- [ ] 2.2 Add a `v-else` branch rendering a read-only `<a-tag>` with the same `getStatusColor(record.status)` and `getStatusLabel(record.status)` (no dropdown, no pointer cursor)
- [ ] 2.3 Add an early-return guard at the top of `updateStatus`: `if (!can('approve', 'payment')) return;`

## 3. Leave the filter untouched

- [ ] 3.1 Confirm the status filter select (lines ~330-352) is unchanged and still usable without `approve-payment`

## 4. Verify

- [ ] 4.1 Super-admin / user WITH `approve-payment`: status renders as an interactive dropdown and can be changed
- [ ] 4.2 User WITHOUT `approve-payment`: status renders as a read-only tag with no dropdown/click
- [ ] 4.3 `updateStatus` sends no request when the permission is absent
- [ ] 4.4 The status filter still filters the list for a non-permitted user
- [ ] 4.5 `pnpm build` (vue-tsc) passes with no new type errors
