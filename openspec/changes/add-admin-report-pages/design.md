# Admin Report Data Visualization - Design Document

## Context

**Current State:**
- 4 admin report pages exist (video, user, package, payment) with:
  - Functional data tables with pagination and sorting
  - Filter controls (search, date range, status filters)
  - Export to CSV functionality
  - Summary statistic cards
- Chart components exist but are unused: `LineChart.vue`, `PieChart.vue`, `BarChart.vue`, `AreaChart.vue`
- All reports use composible pattern for API calls
- Reports follow consistent layout and structure

**Constraints:**
- Must maintain existing table/filter functionality
- Charts should not break page performance (use lazy loading)
- Mobile-responsive design required
- Must support both Lao and English languages
- ECharts library already available via echarts-for-vue
- Backend API endpoints need to be created for chart data aggregation

**Stakeholders:**
- Admin users who need quick visual insights
- Super-admins who analyze platform performance
- Backend developers who will create chart API endpoints

## Goals / Non-Goals

**Goals:**
- Add interactive charts to all 4 report pages without breaking existing functionality
- Provide visual insights for trends (line/area charts), distributions (pie charts), and comparisons (bar charts)
- Enable time period selection (daily, weekly, monthly, yearly) for trend charts
- Reuse existing chart components with consistent styling
- Keep chart data loading separate from table data to maintain performance

**Non-Goals:**
- Custom chart builder (predefined chart types only)
- Real-time chart updates (manual refresh via filters)
- Advanced chart customization (colors, sizes fixed)
- Drill-down interactions (no clicking charts to filter tables)

## Decisions

### 1. Chart Section Placement

**Decision:** Place charts in a collapsible section below summary cards, above filters.

**Rationale:**
- Summary cards give immediate key metrics at top
- Charts provide visual trends before detailed table data
- Collapsible to save space if users prefer tables only
- Maintains visual hierarchy: summary → charts → filters → table

**Alternatives Considered:**
- Charts in modal: ❌ Too hidden, breaks context
- Charts sidebar: ❌ Not enough space, mobile-unfriendly
- Charts below table: ❌ Users may not scroll down to see them

### 2. Chart Types by Report

**ReportVideo:**
- Line Chart: Video views trend over time (period selector)
- Pie Chart: Likes distribution by video category
- Bar Chart: Top 10 videos by views/likes

**ReportUser:**
- Area Chart: User registrations over time
- Pie Chart: User role distribution (admin/creator/customer)
- Bar Chart: Active vs inactive users by role

**ReportPackage:**
- Line Chart: Revenue trend over time
- Pie Chart: Package type distribution (1month/3months/6months/1year)
- Bar Chart: Sales by package type

**ReportPayment:**
- Area Chart: Payment volume over time
- Pie Chart: Payment status breakdown (pending/approved/rejected)
- Bar Chart: Revenue by payment method

**Rationale:** Each chart type serves a specific analytical purpose:
- Line/Area: Time-series trends
- Pie: Part-to-whole relationships
- Bar: Comparisons between categories

### 3. Data Loading Strategy

**Decision:** Separate `fetchChartData()` API call from table data.

```typescript
// In composible
const fetchChartData = async (
  period: string = "monthly", // daily, weekly, monthly, yearly
  startDate: string = "",
  endDate: string = ""
) => {
  const response = await apiClient.get("/videos/report/chart", {
    params: { period, start_date: startDate, end_date: endDate }
  });
  return response.data.data || response.data;
};
```

**Rationale:**
- Chart data is aggregated (fewer records) vs table data (paginated)
- Different parameters: charts need period grouping, tables need search/sort
- Independent loading prevents one from blocking the other
- Can cache chart data more aggressively

**Alternatives Considered:**
- Reuse table data: ❌ Too much data, client-side aggregation slow
- Single endpoint with format param: ❌ Backend complexity, harder to optimize

### 4. Chart Component Interface

**Decision:** All chart components support consistent props interface.

```typescript
interface ChartProps {
  title: string;
  data: any[];
  loading?: boolean;
  height?: string;
  xKey?: string;      // For line/bar charts
  yKey?: string;      // For line/bar charts
  dataKey?: string;   // For pie charts
  color?: string[];   // Custom colors (optional)
}
```

**Rationale:**
- Consistent API across all chart types
- Easy to swap chart types if needed
- Minimal props reduce complexity

### 5. Period Selector Implementation

