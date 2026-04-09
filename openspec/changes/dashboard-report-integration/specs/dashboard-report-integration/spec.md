## ADDED Requirements

### Requirement: Aggregate report data for dashboard
The system SHALL provide a unified data layer that fetches and aggregates data from multiple report modules (packages, payments, members) for dashboard consumption.

#### Scenario: Fetch all report summaries on dashboard load
- **WHEN** dashboard component mounts
- **THEN** system SHALL fetch data from all report summary endpoints in parallel
- **AND** combine results into unified dashboard data structure
- **AND** handle individual endpoint failures gracefully
- **AND** display partial data if some endpoints fail

#### Scenario: Cache report summary data
- **WHEN** report summary data is fetched successfully
- **THEN** system SHALL cache data in localStorage with 5-minute TTL
- **AND** use cached data on subsequent dashboard loads within TTL
- **AND** invalidate cache when user initiates manual refresh

### Requirement: Provide real-time dashboard updates
The system SHALL update dashboard metrics in real-time when payment or member data changes via Socket.io notifications.

#### Scenario: Update metrics on new payment
- **WHEN** new payment notification received via socket
- **THEN** system SHALL update financial metrics incrementally
- **AND** refresh financial charts if significant change detected (>5%)
- **AND** show visual indicator of live update

#### Scenario: Update metrics on new member registration
- **WHEN** new member registration detected
- **THEN** system SHALL increment member count
- **AND** update member growth chart with new data point
- **AND** display notification of new member

### Requirement: Support time range filtering across all charts
The system SHALL provide unified time range filtering that applies to all dashboard charts and metrics simultaneously.

#### Scenario: Apply global time range filter
- **WHEN** user selects time range (e.g., "Last 30 days")
- **THEN** system SHALL update all package charts with selected range
- **AND** update all member charts with selected range
- **AND** update all financial charts with selected range
- **AND** refresh metric cards with aggregated data for range

#### Scenario: Persist time range selection
- **WHEN** user selects time range
- **THEN** system SHALL save selection to localStorage
- **AND** restore selection on next dashboard visit
- **AND** default to "Last 30 days" if no saved preference

### Requirement: Handle loading states gracefully
The system SHALL display appropriate loading states while fetching report data from multiple endpoints.

#### Scenario: Show skeleton loaders during fetch
- **WHEN** dashboard is loading report data
- **THEN** system SHALL display skeleton cards for each metric
- **AND** show skeleton placeholders for chart areas
- **AND** maintain layout stability during load

#### Scenario: Handle partial loading failures
- **WHEN** some report endpoints fail but others succeed
- **THEN** system SHALL display successful data normally
- **AND** show error message for failed sections
- **AND** provide retry buttons for failed sections only

### Requirement: Export dashboard data
The system SHALL allow users to export dashboard analytics data in CSV format for external analysis.

#### Scenario: Export single domain data
- **WHEN** user clicks export button on package analytics section
- **THEN** system SHALL generate CSV with package metrics
- **AND** include timestamp, package type, revenue, subscriptions
- **AND** trigger file download with filename `package-analytics-{timestamp}.csv`

#### Scenario: Export full dashboard data
- **WHEN** user clicks "Export All" button
- **THEN** system SHALL compile data from all sections
- **AND** generate CSV with tabs for packages, members, financials
- **AND** include summary metrics and detailed data
