## ADDED Requirements

### Requirement: Display key performance metrics

The dashboard SHALL display key performance metrics in real-time with visual indicators for trends and status.

#### Scenario: Initial dashboard load
- **WHEN** user navigates to the dashboard
- **THEN** the system SHALL display loading skeleton screens while fetching metrics
- **THEN** after data loads, SHALL display all metric cards with animated entrance transitions
- **THEN** each metric card SHALL show the current value and a trend indicator (increase/decrease percentage)

#### Scenario: Metric card interaction
- **WHEN** user hovers over a metric card
- **THEN** the card SHALL scale up slightly and show enhanced shadow
- **THEN** clicking on a card SHALL navigate to relevant detail page (e.g., users page from user count card)

#### Scenario: Real-time metric updates
- **WHEN** a socket event indicates a metric change
- **THEN** the affected metric card SHALL update its value with a subtle flash animation
- **THEN** the system SHALL update trend indicators dynamically based on comparison
- **THEN** other cards SHALL remain unchanged to avoid unnecessary re-renders

#### Scenario: Metric trend calculation
- **WHEN** displaying trend indicators
- **THEN** the system SHALL compare current value to previous period (day, week, month)
- **THEN** positive trends SHALL be displayed in green with up arrow
- **THEN** negative trends SHALL be displayed in red with down arrow
- **THEN** neutral trends SHALL be displayed in gray

#### Scenario: Metric data unavailability
- **WHEN** API endpoint fails or returns error
- **THEN** the system SHALL display error state with retry button
- **THEN** metric cards SHALL show cached values with visual indicator that data is stale

#### Scenario: Metric card accessibility
- **WHEN** using screen reader or keyboard navigation
- **THEN** each metric card SHALL have semantic ARIA labels describing the metric
- **THEN** trend indicators SHALL be announced as percentage changes
- **THEN** metric cards SHALL be keyboard focusable and clickable
