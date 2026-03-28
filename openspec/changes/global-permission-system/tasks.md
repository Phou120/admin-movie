# Implementation Tasks

## 1. Core Infrastructure

- [x] 1.1 Create `src/common/composables/useAuth.ts` file
- [x] 1.2 Implement reactive state (user, roles, permissions refs)
- [x] 1.3 Implement `initialize()` function to read from localStorage
- [x] 1.4 Implement `isAuthenticated` computed property
- [x] 1.5 Implement `isAdmin` computed property
- [x] 1.6 Implement `hasRole(roleName)` method
- [x] 1.7 Implement `hasPermission(permString)` method with admin fallback
- [x] 1.8 Implement `can(action, resource)` method that constructs permission string
- [x] 1.9 Implement `hasAnyPermission(permStrings)` method
- [x] 1.10 Implement `hasAllPermissions(permStrings)` method
- [x] 1.11 Add error handling for malformed localStorage data (try/catch JSON parsing)
- [x] 1.12 Export composable function with all methods and computed properties
- [x] 1.13 Test composable in browser console with mock localStorage data

## 2. Authentication Storage

- [x] 2.1 Modify `src/modules/admin/auth/composible/auth.ts` to store permissions
- [x] 2.2 Add `localStorage.setItem("user_permissions", JSON.stringify(...))` after login success
- [x] 2.3 Handle case where permissions array is null or missing from response
- [x] 2.4 Test login with admin user and verify permissions are stored
- [x] 2.5 Test login with creator user and verify permissions are stored
- [x] 2.6 Verify existing token and roles storage still works

## 3. Sidebar Integration

- [x] 3.1 Import `useAuth` composable in `src/components/layouts/Sidebar.vue`
- [x] 3.2 Replace `isAdminOrSuperAdmin` computed with `useAuth()` calls
- [x] 3.3 Add `isCreator` computed using `hasRole('creator')`
- [x] 3.4 Update Dashboard menu item to use `can('read', 'dashboard')` or role check
- [x] 3.5 Update Banner menu item to use `can('read', 'banner')`
- [x] 3.6 Update Category menu item to use `can('read', 'category')`
- [x] 3.7 Update Video menu item to use `can('read', 'video')` or show for all roles
- [x] 3.8 Update Package menu item to use `can('read', 'package')`
- [x] 3.9 Update Payment menu item to use `can('read', 'payment')`
- [x] 3.10 Update QR Code menu item to use `can('read', 'qr-code')`
- [x] 3.11 Update Customer menu item to use `can('read', 'customer')`
- [x] 3.12 Update Member menu item to use `can('read', 'member')`
- [x] 3.13 Update System submenu to use permission checks
- [x] 3.14 Update Reports submenu to use permission checks
- [x] 3.15 Test sidebar with admin user (all items visible)
- [x] 3.16 Test sidebar with creator user (limited items visible)

## 4. Banner Module - Permission Guards

- [x] 4.1 Import `useAuth` in `src/modules/admin/banner/banner.vue`
- [x] 4.2 Add permission check to Add Button: `v-if="can('create', 'banner')"`
- [x] 4.3 Add permission check to Edit action: `v-if="can('update', 'banner')"`
- [x] 4.4 Add permission check to Delete action: `v-if="can('delete', 'banner')"`
- [x] 4.5 Test banner page with admin user (all actions visible)
- [x] 4.6 Test banner page with user lacking permissions (actions hidden)

## 5. Category Module - Permission Guards

- [x] 5.1 Import `useAuth` in `src/modules/admin/category/category.vue`
- [x] 5.2 Add permission check to Add Button: `v-if="can('create', 'category')"`
- [x] 5.3 Add permission check to Edit action: `v-if="can('update', 'category')"`
- [x] 5.4 Add permission check to Delete action: `v-if="can('delete', 'category')"`
- [x] 5.5 Test category page with different user roles

## 6. User Module - Permission Guards

- [x] 6.1 Import `useAuth` in `src/modules/admin/user/user.vue`
- [x] 6.2 Add permission check to Add Button: `v-if="can('create', 'user')"`
- [x] 6.3 Add permission check to Edit action: `v-if="can('update', 'user')"`
- [x] 6.4 Add permission check to Delete action: `v-if="can('delete', 'user')"`
- [x] 6.5 Test user management page permissions

## 7. Role Module - Permission Guards

- [x] 7.1 Import `useAuth` in `src/modules/admin/role/role.vue`
- [x] 7.2 Add permission check to Add Button: `v-if="can('create', 'role')"`
- [x] 7.3 Add permission check to Edit action: `v-if="can('update', 'role')"`
- [x] 7.4 Add permission check to Delete action: `v-if="can('delete', 'role')"`
- [x] 7.5 Test role management page permissions

## 8. Customer Module - Permission Guards

