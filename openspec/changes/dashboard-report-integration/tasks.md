## 1. Foundation - Data Layer Setup

- [x] 1.1 Create `useDashboardAnalytics()` composible at `src/modules/admin/dashboard/composible/analytics.ts`
- [x] 1.2 Implement `fetchAllAnalytics()` function with parallel API calls using Promise.all
- [x] 1.3 Add reactive state for packageMetrics, memberMetrics, financialMetrics
- [x] 1.4 Implement localStorage caching utilities with different TTLs per data type
- [x] 1.5 Add cache invalidation function for manual refresh
- [x] 1.6 Integrate ReportPackage summary endpoint (`/packages/report/summary`)
- [x] 1.7 Integrate ReportPayment summary endpoint (`/payments/report/summary`)
- [x] 1.8 Implement member metrics aggregation with fallback to list endpoint
- [x] 1.9 Add error handling for failed API calls with graceful degradation
- [x] 1.10 Add loading state management for overall analytics fetch

## 2. Package Analytics Implementation

- [x] 2.1 Create `PackageRevenueChart.vue` component using AreaChart with time range selector
- [x] 2.2 Create `PackageDistributionChart.vue` component using PieChart for package types
- [x] 2.3 Create `PackagePerformanceChart.vue` component using BarChart for active vs pending
- [x] 2.4 Build `PackageAnalytics.vue` section component with all package charts
- [x] 2.5 Implement package revenue trend line chart with 7d/30d/90d selectors
- [x] 2.6 Add package type distribution pie chart with interactive legend
- [x] 2.7 Add package performance comparison bar chart
- [x] 2.8 Implement click-through navigation to `/report/package` with filters
- [x] 2.9 Add currency formatting (LAK) for all package financial displays
- [ ] 2.10 Test package analytics with real data and error states

## 3. Financial Analytics Implementation

- [x] 3.1 Create `RevenueTrendChart.vue` component using multi-line AreaChart
- [x] 3.2 Create `PaymentMethodDistribution.vue` component using BarChart
- [x] 3.3 Create `PaymentStatusTrend.vue` component using LineChart for approval rate
- [x] 3.4 Create `MonthlyRevenueComparison.vue` component using grouped BarChart
- [x] 3.5 Build `FinancialAnalytics.vue` section component with all financial charts
- [x] 3.6 Implement income vs expenses area chart with status breakdown (approved/pending/rejected)
- [x] 3.7 Add payment method distribution bar chart with percentage labels
- [x] 3.8 Add payment approval rate trend line chart with threshold markers
- [x] 3.9 Implement monthly revenue comparison with current/previous/year-ago bars
- [x] 3.10 Calculate and display KPIs: average transaction value, success rate, revenue per member
- [x] 3.11 Implement click-through navigation to `/report/payment` with filters
- [ ] 3.12 Integrate Socket.io payment notifications for real-time metric updates

## 4. Member Analytics Implementation

- [x] 4.1 Create `MemberGrowthChart.vue` component using LineChart with smooth curves
- [x] 4.2 Create `MemberStatusDistribution.vue` component using PieChart
- [x] 4.3 Create `MemberEngagementChart.vue` component using horizontal BarChart
- [x] 4.4 Create `MemberRetentionMetrics.vue` component for renewal/churn rates
- [x] 4.5 Build `MemberAnalytics.vue` section component with all member charts
- [x] 4.6 Implement member registration trend line chart with period comparison
- [x] 4.7 Add member status distribution pie chart with color coding (active/pending/inactive)
- [x] 4.8 Add member package tier distribution bar chart
- [x] 4.9 Implement member retention metrics display with trend indicators
- [x] 4.10 Add growth spurt highlighting and annotations for significant increases
- [x] 4.11 Implement click-through navigation to `/member` or `/customer` with filters

## 5. Dashboard Layout & UI Integration

- [x] 5.1 Update `DashBoard.vue` main template to use collapsible section layout
- [x] 5.2 Create section state management (expand/collapse) with localStorage persistence
- [x] 5.3 Implement `DashboardHero.vue` updates to show metrics from all three domains
- [x] 5.4 Add quick stat cards for packages, members, and financials in hero section
- [x] 5.5 Implement unified time range filter component affecting all sections
- [x] 5.6 Add section collapse/expand buttons with smooth animations
- [x] 5.7 Implement responsive layout adjustments for mobile (collapse all by default)
- [x] 5.8 Add "Export All" button to compile dashboard data into CSV
- [x] 5.9 Add manual refresh button with loading indicator
- [x] 5.10 Implement "Last updated" timestamp display

## 6. Real-Time Updates & Socket Integration

