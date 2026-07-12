## ADDED Requirements

### Requirement: Category operations surface the backend error message
The admin Category screen SHALL display the message returned by the backend (`error.response.data.message`) when a create, update, delete, or load operation fails, rather than the generic Axios error string. When no backend message is available, it SHALL fall back to a localized default message.

#### Scenario: Delete rejected because the category is in use
- **WHEN** the user deletes a category and the backend responds with an error (e.g. HTTP 409/400) whose body is `{ "message": "Category is used by videos and cannot be deleted" }`
- **THEN** the error notification SHALL show that backend message text
- **AND** the category SHALL remain in the list

#### Scenario: Create/update failure shows backend message
- **WHEN** a create or update request fails with a backend error envelope containing `message`
- **THEN** the notification SHALL display that `message`

#### Scenario: Failure with no backend message
- **WHEN** an operation fails with a network error or a response that has no `message` field
- **THEN** the notification SHALL display a localized fallback message and SHALL NOT display `undefined`

### Requirement: Category list maps the backend pagination envelope correctly
`loadCategories` SHALL map the backend pagination envelope `{ total, total_pages, limit, page }` onto the table pagination state, using `page` as the current page, `limit` as the page size, and `total` as the total count. It SHALL NOT read a non-existent `currentPage` field, and SHALL tolerate a missing `pagination` object without throwing.

#### Scenario: Pagination fields mapped from backend response
- **WHEN** `GET /api/categories?page=2&limit=5` returns `pagination: { total: 6, total_pages: 2, limit: 5, page: 2 }`
- **THEN** the table SHALL show current page 2, page size 5, and total 6

#### Scenario: Response without a pagination object
- **WHEN** a categories response contains `data` but no `pagination` object
- **THEN** `loadCategories` SHALL still render the rows and SHALL NOT throw `Cannot read properties of undefined`

### Requirement: Category API calls conform to the backend contract
The Category composible SHALL call the backend endpoints with request and response shapes that match the backend contract: `GET /api/categories` (list, paginated), `POST /api/categories` (create with `{ name, description }`), `PUT /api/categories/:id` (update), and `DELETE /api/categories/:id` (delete). Each call SHALL return the parsed response envelope so callers can read `data`, `message`, and `pagination`.

#### Scenario: Successful create returns the backend envelope
- **WHEN** `createCategory` succeeds
- **THEN** it SHALL resolve with the backend envelope including `message` and the created `data`
- **AND** the screen SHALL show the backend success `message` and refresh the list
