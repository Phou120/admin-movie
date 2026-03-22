# Report APIs - Backend Implementation Guide

This document provides complete API specifications for all report endpoints needed by the admin panel.

---

## 1. Video Report APIs

### 1.1 Get Video Report List

**Endpoint:** `GET /api/videos/report`

**Query Parameters:**
```json
{
  "page": 1,              // integer, required, default: 1
  "limit": 10,            // integer, required, default: 10
  "search": "",           // string, optional, search by title
  "category_id": "",      // string/integer, optional, filter by category
  "customer_id": "",      // string/integer, optional, filter by customer
  "status": "",           // string, optional, values: "active" | "inactive"
  "start_date": "",       // string, optional, format: "YYYY-MM-DD"
  "end_date": ""          // string, optional, format: "YYYY-MM-DD"
}
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Video Title",
      "content": "Video description",
      "total_views": 1250,
      "total_likes": 85,
      "customer_name": "John Doe",
      "customer_id": 5,
      "categories": ["Action", "Drama"],
      "category_ids": [1, 3],
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z",
      "image_url": "https://example.com/image.jpg",
      "video_url": "https://example.com/video.mp4",
      "trailer_url": "https://example.com/trailer.mp4"
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

### 1.2 Get Video Report Summary

**Endpoint:** `GET /api/videos/report/summary`

**Response Format:**
```json
{
  "total_views": 125000,
  "total_likes": 8500,
  "active_videos": 38,
  "total_videos": 45
}
```

### 1.3 Get Categories (for Filter Dropdown)

**Endpoint:** `GET /api/categories`

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Action"
    },
    {
      "id": 2,
      "name": "Comedy"
    },
    {
      "id": 3,
      "name": "Drama"
    }
  ]
}
```

### 1.4 Get Customers (for Filter Dropdown)

**Endpoint:** `GET /api/customers`

**Query Parameters:**
```json
{
  "page": 1,
  "limit": 1000,
  "type": "creator"
}
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 5,
      "name": "John Doe"
    },
    {
      "id": 8,
      "name": "Jane Smith"
    }
  ]
}
```

### 1.5 Export Video Report (CSV)

**Endpoint:** `GET /api/videos/report/export`

**Query Parameters:** Same as list endpoint (page, limit, search, category_id, customer_id, status, start_date, end_date)

**Response:** CSV file download (Content-Type: text/csv)

---

## 2. User Report APIs

### 2.1 Get User Report List

**Endpoint:** `GET /api/users/report`

**Query Parameters:**
```json
{
  "page": 1,              // integer, required, default: 1
  "limit": 10,            // integer, required, default: 10
  "search": "",           // string, optional, search by name or email
  "role": "",             // string, optional, values: "admin" | "super-admin" | "customer"
  "status": "",           // string, optional, values: "active" | "inactive"
  "start_date": "",       // string, optional, format: "YYYY-MM-DD"
  "end_date": ""          // string, optional, format: "YYYY-MM-DD"
}
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John",
      "surname": "Doe",
      "email": "john@example.com",
      "role": "admin",
      "status": "active",
      "registration_date": "2025-01-15T10:30:00Z",
      "last_login": "2025-03-21T08:45:00Z",
      "login_count": 45,
      "profile_image": "https://example.com/avatar.jpg",
      "is_active": true
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

### 2.2 Get User Report Summary

**Endpoint:** `GET /api/users/report/summary`

**Response Format:**
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

### 2.3 Export User Report (CSV)

**Endpoint:** `GET /api/users/report/export`

**Query Parameters:** Same as list endpoint (page, limit, search, role, status, start_date, end_date)

**Response:** CSV file download (Content-Type: text/csv)

---

## 3. Package Report APIs

### 3.1 Get Package Report List

**Endpoint:** `GET /api/packages/report`

**Query Parameters:**
```json
{
  "page": 1,              // integer, required, default: 1
  "limit": 10,            // integer, required, default: 10
  "search": "",           // string, optional, search by name or content
  "package_type": "",     // string, optional, values: "1month" | "3months" | "6months" | "1year"
  "status": "",           // string, optional, values: "active" | "inactive"
  "start_date": "",       // string, optional, format: "YYYY-MM-DD"
  "end_date": ""          // string, optional, format: "YYYY-MM-DD"
}
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Premium Package",
      "type": "1month",
      "price": 29.99,
      "total_sales": 125,
      "total_revenue": 3748.75,
      "active_subscriptions": 85,
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z"
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