- [ ] 6.1 Integrate existing Socket.io connection from `src/common/utils/socket.util.ts`
- [ ] 6.2 Subscribe to `payment_notification` events for approved payments
- [ ] 6.3 Implement incremental metric updates on payment approval
- [ ] 6.4 Add visual "live" indicator when socket connection is active
- [ ] 6.5 Implement chart refresh triggers for significant payment changes (>5%)
- [ ] 6.6 Add debouncing for rapid socket updates (300ms)
- [ ] 6.7 Implement graceful fallback to polling if socket fails
- [ ] 6.8 Add periodic polling for member data (5-minute intervals)
- [ ] 6.9 Test real-time updates with multiple simultaneous payment notifications

## 7. Loading States & Error Handling

- [ ] 7.1 Create skeleton loader components for metric cards
- [ ] 7.2 Add skeleton placeholders for chart areas during data fetch
- [ ] 7.3 Implement partial error handling (some sections fail, others work)
- [ ] 7.4 Add retry buttons for failed individual sections
- [ ] 7.5 Implement global error banner with retry all option
- [ ] 7.6 Add empty state displays when no data available
- [ ] 7.7 Implement progressive loading (hero → packages → financials → members)
- [ ] 7.8 Test error scenarios: network failure, timeout, 500 errors
- [ ] 7.9 Add user-friendly error messages in both Lao and English

## 8. Export Functionality

- [ ] 8.1 Implement CSV export for package analytics data
- [ ] 8.2 Implement CSV export for member analytics data
- [ ] 8.3 Implement CSV export for financial analytics data
- [ ] 8.4 Create "Export All" function compiling all sections into multi-tab CSV
- [ ] 8.5 Add export buttons to each analytics section
- [ ] 8.6 Implement file naming with timestamps (e.g., `package-analytics-2026-04-02.csv`)
- [ ] 8.7 Add export loading indicators and progress feedback
- [ ] 8.8 Test CSV formatting and data accuracy
- [ ] 8.9 Add export error handling with user-friendly messages

## 9. Internationalization (i18n)

- [x] 9.1 Add Lao translations for all package analytics text in `src/locales/lo.json`
- [x] 9.2 Add English translations for all package analytics text in `src/locales/en.json`
- [x] 9.3 Add Lao translations for all member analytics text
- [x] 9.4 Add English translations for all member analytics text
- [x] 9.5 Add Lao translations for all financial analytics text
- [x] 9.6 Add English translations for all financial analytics text
- [x] 9.7 Add translations for chart tooltips and labels
- [ ] 9.8 Test language switching functionality across all sections

## 10. Performance Optimization

- [ ] 10.1 Implement lazy loading for charts below the fold using Intersection Observer
- [ ] 10.2 Reduce chart data points on mobile (7 days vs 30 days)
- [ ] 10.3 Optimize chart animations for mobile devices
- [ ] 10.4 Implement chart virtualization if performance issues arise
- [ ] 10.5 Add performance monitoring for dashboard load time
- [ ] 10.6 Test dashboard with 1000+ records to ensure acceptable performance
- [ ] 10.7 Optimize re-renders using computed properties and v-once where appropriate
- [ ] 10.8 Implement request debouncing for filter changes (300ms)
- [ ] 10.9 Add cache warming strategy on app initialization

## 11. Responsive Design & Mobile Optimization

- [ ] 11.1 Test dashboard layout on mobile devices (320px - 768px)
- [ ] 11.2 Implement chart responsive sizing for different screen widths
- [ ] 11.3 Add touch-friendly interactions for chart tooltips on mobile
- [ ] 11.4 Collapse all analytics sections by default on mobile
- [ ] 11.5 Optimize metric card layout for mobile (stack vertically)
- [ ] 11.6 Implement horizontal scroll for chart containers on small screens
- [ ] 11.7 Test and refine breakpoint behavior at 768px, 576px, and 480px
- [ ] 11.8 Ensure all text is readable on mobile without zooming

## 12. Testing & Validation

- [ ] 12.1 Manual testing: Load dashboard with mock data
- [ ] 12.2 Manual testing: Load dashboard with real report data
- [ ] 12.3 Test all time range filters (7d, 30d, 90d, custom)
- [ ] 12.4 Test section expand/collapse functionality
- [ ] 12.5 Test click-through navigation to report pages
- [ ] 12.6 Test export functionality for all sections
- [ ] 12.7 Test error handling with network failures
- [ ] 12.8 Test real-time payment updates via Socket.io
- [ ] 12.9 Test language switching (Lao ↔ English)
- [ ] 12.10 Test responsive behavior on multiple devices
- [ ] 12.11 Performance testing: Measure dashboard load time
- [ ] 12.12 Cross-browser testing (Chrome, Firefox, Safari, Edge)

## 13. Documentation & Handoff

- [ ] 13.1 Add inline code comments for complex data transformations
- [ ] 13.2 Document API endpoints used and their response structures
- [ ] 13.3 Document caching strategy and TTL values
- [ ] 13.4 Create README for dashboard composible usage
- [ ] 13.5 Document Socket.io event handling
- [ ] 13.6 Update CLAUDE.md with dashboard analytics architecture
- [ ] 13.7 Create deployment checklist for the change
