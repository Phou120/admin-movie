# OpenSpec Directory

This directory contains OpenSpec change management and API documentation for the admin panel.

---

## 📁 Directory Structure

```
openspec/
├── changes/                    # OpenSpec changes (proposals, designs, tasks)
│   ├── admin-report-pages/    # Report pages implementation
│   └── customer-status-badge-redesign/
├── specs/                     # Capability specifications
├── config.yaml                # OpenSpec configuration
├── API_DOCUMENTATION.md       # 📘 Complete API specifications
├── API_QUICK_REFERENCE.md     # 🚀 Quick reference guide
└── API_EXAMPLES.md            # 💡 Example responses & mock data
```

---

## 📚 API Documentation Files

### **API_DOCUMENTATION.md** ← Start Here!
Complete API specifications for all report endpoints.
- Request/response formats for all 4 report modules
- Authentication & authorization requirements
- Status values and enumerations
- Database query examples (Laravel/Eloquent)
- CSV export formats
- Implementation checklist

**Use this for:** Backend developers implementing the APIs

---

### **API_QUICK_REFERENCE.md**
Quick reference guide with essential information at a glance.
- All endpoints summarized
- Quick parameter lists
- Status values reference
- Common curl examples

**Use this for:** Quick lookup during development

---

### **API_EXAMPLES.md**
Realistic example responses and mock data.
- Sample JSON responses for all endpoints
- Multiple data examples
- Error response examples
- Filtered search examples
- CSV export examples
- cURL testing commands

**Use this for:** Testing frontend without backend, or as reference for expected response formats

---

## 🔗 Report Modules Overview

The admin panel includes 4 report modules:

| Module | Purpose | Endpoint Pattern |
|--------|---------|------------------|
| **Video Report** | Video performance analytics | `/api/videos/report/*` |
| **User Report** | User activity statistics | `/api/users/report/*` |
| **Package Report** | Package sales & revenue | `/api/packages/report/*` |
| **Payment Report** | Payment history & status | `/api/payments/report/*` |

Each module provides:
- ✅ List view with pagination & filtering
- ✅ Summary statistics for dashboard
- ✅ Export to CSV functionality
- ✅ Chart data for visualizations

---

## 🚀 Quick Start

### For Backend Developers:

1. **Read** `API_DOCUMENTATION.md` for complete specifications
2. **Implement** endpoints following the documented request/response formats
3. **Test** with examples from `API_EXAMPLES.md`
4. **Verify** with the implementation checklist

### For Frontend Developers:

1. **Reference** `API_QUICK_REFERENCE.md` for endpoint URLs
2. **Check** `API_EXAMPLES.md` for expected response structures
3. **Use** mock data for testing without backend dependency

---

## 📋 Implementation Checklist

For each report endpoint, ensure:

- [ ] Query parameter validation
- [ ] Pagination logic (page, limit, total)
- [ ] Search functionality (case-insensitive)
- [ ] Date range filtering (inclusive)
- [ ] Status filtering
- [ ] Proper error handling
- [ ] JWT authentication check
- [ ] Role-based authorization (admin/super-admin)
- [ ] Multi-language support (lang header)
- [ ] CSV export with proper headers
- [ ] Summary calculations
- [ ] Response format consistency

---

## 🔐 Authentication Requirements

All report endpoints require:

**Headers:**
```
Authorization: Bearer {jwt_token}
lang: lo  // or "en" for English
```

**Required Roles:** `admin` or `super-admin`

---

## 📊 Response Format Standards

### Success Response
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

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 📅 Date Format Standards

- **DateTime:** `YYYY-MM-DDTHH:mm:ssZ` (ISO 8601, UTC)
- **Date Filter:** `YYYY-MM-DD` (e.g., `2025-03-21`)

---

## 🎨 Status Values Reference

| Resource | Status Values |
|----------|--------------|
| Video/User/Package | `active`, `inactive` |
| Payment | `pending`, `approved`, `rejected` |

### User Roles
- `admin` - Administrator
- `super-admin` - Super Administrator
- `customer` - Regular User/Creator

### Package Types
- `1month` - 1 Month subscription
- `3months` - 3 Months subscription
- `6months` - 6 Months subscription
- `1year` - 1 Year subscription

### Payment Types
- `transfer` - Bank Transfer
- `cash` - Cash payment
- `creditCard` - Credit/Debit Card

---

## 🔗 Related Documentation

- **Change Proposals:** See `changes/` directory for feature specifications
- **Task Lists:** Each change has a `tasks.md` file with implementation steps
- **Design Docs:** `changes/*/design.md` for technical design details

---

## 📞 Support

For questions or clarifications about the API specifications:
1. Check `API_DOCUMENTATION.md` for detailed specs
2. See `API_EXAMPLES.md` for concrete examples
3. Review the corresponding change in `changes/admin-report-pages/`

---

**Last Updated:** 2025-03-21
**Version:** 1.0
**Status:** Active
