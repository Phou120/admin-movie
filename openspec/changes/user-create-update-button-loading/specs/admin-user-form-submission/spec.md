## ADDED Requirements

### Requirement: Create User submit button reflects request progress
While a create-user request is in flight, the Create User submit button SHALL show a loading state and SHALL be disabled, preventing duplicate submissions. The loading state SHALL be cleared when the request settles (success or failure).

#### Scenario: Submitting the create form
- **WHEN** the user submits a valid Create User form
- **THEN** the submit button SHALL show a loading spinner and be disabled until the request completes

#### Scenario: Create fails
- **WHEN** the create request returns an error
- **THEN** the button SHALL return to its normal (non-loading) state
- **AND** the backend error message SHALL be shown to the user

#### Scenario: Prevent double submit
- **WHEN** the user clicks the submit button while a create request is already running
- **THEN** no second create request SHALL be sent

### Requirement: Update User submit button reflects request progress
While an update-user request is in flight, the Update User submit button SHALL show a loading state and be disabled, and SHALL clear it when the request settles. Both create and update forms SHALL behave consistently.

#### Scenario: Submitting the update form
- **WHEN** the user submits the Update User form
- **THEN** the submit button SHALL show a loading spinner and be disabled until the request completes, then return to normal
