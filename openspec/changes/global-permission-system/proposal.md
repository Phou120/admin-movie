# Global Permission System

## Why

The current authentication system only stores user roles in localStorage but discards the permissions array returned by the login API. This forces the application to rely on hardcoded role checks (`isAdminOrSuperAdmin`) throughout the codebase, making it impossible to implement granular access control. As the application grows and more user roles are introduced (like "creator"), there's no scalable way to control which users can see menu items, click action buttons, or perform specific operations.

## What Changes

- **Fix auth storage**: Modify `auth.ts` to store both roles AND permissions from login response
- **Create global composable**: Build `useAuth()` composable for centralized permission/role checking
- **Update sidebar navigation**: Replace hardcoded role checks with permission-based menu visibility
- **Add action button guards**: Implement permission checks on Add/Edit/Delete buttons throughout the app
- **Standardize permission API**: Provide consistent methods like `can('create', 'banner')` for checking permissions

## Capabilities

### New Capabilities

- `global-permission-checking`: Centralized, reusable permission and role checking system that provides reactive access control for UI elements (menus, buttons, actions) based on user roles and permissions stored in localStorage

- `auth-storage-management`: Proper storage and retrieval of authentication data including access tokens, user information, roles, and permissions from the login API response

## Impact

**Modified Files:**
- `src/modules/admin/auth/composible/auth.ts` - Add permissions storage
- `src/components/layouts/Sidebar.vue` - Use permission checks instead of role checks
- All module list pages (banner, user, customer, video, etc.) - Add permission guards to action buttons

**New Files:**
- `src/common/composables/useAuth.ts` - Global authentication and permission composable

**No Breaking Changes:** This is purely additive. Existing role-based checks will continue to work, and permission checks will provide finer-grained control where needed.

**No External Dependencies:** Uses Vue 3 Composition API with computed properties - no new libraries required.