### 3.2 Get Package Report Summary

**Endpoint:** `GET /api/packages/report/summary`

**Response Format:**
```json
{
  "total_packages": 15,
  "active_packages": 12,
  "total_revenue": 45750.50,
  "total_subscriptions": 350
}
```

### 3.3 Export Package Report (CSV)

**Endpoint:** `GET /api/packages/report/export`

**Query Parameters:** Same as list endpoint (page, limit, search, package_type, status, start_date, end_date)

**Response:** CSV file download (Content-Type: text/csv)

---

## 4. Payment Report APIs

### 4.1 Get Payment Report List

**Endpoint:** `GET /api/payments/report`

**Query Parameters:**
```json
{
  "page": 1,              // integer, required, default: 1
  "limit": 10,            // integer, required, default: 10
  "search": "",           // string, optional, search by transaction ID or member name
  "status": "",           // string, optional, values: "pending" | "approved" | "rejected"
  "payment_type": "",     // string, optional, values: "transfer" | "cash" | "creditCard"
  "member_id": "",        // string/integer, optional, filter by member
  "start_date": "",       // string, optional, format: "YYYY-MM-DD"
  "end_date": ""          // string, optional, format: "YYYY-MM-DD"
}
```

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "transaction_id": "TXN-2025-001",
      "member_name": "John Doe",
      "member_id": 15,
      "package_name": "Premium Package",
      "amount": 29.99,
      "payment_type": "transfer",
      "status": "approved",
      "slip_url": "https://example.com/slip.jpg",
      "payment_date": "2025-03-21T10:30:00Z"
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

### 4.2 Get Payment Report Summary

**Endpoint:** `GET /api/payments/report/summary`

**Response Format:**
```json
{
  "total_revenue": 125750.00,
  "pending_payments": 12,
  "approved_payments": 130,
  "rejected_payments": 8,
  "transaction_count": 150
}
```

### 4.3 Get Members (for Filter Dropdown)

**Endpoint:** `GET /api/members`

**Response Format:**
```json
{
  "data": [
    {
      "id": 15,
      "name": "John Doe"
    },
    {
      "id": 22,
      "name": "Jane Smith"
    }
  ]
}
```

### 4.4 Export Payment Report (CSV)

**Endpoint:** `GET /api/payments/report/export`

**Query Parameters:** Same as list endpoint (page, limit, search, status, payment_type, member_id, start_date, end_date)

**Response:** CSV file download (Content-Type: text/csv)

---

## 5. Common Response Patterns

### 5.1 Success Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": { ... }
}
```

### 5.2 Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "errors": {
    "field": ["Error details"]
  }
}
```

### 5.3 Pagination Response
All list endpoints should return:
```json
{
  "data": [...],
  "pagination": {
    "current": 1,           // Current page number
    "pageSize": 10,         // Items per page
    "total": 100,           // Total number of items
    "showSizeChanger": true // Optional: allow page size changes
  }
}
```

---

## 6. Status Values

### Video Status
- `"active"` - Video is visible and playable
- `"inactive"` - Video is hidden/disabled

### User Status
- `"active"` - User can login and access the system
- `"inactive"` - User account is disabled

### Package Status
- `"active"` - Package is available for purchase
- `"inactive"` - Package is not available

### Payment Status
- `"pending"` - Payment awaiting approval
- `"approved"` - Payment accepted and processed
- `"rejected"` - Payment declined

### User Roles
- `"admin"` - Administrator with full access
- `"super-admin"` - Super administrator with all permissions
- `"customer"` - Regular user/creator

### Package Types
- `"1month"` - 1 Month subscription
- `"3months"` - 3 Months subscription
- `"6months"` - 6 Months subscription
- `"1year"` - 1 Year subscription

### Payment Types
- `"transfer"` - Bank transfer
- `"cash"` - Cash payment
- `"creditCard"` - Credit/Debit card

---

## 7. Date Format Standards