**Decision:** Global period selector applies to all time-based charts on page.

```vue
<a-select v-model:value="chartPeriod" style="width: 120px">
  <a-select-option value="daily">Daily</a-select-option>
  <a-select-option value="weekly">Weekly</a-select-option>
  <a-select-option value="monthly">Monthly</a-select-option>
  <a-select-option value="yearly">Yearly</a-select-option>
</a-select>
```

**Rationale:**
- Simple implementation, single state variable
- Users understand "show me monthly trends" easily
- All time-series charts update together

**Alternatives Considered:**
- Individual period per chart: ❌ Too complex, confusing UX
- Date range only: ❌ Doesn't give quick period views

### 6. API Response Format

**Decision:** Standardized chart data response structure.

```typescript
// GET /videos/report/chart?period=monthly&start_date=2024-01-01&end_date=2024-12-31
{
  data: {
    timeline: [
      { date: "2024-01", views: 1250, likes: 320 },
      { date: "2024-02", views: 1380, likes: 410 },
      // ...
    ],
    distribution: [
      { category: "Action", count: 45 },
      { category: "Drama", count: 32 },
      // ...
    ],
    ranking: [
      { title: "Video A", views: 5420 },
      { title: "Video B", views: 4890 },
      // ...
    ]
  }
}
```

**Rationale:**
- Single endpoint returns all chart types for that report
- Reduces API calls (1 vs 3 separate endpoints)
- Backend can optimize aggregations efficiently
- Consistent structure across all reports

## Risks / Trade-offs

### Risk 1: Backend API Endpoints Don't Exist

**Risk:** Chart data endpoints (`/videos/report/chart`, etc.) may not be implemented yet.

**Mitigation:**
- Frontend should implement with mock data first for UI testing
- Provide clear API contract in this design document
- Add fallback to show "Chart data unavailable" message if API fails

### Risk 2: Performance with Large Date Ranges

**Risk:** Chart data may become slow with date ranges > 1 year at daily granularity.

**Mitigation:**
- Enforce maximum data points (e.g., 365 points max)
- Auto-adjust granularity based on range (daily → weekly → monthly)
- Implement loading states to prevent UI freezing

### Risk 3: Mobile Chart Usability

**Risk:** Charts may be too small or cramped on mobile screens.

**Mitigation:**
- Stack charts vertically on mobile (vs grid on desktop)
- Minimum touch target sizes for chart interactions
- Hide less important charts on small screens
- Use responsive chart heights (300px desktop, 250px mobile)

### Risk 4: Chart Data Inconsistency with Table

**Risk:** Charts and table may show different numbers due to caching or timing.

**Mitigation:**
- Document that charts show aggregated data, tables show detailed records
- Add "Last updated" timestamp to charts
- Provide "Refresh Charts" button if data seems stale

### Trade-off: Collapsible Charts Section

**Trade-off:** Charts in collapsible section saves space but may hide insights.

**Decision:** Default to expanded, allow users to collapse if preferred.

## Migration Plan

**Phase 1: Frontend Implementation (No Backend)**
1. Add chart section components to all 4 report pages
2. Use mock data for chart rendering
3. Implement period selector and chart interactions
4. Test responsive layouts

**Phase 2: Backend API Integration**
1. Backend creates chart data endpoints
2. Update composibles to call real APIs
3. Remove mock data, handle loading/error states
4. Test with real data volumes

**Phase 3: Polish**
1. Add translation keys for chart labels
2. Implement chart export as image (if needed)
3. Performance testing with large date ranges
4. User acceptance testing

**Rollback Strategy:**
- Charts are additive - can hide entire chart section via feature flag
- No changes to existing table/filter functionality
- Simple revert: remove chart section components from pages

## Open Questions

1. **Chart Date Range:** Should charts use the same date range filter as tables, or separate range?
   - **Recommendation:** Same date range filter for consistency

2. **Chart Export:** Do we need "Export Chart as Image" functionality?
   - **Recommendation:** Nice-to-have, not MVP. Add if users request it.

3. **Chart Refresh:** Should charts auto-refresh when filters change, or require manual refresh button?
   - **Recommendation:** Auto-refresh on filter change for smoother UX

4. **Empty States:** What should charts show when no data matches filters?
   - **Recommendation:** Show "No data available" message with empty chart state

5. **Chart Colors:** Should charts use brand colors or allow custom theming?
   - **Recommendation:** Use Ant Design color palette for consistency, hardcode for MVP
