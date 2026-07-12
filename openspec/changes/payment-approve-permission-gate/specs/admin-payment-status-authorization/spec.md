## ADDED Requirements

### Requirement: Payment status change requires the approve-payment permission
On the admin Payments screen, the per-row status-change control SHALL be available only to users who hold the `approve-payment` permission (checked via `can('approve', 'payment')`). Super-admins bypass all permission checks and are therefore always allowed.

#### Scenario: User with approve-payment permission
- **WHEN** a user who has `approve-payment` (or is super-admin) views the payments table
- **THEN** each row's status SHALL render as an interactive dropdown
- **AND** selecting a new status SHALL call the update-status action

#### Scenario: User without approve-payment permission
- **WHEN** a user who lacks `approve-payment` views the payments table
- **THEN** each row's status SHALL render as a read-only tag (same color and label)
- **AND** there SHALL be no dropdown or clickable control to change the status

#### Scenario: Guarded update action
- **WHEN** `updateStatus` is invoked while the user lacks `approve-payment`
- **THEN** it SHALL not send a status-change request

### Requirement: Status filter remains available to all viewers
The status **filter** select on the Payments screen SHALL remain usable by anyone who can view the page and SHALL NOT be gated by `approve-payment`, because filtering is a read-only convenience, not the approval action.

#### Scenario: Filtering without approve permission
- **WHEN** a user without `approve-payment` uses the status filter dropdown
- **THEN** the payment list SHALL filter by the selected status as normal
