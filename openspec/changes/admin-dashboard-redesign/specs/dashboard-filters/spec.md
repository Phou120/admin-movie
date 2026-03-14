## ADDED Requirements

### Requirement: Filter dashboard data by time and category

The dashboard SHALL provide interactive filter controls that allow users to narrow displayed data by time range and category.

#### Scenario: Time range selection
- **WHEN** user selects a time range from dropdown (Today, Last 7 Days, Last 30 Days, This Month, This Year, Custom)
- **THEN** the system SHALL update all metrics, charts, and activity feed for selected range
- **THEN** the system SHALL debounce selection changes by 300ms to avoid excessive API calls
- **THEN** selected range SHALL be visually highlighted in the control

#### Scenario: Custom date range
- **WHEN** user selects "Custom" time range
- **THEN** the system SHALL display date picker for start and end dates
- **THEN** the system SHALL validate that end date is after start date
- **THEN** the system SHALL show error message if date range exceeds maximum (e.g., 1 year)

#### Scenario: Category filtering
- **WHEN** user toggles category checkboxes (Users, Content, Payments, System)
- **THEN** the system SHALL show only metrics and activities for selected categories
- **THEN** the system SHALL maintain independent filters for charts and activity feed
- **THEN** the system shall display count of items for each selected category

#### Scenario: Quick filter presets
- **WHEN** user hovers over filter dropdown
- **THEN** the system SHALL show quick action buttons (Today, This Week, This Month)
- **THEN** clicking a preset SHALL immediately apply the filter without opening dropdown

#### Scenario: Filter persistence
- **WHEN** user applies or changes filters
- **THEN** the system SHALL save filter selection to localStorage
- **THEN** on next dashboard visit, the system SHALL restore saved filters
- **THEN** the system SHALL apply filters before showing loading state

#### Scenario: Clearing filters
- **WHEN** user clicks "Clear Filters" button
- **THEN** the system SHALL reset all filters to default (Last 30 Days, All Categories)
- **THEN** the system SHALL refresh all dashboard data with default filters
- **THEN** the clear action shall have confirmation if user has unsaved changes

#### Scenario: Filter visual feedback
- **WHEN** filters are applied and data is loading
- **THEN** the filter controls SHALL show loading spinner or skeleton
- **THEN** the system shall display progress indicator (e.g., "Updating dashboard...")

#### Scenario: Filter accessibility
- **WHEN** using keyboard navigation
- **THEN** filter dropdowns and controls SHALL be keyboard accessible
- **THEN** selected filters SHALL be announced to screen readers
- **THEN** filter controls shall have clear focus states for visual indication
