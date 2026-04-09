## ADDED Requirements

### Requirement: Display member growth metrics
The dashboard SHALL display member growth metrics including total members, active members, new registrations in current period, and growth percentage using member/customer data.

#### Scenario: Load member metrics on dashboard
- **WHEN** dashboard component mounts
- **THEN** system SHALL fetch member summary data
- **AND** display total_members in a metric card
- **AND** display active_members in a metric card
- **AND** display new_regulations in a metric card
- **AND** display growth_percentage with trend indicator (up/down arrow)

#### Scenario: Handle member metrics unavailability
- **WHEN** member summary endpoint does not exist
- **THEN** system SHALL aggregate data from member list endpoint
- **AND** cache aggregated results for 5 minutes
- **OR** display message that member analytics are being calculated

### Requirement: Visualize member registration trends
The dashboard SHALL display member registration trends over time as a line chart showing new member signups across configurable time periods.

#### Scenario: View member growth trend
- **WHEN** user views member analytics section
- **THEN** system SHALL display line chart showing registration trend
- **AND** chart SHALL support time range selection (7d, 30d, 90d, 1y)
- **AND** display comparison line for same period in previous year if available
- **AND** use smooth curve interpolation for aesthetic appeal

#### Scenario: Highlight growth spurts
- **WHEN** member growth exceeds threshold (e.g., 20% increase)
- **THEN** system SHALL highlight data point with special marker
- **AND** display annotation explaining the growth

### Requirement: Show member status distribution
The dashboard SHALL display member status distribution as a pie chart showing breakdown of active, inactive, pending, and suspended members.

#### Scenario: View member status breakdown
- **WHEN** user views member analytics section
- **THEN** system SHALL display pie chart with member status segments
- **AND** use color coding: green (active), orange (pending), red (inactive/suspended)
- **AND** display count and percentage for each status
- **AND** include interactive legend to filter by status

### Requirement: Display member engagement by package tier
The dashboard SHALL display a bar chart showing member distribution across different package tiers or subscription levels.

#### Scenario: View member package distribution
- **WHEN** user views member analytics section
- **THEN** system SHALL display horizontal bar chart
- **AND** show package tiers on y-axis (1-month, 3-month, 6-month, 1-year)
- **AND** show member count on x-axis
- **AND** enable drill-down to see member list for each tier

### Requirement: Track member retention metrics
The dashboard SHALL display member retention metrics including renewal rate and churn rate for the selected time period.

#### Scenario: View retention metrics
- **WHEN** user views member analytics section
- **THEN** system SHALL display renewal rate percentage
- **AND** display churn rate percentage
- **AND** show trend line for retention over time
- **AND** highlight if retention rate drops below threshold

### Requirement: Navigate to member management
The dashboard SHALL provide navigation from member analytics cards to the member management page with relevant filters applied.

#### Scenario: Click through to member details
- **WHEN** user clicks on member metric card
- **THEN** system SHALL navigate to `/member` or `/customer`
- **AND** pre-filters based on selected status or package tier
