## Context

The admin panel currently has list pages for CRUD operations (videos, users, packages, payments) but lacks dedicated reporting interfaces for data analysis and export. The existing dashboard (`src/modules/admin/dashboard/DashBoard.vue`) provides some analytics with chart components but is focused on high-level metrics rather than detailed report data.

**Current State:**
- List pages exist for videos, users, packages, and payments with edit/delete functionality
- Chart components are available (LineChart, PieChart, BarChart, AreaChart) in `src/components/charts/`
- Module pattern is well-established: composible for API calls, Vue component, TypeScript interfaces
- report-video module structure has been partially created at `src/modules/admin/report-video/`

**Constraints:**
- No Pinia/Vuex - must use Vue 3 Composition API with local state
- Must support both Lao (primary) and English languages
- Must follow existing project structure and naming conventions
- Backend API endpoints assumed to exist (may need verification)
- No new external dependencies allowed

## Goals / Non-Goals

**Goals:**
- Create four report pages for videos, users, packages, and payments with read-only data access
- Implement consistent filtering, sorting, and pagination across all reports
- Add export functionality for downloading report data as CSV
- Integrate existing chart components for data visualization
- Follow established module patterns and project conventions
- Support role-based access control (admin/super-admin only)

**Non-Goals:**
- No create/edit/delete operations on report pages (read-only)
- No real-time data updates via socket.io (unlike payment notifications)
- No new chart library integration (use existing ECharts components)
- No backend API implementation (assumes endpoints exist or will be created separately)
- No advanced analytics features (drill-down, custom date ranges beyond simple picker)

## Decisions

### Module Structure Pattern
**Decision:** Follow the existing module pattern with composible, interfaces, and Vue component for each report type.

**Rationale:**
- Consistency with existing codebase (`video`, `user`, `payment` modules all use this pattern)
- Clear separation of concerns (API logic vs. presentation vs. types)
- Familiar to developers working on this project

**Structure:**
```
src/modules/admin/report-{entity}/
├── Report{Entity}.vue        # Main page component
├── composible/
│   └── index.ts              # API calls
└── interface/
    └── report-{entity}.interface.ts  # TypeScript interfaces
```

### API Endpoint Design
**Decision:** Use RESTful endpoints following the pattern `/{resource}/report` with query parameters for filtering.

**Rationale:**
- Follows existing API patterns in the project
- Backend controls filtering logic for performance
- Consistent with how `VideoComposible` calls `/videos` with params

**Endpoints:**
- `GET /videos/report` - Video analytics data
- `GET /users/report` - User activity and statistics
- `GET /packages/report` - Package performance metrics
- `GET /payments/report` - Payment history and revenue

**Query Parameters:**
- Common: `page`, `limit`, `search`, `start_date`, `end_date`, `status`
- Entity-specific: `category_id` (videos), `role` (users), `package_type` (packages), `payment_type` (payments)

### State Management Approach
**Decision:** Use Vue 3 Composition API with reactive state within each component.

**Rationale:**
- Project does not use Pinia or Vuex
- Local state is sufficient for report pages (no cross-component sharing needed)
- Consistent with existing list pages like `video.vue`

**State Structure:**
```typescript
const data = reactive<{
  items: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}>({ items: [], pagination: {...} });

const filters = reactive({
  search: '',
  status: undefined,
  // ... entity-specific filters
});
```

### Chart Integration Strategy
**Decision:** Place summary cards and chart components above the data table, using data fetched from the same API endpoints.

**Rationale:**
- Existing chart components are already integrated in the dashboard
- Provides immediate visual insights before detailed table data
- Single API call can return both summary stats and detailed data

**Implementation:**
- Import chart components from `src/components/charts/`
- Pass fetched data to chart props
- Use loading states during data fetch
- Handle empty states gracefully

### Export Functionality
**Decision:** Implement client-side CSV export using JavaScript blob generation.

**Rationale:**
- No additional backend endpoint required
- Fast for typical report datasets (<10,000 rows)
- Can export filtered data currently in the table

**Implementation:**
```typescript
function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => row[h]).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  // Trigger download
}
```

### Filter Component Design
**Decision:** Use Ant Design Vue form components (a-input, a-select, a-range-picker) arranged in a horizontal row.

**Rationale:**
- Consistent with existing UI components
- Good accessibility and keyboard navigation
- Built-in validation and error handling

