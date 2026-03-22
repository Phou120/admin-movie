# API Quick Reference - Report Endpoints

Quick reference for backend implementation of all report APIs.

---

## 📊 Video Report (`/api/videos/report`)

### List Endpoint
```
GET /api/videos/report
```

**Required Params:** `page`, `limit`

**Optional Params:** `search`, `category_id`, `customer_id`, `status`, `start_date`, `end_date`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Video Title",
      "total_views": 1250,
      "total_likes": 85,
      "customer_name": "John Doe",
      "categories": ["Action", "Drama"],
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": { "current": 1, "pageSize": 10, "total": 45 }
}
```

### Summary Endpoint
```
GET /api/videos/report/summary
```

**Response:**
```json
{
  "total_views": 125000,
  "total_likes": 8500,
  "active_videos": 38,
  "total_videos": 45
}
```

---

## 👥 User Report (`/api/users/report`)

### List Endpoint
```
GET /api/users/report
```

**Required Params:** `page`, `limit`

**Optional Params:** `search`, `role`, `status`, `start_date`, `end_date`

**Response:**
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
      "login_count": 45
    }
  ],
  "pagination": { "current": 1, "pageSize": 10, "total": 52 }
}
```

### Summary Endpoint
```
GET /api/users/report/summary
```

**Response:**
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

## 📦 Package Report (`/api/packages/report`)

### List Endpoint
```
GET /api/packages/report
```

**Required Params:** `page`, `limit`

**Optional Params:** `search`, `package_type`, `status`, `start_date`, `end_date`

**Response:**
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
      "status": "active"
    }
  ],
  "pagination": { "current": 1, "pageSize": 10, "total": 15 }
}
```

### Summary Endpoint
```
GET /api/packages/report/summary
```

**Response:**
```json
{
  "total_packages": 15,
  "active_packages": 12,
  "total_revenue": 45750.50,
  "total_subscriptions": 350
}
```

---

## 💰 Payment Report (`/api/payments/report`)

### List Endpoint
```
GET /api/payments/report
```

**Required Params:** `page`, `limit`

**Optional Params:** `search`, `status`, `payment_type`, `member_id`, `start_date`, `end_date`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "transaction_id": "TXN-2025-001",
      "member_name": "John Doe",
      "package_name": "Premium Package",
      "amount": 29.99,
      "payment_type": "transfer",
      "status": "approved",
      "slip_url": "https://example.com/slip.jpg",
      "payment_date": "2025-03-21T10:30:00Z"
    }
  ],
  "pagination": { "current": 1, "pageSize": 10, "total": 150 }
}
```

### Summary Endpoint
```
GET /api/payments/report/summary
```

**Response:**
```json
{
  "total_revenue": 125750.00,
  "pending_payments": 12,
  "approved_payments": 130,
  "rejected_payments": 8,
  "transaction_count": 150
}
```

---

## 🏷️ Filter Options

### Categories Dropdown
```
GET /api/categories
```
**Response:** `[{ "id": 1, "name": "Action" }]`

### Customers Dropdown
```
GET /api/customers?type=creator&page=1&limit=1000
```
**Response:** `[{ "id": 5, "name": "John Doe" }]`

### Members Dropdown
```
GET /api/members
```
**Response:** `[{ "id": 15, "name": "John Doe" }]`

---

## 📤 Export Endpoints

All export endpoints use the same parameters as their list endpoints:

```
GET /api/videos/report/export
GET /api/users/report/export
GET /api/packages/report/export
GET /api/payments/report/export
```

**Response:** CSV file download (Content-Type: text/csv)

---

## 🎨 Status Values

| Resource | Status Values |
|----------|--------------|
| Video | `active`, `inactive` |
| User | `active`, `inactive` |
| Package | `active`, `inactive` |
| Payment | `pending`, `approved`, `rejected` |

### User Roles
- `admin` - Administrator
- `super-admin` - Super Administrator
- `customer` - Regular User/Creator

### Package Types
- `1month` - 1 Month
- `3months` - 3 Months
- `6months` - 6 Months
- `1year` - 1 Year

### Payment Types
- `transfer` - Bank Transfer
- `cash` - Cash
- `creditCard` - Credit/Debit Card

---

## 🔒 Authentication

**Required Header:**
```
Authorization: Bearer {jwt_token}
```

**Required Roles:** `admin` or `super-admin`

---

## 📅 Date Formats

- **DateTime:** `YYYY-MM-DDTHH:mm:ssZ` (ISO 8601)
- **Date Filter:** `YYYY-MM-DD` (e.g., `2025-03-21`)

---

## ✅ Response Format

**Success:**
```json
{
  "data": [...],
  "pagination": {
    "current": 1,
    "pageSize": 10,
    "total": 100
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 📝 Example Requests

```bash
# Get all videos
curl -H "Authorization: Bearer {token}" \
  "http://api.com/api/videos/report?page=1&limit=10"

# Search users
curl -H "Authorization: Bearer {token}" \
  "http://api.com/api/users/report?search=john&page=1&limit=10"

# Filter payments by status
curl -H "Authorization: Bearer {token}" \
  "http://api.com/api/payments/report?status=approved&page=1&limit=10"

# Date range filter
curl -H "Authorization: Bearer {token}" \
  "http://api.com/api/videos/report?start_date=2025-01-01&end_date=2025-03-31"

# Export to CSV
curl -H "Authorization: Bearer {token}" \
  "http://api.com/api/videos/report/export" -o videos.csv
```

---

**Need More Details?** See `API_DOCUMENTATION.md` for complete specifications.
