## ADDED Requirements

### Requirement: User report data display
The system SHALL display user activity and engagement data including role information, status, and activity metrics.

#### Scenario: View user report
- **WHEN** an admin navigates to the user report page
- **THEN** the system displays a table with columns: user name, email, role, status, registration date, last login, and activity metrics

#### Scenario: Display user profile image
- **WHEN** a user record includes a profile image URL
- **THEN** the system displays a thumbnail preview of the user's profile image

### Requirement: User report filtering
The system SHALL provide user-specific filters for role, status, and date range.

#### Scenario: Filter by role
- **WHEN** a user selects a role (admin, super-admin, customer) from the role filter dropdown
- **THEN** the system displays only users with the selected role

#### Scenario: Filter by status
- **WHEN** a user selects a status (active/inactive) from the status filter
- **THEN** the system displays only users with the selected status

#### Scenario: Filter by registration date range
- **WHEN** a user selects a date range using the date picker
- **THEN** the system displays only users who registered within the selected date range

#### Scenario: Filter by last login date range
- **WHEN** a user selects a date range for last login
- **THEN** the system displays only users whose last login falls within the selected date range

#### Scenario: Search users by name or email
- **WHEN** a user enters text in the search field and submits
- **THEN** the system displays users whose name or email contains the search text (case-insensitive)

### Requirement: User metrics visualization
The system SHALL display user statistics and trends using charts and summary cards.

#### Scenario: View user statistics summary
- **WHEN** the user report page loads
- **THEN** the system displays summary cards showing total users, active users, new registrations this month, and users by role breakdown

#### Scenario: View registration trend chart
- **WHEN** a user views the user report page
- **THEN** the system displays a line chart showing user registrations over time (daily/weekly/monthly)

#### Scenario: View role distribution chart
- **WHEN** a user views the user report page
- **THEN** the system displays a pie chart showing the distribution of users across roles

#### Scenario: View user activity heatmap
- **WHEN** a user views the user report page
- **THEN** the system displays a chart showing user activity patterns by day of week and hour

### Requirement: User activity tracking
The system SHALL track and display user engagement metrics.

#### Scenario: Display user login frequency
- **WHEN** viewing the user report
- **THEN** the system displays each user's login count and last login date/time

#### Scenario: Display user activity status
- **WHEN** viewing the user report
- **THEN** the system indicates whether each user is currently active (logged in) or inactive

### Requirement: User report sorting
The system SHALL allow sorting user data by name, registration date, last login, and activity metrics.

#### Scenario: Sort by registration date
- **WHEN** a user sorts the table by the registration date column
- **THEN** the system orders users from newest to oldest registration

#### Scenario: Sort by last login
- **WHEN** a user sorts the table by the last login column
- **THEN** the system orders users from most recent to least recent login

#### Scenario: Sort by activity level
- **WHEN** a user sorts the table by the activity metrics column
- **THEN** the system orders users from most active to least active

### Requirement: User role display
The system SHALL display user roles with appropriate badges and indicators.

#### Scenario: Display admin role
- **WHEN** a user has the admin role
- **THEN** the system displays an "Admin" badge with appropriate styling

#### Scenario: Display super-admin role
- **WHEN** a user has the super-admin role
- **THEN** the system displays a "Super Admin" badge with distinctive styling

#### Scenario: Display customer role
- **WHEN** a user has the customer role
- **THEN** the system displays a "Customer" badge with appropriate styling

#### Scenario: Display multiple roles
- **WHEN** a user has multiple roles assigned
- **THEN** the system displays all roles as individual badges

### Requirement: User status indicators
The system SHALL visually indicate user account status with color-coded badges.

#### Scenario: Display active status
- **WHEN** a user account has status "active"
- **THEN** the system displays a green "Active" badge

#### Scenario: Display inactive status
- **WHEN** a user account has status "inactive"
- **THEN** the system displays a red "Inactive" badge
