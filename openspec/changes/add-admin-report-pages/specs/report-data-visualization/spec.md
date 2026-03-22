# Report Data Visualization - Specification

## ADDED Requirements

### Requirement: Chart section displays on report pages
The system SHALL display a collapsible chart section on all 4 admin report pages (video, user, package, payment) positioned between summary cards and filter controls.

#### Scenario: Chart section is visible by default
- **GIVEN** user navigates to any report page (/admin/report/report-video, /admin/report/report-user, /admin/report/report-package, /admin/report/report-payment)
- **WHEN** page loads
- **THEN** chart section is visible and expanded below summary cards
- **AND** charts render with initial data

#### Scenario: User can collapse chart section
- **GIVEN** chart section is visible
- **WHEN** user clicks collapse button
- **THEN** chart section collapses to hide all charts
- **AND** collapse button changes to expand button
- **AND** table and filters remain accessible

#### Scenario: User can expand collapsed chart section
- **GIVEN** chart section is collapsed
- **WHEN** user clicks expand button
- **THEN** chart section expands to show all charts
- **AND** charts render with current filter data

### Requirement: Report video displays multiple chart types
The system SHALL display 3 chart types on the video report page: line chart for views trend, pie chart for likes distribution by category, and bar chart for top videos ranking.

#### Scenario: Line chart shows video views over time
- **GIVEN** user is on video report page
- **WHEN** chart section loads
- **THEN** line chart displays video views trend over selected time period
- **AND** x-axis shows dates grouped by selected period (daily/weekly/monthly/yearly)
- **AND** y-axis shows total views count
- **AND** chart title displays "Video Views Trend"

#### Scenario: Pie chart shows likes distribution by category
- **GIVEN** user is on video report page
- **WHEN** chart section loads
- **THEN** pie chart displays distribution of video likes across categories
- **AND** each slice represents a movie category (Action, Drama, Comedy, etc.)
- **AND** slice size corresponds to percentage of total likes in that category
- **AND** clicking slice shows exact count and percentage in tooltip

#### Scenario: Bar chart shows top 10 videos by views
- **GIVEN** user is on video report page
- **WHEN** chart section loads
- **THEN** bar chart displays top 10 videos ranked by views
- **AND** x-axis shows video titles
- **AND** y-axis shows view counts
- **AND** bars are sorted in descending order by views

### Requirement: Report user displays multiple chart types
The system SHALL display 3 chart types on the user report page: area chart for registration trend, pie chart for role distribution, and bar chart for user activity by role.

#### Scenario: Area chart shows user registrations over time
- **GIVEN** user is on user report page
- **WHEN** chart section loads
- **THEN** area chart displays user registration trend over selected time period
- **AND** x-axis shows dates grouped by selected period
- **AND** y-axis shows cumulative user count
- **AND** filled area under line shows growth

#### Scenario: Pie chart shows user role distribution
- **GIVEN** user is on user report page
- **WHEN** chart section loads
- **THEN** pie chart displays distribution of users by role
- **AND** slices show admin, super-admin, and customer roles
- **AND** each slice shows count and percentage

#### Scenario: Bar chart shows active vs inactive users by role
- **GIVEN** user is on user report page
- **WHEN** chart section loads
- **THEN** grouped bar chart displays active and inactive user counts
- **AND** x-axis shows user roles
- **AND** y-axis shows user counts
- **AND** green bars represent active users
- **AND** red bars represent inactive users

### Requirement: Report package displays multiple chart types
The system SHALL display 3 chart types on the package report page: line chart for revenue trend, pie chart for package type distribution, and bar chart for sales by package type.

#### Scenario: Line chart shows revenue trend over time
- **GIVEN** user is on package report page
- **WHEN** chart section loads
- **THEN** line chart displays total revenue trend over selected time period
- **AND** x-axis shows dates grouped by selected period
- **AND** y-axis shows revenue in local currency format
- **AND** data points show exact revenue on hover

#### Scenario: Pie chart shows package type distribution
- **GIVEN** user is on package report page
- **WHEN** chart section loads
- **THEN** pie chart displays distribution of packages by type
- **AND** slices show 1month, 3months, 6months, and 1year packages
- **AND** each slice shows count and percentage

#### Scenario: Bar chart shows sales by package type
- **GIVEN** user is on package report page
- **WHEN** chart section loads
- **THEN** bar chart displays total sales count by package type
- **AND** x-axis shows package types
- **AND** y-axis shows sales count
- **AND** bars show number of packages sold

