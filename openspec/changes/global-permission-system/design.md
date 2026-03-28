# Global Permission System - Technical Design

## Context

The current authentication system stores user roles in localStorage but completely ignores the permissions array returned by the backend login API. The application relies on hardcoded role checks (`v-if="isAdminOrSuperAdmin"`) scattered throughout components, making it impossible to implement granular access control for different user types like "creator" or "customer".

**Current State:**
- Login API returns: `{ access_token, user, roles: [], permissions: [], customer }`
- Only `roles` are stored in localStorage
- Permission checks are non-existent
- Role-based checks are repetitive and not reusable

**Constraints:**
- Project uses Vue 3 Composition API
- No Pinia/Vuex - state managed via reactive refs and localStorage
- Existing pattern: "composible" directories for business logic
- Must work with existing JWT token-based authentication
- Permission naming: `{action}-{resource}` (e.g., "create-user", "read-banner")

**Stakeholders:**
- Admin users need full access
- Creator users need limited access (manage own content, view analytics)
- Future customer role may need read-only access

## Goals / Non-Goals

**Goals:**
- Provide centralized, reusable permission and role checking across all components
- Store permissions from login response in localStorage
- Support both role-based and permission-based access control
- Maintain reactive updates when auth state changes
- Follow existing project patterns (composables, Composition API)

**Non-Goals:**
- Not implementing role/permission management UI (already exists)
- Not modifying backend API or authentication flow
- Not adding new dependencies (Pinia, Vuex, etc.)
- Not implementing route-level guards (already handled by auth.guard.ts)

## Decisions

### Decision 1: Use Composable Pattern

**Choice:** Create `useAuth()` composable at `src/common/composables/useAuth.ts`

**Rationale:**
- Follows existing project pattern (see `composible` directories in each module)
- No new dependencies required
- Easy to import and use in any component
- Computed properties provide reactive updates automatically
- Single source of truth for auth state

**Alternatives Considered:**
- **Pinia Store**: Rejected - adds unnecessary dependency for simple auth state
- **Vue Directive**: Rejected - harder to test and debug, limited flexibility
- **Provide/Inject**: Rejected - less explicit, harder to track usage

### Decision 2: Permission Check API Design

**Choice:** Provide multiple check methods for different use cases

```typescript
const { hasRole, hasPermission, can } = useAuth();

// Check by permission string
hasPermission('create-banner')

// Check by action + resource (recommended)
can('create', 'banner')

// Check role
hasRole('admin')
```

**Rationale:**
- `hasPermission()` - Direct string match for existing permissions
- `can(action, resource)` - More readable, follows permission naming convention
- `hasRole()` - Quick role checks when permissions aren't defined
- Flexibility allows developers to choose what fits their use case

**Alternatives Considered:**
- **Single method `check(type, value)`**: Rejected - less readable, harder to type-check
- **Only permission strings**: Rejected - `can('read', 'banner')` is clearer than `hasPermission('read-banner')`

### Decision 3: Automatic Admin Role Fallback

**Choice:** Admins automatically pass all permission checks

```typescript
hasPermission(perm) {
  return roles.includes('admin') || permissions.includes(perm);
}
```

**Rationale:**
- Backend sends admin users with all permissions anyway
- Reduces permission array size in login response
- Simplifies checks - don't need to enumerate every permission for admins
- Matches common RBAC patterns

**Alternatives Considered:**
- **Strict permission checking**: Rejected - would require hundreds of permissions for admins
- **Configurable fallback**: Rejected - adds complexity without clear benefit

### Decision 4: LocalStorage as Source of Truth

**Choice:** Read roles and permissions from localStorage, not API

**Rationale:**
- Auth state already stored in localStorage (token, user_id, user_roles)
- Fast access, no network calls
- Works offline after initial login
- Simple and reliable
- Consistent with existing architecture

**Alternatives Considered:**
- **Fetch from API**: Rejected - adds latency, complexity, and network dependency
- **Hybrid approach**: Rejected - localStorage is sufficient and simpler

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Login Flow                                │
├─────────────────────────────────────────────────────────────┤
│  1. User enters credentials                                   │
│  2. Backend returns: { access_token, user, roles, permissions }│
│  3. auth.ts stores ALL data in localStorage:                │
│     - token, user_id, user_roles, user_permissions          │
│  4. useAuth() composable reads from localStorage             │
│  5. Components use useAuth() for permission checks          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              useAuth() Composable API                        │
├─────────────────────────────────────────────────────────────┤
│  State:                                                       │
│  ├── user: Ref<User | null>                                │
│  ├── roles: Computed<Role[]>                               │
│  ├── permissions: Computed<string[]>                       │
│  ├── isAuthenticated: Computed<bool>                         │
│  └── isAdmin: Computed<bool>                                │
│                                                               │
│  Methods:                                                     │
│  ├── hasRole(roleName): boolean                             │
│  ├── hasPermission(permString): boolean                     │
│  ├── hasAnyPermission([...permStrings]): boolean             │
│  ├── hasAllPermissions([...permStrings]): boolean            │
│  ├── can(action, resource): boolean                         │
│  └── refresh(): Promise<void>                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Usage Patterns                                   │
├─────────────────────────────────────────────────────────────┤
│  Sidebar Menu Items:                                         │
│  <a-menu-item v-if="can('read', 'banner')">Banner</a-menu-item>│
│                                                               │
│  Add Buttons:                                                 │
│  <AddButton v-if="can('create', 'banner')" />              │
│                                                               │
│  Edit/Delete Actions:                                         │
│  <edit-outlined v-if="can('update', 'banner')" />            │
│  <delete-outlined v-if="can('delete', 'banner')" />          │
│                                                               │
│  Role-Based Checks (when permissions undefined):            │
│  <div v-if="hasRole('creator')">Creator Content</div>        │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Details

