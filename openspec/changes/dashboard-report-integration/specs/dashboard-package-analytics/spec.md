## ADDED Requirements

### Requirement: Display package performance metrics
The dashboard SHALL display key package performance metrics including total packages, active subscriptions, total revenue, and pending subscriptions using data from the ReportPackage summary endpoint.

#### Scenario: Load package metrics on dashboard mount
- **WHEN** dashboard component mounts
- **THEN** system SHALL fetch package summary from `/packages/report/summary`
- **AND** display total_packages in a metric card
- **AND** display active_packages in a metric card
- **AND** display total_revenue in a metric card with LAK currency formatting
- **AND** display total_subscriptions in a metric card

#### Scenario: Handle package metrics fetch failure
- **WHEN** package summary API call fails
- **THEN** system SHALL display error message
- **AND** provide retry button
- **AND** show zero or cached values if available

### Requirement: Visualize package revenue trends
The dashboard SHALL display package revenue over time as an interactive area or line chart showing revenue trends across selectable time ranges.

#### Scenario: View package revenue trend
- **WHEN** user views package analytics section
- **THEN** system SHALL display area chart showing revenue trend
- **AND** chart SHALL include time range selector (7d, 30d, 90d options)
- **AND** chart SHALL use Ant Design primary colors (#1890ff, #52c41a)
- **AND** chart SHALL be responsive on mobile devices

#### Scenario: Interact with package revenue chart
- **WHEN** user hovers over chart data point
- **THEN** system SHALL display tooltip with exact revenue amount
- **AND** format currency as LAK with thousand separators

### Requirement: Show package type distribution
The dashboard SHALL display package distribution as a pie or doughnut chart showing revenue share or subscription count by package type (1-month, 3-month, 6-month, 1-year).

#### Scenario: View package distribution chart
- **WHEN** user views package analytics section
- **THEN** system SHALL display pie chart with package type breakdown
- **AND** each segment SHALL be labeled with package type
- **AND** segments SHALL use distinct colors from Ant Design palette
- **AND** chart SHALL include legend showing package types

#### Scenario: Filter by package type
- **WHEN** user clicks on a package type segment
- **THEN** system SHALL highlight selected package type
- **AND** update other charts to show data for selected package only

### Requirement: Display package performance comparison
The dashboard SHALL display a bar chart comparing performance metrics across package types, including active subscriptions, pending subscriptions, and revenue per package type.

#### Scenario: View package performance comparison
- **WHEN** user views package analytics section
- **THEN** system SHALL display bar chart with package types on x-axis
- **AND** display grouped bars for active, pending, and revenue metrics
- **AND** enable switching between metrics via selector

### Requirement: Navigate to detailed package reports
The dashboard SHALL provide navigation from package analytics cards to the detailed package report page with relevant filters pre-applied.

#### Scenario: Click through to package details
- **WHEN** user clicks on package metric card
- **THEN** system SHALL navigate to `/report/package`
- **AND** pre-fill filters with dashboard's selected time range