### Requirement: Report payment displays multiple chart types
The system SHALL display 3 chart types on the payment report page: area chart for payment volume, pie chart for status breakdown, and bar chart for revenue by payment method.

#### Scenario: Area chart shows payment volume over time
- **GIVEN** user is on payment report page
- **WHEN** chart section loads
- **THEN** area chart displays payment volume trend over selected time period
- **AND** x-axis shows dates grouped by selected period
- **AND** y-axis shows total payment amount
- **AND** filled area shows payment flow

#### Scenario: Pie chart shows payment status breakdown
- **GIVEN** user is on payment report page
- **WHEN** chart section loads
- **THEN** pie chart displays distribution of payment statuses
- **AND** slices show pending, approved, and rejected payments
- **AND** colors indicate status (orange=pending, green=approved, red=rejected)

#### Scenario: Bar chart shows revenue by payment method
- **GIVEN** user is on payment report page
- **WHEN** chart section loads
- **THEN** bar chart displays total revenue by payment type
- **AND** x-axis shows payment methods (bank_transfer, credit_card, mobile_payment, cash)
- **AND** y-axis shows revenue amount
- **AND** bars are sorted by revenue descending

### Requirement: Period selector filters time-based charts
The system SHALL provide a period selector dropdown that changes the time granularity for all time-series charts (line/area charts) on the current report page.

#### Scenario: User selects daily period
- **GIVEN** user is viewing any report page with time-series charts
- **WHEN** user selects "Daily" from period dropdown
- **THEN** all line/area charts group data by day
- **AND** x-axis shows individual dates
- **AND** chart data API is called with period=daily parameter

#### Scenario: User selects weekly period
- **GIVEN** user is viewing any report page with time-series charts
- **WHEN** user selects "Weekly" from period dropdown
- **THEN** all line/area charts group data by week
- **AND** x-axis shows week dates
- **AND** chart data API is called with period=weekly parameter

#### Scenario: User selects monthly period
- **GIVEN** user is viewing any report page with time-series charts
- **WHEN** user selects "Monthly" from period dropdown
- **THEN** all line/area charts group data by month
- **AND** x-axis shows month names
- **AND** chart data API is called with period=monthly parameter

#### Scenario: User selects yearly period
- **GIVEN** user is viewing any report page with time-series charts
- **WHEN** user selects "Yearly" from period dropdown
- **THEN** all line/area charts group data by year
- **AND** x-axis shows years
- **AND** chart data API is called with period=yearly parameter

### Requirement: Charts respect filter controls
The system SHALL update all chart data when user changes filter controls (search, date range, status filters, dropdowns) on the report page.

#### Scenario: Charts update when date range changes
- **GIVEN** user is viewing any report page
- **WHEN** user selects a new date range from date range picker
- **THEN** all charts automatically refresh with new data
- **AND** chart API call includes start_date and end_date parameters
- **AND** loading state shows during data fetch

#### Scenario: Charts update when status filter changes
- **GIVEN** user is viewing a report page with status filter
- **WHEN** user selects a status (active/inactive/pending/approved/rejected)
- **THEN** all charts automatically refresh filtered by selected status
- **AND** chart API call includes status parameter
- **AND** chart data reflects only records with selected status

#### Scenario: Charts update when category/customer dropdown changes
- **GIVEN** user is on video report page
- **WHEN** user selects a category or customer from dropdown
- **THEN** all charts automatically refresh filtered by selection
- **AND** chart API call includes category_id or customer_id parameter
- **AND** charts show data only for selected category/customer

#### Scenario: Charts update when search text changes
- **GIVEN** user is viewing any report page
- **WHEN** user enters search text and clicks Search button
- **THEN** all charts automatically refresh filtered by search term
- **AND** chart API call includes search parameter
- **AND** charts show data matching search criteria

### Requirement: Charts display loading state
The system SHALL display a loading indicator while chart data is being fetched from the API.

#### Scenario: Loading spinner shows during initial load
- **GIVEN** user navigates to a report page
- **WHEN** chart section loads
- **THEN** each chart displays a skeleton loader or spinning icon
- **AND** loading state persists until chart data API returns
- **AND** loading indicator is replaced by rendered chart on success

