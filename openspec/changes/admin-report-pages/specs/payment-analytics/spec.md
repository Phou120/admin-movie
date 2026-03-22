## ADDED Requirements

### Requirement: Payment report data display
The system SHALL display payment transaction data including amount, status, payer information, and timestamp.

#### Scenario: View payment report
- **WHEN** an admin navigates to the payment report page
- **THEN** the system displays a table with columns: transaction ID, member name, package name, amount, payment type, status, slip image, and payment date

#### Scenario: Display payment slip thumbnail
- **WHEN** a payment record includes a slip image URL
- **THEN** the system displays a thumbnail preview that can be clicked to view the full slip image

### Requirement: Payment report filtering
The system SHALL provide payment-specific filters for status, payment type, date range, and member.

#### Scenario: Filter by payment status
- **WHEN** a user selects a status (pending/approved/rejected) from the status filter dropdown
- **THEN** the system displays only payments with the selected status

#### Scenario: Filter by payment type
- **WHEN** a user selects a payment type from the payment type filter dropdown
- **THEN** the system displays only payments of the selected type

#### Scenario: Filter by payment date range
- **WHEN** a user selects a date range using the date picker
- **THEN** the system displays only payments made within the selected date range

#### Scenario: Filter by member
- **WHEN** a user selects a member from the member filter dropdown
- **THEN** the system displays only payments made by the selected member

#### Scenario: Search payments by transaction ID or member name
- **WHEN** a user enters text in the search field and submits
- **THEN** the system displays payments whose transaction ID or member name contains the search text (case-insensitive)

### Requirement: Payment metrics visualization
The system SHALL display payment analytics using charts and summary cards.

#### Scenario: View payment statistics summary
- **WHEN** the payment report page loads
- **THEN** the system displays summary cards showing total revenue, pending payments, approved payments, rejected payments, and transaction count

#### Scenario: View revenue trend chart
- **WHEN** a user views the payment report page
- **THEN** the system displays a line chart showing payment revenue over time (daily/weekly/monthly)

#### Scenario: View payment status distribution
- **WHEN** a user views the payment report page
- **THEN** the system displays a pie chart showing the distribution of payments by status (pending/approved/rejected)

#### Scenario: View payment type comparison
- **WHEN** a user views the payment report page
- **THEN** the system displays a bar chart comparing payment amounts across different payment types

### Requirement: Payment revenue calculation
The system SHALL calculate and display revenue metrics based on payment status.

#### Scenario: Display total revenue
- **WHEN** viewing the payment report
- **THEN** the system displays the sum of all approved payment amounts

#### Scenario: Display pending revenue
- **WHEN** viewing the payment report
- **THEN** the system displays the sum of all pending payment amounts

#### Scenario: Display approved revenue by payment type
- **WHEN** viewing the payment report
- **THEN** the system displays the revenue breakdown by payment type for approved payments

### Requirement: Payment status indicators
The system SHALL visually indicate payment status with color-coded badges.

#### Scenario: Display pending status
- **WHEN** a payment has status "pending"
- **THEN** the system displays an orange or yellow "Pending" badge

#### Scenario: Display approved status
- **WHEN** a payment has status "approved"
- **THEN** the system displays a green "Approved" badge

#### Scenario: Display rejected status
- **WHEN** a payment has status "rejected"
- **THEN** the system displays a red "Rejected" badge

### Requirement: Payment slip image viewing
The system SHALL allow users to view payment slip images in a modal.

#### Scenario: View full slip image
- **WHEN** a user clicks on a payment slip thumbnail
- **THEN** the system opens a modal displaying the full-size slip image

#### Scenario: Close slip image modal
- **WHEN** a user clicks the modal close button or outside the modal
- **THEN** the system closes the slip image modal

### Requirement: Payment report sorting
The system SHALL allow sorting payment data by amount, date, and status.

#### Scenario: Sort by payment amount
- **WHEN** a user sorts the table by the amount column
- **THEN** the system orders payments from highest to lowest amount

#### Scenario: Sort by payment date
- **WHEN** a user sorts the table by the payment date column
- **THEN** the system orders payments from most recent to oldest

#### Scenario: Sort by status
- **WHEN** a user sorts the table by the status column
- **THEN** the system groups and orders payments by status (pending, approved, rejected)

### Requirement: Payment amount formatting
The system SHALL display payment amounts with proper currency formatting.

#### Scenario: Display payment amount
- **WHEN** viewing the payment report
- **THEN** the system displays each payment amount with appropriate currency symbol and formatting (e.g., ₭1,250,000 or $125.00)

### Requirement: Payment type display
The system SHALL display payment method/type information clearly.

#### Scenario: Display payment type
- **WHEN** viewing the payment report
- **THEN** the system displays the payment type (e.g., bank transfer, credit card, mobile payment) for each transaction