All dates should follow ISO 8601 format:
- **DateTime:** `YYYY-MM-DDTHH:mm:ssZ` (e.g., "2025-03-21T10:30:00Z")
- **DateOnly:** `YYYY-MM-DD` (e.g., "2025-03-21")

**Important Notes:**
- All datetime fields should be in UTC
- Date range filters use `YYYY-MM-DD` format
- Export endpoints accept same parameters as list endpoints

---

## 8. Authentication & Authorization

All report endpoints require:
- **Authentication:** Valid JWT token in `Authorization: Bearer {token}` header
- **Authorization:** User must have `admin` or `super-admin` role
- **Response Headers:** Include `lang` header from request for multi-language support

**Example Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
lang: lo
```

---

## 9. CSV Export Format

Export endpoints should return CSV files with:
- **Content-Type:** `text/csv`
- **Content-Disposition:** `attachment; filename="report-{type}-{timestamp}.csv"`

**CSV Headers Example (Video Report):**
```csv
No,Title,Customer,Categories,Total Views,Total Likes,Status,Created At
1,Video Title,John Doe,"Action, Drama",1250,85,active,2025-01-15 10:30:00
```

---

## 10. Implementation Checklist

For each report endpoint, ensure:

- [ ] Query parameter validation
- [ ] Pagination logic (page, limit, total)
- [ ] Search functionality (case-insensitive)
- [ ] Date range filtering (inclusive)
- [ ] Status filtering
- [ ] Proper error handling
- [ ] JWT authentication check
- [ ] Role-based authorization
- [ ] Multi-language support (lang header)
- [ ] CSV export with proper headers
- [ ] Summary calculations
- [ ] Response format consistency

---

## 11. Testing Example Requests

### Video Report Example
```bash
# Get all videos
GET /api/videos/report?page=1&limit=10

# Search videos
GET /api/videos/report?search=action&page=1&limit=10

# Filter by category and status
GET /api/videos/report?category_id=1&status=active&page=1&limit=10

# Date range filter
GET /api/videos/report?start_date=2025-01-01&end_date=2025-03-31&page=1&limit=10

# Export to CSV
GET /api/videos/report/export?category_id=1&start_date=2025-01-01&end_date=2025-03-31
```

### User Report Example
```bash
# Get all users
GET /api/users/report?page=1&limit=10

# Filter by role
GET /api/users/report?role=admin&page=1&limit=10

# Search by name
GET /api/users/report?search=john&page=1&limit=10
```

### Package Report Example
```bash
# Get all packages
GET /api/packages/report?page=1&limit=10

# Filter by type
GET /api/packages/report?package_type=1month&page=1&limit=10
```

### Payment Report Example
```bash
# Get all payments
GET /api/payments/report?page=1&limit=10

# Filter by status
GET /api/payments/report?status=approved&page=1&limit=10

# Filter by member
GET /api/payments/report?member_id=15&page=1&limit=10
```

---

## 12. Database Query Examples

### Video Report Query (Laravel/Eloquent Example)
```php
public function getVideoReport($request) {
    $query = Video::with(['customer', 'categories']);

    // Search
    if ($request->search) {
        $query->where('title', 'like', '%' . $request->search . '%');
    }

    // Filters
    if ($request->category_id) {
        $query->whereHas('categories', function($q) use ($request) {
            $q->where('id', $request->category_id);
        });
    }

    if ($request->customer_id) {
        $query->where('customer_id', $request->customer_id);
    }

    if ($request->status) {
        $query->where('status', $request->status);
    }

    // Date range
    if ($request->start_date && $request->end_date) {
        $query->whereBetween('created_at', [
            $request->start_date . ' 00:00:00',
            $request->end_date . ' 23:59:59'
        ]);
    }

    // Pagination
    $result = $query->paginate($request->limit, ['*'], 'page', $request->page);

    return response()->json([
        'data' => $result->items(),
        'pagination' => [
            'current' => $result->currentPage(),
            'pageSize' => $result->perPage(),
            'total' => $result->total(),
        ]
    ]);
}
```

---

**Document Version:** 1.0
**Last Updated:** 2025-03-21
**Frontend Version:** Vue 3 + TypeScript
