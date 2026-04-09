## ADDED Requirements

### Requirement: Display financial summary metrics
The dashboard SHALL display key financial metrics including total revenue, pending payments, approved payments, rejected payments, and net income using ReportPayment summary data.

#### Scenario: Load financial metrics on dashboard
- **WHEN** dashboard component mounts
- **THEN** system SHALL fetch payment summary from `/payments/report/summary`
- **AND** display total_revenue in metric card with LAK currency
- **AND** display pending_payments in metric card (orange accent)
- **AND** display approved_payments in metric card (green accent)
- **AND** display rejected_payments in metric card (red accent)

#### Scenario: Calculate net income
- **WHEN** payment summary data loads
- **THEN** system SHALL calculate net_income = approved_payments - rejected_payments
- **AND** display net income in prominent metric card
- **AND** show trend arrow comparing to previous period

### Requirement: Visualize income vs expenses trend
The dashboard SHALL display an area or line chart showing revenue trends over time with breakdown by payment status (approved, pending, rejected).

#### Scenario: View revenue trend chart
- **WHEN** user views financial analytics section
- **THEN** system SHALL display multi-line area chart
- **AND** show approved payments as green line with filled area
- **AND** show pending payments as orange line
- **AND** show rejected payments as red line
- **AND** support time range selection (daily, weekly, monthly views)

#### Scenario: Compare revenue periods
- **WHEN** user selects time range
- **THEN** system SHALL fetch payment data for selected period
- **AND** update chart with new data
- **AND** show percentage change from previous period

### Requirement: Display payment method distribution
The dashboard SHALL display a bar or pie chart showing payment distribution by payment method (bank transfer, mobile banking, cash, etc.).

#### Scenario: View payment method breakdown
- **WHEN** user views financial analytics section
- **THEN** system SHALL display bar chart with payment methods
- **AND** show amount for each payment method
- **AND** display percentage of total for each method
- **AND** use Ant Design colors for method categories

### Requirement: Track payment status trends
The dashboard SHALL display payment approval trends showing the ratio of approved vs rejected payments over time.

#### Scenario: View payment approval rate
- **WHEN** user views financial analytics section
- **THEN** system SHALL display line chart showing approval rate
- **AND** calculate approval_rate = approved / (approved + rejected) * 100
- **AND** show trend line with threshold markers
- **AND** alert if approval rate drops below 80%

### Requirement: Display monthly revenue comparison
The dashboard SHALL display a bar chart comparing revenue across months, showing current month, previous month, and same month last year.

#### Scenario: View monthly comparison
- **WHEN** user views financial analytics section
- **THEN** system SHALL display grouped bar chart
- **AND** show bars for current month, previous month, and year-ago month
- **AND** highlight current month bar
- **AND** display growth percentage annotations

### Requirement: Calculate and display financial KPIs
The dashboard SHALL calculate and display key performance indicators including average transaction value, payment success rate, and revenue per member.

#### Scenario: View financial KPIs
- **WHEN** user views financial analytics section
- **THEN** system SHALL display average_transaction_value metric
- **AND** display payment_success_rate percentage
- **AND** display revenue_per_member calculation
- **AND** show trend indicators for each KPI

### Requirement: Navigate to payment reports
The dashboard SHALL provide navigation from financial analytics cards to the detailed payment report page with relevant filters pre-applied.

#### Scenario: Click through to payment details
- **WHEN** user clicks on financial metric card
- **THEN** system SHALL navigate to `/report/payment`
- **AND** pre-apply filters based on selected time range and payment status
