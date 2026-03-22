# Example API Responses - Mock Data for Testing

This file contains example API responses that you can use for testing your frontend or as reference for backend implementation.

---

## 1. Video Report Examples

### 1.1 Video Report List Response

**Request:** `GET /api/videos/report?page=1&limit=10`

```json
{
  "data": [
    {
      "id": 1,
      "title": "Action Movie 2025",
      "content": "An exciting action movie with lots of explosions",
      "total_views": 5420,
      "total_likes": 385,
      "customer_name": "John Productions",
      "customer_id": 5,
      "categories": ["Action", "Adventure"],
      "category_ids": [1, 2],
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-03-20T14:22:00Z",
      "image_url": "https://example.com/images/action-movie.jpg",
      "video_url": "https://example.com/videos/action-movie.mp4",
      "trailer_url": "https://example.com/trailers/action-movie-trailer.mp4"
    },
    {
      "id": 2,
      "title": "Comedy Special",
      "content": "Hilarious comedy show",
      "total_views": 3250,
      "total_likes": 420,
      "customer_name": "Jane Studios",
      "customer_id": 8,
      "categories": ["Comedy"],
      "category_ids": [3],
      "status": "active",
      "created_at": "2025-02-01T08:15:00Z",
      "updated_at": "2025-03-18T16:45:00Z",
      "image_url": "https://example.com/images/comedy.jpg",
      "video_url": "https://example.com/videos/comedy.mp4",
      "trailer_url": "https://example.com/trailers/comedy-trailer.mp4"
    },
    {
      "id": 3,
      "title": "Romantic Drama",
      "content": "A touching love story",
      "total_views": 1890,
      "total_likes": 156,
      "customer_name": "Romance Films Inc",
      "customer_id": 12,
      "categories": ["Drama", "Romance"],
      "category_ids": [4, 5],
      "status": "active",
      "created_at": "2025-02-15T12:00:00Z",
      "updated_at": "2025-03-10T09:30:00Z",
      "image_url": "https://example.com/images/romance.jpg",
      "video_url": "https://example.com/videos/romance.mp4",
      "trailer_url": null
    },
    {
      "id": 4,
      "title": "Horror Night",
      "content": "Scary movie for Halloween",
      "total_views": 2100,
      "total_likes": 95,
      "customer_name": "Fear Films",
      "customer_id": 15,
      "categories": ["Horror", "Thriller"],
      "category_ids": [6, 7],
      "status": "inactive",
      "created_at": "2025-03-01T18:30:00Z",
      "updated_at": "2025-03-05T11:20:00Z",
      "image_url": "https://example.com/images/horror.jpg",
      "video_url": "https://example.com/videos/horror.mp4",
      "trailer_url": "https://example.com/trailers/horror-trailer.mp4"
    }
  ],
  "pagination": {
    "current": 1,
    "pageSize": 10,
    "total": 45,
    "showSizeChanger": true
  }
}
```

### 1.2 Video Summary Response

**Request:** `GET /api/videos/report/summary`

```json
{
  "total_views": 125450,
  "total_likes": 8520,
  "active_videos": 38,
  "total_videos": 45
}
```

### 1.3 Categories List Response

**Request:** `GET /api/categories`

```json
{
  "data": [
    { "id": 1, "name": "Action" },
    { "id": 2, "name": "Adventure" },
    { "id": 3, "name": "Comedy" },
    { "id": 4, "name": "Drama" },
    { "id": 5, "name": "Romance" },
    { "id": 6, "name": "Horror" },
    { "id": 7, "name": "Thriller" },
    { "id": 8, "name": "Sci-Fi" },
    { "id": 9, "name": "Documentary" },
    { "id": 10, "name": "Animation" }
  ]
}
```

### 1.4 Customers List Response

**Request:** `GET /api/customers?type=creator&page=1&limit=1000`

```json
{
  "data": [
    { "id": 5, "name": "John Productions" },
    { "id": 8, "name": "Jane Studios" },
    { "id": 12, "name": "Romance Films Inc" },
    { "id": 15, "name": "Fear Films" },
    { "id": 18, "name": "Action Heroes Ltd" },
    { "id": 22, "name": "Comedy Central Studios" }
  ]
}
```

---

## 2. User Report Examples

### 2.1 User Report List Response

**Request:** `GET /api/users/report?page=1&limit=10`

