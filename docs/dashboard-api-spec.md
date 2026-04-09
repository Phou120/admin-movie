# Dashboard API Specification

Backend API endpoints needed for the Dashboard Income & Expenses charts.

## Base URL

```
{{VITE_API_BASE_URL}}
```

All endpoints require `Authorization: Bearer {token}` header.

---

## 1. Monthly Income

Get monthly income (approved/successful payments) aggregated by month.

### Endpoint

```
GET /api/dashboard/income
```

### Query Parameters

| Parameter | Type   | Required | Default      | Description            |
|-----------|--------|----------|--------------|------------------------|
| year      | number | No       | current year | Filter by year         |

### Response

```json
{
  "data": [
    { "month": 1,  "amount": 15000000 },
    { "month": 2,  "amount": 18000000 },
    { "month": 3,  "amount": 22000000 },
    { "month": 4,  "amount": 19500000 },
    { "month": 5,  "amount": 25000000 },
    { "month": 6,  "amount": 21000000 },
    { "month": 7,  "amount": 28000000 },
    { "month": 8,  "amount": 24000000 },
    { "month": 9,  "amount": 30000000 },
    { "month": 10, "amount": 27000000 },
    { "month": 11, "amount": 32000000 },
    { "month": 12, "amount": 35000000 }
  ]
}
```

| Field  | Type   | Description                          |
|--------|--------|--------------------------------------|
| month  | number | Month number (1 = January, 12 = December) |
| amount | number | Total income in LAK for that month   |

### Business Logic

- Sum all payments where `status = 'success'` or `status = 'approved'`
- Group by month of `created_at`
- Filter by the requested `year`
- Return all 12 months (use `0` for months with no data)

---

## 2. Monthly Expenses

Get monthly expenses aggregated by month.

### Endpoint

```
GET /api/dashboard/expenses
```

### Query Parameters

| Parameter | Type   | Required | Default      | Description            |
|-----------|--------|----------|--------------|------------------------|
| year      | number | No       | current year | Filter by year         |

### Response

```json
{
  "data": [
    { "month": 1,  "amount": 8500000 },
    { "month": 2,  "amount": 9200000 },
    { "month": 3,  "amount": 7800000 },
    { "month": 4,  "amount": 10500000 },
    { "month": 5,  "amount": 11200000 },
    { "month": 6,  "amount": 9800000 },
    { "month": 7,  "amount": 10800000 },
    { "month": 8,  "amount": 12000000 },
    { "month": 9,  "amount": 11500000 },
    { "month": 10, "amount": 13200000 },
    { "month": 11, "amount": 12800000 },
    { "month": 12, "amount": 14500000 }
  ]
}
```

| Field  | Type   | Description                            |
|--------|--------|----------------------------------------|
| month  | number | Month number (1 = January, 12 = December) |
| amount | number | Total expenses in LAK for that month   |

### Business Logic

- Sum all expense records grouped by month of `created_at`
- Filter by the requested `year`
- Return all 12 months (use `0` for months with no data)

---

## Error Response

All endpoints return the same error format:

```json
{
  "message": "Error description",
  "statusCode": 401
}
```

| Status Code | Description          |
|-------------|----------------------|
| 200         | Success              |
| 401         | Unauthorized (invalid/missing token) |
| 500         | Server error         |

---

## Frontend Integration

Once the backend endpoints are ready, the frontend will call:

```typescript
// In composible
const fetchMonthlyIncome = async (year?: number) => {
  const response = await apiClient.get("/dashboard/income", {
    params: { year },
  });
  return response.data.data; // Array of { month, amount }
};

const fetchMonthlyExpenses = async (year?: number) => {
  const response = await apiClient.get("/dashboard/expenses", {
    params: { year },
  });
  return response.data.data; // Array of { month, amount }
};
```

> **Note:** The frontend currently uses placeholder data for expenses and aggregates income from `/payments/report`. Once these endpoints are available, both charts will use real data directly.