- [x] 8.1 Import `useAuth` in `src/modules/admin/customer/Customer.vue`
- [x] 8.2 Add permission check to Add Button: `v-if="can('create', 'customer')"`
- [x] 8.3 Add permission check to Edit action: `v-if="can('update', 'customer')"`
- [x] 8.4 Add permission check to Delete action: `v-if="can('delete', 'customer')"`
- [x] 8.5 Add permission check to Payment action: `v-if="can('create', 'payment')"`
- [x] 8.6 Test customer page with creator role (should see payment button)

## 9. Video Module - Permission Guards

- [x] 9.1 Import `useAuth` in `src/modules/admin/video/video.vue`
- [x] 9.2 Add permission check to Add Button: `v-if="can('create', 'video')"`
- [x] 9.3 Add permission check to Edit action: `v-if="can('update', 'video')"`
- [x] 9.4 Add permission check to Delete action: `v-if="can('delete', 'video')"`
- [x] 9.5 Test video management page permissions

## 10. Package Module - Permission Guards

- [x] 10.1 Import `useAuth` in `src/modules/admin/packages/Packages.vue`
- [x] 10.2 Add permission check to Add Button: `v-if="can('create', 'package')"`
- [x] 10.3 Add permission check to Edit action: `v-if="can('update', 'package')"`
- [x] 10.4 Add permission check to Delete action: `v-if="can('delete', 'package')"`
- [x] 10.5 Test package management page permissions

## 11. Payment Module - Permission Guards

- [x] 11.1 Import `useAuth` in `src/modules/admin/payment/payment.vue`
- [x] 11.2 Add permission check to Add Button (if exists): `v-if="can('create', 'payment')"`
- [x] 11.3 Add permission check to Edit action (if exists): `v-if="can('update', 'payment')"`
- [x] 11.4 Add permission check to Delete action: `v-if="can('delete', 'payment')"`
- [x] 11.5 Test payment management page permissions

## 12. Member Module - Permission Guards

- [x] 12.1 Import `useAuth` in `src/modules/admin/member/Member.vue`
- [x] 12.2 Add permission check to Add Button: `v-if="can('create', 'member')"`
- [x] 12.3 Add permission check to Edit action: `v-if="can('update', 'member')"`
- [x] 12.4 Add permission check to Delete action: `v-if="can('delete', 'member')"`
- [x] 12.5 Test member management page permissions

## 13. QR Code Module - Permission Guards

- [x] 13.1 Import `useAuth` in `src/modules/admin/qr-code/qr-code.vue`
- [x] 13.2 Add permission check to Add Button: `v-if="can('create', 'qr-code')"`
- [x] 13.3 Add permission check to Edit action: `v-if="can('update', 'qr-code')"`
- [x] 13.4 Add permission check to Delete action: `v-if="can('delete', 'qr-code')"`
- [x] 13.5 Test QR code management page permissions

## 14. View Settings Module - Permission Guards

- [x] 14.1 Import `useAuth` in `src/modules/admin/views/Views.vue`
- [x] 14.2 Add permission check to Add Button: `v-if="can('create', 'view')"`
- [x] 14.3 Add permission check to Edit action: `v-if="can('update', 'view')"`
- [x] 14.4 Add permission check to Delete action: `v-if="can('delete', 'view')"`
- [x] 14.5 Test view settings page permissions

## 15. Report Modules - Permission Guards

- [x] 15.1 Import `useAuth` in `src/modules/admin/report/video/ReportVideo.vue`
- [x] 15.2 Add permission check to export or other actions: `v-if="can('read', 'report-video')"`
- [x] 15.3 Import `useAuth` in `src/modules/admin/report/user/ReportUser.vue`
- [x] 15.4 Add permission check to export or other actions: `v-if="can('read', 'report-user')"`
- [x] 15.5 Import `useAuth` in `src/modules/admin/report/package/ReportPackage.vue`
- [x] 15.6 Add permission check to export or other actions: `v-if="can('read', 'report-package')"`
- [x] 15.7 Import `useAuth` in `src/modules/admin/report/payment/ReportPayment.vue`
- [x] 15.8 Add permission check to export button: `v-if="can('read', 'report-payment')"`
- [x] 15.9 Test all report pages with different user roles

## 16. Testing & Verification

- [x] 16.1 Test login flow with admin user - verify permissions stored correctly
- [x] 16.2 Test login flow with creator user - verify permissions stored correctly
- [x] 16.3 Verify admin user can see all menu items and action buttons
- [x] 16.4 Verify creator user can only access allowed features
- [x] 16.5 Verify permission checks work correctly for banner module
- [x] 16.6 Verify permission checks work correctly for user management
- [x] 16.7 Verify permission checks work correctly for customer/payment module
- [x] 16.8 Test that missing permissions in backend are handled gracefully
- [x] 16.9 Test that malformed localStorage data doesn't break the app
- [x] 16.10 Verify no TypeScript errors after all changes
- [x] 16.11 Run `pnpm build` to verify build succeeds
- [x] 16.12 Manual testing: login as different users, check UI elements appear/disappear correctly

## 17. Documentation (Optional)

- [x] 17.1 Update CLAUDE.md with useAuth composable documentation
- [x] 17.2 Add permission checking examples to CLAUDE.md
- [x] 17.3 Document permission naming convention for future developers
