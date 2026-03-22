# Admin Report Data Visualization - Implementation Tasks

## 1. Project Setup & Dependencies

- [ ] 1.1 Verify existing chart components are functional (LineChart, PieChart, BarChart, AreaChart)
- [ ] 1.2 Check echarts-for-vue library is properly installed and configured
- [ ] 1.3 Create backup branches for all 4 report modules before modification

## 2. Video Report Charts Implementation

- [ ] 2.1 Add chart section HTML structure to ReportVideo.vue (collapsible, between summary and filters)
- [ ] 2.2 Add period selector dropdown component to ReportVideo.vue
- [ ] 2.3 Add fetchChartData() method to ReportVideo composible (src/modules/admin/report/video/composible/index.ts)
- [ ] 2.4 Add chart loading and error state refs to ReportVideo.vue component
- [ ] 2.5 Integrate LineChart component for video views trend in ReportVideo.vue
- [ ] 2.6 Integrate PieChart component for likes distribution by category in ReportVideo.vue
- [ ] 2.7 Integrate BarChart component for top 10 videos ranking in ReportVideo.vue
- [ ] 2.8 Implement chart refresh logic when filters change in ReportVideo.vue
- [ ] 2.9 Add responsive layout styles for chart section in ReportVideo.vue
- [ ] 2.10 Test video report charts with mock data (before backend API is ready)

## 3. User Report Charts Implementation

- [ ] 3.1 Add chart section HTML structure to ReportUser.vue
- [ ] 3.2 Add period selector dropdown component to ReportUser.vue
- [ ] 3.3 Add fetchChartData() method to ReportUser composible
- [ ] 3.4 Add chart loading and error state refs to ReportUser.vue component
- [ ] 3.5 Integrate AreaChart component for user registrations trend in ReportUser.vue
- [ ] 3.6 Integrate PieChart component for role distribution in ReportUser.vue
- [ ] 3.7 Integrate BarChart component for active vs inactive users in ReportUser.vue
- [ ] 3.8 Implement chart refresh logic when filters change in ReportUser.vue
- [ ] 3.9 Add responsive layout styles for chart section in ReportUser.vue
- [ ] 3.10 Test user report charts with mock data

## 4. Package Report Charts Implementation

- [ ] 4.1 Add chart section HTML structure to ReportPackage.vue
- [ ] 4.2 Add period selector dropdown component to ReportPackage.vue
- [ ] 4.3 Add fetchChartData() method to ReportPackage composible
- [ ] 4.4 Add chart loading and error state refs to ReportPackage.vue component
- [ ] 4.5 Integrate LineChart component for revenue trend in ReportPackage.vue
- [ ] 4.6 Integrate PieChart component for package type distribution in ReportPackage.vue
- [ ] 4.7 Integrate BarChart component for sales by package type in ReportPackage.vue
- [ ] 4.8 Implement chart refresh logic when filters change in ReportPackage.vue
- [ ] 4.9 Add responsive layout styles for chart section in ReportPackage.vue
- [ ] 4.10 Test package report charts with mock data

## 5. Payment Report Charts Implementation

- [ ] 5.1 Add chart section HTML structure to ReportPayment.vue
- [ ] 5.2 Add period selector dropdown component to ReportPayment.vue
- [ ] 5.3 Add fetchChartData() method to ReportPayment composible
- [ ] 5.4 Add chart loading and error state refs to ReportPayment.vue component
- [ ] 5.5 Integrate AreaChart component for payment volume trend in ReportPayment.vue
- [ ] 5.6 Integrate PieChart component for payment status breakdown in ReportPayment.vue
- [ ] 5.7 Integrate BarChart component for revenue by payment method in ReportPayment.vue
- [ ] 5.8 Implement chart refresh logic when filters change in ReportPayment.vue
- [ ] 5.9 Add responsive layout styles for chart section in ReportPayment.vue
- [ ] 5.10 Test payment report charts with mock data

## 6. Translation & Localization

- [ ] 6.1 Add chart-related translation keys to src/locales/en.json
  - [ ] 6.1.1 Add modules.reportVideo.charts.* keys (titles, labels, tooltips)
  - [ ] 6.1.2 Add modules.reportUser.charts.* keys
  - [ ] 6.1.3 Add modules.reportPackage.charts.* keys
  - [ ] 6.1.4 Add modules.reportPayment.charts.* keys
  - [ ] 6.1.5 Add common chart period labels (daily, weekly, monthly, yearly)
  - [ ] 6.1.6 Add chart loading/error/empty state messages
- [ ] 6.2 Add chart-related translation keys to src/locales/lo.json (same structure as en.json)
- [ ] 6.3 Test language switching on all 4 report pages to verify chart text updates

## 7. TypeScript Interfaces

- [ ] 7.1 Create chart data interfaces for video report (IChartDataTimeline, IChartDataDistribution, IChartDataRanking)
- [ ] 7.2 Create chart data interfaces for user report
- [ ] 7.3 Create chart data interfaces for package report
- [ ] 7.4 Create chart data interfaces for payment report
- [ ] 7.5 Add interface exports to existing report interface files or create new chart interface files

## 8. Backend API Integration

- [ ] 8.1 Mock chart data in composibles for initial frontend testing
- [ ] 8.2 Update fetchChartData() methods to call real backend endpoints when available
- [ ] 8.3 Replace mock data with real API responses for video report
- [ ] 8.4 Replace mock data with real API responses for user report
- [ ] 8.5 Replace mock data with real API responses for package report
- [ ] 8.6 Replace mock data with real API responses for payment report
- [ ] 8.7 Test error handling when backend endpoints return errors
- [ ] 8.8 Test loading states during real API calls

## 9. Styling & Responsive Design

- [ ] 9.1 Implement collapsible chart section component (collapse/expand animation)
- [ ] 9.2 Style period selector dropdown to match existing Ant Design components
- [ ] 9.3 Implement responsive grid layout for charts (2 columns on desktop, 1 on mobile)
- [ ] 9.4 Set appropriate chart heights (300px desktop, 280px tablet, 250px mobile)
- [ ] 9.5 Test chart display on mobile devices (< 768px width)
- [ ] 9.6 Test chart display on tablet devices (768px - 1023px width)
- [ ] 9.7 Test chart display on desktop (≥ 1024px width)
- [ ] 9.8 Ensure chart tooltips are readable and accessible on all screen sizes

## 10. Testing & Quality Assurance

- [ ] 10.1 Manually test all video report charts with various filter combinations
- [ ] 10.2 Manually test all user report charts with various filter combinations
- [ ] 10.3 Manually test all package report charts with various filter combinations
- [ ] 10.4 Manually test all payment report charts with various filter combinations
- [ ] 10.5 Test chart period selector (daily, weekly, monthly, yearly) on all pages
- [ ] 10.6 Test chart collapse/expand functionality on all pages
- [ ] 10.7 Test chart loading states on slow network connections
- [ ] 10.8 Test chart error states with failed API calls
- [ ] 10.9 Test chart empty states when no data matches filters
- [ ] 10.10 Verify chart tooltips display correct information on hover
- [ ] 10.11 Run TypeScript compilation to verify no type errors
- [ ] 10.12 Run production build to ensure charts don't break existing functionality

## 11. Documentation & Cleanup

- [ ] 11.1 Remove mock data after real API integration is complete
- [ ] 11.2 Add JSDoc comments to composible fetchChartData() methods
- [ ] 11.3 Update component comments to document chart sections
- [ ] 11.4 Verify no console errors or warnings on any report page
- [ ] 11.5 Create git commit with clear message describing chart implementation