**Layout:**
```
[Search Input] [Filter Select 1] [Filter Select 2] [Date Range] [Search Button] [Reset Button] [Export Button]
```

### Pagination Strategy
**Decision:** Use Ant Design Vue table's built-in pagination with configurable page size.

**Rationale:**
- Consistent with existing list pages
- Standard UX pattern users expect
- Reduces initial load time for large datasets

**Configuration:**
- Default page size: 10
- Page size options: [10, 20, 50, 100]
- Show total count and current range

### Route Configuration
**Decision:** Add routes as children of the main Layout component at `/report/{entity}` with route name `report-{entity}`.

**Rationale:**
- Follows existing routing pattern (e.g., `/video`, `/payment`)
- Sidebar menu already configured with these route names
- Clear, intuitive URL structure

**Routes:**
```typescript
{
  path: "/report/video",
  name: "report-video",
  component: ReportVideoPage,
},
// ... similar for user, package, payment
```

### Translation Key Structure
**Decision:** Add translation keys under `modules.report{Entity}` namespace in both `en.json` and `lo.json`.

**Rationale:**
- Keeps report translations organized together
- Consistent with existing translation structure (e.g., `modules.video`)

**Key Structure:**
```json
{
  "modules": {
    "reportVideo": {
      "title": "Video Report",
      "columns": { "no": "No", "title": "Title", ... },
      "filters": { "searchPlaceholder": "Search videos...", ... }
    }
  }
}
```

## Risks / Trade-offs

### Risk: Backend API Endpoints May Not Exist
**Impact:** Cannot implement report pages without backend data sources.
**Mitigation:**
- Use existing list endpoints (`/videos`, `/users`, etc.) as fallback
- Add error handling with clear messages if endpoints return 404
- Document required backend API contracts in design

### Risk: Large Dataset Performance
**Impact:** Report pages with thousands of records may be slow to load and export.
**Mitigation:**
- Implement pagination on backend (not frontend)
- Add loading indicators during data fetch
- Consider adding maximum date range restriction (e.g., 90 days)
- Optimize export by streaming or chunking for very large datasets

### Risk: Chart Complexity
**Impact:** Charts may become cluttered or misleading with too much data.
**Mitigation:**
- Start with simple charts (line trends, pie distributions)
- Aggregate data appropriately (daily/weekly vs. hourly)
- Provide chart controls (time range selector, data toggle)
- Hide charts if insufficient data

### Trade-off: Client-side Export vs. Server-side
**Choice:** Client-side CSV generation
**Benefits:** No backend changes, fast for small datasets
**Drawbacks:** Memory limitations for very large datasets, no export of all data if pagination is used
**Future Consideration:** Could add server-side export endpoint if needed for larger datasets

### Trade-off: Separate Report Modules vs. Unified Report Component
**Choice:** Four separate modules (report-video, report-user, report-package, report-payment)
**Benefits:** Clear separation, easier to maintain, follows existing patterns
**Drawbacks:** Code duplication in common functionality (filters, pagination, export)
**Mitigation:** Extract common components later if duplication becomes problematic

## Migration Plan

No database migration required. This is a purely additive feature.

**Deployment Steps:**
1. Create all four report modules (video, user, package, payment)
2. Add translation keys to `en.json` and `lo.json`
3. Update `src/router.ts` with new routes
4. Verify sidebar navigation works correctly
5. Test with various filter combinations
6. Test export functionality
7. Test with different user roles (admin, super-admin, customer)

**Rollback Strategy:**
- Remove routes from `src/router.ts`
- Remove report module directories if needed
- No data changes to roll back

## Open Questions

1. **Backend API Contract:** What is the exact response format from the `/report` endpoints? Should we assume the same structure as list endpoints (e.g., `{ data: [], pagination: {...} }`)?

2. **Chart Data Aggregation:** Should chart data come from the same report endpoints, or should there be separate aggregated endpoints (e.g., `/videos/report/summary`)? Current design assumes same endpoints with summary stats in response.

3. **Export Scope:** Should export functionality export all data matching filters, or only the current page? Current design is all filtered data (may need backend support for large datasets).

4. **Date Range Default:** What should be the default date range when report pages first load? Options: no filter (all time), last 30 days, last 7 days, current month.

5. **Real-time Updates:** Should report pages auto-refresh or show real-time updates? Current design is static (load on mount, refresh on filter change). Socket.io integration exists for payment notifications but not currently planned for reports.