```json
{
  "data": [
    {
      "id": 1,
      "name": "John",
      "surname": "Doe",
      "email": "john.doe@example.com",
      "role": "admin",
      "status": "active",
      "registration_date": "2024-01-15T10:30:00Z",
      "last_login": "2025-03-21T08:45:00Z",
      "login_count": 156,
      "profile_image": "https://example.com/avatars/john.jpg",
      "is_active": true
    },
    {
      "id": 2,
      "name": "Jane",
      "surname": "Smith",
      "email": "jane.smith@example.com",
      "role": "super-admin",
      "status": "active",
      "registration_date": "2024-02-20T14:22:00Z",
      "last_login": "2025-03-21T09:15:00Z",
      "login_count": 243,
      "profile_image": "https://example.com/avatars/jane.jpg",
      "is_active": true
    },
    {
      "id": 3,
      "name": "Bob",
      "surname": "Johnson",
      "email": "bob.johnson@example.com",
      "role": "customer",
      "status": "active",
      "registration_date": "2024-03-10T16:45:00Z",
      "last_login": "2025-03-20T18:30:00Z",
      "login_count": 89,
      "profile_image": null,
      "is_active": true
    },
    {
      "id": 4,
      "name": "Alice",
      "surname": "Williams",
      "email": "alice.williams@example.com",
      "role": "customer",
      "status": "active",
      "registration_date": "2024-06-05T09:12:00Z",
      "last_login": "2025-03-19T12:20:00Z",
      "login_count": 67,
      "profile_image": "https://example.com/avatars/alice.jpg",
      "is_active": true
    },
    {
      "id": 5,
      "name": "Charlie",
      "surname": "Brown",
      "email": "charlie.brown@example.com",
      "role": "customer",
      "status": "inactive",
      "registration_date": "2024-08-15T11:30:00Z",
      "last_login": "2025-01-10T14:50:00Z",
      "login_count": 23,
      "profile_image": null,
      "is_active": false
    }
  ],
  "pagination": {
    "current": 1,
    "pageSize": 10,
    "total": 52,
    "showSizeChanger": true
  }
}
```

### 2.2 User Summary Response

**Request:** `GET /api/users/report/summary`

```json
{
  "total_users": 52,
  "active_users": 48,
  "new_registrations": 12,
  "role_breakdown": {
    "admin": 5,
    "super_admin": 2,
    "customer": 45
  }
}
```

---

## 3. Package Report Examples

### 3.1 Package Report List Response

**Request:** `GET /api/packages/report?page=1&limit=10`

```json
{
  "data": [
    {
      "id": 1,
      "name": "Basic Plan",
      "type": "1month",
      "price": 9.99,
      "total_sales": 85,
      "total_revenue": 849.15,
      "active_subscriptions": 42,
      "status": "active",
      "created_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Standard Plan",
      "type": "3months",
      "price": 24.99,
      "total_sales": 125,
      "total_revenue": 3123.75,
      "active_subscriptions": 95,
      "status": "active",
      "created_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": 3,
      "name": "Premium Plan",
      "type": "6months",
      "price": 49.99,
      "total_sales": 78,
      "total_revenue": 3899.22,
      "active_subscriptions": 65,
      "status": "active",
      "created_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": 4,
      "name": "Annual Plan",
      "type": "1year",
      "price": 89.99,
      "total_sales": 62,
      "total_revenue": 5579.38,
      "active_subscriptions": 58,
      "status": "active",
      "created_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": 5,
      "name": "Trial Plan",
      "type": "1month",
      "price": 0.00,
      "total_sales": 145,
      "total_revenue": 0.00,
      "active_subscriptions": 12,
      "status": "inactive",
      "created_at": "2025-02-01T00:00:00Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pageSize": 10,
    "total": 15,
    "showSizeChanger": true
  }
}
```

### 3.2 Package Summary Response

**Request:** `GET /api/packages/report/summary`

```json
{
  "total_packages": 15,
  "active_packages": 12,
  "total_revenue": 13451.50,
  "total_subscriptions": 272
}
```

---

## 4. Payment Report Examples

### 4.1 Payment Report List Response

**Request:** `GET /api/payments/report?page=1&limit=10`

```json
{
  "data": [
    {
      "id": 1,
      "transaction_id": "TXN-20250321-001",
      "member_name": "John Doe",
      "member_id": 15,
      "package_name": "Premium Plan",
      "amount": 49.99,
      "payment_type": "transfer",
      "status": "approved",
      "slip_url": "https://example.com/slips/slip-001.jpg",
      "payment_date": "2025-03-21T10:30:00Z"
    },
    {
      "id": 2,
      "transaction_id": "TXN-20250321-002",
      "member_name": "Jane Smith",
      "member_id": 22,
      "package_name": "Annual Plan",
      "amount": 89.99,
      "payment_type": "creditCard",
      "status": "approved",
      "slip_url": "https://example.com/slips/slip-002.jpg",
      "payment_date": "2025-03-21T11:15:00Z"
    },
    {
      "id": 3,
      "transaction_id": "TXN-20250321-003",
      "member_name": "Bob Johnson",
      "member_id": 28,
      "package_name": "Standard Plan",
      "amount": 24.99,
      "payment_type": "cash",
      "status": "pending",
      "slip_url": "https://example.com/slips/slip-003.jpg",
      "payment_date": "2025-03-21T12:00:00Z"
    },
    {
      "id": 4,
      "transaction_id": "TXN-20250320-001",
      "member_name": "Alice Williams",
      "member_id": 35,
      "package_name": "Basic Plan",
      "amount": 9.99,
      "payment_type": "transfer",
      "status": "approved",
      "slip_url": "https://example.com/slips/slip-004.jpg",
      "payment_date": "2025-03-20T14:30:00Z"
    },
    {
      "id": 5,
      "transaction_id": "TXN-20250320-002",
      "member_name": "Charlie Brown",
      "member_id": 42,
      "package_name": "Premium Plan",
      "amount": 49.99,
      "payment_type": "transfer",
      "status": "rejected",
      "slip_url": "https://example.com/slips/slip-005.jpg",
      "payment_date": "2025-03-20T16:45:00Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pageSize": 10,
    "total": 150,
    "showSizeChanger": true
  }
}
```

