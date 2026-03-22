## ADDED Requirements

### Requirement: Video report data display
The system SHALL display video performance data including views, likes, customer attribution, and categorization.

#### Scenario: View video report
- **WHEN** an admin navigates to the video report page
- **THEN** the system displays a table with columns: video title, customer name, categories, total views, total likes, status, and creation date

#### Scenario: Display video thumbnail
- **WHEN** a video record includes an image URL
- **THEN** the system displays a thumbnail preview in the table

#### Scenario: Display video play button
- **WHEN** a video record includes a video URL
- **THEN** the system displays a play button that opens a video player modal

### Requirement: Video report filtering
The system SHALL provide video-specific filters for category, customer, and status.

#### Scenario: Filter by category
- **WHEN** a user selects a category from the category filter dropdown
- **THEN** the system displays only videos associated with the selected category

#### Scenario: Filter by customer
- **WHEN** a user selects a customer from the customer filter dropdown
- **THEN** the system displays only videos created by the selected customer

#### Scenario: Filter by status
- **WHEN** a user selects a status (active/inactive) from the status filter
- **THEN** the system displays only videos with the selected status

#### Scenario: Search videos by title
- **WHEN** a user enters text in the search field and submits
- **THEN** the system displays videos whose titles contain the search text (case-insensitive)

### Requirement: Video metrics visualization
The system SHALL display video performance metrics using charts and statistics.

#### Scenario: View video performance summary
- **WHEN** the video report page loads
- **THEN** the system displays summary cards showing total views, total likes, active videos, and total videos

#### Scenario: View views trend chart
- **WHEN** a user views the video report page
- **THEN** the system displays a line chart showing video views over time (daily/weekly/monthly)

#### Scenario: View category distribution
- **WHEN** a user views the video report page
- **THEN** the system displays a pie chart showing the distribution of videos across categories

### Requirement: Video report sorting
The system SHALL allow sorting video data by views, likes, and date.

#### Scenario: Sort by most viewed
- **WHEN** a user sorts the table by the views column
- **THEN** the system orders videos from highest to lowest view count

#### Scenario: Sort by most liked
- **WHEN** a user sorts the table by the likes column
- **THEN** the system orders videos from highest to lowest like count

#### Scenario: Sort by creation date
- **WHEN** a user sorts the table by the created_at column
- **THEN** the system orders videos from newest to oldest

### Requirement: Video playback modal
The system SHALL provide a modal for playing videos directly from the report.

#### Scenario: Open video player
- **WHEN** a user clicks the play button for a video
- **THEN** the system opens a modal with an HTML5 video player loaded with the video URL

#### Scenario: Close video player
- **WHEN** a user clicks the modal close button or outside the modal
- **THEN** the system closes the video player modal and stops playback

### Requirement: Video category display
The system SHALL display all categories associated with a video as tags.

#### Scenario: Display multiple categories
- **WHEN** a video is associated with multiple categories
- **THEN** the system displays all categories as individual colored tags

### Requirement: Video status indicators
The system SHALL visually indicate video status with color-coded badges.

#### Scenario: Display active status
- **WHEN** a video has status "active"
- **THEN** the system displays a green "Active" badge

#### Scenario: Display inactive status
- **WHEN** a video has status "inactive"
- **THEN** the system displays a red "Inactive" badge
