# Auth Storage Management Specification

## ADDED Requirements

### Requirement: Store access token on successful login
The system SHALL store the JWT access token from the login API response to localStorage when authentication succeeds.

#### Scenario: Successful login stores token
- **GIVEN** the user submits valid login credentials
- **AND** the backend responds with status code 200 or 201
- **AND** the response contains `data.access_token`
- **WHEN** the `login()` function processes the response
- **THEN** the system stores the access token in localStorage under key `"token"`
- **AND** the token value is extracted from `response.data.data.access_token`

### Requirement: Store user ID on successful login
The system SHALL store the user ID from the login API response to localStorage when authentication succeeds.

#### Scenario: Successful login stores user ID
- **GIVEN** the backend login response contains `data.user.id`
- **WHEN** the `login()` function processes the response
- **THEN** the system stores the user ID in localStorage under key `"user_id"`
- **AND** the user ID value is extracted from `response.data.data.user.id`

### Requirement: Store user roles on successful login
The system SHALL store the roles array from the login API response to localStorage as a JSON string when authentication succeeds.

#### Scenario: Successful login stores roles
- **GIVEN** the backend login response contains `data.roles` array
- **AND** the roles array contains `["admin"]` or other role names
- **WHEN** the `login()` function processes the response
- **THEN** the system stores the roles in localStorage under key `"user_roles"`
- **AND** the roles are serialized as JSON using `JSON.stringify(roles)`

#### Scenario: Roles array is properly formatted
- **GIVEN** the backend returns `roles: ["admin", "creator"]`
- **WHEN** stored in localStorage
- **THEN** the stored value is the string `'["admin", "creator"]'`

### Requirement: Store user permissions on successful login
The system SHALL store the permissions array from the login API response to localStorage as a JSON string when authentication succeeds.

#### Scenario: Successful login stores permissions
- **GIVEN** the backend login response contains `data.permissions` array
- **AND** the permissions array contains strings like `["create-user", "read-banner"]`
- **WHEN** the `login()` function processes the response
- **THEN** the system stores the permissions in localStorage under key `"user_permissions"`
- **AND** the permissions are serialized as JSON using `JSON.stringify(permissions)`

#### Scenario: Permissions array with multiple entries
- **GIVEN** the backend returns `permissions: ["create-user", "read-user", "delete-user"]`
- **WHEN** stored in localStorage
- **THEN** the stored value is the string `'["create-user", "read-user", "delete-user"]'`

### Requirement: Store customer data for creator users
The system SHALL store customer object and customer ID in localStorage when the login response includes customer data (for creator-type users).

#### Scenario: Creator user login stores customer data
- **GIVEN** the backend login response contains `data.customer` object
- **AND** the customer object has an `id` property
- **WHEN** the `login()` function processes the response
- **THEN** the system stores the customer ID in localStorage under key `"customer_id"`
- **AND** the system stores the full customer object in localStorage under key `"customer"`
- **AND** the customer ID is stored as a string

#### Scenario: Admin user login clears customer data
- **GIVEN** the backend login response contains `data.customer: null`
- **WHEN** the `login()` function processes the response
- **THEN** the system removes any existing `"customer_id"` key from localStorage
- **AND** the system removes any existing `"customer"` key from localStorage

### Requirement: Clear auth data on logout
The system SHALL remove all authentication-related data from localStorage when the user logs out.

#### Scenario: Logout removes all auth keys
- **GIVEN** the user is currently logged in
- **AND** localStorage contains keys `"token"`, `"user_id"`, `"user_roles"`, `"user_permissions"`
- **WHEN** the user logs out (logout function is called)
- **THEN** the system removes all auth-related keys from localStorage
- **AND** the system removes any customer-related keys (`"customer_id"`, `"customer"`)

### Requirement: Handle missing or null permissions array
The system SHALL handle cases where the login response does not include a permissions array or the permissions array is null.

#### Scenario: Login response missing permissions
- **GIVEN** the backend login response does not contain a `permissions` field
- **WHEN** the `login()` function processes the response
- **THEN** the system does not throw an error
- **AND** no `"user_permissions"` key is created in localStorage
- **OR** the system creates `"user_permissions"` with an empty array `[]`

#### Scenario: Login response has null permissions
- **GIVEN** the backend login response contains `permissions: null`
- **WHEN** the `login()` function processes the response
- **THEN** the system either skips storage or stores `"user_permissions": "[]"`
- **AND** does not throw an error

### Requirement: Handle missing or null roles array
The system SHALL handle cases where the login response does not include a roles array or the roles array is null.

#### Scenario: Login response missing roles
- **GIVEN** the backend login response does not contain a `roles` field
- **WHEN** the `login()` function processes the response
- **THEN** the system does not throw an error
- **AND** no `"user_roles"` key is created in localStorage
- **OR** the system creates `"user_roles"` with an empty array `[]`

#### Scenario: Login response has null roles
- **GIVEN** the backend login response contains `roles: null`
- **WHEN** the `login()` function processes the response
- **THEN** the system either skips storage or stores `"user_roles": "[]"`
- **AND** does not throw an error

### Requirement: Maintain response status check
The system SHALL only store authentication data in localStorage when the login API response has a successful status code (200 or 201).

#### Scenario: Failed login does not store data
- **GIVEN** the user submits invalid credentials
- **AND** the backend responds with status code 401 (Unauthorized)
- **WHEN** the `login()` function processes the response
- **THEN** the system does NOT store any data in localStorage
- **AND** no auth-related keys are created or modified

#### Scenario: Successful login stores data
- **GIVEN** the user submits valid credentials
- **AND** the backend responds with status code 200 or 201
- **WHEN** the `login()` function processes the response
- **THEN** the system stores all auth data (token, user ID, roles, permissions)
