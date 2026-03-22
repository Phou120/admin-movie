# Report Chart API - Specification

## ADDED Requirements

### Requirement: Video report chart data endpoint
The system SHALL provide a REST API endpoint that returns aggregated video statistics data formatted for chart visualization.

#### Scenario: GET /videos/report/chart returns video metrics
- **GIVEN** user is authenticated with admin or super-admin role
- **WHEN** user sends GET request to /videos/report/chart with period, start_date, end_date, category_id, customer_id, and status parameters
- **THEN** system returns HTTP 200 OK with chart data object
- **AND** response contains timeline array with date, views, and likes grouped by period
- **AND** response contains distribution array with category and count for likes distribution
- **AND** response contains ranking array with title, views, and likes for top 10 videos
- **AND** data respects all provided filters (category, customer, status, date range)

#### Scenario: Chart API respects period parameter
- **GIVEN** user requests /videos/report/chart
- **WHEN** period parameter is "daily"
- **THEN** timeline data groups by day (YYYY-MM-DD format)
- **WHEN** period parameter is "weekly"
- **THEN** timeline data groups by week (YYYY-Www format)
- **WHEN** period parameter is "monthly"
- **THEN** timeline data groups by month (YYYY-MM format)
- **WHEN** period parameter is "yearly"
- **THEN** timeline data groups by year (YYYY format)
- **AND** default period is "monthly" if not provided

#### Scenario: Chart API filters by date range
- **GIVEN** user requests /videos/report/chart with start_date and end_date parameters
- **WHEN** both dates are provided
- **THEN** timeline data includes only records within date range inclusive
- **WHEN** start_date is missing
- **THEN** system uses earliest record date as start
- **WHEN** end_date is missing
- **THEN** system uses current date as end

#### Scenario: Chart API filters by category
- **GIVEN** user requests /videos/report/chart with category_id parameter
- **WHEN** category_id is provided
- **THEN** all chart data includes only videos in specified category
- **AND** distribution array has single entry for that category

#### Scenario: Chart API filters by customer
- **GIVEN** user requests /videos/report/chart with customer_id parameter
- **WHEN** customer_id is provided
- **THEN** all chart data includes only videos from specified customer
- **AND** timeline shows views/likes for that customer's videos only

#### Scenario: Chart API filters by status
- **GIVEN** user requests /videos/report/chart with status parameter
- **WHEN** status is "active" or "inactive"
- **THEN** all chart data includes only videos with matching status

#### Scenario: Chart API returns 401 for unauthenticated requests
- **GIVEN** user is not authenticated
- **WHEN** user sends GET request to /videos/report/chart
- **THEN** system returns HTTP 401 Unauthorized
- **AND** response contains error message

#### Scenario: Chart API returns 403 for non-admin users
- **GIVEN** user is authenticated with customer role
- **WHEN** user sends GET request to /videos/report/chart
- **THEN** system returns HTTP 403 Forbidden
- **AND** response contains error message indicating insufficient permissions

### Requirement: User report chart data endpoint
The system SHALL provide a REST API endpoint that returns aggregated user statistics data formatted for chart visualization.

#### Scenario: GET /users/report/chart returns user metrics
- **GIVEN** user is authenticated with admin or super-admin role
- **WHEN** user sends GET request to /users/report/chart with period, start_date, end_date, role, and status parameters
- **THEN** system returns HTTP 200 OK with chart data object
- **AND** response contains timeline array with date and registrations grouped by period
- **AND** response contains distribution array with role and count for role distribution
- **AND** response contains activity array with role, active_count, and inactive_count for activity breakdown
- **AND** data respects all provided filters (role, status, date range)

#### Scenario: User chart API groups registrations by period
- **GIVEN** user requests /users/report/chart
- **WHEN** period parameter is provided
- **THEN** timeline data groups user registrations by specified period
- **AND** each timeline entry contains date (grouped by period) and cumulative user count

#### Scenario: User chart API filters by role
- **GIVEN** user requests /users/report/chart with role parameter
- **WHEN** role is "admin", "super-admin", or "customer"
- **THEN** all chart data includes only users with specified role
- **AND** distribution array has single entry for that role

#### Scenario: User chart API filters by status
- **GIVEN** user requests /users/report/chart with status parameter
- **WHEN** status is "active" or "inactive"
- **THEN** all chart data includes only users with matching status
- **AND** activity array reflects filtered user set

### Requirement: Package report chart data endpoint
The system SHALL provide a REST API endpoint that returns aggregated package statistics data formatted for chart visualization.

