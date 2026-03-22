# Add Admin Report Pages with Data Visualization

## Why

The admin panel currently has 4 report pages (video, user, package, payment) with functional data tables and filters, but lacks visual data representations. Admins need interactive charts and graphs to quickly identify trends, patterns, and insights from the data. Visual analytics will enable faster decision-making and better understanding of key metrics.

## What Changes

**New Capabilities:**
- `report-data-visualization`: Interactive charts and graphs for all 4 admin report pages (video, user, package, payment)
- `report-chart-api`: Backend API endpoints for aggregated chart data

**Enhancements to Existing Report Pages:**
- **ReportVideo**: Add video views trend chart (line), likes distribution (pie), category performance (bar)
- **ReportUser**: Add user registration trend (area), role distribution (pie), activity status (bar)
- **ReportPackage**: Add sales revenue trend (line), package type distribution (pie), subscription analytics (bar)
- **ReportPayment**: Add payment trends over time (area), payment status breakdown (pie), revenue by payment type (bar)

**UI Components:**
- Chart period selector (daily, weekly, monthly, yearly)
- Interactive chart tooltips with detailed information
- Chart export as image functionality
- Responsive chart layouts for mobile/tablet

## Capabilities

### New Capabilities

- `report-data-visualization`: Interactive chart components integration across all admin report pages with ECharts-based visualizations, including trend lines, distribution pies, comparison bars, and area charts showing time-series data

- `report-chart-api`: Backend API endpoints providing aggregated data for charts (`/videos/report/chart`, `/users/report/chart`, `/packages/report/chart`, `/payments/report/chart`) with support for time period grouping (day, week, month, year) and filter combinations

### Modified Capabilities

None - This is purely additive functionality. Existing table/filter/export features remain unchanged.

## Impact

**Affected Code:**
- `src/modules/admin/report/video/ReportVideo.vue` - Add chart section
- `src/modules/admin/report/user/ReportUser.vue` - Add chart section
- `src/modules/admin/report/package/ReportPackage.vue` - Add chart section
- `src/modules/admin/report/payment/ReportPayment.vue` - Add chart section
- `src/modules/admin/report/*/composible/index.ts` - Add `fetchChartData()` methods

**New API Endpoints Required:**
- `GET /videos/report/chart` - Video metrics for charts
- `GET /users/report/chart` - User statistics for charts
- `GET /packages/report/chart` - Package performance for charts
- `GET /payments/report/chart` - Payment analytics for charts

**Dependencies:**
- Existing chart components: `LineChart.vue`, `PieChart.vue`, `BarChart.vue`, `AreaChart.vue` (already in `src/components/charts/`)
- ECharts library (already installed via echarts-for-vue)

**Translation Keys:**
Add to `src/locales/en.json` and `src/locales/lo.json`:
- `modules.reportVideo.charts.*`
- `modules.reportUser.charts.*`
- `modules.reportPackage.charts.*`
- `modules.reportPayment.charts.*`
- Common chart period labels (daily, weekly, monthly, yearly)
