## ADDED Requirements

### Requirement: Report page accessibility
The system SHALL restrict report page access to users with admin or super-admin roles.

#### Scenario: Admin accesses report pages
- **WHEN** a user with admin role navigates to any report page (/report/video, /report/user, /report/package, /report/payment)
- **THEN** the system displays the report page with all features enabled

#### Scenario: Non-admin attempts to access report pages
- **WHEN** a user without admin or super-admin role attempts to access a report page
- **THEN** the system redirects them to the default landing page or shows an access denied message

### Requirement: Report page common structure
Each report page SHALL provide a consistent structure with filters, data table, and export functionality.

#### Scenario: View report page structure
- **WHEN** a user navigates to any report page
- **THEN** the system displays:
  - Page title and description
  - Filter controls section (search, date range, status filters, entity-specific filters)
  - Data table with sortable columns
  - Pagination controls
  - Export button

### Requirement: Report data filtering
The system SHALL allow users to filter report data using multiple criteria simultaneously.

#### Scenario: Apply multiple filters
- **WHEN** a user applies multiple filters (search text, date range, status, entity-specific filters)
- **THEN** the system updates the data table to show only records matching all filter criteria

#### Scenario: Clear filters
- **WHEN** a user clicks the "Reset" or "Clear" button
- **THEN** the system clears all filters and reloads the full dataset

### Requirement: Report data pagination
The system SHALL paginate report data with configurable page size.

#### Scenario: Navigate between pages
- **WHEN** a user clicks pagination controls or changes page size
- **THEN** the system fetches and displays the requested page of data

#### Scenario: Maintain filters across page changes
- **WHEN** a user changes pages while filters are active
- **THEN** the system maintains the applied filters and shows filtered results for the new page

### Requirement: Report data export
The system SHALL allow users to export report data in CSV format.

#### Scenario: Export filtered data
- **WHEN** a user clicks the Export button while filters are applied
- **THEN** the system downloads a CSV file containing only the filtered data matching current filter criteria

#### Scenario: Export all data
- **WHEN** a user clicks the Export button with no filters applied
- **THEN** the system downloads a CSV file containing all data for the report type

### Requirement: Report data sorting
The system SHALL allow users to sort data by any column in ascending or descending order.

#### Scenario: Sort by column
- **WHEN** a user clicks a column header
- **THEN** the system sorts the data table by that column in ascending order, and toggles to descending on second click

### Requirement: Report page internationalization
All report pages SHALL support both Lao (primary) and English languages.

#### Scenario: View report in Lao
- **WHEN** a user views any report page with locale set to "lo"
- **THEN** the system displays all labels, buttons, and messages in Lao language

#### Scenario: View report in English
- **WHEN** a user views any report page with locale set to "en"
- **THEN** the system displays all labels, buttons, and messages in English language

### Requirement: Report module structure
Each report module SHALL follow the established module pattern with composible, interfaces, and Vue component.

#### Scenario: Module structure consistency
- **WHEN** a developer creates or maintains a report module
- **THEN** the module includes:
  - Vue page component (e.g., ReportVideo.vue)
  - Composible for API calls (composible/index.ts)
  - TypeScript interfaces (interface/*.ts)
  - Proper integration with router and sidebar navigation
