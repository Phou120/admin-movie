## Why

The current dashboard displays generic mock data and lacks integration with the rich report data already available from packages, members, customers, and payment modules. Admin users need to see real business analytics - package performance, member growth trends, and financial insights - to make informed decisions. Without this integration, valuable data exists in separate report pages but isn't surfaced in the main dashboard where users need it most.

## What Changes

- Integrate report module data (ReportPackage, ReportPayment, Member, Customer) into the dashboard
- Replace mock chart data with real business analytics from report summary endpoints
- Add domain-specific chart sections: Package Analytics, Member Analytics, and Financial Overview
- Create a unified analytics view that combines metrics from multiple report sources
- Implement interactive charts showing trends, distributions, and comparisons for each domain
- Add time range filtering and drill-down capabilities from dashboard to detailed reports
- Leverage existing ECharts components and Ant Design styling from the dashboard redesign

## Capabilities

### New Capabilities
- `dashboard-package-analytics`: Display package performance metrics, revenue trends, and distribution charts using data from ReportPackage module
- `dashboard-member-analytics`: Show member growth trends, status distribution, and engagement metrics using member/customer data
- `dashboard-financial-analytics`: Present income, expenses, and payment analytics with trends and breakdowns using ReportPayment data
- `dashboard-report-integration`: Unified data layer that aggregates and formats report module data for dashboard consumption

### Modified Capabilities
None - This change integrates existing report data into the dashboard without modifying report module requirements

## Impact

- Modified files: `src/modules/admin/dashboard/DashBoard.vue`, `src/modules/admin/dashboard/composible/index.ts`
- New composible: `src/modules/admin/dashboard/composible/reportIntegration.ts` or integrated into existing dashboard composible
- API integration: Consume existing report summary endpoints (`/packages/report/summary`, `/payments/report/summary`)
- May require new backend summary endpoints for member/customer analytics if they don't exist
- Reuses existing ECharts components (LineChart, AreaChart, PieChart, BarChart) from dashboard redesign
- Leverages Ant Design components (a-card, a-statistic, a-row, a-col) for consistent styling
- Potential dependency: May need to create member/customer summary endpoints if they don't exist
- Performance: Consider caching report summary data with appropriate TTL to balance freshness and load