#### Scenario: GET /packages/report/chart returns package metrics
- **GIVEN** user is authenticated with admin or super-admin role
- **WHEN** user sends GET request to /packages/report/chart with period, start_date, end_date, package_type, and status parameters
- **THEN** system returns HTTP 200 OK with chart data object
- **AND** response contains timeline array with date and revenue grouped by period
- **AND** response contains distribution array with package_type and count for type distribution
- **AND** response contains sales array with package_type, name, and sales_count for sales ranking
- **AND** data respects all provided filters (package_type, status, date range)

#### Scenario: Package chart API calculates revenue by period
- **GIVEN** user requests /packages/report/chart
- **WHEN** period parameter is provided
- **THEN** timeline data sums revenue from all package sales grouped by period
- **AND** each timeline entry contains date and total_revenue

#### Scenario: Package chart API filters by package type
- **GIVEN** user requests /packages/report/chart with package_type parameter
- **WHEN** package_type is "1month", "3months", "6months", or "1year"
- **THEN** all chart data includes only packages of specified type
- **AND** distribution array has single entry for that type

### Requirement: Payment report chart data endpoint
The system SHALL provide a REST API endpoint that returns aggregated payment statistics data formatted for chart visualization.

#### Scenario: GET /payments/report/chart returns payment metrics
- **GIVEN** user is authenticated with admin or super-admin role
- **WHEN** user sends GET request to /payments/report/chart with period, start_date, end_date, status, payment_type, and member_id parameters
- **THEN** system returns HTTP 200 OK with chart data object
- **AND** response contains timeline array with date and total_amount grouped by period
- **AND** response contains breakdown array with status and count for status distribution
- **AND** response contains methods array with payment_type and total_amount for payment method analysis
- **AND** data respects all provided filters (status, payment_type, member_id, date range)

#### Scenario: Payment chart API calculates payment volume by period
- **GIVEN** user requests /payments/report/chart
- **WHEN** period parameter is provided
- **THEN** timeline data sums payment amounts grouped by period
- **AND** each timeline entry contains date and total_amount
- **AND** only approved payments are included in totals

#### Scenario: Payment chart API filters by status
- **GIVEN** user requests /payments/report/chart with status parameter
- **WHEN** status is "pending", "approved", or "rejected"
- **THEN** timeline data includes only payments with specified status
- **AND** breakdown array shows count for specified status only

#### Scenario: Payment chart API filters by payment type
- **GIVEN** user requests /payments/report/chart with payment_type parameter
- **WHEN** payment_type is provided
- **THEN** all chart data includes only payments with specified payment type
- **AND** methods array has single entry for that type

#### Scenario: Payment chart API filters by member
- **GIVEN** user requests /payments/report/chart with member_id parameter
- **WHEN** member_id is provided
- **THEN** all chart data includes only payments from specified member

### Requirement: Chart API returns standardized response format
The system SHALL return chart data in a consistent JSON structure across all four chart endpoints.

#### Scenario: Response includes timeline array for time-series charts
- **GIVEN** any chart API endpoint is called
- **WHEN** response is returned
- **THEN** response contains timeline array at data.timeline path
- **AND** each timeline item contains date field (string) and metric fields (numeric)
- **AND** timeline items are sorted chronologically ascending

#### Scenario: Response includes distribution array for pie charts
- **GIVEN** any chart API endpoint is called
- **WHEN** response is returned
- **THEN** response contains distribution array at data.distribution path
- **AND** each distribution item contains label field (string) and count field (numeric)
- **AND** distribution items are sorted by count descending

#### Scenario: Response includes ranking array for bar charts
- **GIVEN** any chart API endpoint is called
- **WHEN** response is returned
- **THEN** response contains ranking array at data.ranking path (or sales/activity/methods depending on endpoint)
- **AND** each ranking item contains name/label field (string) and value field (numeric)
- **AND** ranking items are sorted by value descending
- **AND** ranking array is limited to top 10 items

#### Scenario: Response wraps data in standard envelope
- **GIVEN** any chart API endpoint is called
- **WHEN** response is returned successfully
- **THEN** response has status code 200
- **AND** response body contains data object
- **AND** data object contains timeline, distribution, and ranking (or equivalent) arrays
- **AND** response follows API response format: { data: { timeline: [], distribution: [], ranking: [] } }

### Requirement: Chart API validates query parameters
The system SHALL validate all query parameters and return appropriate error responses for invalid input.

#### Scenario: API validates period parameter
- **GIVEN** user requests any chart endpoint
- **WHEN** period parameter is not one of "daily", "weekly", "monthly", "yearly"
- **THEN** system returns HTTP 400 Bad Request
- **AND** response contains validation error message