#### Scenario: Loading state shows when filters change
- **GIVEN** user is viewing a report page with loaded charts
- **WHEN** user changes any filter
- **THEN** all charts show loading state
- **AND** charts render with new data after API response

### Requirement: Charts display error state
The system SHALL display an error message when chart data fails to load from the API.

#### Scenario: Error message shows on API failure
- **GIVEN** user is viewing a report page
- **WHEN** chart data API call fails (network error, server error, etc.)
- **THEN** each chart displays error message "Failed to load chart data"
- **AND** error message includes retry button
- **AND** clicking retry button re-attempts API call

#### Scenario: Empty state shows when no data available
- **GIVEN** user is viewing a report page
- **WHEN** chart data API returns empty dataset
- **THEN** chart displays "No data available for selected filters"
- **AND** empty chart area is shown without chart rendering

### Requirement: Charts are responsive on mobile devices
The system SHALL display charts in a responsive layout that adapts to mobile, tablet, and desktop screen sizes.

#### Scenario: Charts stack vertically on mobile
- **GIVEN** user views report page on mobile screen (< 768px width)
- **WHEN** chart section loads
- **THEN** charts are stacked vertically in single column
- **AND** chart height is 250px for mobile
- **AND** charts remain interactive and readable

#### Scenario: Charts display in grid on desktop
- **GIVEN** user views report page on desktop screen (≥ 1024px width)
- **WHEN** chart section loads
- **THEN** charts display in 2-column grid layout
- **AND** chart height is 300px for desktop
- **AND** charts maintain aspect ratios

#### Scenario: Charts adapt on tablet
- **GIVEN** user views report page on tablet (768px - 1023px width)
- **WHEN** chart section loads
- **THEN** charts display in 2-column grid with larger touch targets
- **AND** chart height is 280px for tablet

### Requirement: Charts support tooltip interactions
The system SHALL display detailed information in tooltips when user hovers over or interacts with chart elements.

#### Scenario: Line chart tooltip shows data point details
- **GIVEN** user views line chart on any report page
- **WHEN** user hovers over data point
- **THEN** tooltip displays date, metric name, and exact value
- **AND** tooltip follows mouse cursor
- **AND** tooltip background is opaque for readability

#### Scenario: Pie chart tooltip shows slice details
- **GIVEN** user views pie chart on any report page
- **WHEN** user hovers over pie slice
- **THEN** tooltip displays category name, count, and percentage
- **AND** tooltip highlights selected slice

#### Scenario: Bar chart tooltip shows bar details
- **GIVEN** user views bar chart on any report page
- **WHEN** user hovers over bar
- **THEN** tooltip displays label and exact value
- **AND** tooltip shows bar rank if applicable

### Requirement: Chart section follows existing module pattern
The system SHALL implement chart functionality using the existing composible pattern with separate API calls for chart data.

#### Scenario: Composible exports fetchChartData method
- **GIVEN** chart functionality is added to a report module
- **WHEN** composible is created or updated
- **THEN** composible exports fetchChartData method
- **AND** fetchChartData accepts period, start_date, end_date, and filter parameters
- **AND** fetchChartData returns chart data object with timeline, distribution, and ranking arrays

#### Scenario: Component calls composible for chart data
- **GIVEN** report Vue component loads
- **WHEN** component mounts or filters change
- **THEN** component calls fetchChartData from composible
- **AND** component passes current filter values and period
- **AND** component stores returned data in reactive state
- **AND** component passes chart data to child chart components

### Requirement: Chart labels support internationalization
The system SHALL display chart titles, axis labels, legends, and tooltips in both Lao and English languages based on selected locale.

#### Scenario: Charts display in English when locale is en
- **GIVEN** user has selected English language (locale: "en")
- **WHEN** chart section renders
- **THEN** all chart titles display in English
- **AND** all axis labels display in English
- **AND** all tooltips display in English
- **AND** all legend text displays in English

#### Scenario: Charts display in Lao when locale is lo
- **GIVEN** user has selected Lao language (locale: "lo")
- **WHEN** chart section renders
- **THEN** all chart titles display in Lao
- **AND** all axis labels display in Lao
- **AND** all tooltips display in Lao
- **AND** all legend text displays in Lao

#### Scenario: Charts update when language changes
- **GIVEN** user is viewing report page with charts
- **WHEN** user switches language using language switcher
- **THEN** all chart text updates to new language immediately
- **AND** chart data remains unchanged
