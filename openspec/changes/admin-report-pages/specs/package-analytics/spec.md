## ADDED Requirements

### Requirement: Package report data display
The system SHALL display package performance data including sales, revenue, and subscription metrics.

#### Scenario: View package report
- **WHEN** an admin navigates to the package report page
- **THEN** the system displays a table with columns: package name, type, price, total sales, total revenue, active subscriptions, status, and creation date

### Requirement: Package report filtering
The system SHALL provide package-specific filters for package type, status, and date range.

#### Scenario: Filter by package type
- **WHEN** a user selects a package type from the type filter dropdown
- **THEN** the system displays only packages of the selected type

#### Scenario: Filter by status
- **WHEN** a user selects a status (active/inactive) from the status filter
- **THEN** the system displays only packages with the selected status

#### Scenario: Filter by creation date range
- **WHEN** a user selects a date range using the date picker
- **THEN** the system displays only packages created within the selected date range

#### Scenario: Search packages by name or content
- **WHEN** a user enters text in the search field and submits
- **THEN** the system displays packages whose name or content contains the search text (case-insensitive)

### Requirement: Package metrics visualization
The system SHALL display package performance metrics using charts and summary cards.

#### Scenario: View package statistics summary
- **WHEN** the package report page loads
- **THEN** the system displays summary cards showing total packages, active packages, total revenue, and total subscriptions

#### Scenario: View revenue trend chart
- **WHEN** a user views the package report page
- **THEN** the system displays a line chart showing package revenue over time (daily/weekly/monthly)

#### Scenario: View package sales comparison
- **WHEN** a user views the package report page
- **THEN** the system displays a bar chart comparing sales across different packages

#### Scenario: View package type distribution
- **WHEN** a user views the package report page
- **THEN** the system displays a pie chart showing the distribution of packages by type

### Requirement: Package revenue calculation
The system SHALL calculate and display revenue metrics for each package.

#### Scenario: Display package revenue
- **WHEN** viewing the package report
- **THEN** the system displays total revenue for each package (price × number of sales)

#### Scenario: Display total revenue
- **WHEN** viewing the package report
- **THEN** the system displays the sum of revenue across all packages

### Requirement: Package subscription tracking
The system SHALL track and display active subscription counts for each package.

#### Scenario: Display active subscriptions
- **WHEN** viewing the package report
- **THEN** the system displays the number of currently active subscriptions for each package

#### Scenario: Display total subscriptions
- **WHEN** viewing the package report
- **THEN** the system displays the total number of subscriptions (including expired) for each package

### Requirement: Package report sorting
The system SHALL allow sorting package data by sales, revenue, and date.

#### Scenario: Sort by sales count
- **WHEN** a user sorts the table by the sales column
- **THEN** the system orders packages from highest to lowest sales count

#### Scenario: Sort by revenue
- **WHEN** a user sorts the table by the revenue column
- **THEN** the system orders packages from highest to lowest revenue

#### Scenario: Sort by subscriptions
- **WHEN** a user sorts the table by the subscriptions column
- **THEN** the system orders packages from highest to lowest active subscription count

#### Scenario: Sort by price
- **WHEN** a user sorts the table by the price column
- **THEN** the system orders packages from highest to lowest price

### Requirement: Package price display
The system SHALL display package prices with proper formatting and currency indication.

#### Scenario: Display package price
- **WHEN** viewing the package report
- **THEN** the system displays each package's price with appropriate currency formatting

### Requirement: Package type indicators
The system SHALL visually distinguish different package types with badges or color coding.

#### Scenario: Display package type badges
- **WHEN** viewing the package report
- **THEN** the system displays each package's type as a colored badge for easy identification

### Requirement: Package status indicators
The system SHALL visually indicate package status with color-coded badges.

#### Scenario: Display active status
- **WHEN** a package has status "active"
- **THEN** the system displays a green "Active" badge

#### Scenario: Display inactive status
- **WHEN** a package has status "inactive"
- **THEN** the system displays a red "Inactive" badge
