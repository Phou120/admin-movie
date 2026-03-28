# Global Permission Checking Specification

## ADDED Requirements

### Requirement: Provide centralized authentication state access
The system SHALL provide a composable function `useAuth()` that exposes reactive authentication state including user information, roles, permissions, and authentication status.

#### Scenario: Component imports useAuth composable
- **WHEN** a component imports the `useAuth()` composable
- **THEN** the composable returns an object containing reactive state and methods for permission checking
- **AND** the state is automatically initialized from localStorage

#### Scenario: Access current user roles
- **WHEN** a component calls `useAuth()` and accesses the `roles` property
- **THEN** the system returns an array of role names (e.g., `["admin", "creator"]`)
- **AND** the roles are read from localStorage key `user_roles`
- **AND** the array is reactive and updates when localStorage changes

#### Scenario: Access current user permissions
- **WHEN** a component calls `useAuth()` and accesses the `permissions` property
- **THEN** the system returns an array of permission strings (e.g., `["create-user", "read-banner"]`)
- **AND** the permissions are read from localStorage key `user_permissions`
- **AND** the array is reactive and updates when localStorage changes

### Requirement: Check if user has specific role
The system SHALL provide a `hasRole(roleName)` method that returns true if the user's roles array includes the specified role name.

#### Scenario: User has admin role
- **GIVEN** the user has roles `["admin", "creator"]` stored in localStorage
- **WHEN** a component calls `hasRole("admin")`
- **THEN** the system returns `true`

#### Scenario: User does not have role
- **GIVEN** the user has roles `["creator"]` stored in localStorage
- **WHEN** a component calls `hasRole("admin")`
- **THEN** the system returns `false`

#### Scenario: Case-sensitive role matching
- **GIVEN** the user has roles `["Admin"]` (capital A)
- **WHEN** a component calls `hasRole("admin")` (lowercase)
- **THEN** the system returns `false` unless the roles array contains exact string match

### Requirement: Check if user has specific permission
The system SHALL provide a `hasPermission(permString)` method that returns true if the user's permissions array includes the specified permission string, or if the user has admin role.

#### Scenario: User has permission
- **GIVEN** the user has permissions `["create-banner", "read-banner"]` stored in localStorage
- **WHEN** a component calls `hasPermission("create-banner")`
- **THEN** the system returns `true`

#### Scenario: Admin role passes all permission checks
- **GIVEN** the user has roles `["admin"]` stored in localStorage
- **AND** the user has no permissions array or an empty permissions array
- **WHEN** a component calls `hasPermission("delete-user")`
- **THEN** the system returns `true` because admin role grants all permissions

#### Scenario: User lacks permission
- **GIVEN** the user has permissions `["read-banner"]` stored in localStorage
- **WHEN** a component calls `hasPermission("delete-banner")`
- **THEN** the system returns `false`

### Requirement: Check permission by action and resource
The system SHALL provide a `can(action, resource)` method that combines action and resource into a permission string and checks if the user has that permission or is an admin.

#### Scenario: Valid action-resource combination
- **GIVEN** the user has permissions `["create-banner", "update-banner"]`
- **WHEN** a component calls `can("create", "banner")`
- **THEN** the system constructs permission string `"create-banner"`
- **AND** returns `true` because the permission exists

#### Scenario: User lacks specific action permission on resource
- **GIVEN** the user has permissions `["read-banner"]`
- **WHEN** a component calls `can("delete", "banner")`
- **THEN** the system constructs permission string `"delete-banner"`
- **AND** returns `false` because the permission does not exist

#### Scenario: Read action check
- **GIVEN** the user has permissions `["read-category", "create-category"]`
- **WHEN** a component calls `can("read", "category")`
- **THEN** the system returns `true`

### Requirement: Check multiple permissions with AND logic
The system SHALL provide a `hasAllPermissions(permStrings)` method that returns true only if the user has ALL of the specified permissions (or is admin).

#### Scenario: User has all required permissions
- **GIVEN** the user has permissions `["create-user", "read-user", "update-user"]`
- **WHEN** a component calls `hasAllPermissions(["create-user", "update-user"])`
- **THEN** the system returns `true`

#### Scenario: User missing some permissions
- **GIVEN** the user has permissions `["create-user", "read-user"]`
- **WHEN** a component calls `hasAllPermissions(["create-user", "delete-user"])`
- **THEN** the system returns `false` because `delete-user` is missing

#### Scenario: Admin auto-passes multiple permission check
- **GIVEN** the user has roles `["admin"]`
- **WHEN** a component calls `hasAllPermissions(["create-video", "delete-payment"])`
- **THEN** the system returns `true` without checking the permissions array

### Requirement: Check multiple permissions with OR logic
The system SHALL provide a `hasAnyPermission(permStrings)` method that returns true if the user has AT LEAST ONE of the specified permissions (or is admin).

#### Scenario: User has at least one required permission
- **GIVEN** the user has permissions `["create-banner", "create-category"]`
- **WHEN** a component calls `hasAnyPermission(["create-banner", "delete-user"])`
- **THEN** the system returns `true` because `create-banner` exists

#### Scenario: User has none of the required permissions
- **GIVEN** the user has permissions `["read-banner", "read-user"]`
- **WHEN** a component calls `hasAnyPermission(["create-banner", "delete-user"])`
- **THEN** the system returns `false` because neither permission exists

#### Scenario: Admin auto-passes any permission check
- **GIVEN** the user has roles `["admin"]`
- **WHEN** a component calls `hasAnyPermission(["non-existent-permission"])`
- **THEN** the system returns `true`

### Requirement: Provide authentication status check
The system SHALL provide an `isAuthenticated` computed property that returns true if a valid access token exists in localStorage.

#### Scenario: User is logged in
- **GIVEN** localStorage contains a `token` key with a valid JWT access token
- **WHEN** a component accesses the `isAuthenticated` property
- **THEN** the system returns `true`

#### Scenario: User is not logged in
- **GIVEN** localStorage does not contain a `token` key
- **WHEN** a component accesses the `isAuthenticated` property
- **THEN** the system returns `false`

### Requirement: Provide admin status check
The system SHALL provide an `isAdmin` computed property that returns true if the user's roles array includes "admin".

#### Scenario: Admin user
- **GIVEN** the user has roles `["admin"]` stored in localStorage
- **WHEN** a component accesses the `isAdmin` property
- **THEN** the system returns `true`

#### Scenario: Non-admin user
- **GIVEN** the user has roles `["creator", "member"]` stored in localStorage
- **WHEN** a component accesses the `isAdmin` property
- **THEN** the system returns `false`

### Requirement: Handle malformed localStorage data gracefully
The system SHALL handle cases where localStorage contains invalid JSON or unexpected data formats without throwing errors.

#### Scenario: Invalid JSON in user_roles
- **GIVEN** localStorage key `user_roles` contains invalid JSON string `"invalid[json"`
- **WHEN** the composable initializes and attempts to parse roles
- **THEN** the system catches the parse error
- **AND** sets roles to an empty array `[]`
- **AND** does not throw an exception

#### Scenario: Missing user_permissions key
- **GIVEN** localStorage does not contain key `user_permissions`
- **WHEN** the composable initializes and attempts to read permissions
- **THEN** the system returns an empty array `[]`
- **AND** does not throw an exception