### 4.2 Payment Summary Response

**Request:** `GET /api/payments/report/summary`

```json
{
  "total_revenue": 125750.00,
  "pending_payments": 12,
  "approved_payments": 130,
  "rejected_payments": 8,
  "transaction_count": 150
}
```

### 4.3 Members List Response

**Request:** `GET /api/members`

```json
{
  "data": [
    { "id": 15, "name": "John Doe" },
    { "id": 22, "name": "Jane Smith" },
    { "id": 28, "name": "Bob Johnson" },
    { "id": 35, "name": "Alice Williams" },
    { "id": 42, "name": "Charlie Brown" },
    { "id": 48, "name": "Diana Prince" },
    { "id": 55, "name": "Evan Peters" }
  ]
}
```

---

## 5. Error Response Examples

### 5.1 Authentication Error

**Status:** 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized. Please provide a valid authentication token."
}
```

### 5.2 Authorization Error

**Status:** 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied. You don't have permission to access this resource."
}
```

### 5.3 Validation Error

**Status:** 422 Unprocessable Entity

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "page": ["The page field is required."],
    "limit": ["The limit must be at least 1 and not more than 100."]
  }
}
```

### 5.4 Not Found Error

**Status:** 404 Not Found

```json
{
  "success": false,
  "message": "The requested resource was not found."
}
```

### 5.5 Server Error

**Status:** 500 Internal Server Error

```json
{
  "success": false,
  "message": "An internal server error occurred. Please try again later.",
  "error": "Database connection failed"
}
```

---

## 6. Filtered Search Examples

### 6.1 Search Videos by Title

**Request:** `GET /api/videos/report?search=action&page=1&limit=10`

```json
{
  "data": [
    {
      "id": 1,
      "title": "Action Movie 2025",
      "total_views": 5420,
      "total_likes": 385,
      "categories": ["Action", "Adventure"]
    },
    {
      "id": 8,
      "title": "Action Hero Returns",
      "total_views": 3120,
      "total_likes": 198,
      "categories": ["Action"]
    }
  ],
  "pagination": { "current": 1, "pageSize": 10, "total": 12 }
}
```

### 6.2 Filter Users by Role

**Request:** `GET /api/users/report?role=admin&page=1&limit=10`

```json
{
  "data": [
    {
      "id": 1,
      "name": "John",
      "surname": "Doe",
      "email": "john.doe@example.com",
      "role": "admin",
      "status": "active"
    }
  ],
  "pagination": { "current": 1, "pageSize": 10, "total": 5 }
}
```

### 6.3 Filter Payments by Status

**Request:** `GET /api/payments/report?status=pending&page=1&limit=10`

```json
{
  "data": [
    {
      "id": 3,
      "transaction_id": "TXN-20250321-003",
      "member_name": "Bob Johnson",
      "amount": 24.99,
      "status": "pending"
    }
  ],
  "pagination": { "current": 1, "pageSize": 10, "total": 12 }
}
```

### 6.4 Date Range Filter

**Request:** `GET /api/videos/report?start_date=2025-01-01&end_date=2025-03-31&page=1&limit=10`

```json
{
  "data": [
    {
      "id": 1,
      "title": "Action Movie 2025",
      "created_at": "2025-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "title": "Comedy Special",
      "created_at": "2025-02-01T08:15:00Z"
    }
  ],
  "pagination": { "current": 1, "pageSize": 10, "total": 25 }
}
```

---

## 7. CSV Export Examples

### 7.1 Video Report CSV

**Request:** `GET /api/videos/report/export`

**CSV Content:**
```csv
No,Title,Customer,Categories,Total Views,Total Likes,Status,Created At
1,Action Movie 2025,John Productions,"Action, Adventure",5420,385,active,2025-01-15 10:30:00
2,Comedy Special,Jane Studios,Comedy,3250,420,active,2025-02-01 08:15:00
```

### 7.2 User Report CSV

**Request:** `GET /api/users/report/export`

**CSV Content:**
```csv
No,Name,Email,Role,Status,Registration Date,Last Login,Login Count
1,John Doe,john.doe@example.com,admin,active,2024-01-15 10:30:00,2025-03-21 08:45:00,156
2,Jane Smith,jane.smith@example.com,super-admin,active,2024-02-20 14:22:00,2025-03-21 09:15:00,243
```

---

## 8. Testing with cURL

### Test Video Report
```bash
curl -X GET "http://localhost:8000/api/videos/report?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Test User Report
```bash
curl -X GET "http://localhost:8000/api/users/report?role=admin&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Test Export
```bash
curl -X GET "http://localhost:8000/api/videos/report/export" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -o videos.csv
```

---

**File Version:** 1.0
**Last Updated:** 2025-03-21
**Purpose:** Testing and reference only
