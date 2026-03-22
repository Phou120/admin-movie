## Why

The admin panel currently lacks dedicated reporting pages for analyzing core business data. Admins and super-admins need to view and export analytics for videos, users, packages, and payments to make informed decisions about content performance, user engagement, revenue trends, and package popularity. The existing list pages are designed for CRUD operations, not for reporting and analysis.

## What Changes

- Add four new report pages to the admin panel:
  - **report-video**: Video performance analytics with views, likes, customer data, and trend analysis
  - **report-user**: User activity statistics with role-based filtering and engagement metrics
  - **report-package**: Package performance reports showing sales, revenue, and subscription data
  - **report-payment**: Payment history and revenue reports with trends over time
- Each report page includes:
  - Data tables with pagination and sorting
  - Advanced filter controls (search, date range, status filters, entity-specific filters)
  - Export functionality (CSV/Excel)
  - Integration with existing chart components (LineChart, PieChart, BarChart, AreaChart)
  - Read-only data access (no create/edit/delete operations)
- Add routes for all four report pages
- Follow existing module pattern (composible for API calls, Vue page component, TypeScript interfaces)
- Add translation keys for Lao and English

## Capabilities

### New Capabilities
- `admin-reports`: Core reporting functionality for admin panel including data tables, filters, pagination, and export capabilities
- `video-analytics`: Video performance data including views, likes, customer attribution, category analysis, and trend visualization
- `user-analytics`: User activity and engagement metrics including registration trends, role distribution, and activity filtering
- `package-analytics`: Package performance metrics including sales data, revenue tracking, and popularity analysis
- `payment-analytics`: Payment history and revenue analytics including transaction trends, status filtering, and financial summaries

### Modified Capabilities
None - This is a new feature without changes to existing capability requirements.

## Impact

- **New modules**: 4 new admin modules (report-video, report-user, report-package, report-payment)
- **Router updates**: Add 4 new routes under the admin layout
- **Translation files**: Add report-specific translation keys to `src/locales/en.json` and `src/locales/lo.json`
- **API integration**: New report endpoints will be consumed (assumes backend provides `/videos/report`, `/users/report`, `/packages/report`, `/payments/report` or similar)
- **Existing work**: The report-video module structure has been partially created at `src/modules/admin/report-video/` and will be integrated and completed
- **No breaking changes**: All changes are additive
- **No new dependencies**: Uses existing chart components (ECharts) and UI library (Ant Design Vue)