### File: src/common/composables/useAuth.ts

```typescript
import { computed, ref } from 'vue';

export function useAuth() {
  // Reactive state
  const user = ref(null);
  const roles = ref([]);
  const permissions = ref([]);

  // Initialize from localStorage
  const initialize = () => {
    const rolesStr = localStorage.getItem('user_roles');
    const permsStr = localStorage.getItem('user_permissions');

    if (rolesStr) {
      try {
        roles.value = JSON.parse(rolesStr);
      } catch (e) {
        roles.value = [];
      }
    }

    if (permsStr) {
      try {
        permissions.value = JSON.parse(permsStr);
      } catch (e) {
        permissions.value = [];
      }
    }
  };

  // Computed properties
  const isAuthenticated = computed(() => !!localStorage.getItem('token'));
  const isAdmin = computed(() => roles.value.includes('admin'));

  // Permission check methods
  const hasRole = (roleName: string): boolean => {
    return roles.value.includes(roleName);
  };

  const hasPermission = (perm: string): boolean => {
    return isAdmin.value || permissions.value.includes(perm);
  };

  const hasAnyPermission = (perms: string[]): boolean => {
    return isAdmin.value || perms.some(p => permissions.value.includes(p));
  };

  const hasAllPermissions = (perms: string[]): boolean => {
    if (isAdmin.value) return true;
    return perms.every(p => permissions.value.includes(p));
  };

  const can = (action: string, resource: string): boolean => {
    const perm = `${action}-${resource}`;
    return hasPermission(perm);
  };

  // Initialize on creation
  initialize();

  return {
    user,
    roles,
    permissions,
    isAuthenticated,
    isAdmin,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can
  };
}
```

### Modified File: src/modules/admin/auth/composible/auth.ts

**Change:** Store permissions in localStorage after successful login

```typescript
// Line 12: Add permission storage
localStorage.setItem("user_roles", JSON.stringify(response.data.data.roles));
localStorage.setItem("user_permissions", JSON.stringify(response.data.data.permissions));

// Logout: Clear permissions
localStorage.removeItem("user_roles");
localStorage.removeItem("user_permissions");
```

### Usage Examples

**Sidebar.vue - Replace role checks:**
```vue
<!-- Before -->
<a-menu-item v-if="isAdminOrSuperAdmin" key="2" @click="handlerMenu('banner')">

<!-- After -->
<a-menu-item v-if="can('read', 'banner')" key="2" @click="handlerMenu('banner')">
```

**Banner.vue - Add permission guards:**
```vue
<template>
  <AddButton
    v-if="can('create', 'banner')"
    @click="openAddModal"
  />

  <a-table>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <edit-outlined
          v-if="can('update', 'banner')"
          @click="openEditModal(record)"
        />
        <delete-outlined
          v-if="can('delete', 'banner')"
          @click="deleteBanner(record.id)"
        />
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { useAuth } from '@/common/composables/useAuth';
const { can } = useAuth();
</script>
```

## Risks / Trade-offs

### Risk: Permission String Typos
**Risk**: Developers mistype permission strings like `"craete-banner"` instead of `"create-banner"`
**Mitigation**: Create TypeScript constants or enums for common permissions
```typescript
// Optional: Create permission constants
export const PERMISSIONS = {
  CREATE_BANNER: 'create-banner',
  READ_BANNER: 'read-banner',
  UPDATE_BANNER: 'update-banner',
  DELETE_BANNER: 'delete-banner',
} as const;
```

### Risk: localStorage Desynchronization
**Risk**: If permissions change on backend while user is logged in, localStorage becomes stale
**Mitigation**: User must re-login to get fresh permissions (acceptable trade-off for simplicity)

### Risk: Missing Permissions for Some Resources
**Risk**: Backend doesn't send permissions for all resources (banner, video, payment, etc.)
**Mitigation**: Use role-based fallback for resources without explicit permissions

**Trade-off**: Less granular control for some features vs. simpler implementation

### Risk: Over-Permissive Admins
**Risk**: Admin role auto-passes all permission checks, which might be too broad
**Mitigation**: Backend controls what permissions are returned for admins. If backend doesn't give "delete-user" permission, frontend check passes but API call will fail with 403

## Migration Plan

### Phase 1: Core Infrastructure (No Breaking Changes)
1. Create `src/common/composables/useAuth.ts`
2. Modify `auth.ts` to store permissions in localStorage
3. Test permission storage and retrieval

### Phase 2: Sidebar Updates (Visible Changes)
1. Update `Sidebar.vue` to use `can()` checks instead of `isAdminOrSuperAdmin`
2. Test menu visibility for different user roles
3. **Rollback**: Revert sidebar changes if issues arise

### Phase 3: Component Updates (Gradual Rollout)
1. Update one module at a time (banner → user → category → etc.)
2. Add permission guards to Add/Edit/Delete buttons
3. Test each module thoroughly
4. **Rollback**: Individual modules can be reverted independently

### Rollback Strategy
- All changes are additive - existing role checks still work
- Revert specific file if issues occur
- No database migrations or backend changes required

## Open Questions

1. **Permission Constants**: Should we create TypeScript enums/constants for permission strings to prevent typos?

2. **Missing Permissions**: How should we handle modules that don't have permissions defined yet (banner, video, payment)?
   - Option A: Use role-based fallback for those modules
   - Option B: Add permissions to backend for all modules first

3. **Custom Permissions**: Are there non-CRUD permissions needed (e.g., `payment.approve`, `video.publish`)?