#### Scenario: API validates date format
- **GIVEN** user requests any chart endpoint
- **WHEN** start_date or end_date is not in YYYY-MM-DD format
- **THEN** system returns HTTP 400 Bad Request
- **AND** response contains validation error message

#### Scenario: API validates date range logic
- **GIVEN** user requests any chart endpoint
- **WHEN** start_date is after end_date
- **THEN** system returns HTTP 400 Bad Request
- **AND** response contains error message indicating invalid date range

#### Scenario: API validates role parameter
- **GIVEN** user requests /users/report/chart
- **WHEN** role parameter is not one of "admin", "super-admin", "customer"
- **THEN** system returns HTTP 400 Bad Request
- **AND** response contains validation error message

#### Scenario: API validates status parameter
- **GIVEN** user requests any chart endpoint
- **WHEN** status parameter is not valid for that endpoint
- **THEN** system returns HTTP 400 Bad Request
- **AND** response contains validation error message listing valid statuses

### Requirement: Chart API respects language header
The system SHALL return chart data with labels and values localized according to the Accept-Language header or lang query parameter.

#### Scenario: API returns English labels when lang is en
- **GIVEN** user requests any chart endpoint with lang=en header or parameter
- **WHEN** response is returned
- **THEN** any string labels in response are in English (if applicable)

#### Scenario: API returns Lao labels when lang is lo
- **GIVEN** user requests any chart endpoint with lang=lo header or parameter
- **WHEN** response is returned
- **THEN** any string labels in response are in Lao (if applicable)

#### Scenario: API defaults to Lao when language not specified
- **GIVEN** user requests any chart endpoint without lang parameter
- **WHEN** response is returned
- **THEN** system defaults to Lao language for any labels

### Requirement: Chart API implements caching for performance
The system SHALL cache chart data responses to improve performance for repeated requests with identical parameters.

#### Scenario: Chart data is cached by parameter hash
- **GIVEN** user requests chart endpoint with specific parameters
- **WHEN** same request is made within cache TTL period
- **THEN** system returns cached response without database query
- **AND** response time is significantly faster

#### Scenario: Cache invalidates on data changes
- **GIVEN** chart data is cached
- **WHEN** new record is created (video, user, package, or payment)
- **THEN** relevant chart cache is invalidated
- **AND** next request fetches fresh data from database

#### Scenario: Cache respects filter parameters
- **GIVEN** user requests /videos/report/chart with category_id=1
- **WHEN** user requests /videos/report/chart with category_id=2
- **THEN** both requests are cached separately
- **AND** different filter combinations result in different cache entries

### Requirement: Chart API limits data points for performance
The system SHALL enforce maximum data point limits to prevent performance degradation with large date ranges.

#### Scenario: API limits daily data points to 365
- **GIVEN** user requests chart with period=daily
- **WHEN** date range exceeds 365 days
- **THEN** system returns at most 365 data points (most recent 365 days)
- **AND** response includes warning header indicating data was truncated

#### Scenario: API limits weekly data points to 208
- **GIVEN** user requests chart with period=weekly
- **WHEN** date range exceeds 208 weeks (4 years)
- **THEN** system returns at most 208 data points (most recent 208 weeks)

#### Scenario: API auto-adjusts granularity for large ranges
- **GIVEN** user requests chart with period=daily and 5-year date range
- **WHEN** range would exceed maximum points
- **THEN** system automatically adjusts to weekly or monthly granularity
- **AND** response includes info header indicating adjusted period

### Requirement: Chart API returns 404 when no data found
The system SHALL return appropriate response when chart data query returns no results matching filters.

#### Scenario: API returns empty arrays for no matching data
- **GIVEN** user requests chart endpoint with filters that match no records
- **WHEN** database query returns zero results
- **THEN** system returns HTTP 200 OK
- **AND** response contains data object with empty arrays: { timeline: [], distribution: [], ranking: [] }

#### Scenario: API handles missing table data gracefully
- **GIVEN** user requests chart endpoint for report type that has no records yet
- **WHEN** table is completely empty
- **THEN** system returns HTTP 200 OK with empty arrays
- **AND** frontend displays "No data available" message

### Requirement: Chart API implements rate limiting
The system SHALL implement rate limiting on chart endpoints to prevent abuse and ensure fair resource usage.

#### Scenario: API enforces rate limit per user
- **GIVEN** user makes multiple chart API requests
- **WHEN** user exceeds rate limit (e.g., 100 requests per minute)
- **THEN** system returns HTTP 429 Too Many Requests
- **AND** response includes Retry-After header indicating seconds to wait

#### Scenario: Rate limit resets after time window
- **GIVEN** user has exceeded rate limit
- **WHEN** retry period expires
- **THEN** subsequent requests are processed normally
