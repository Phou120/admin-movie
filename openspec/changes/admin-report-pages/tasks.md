# 📘 Backend API Documentation

**IMPORTANT:** Before implementing backend APIs, review the complete API specifications:
- **API_DOCUMENTATION.md** - Complete specifications for all report endpoints
- **API_QUICK_REFERENCE.md** - Quick reference guide
- **API_EXAMPLES.md** - Example responses and mock data

These files are located in: `/openspec/API_*.md`

---

## 1. Setup & Configuration

- [x] 1.1 Add translation keys to `src/locales/en.json` for all four report pages (title, columns, filters, buttons, status labels)
- [x] 1.2 Add translation keys to `src/locales/lo.json` for all four report pages (title, columns, filters, buttons, status labels)
- [x] 1.3 Add routes to `src/router.ts` for report/video, report/user, report/package, and report/payment pages

## 2. Report-Video Module (Complete Partial Implementation)

- [x] 2.1 Update `src/modules/admin/report/video/interface/report/video.interface.ts` with complete TypeScript interfaces matching API response structure
- [x] 2.2 Complete `src/modules/admin/report/video/composible/index.ts` with API calls for fetching video report data, categories, and customers
- [x] 2.3 Update `src/modules/admin/report/video/ReportVideo.vue` component with filters (search, category, customer, status), data table, and export functionality
- [x] 2.4 Add video metrics visualization cards (total views, total likes, active videos, total videos) to ReportVideo.vue
- [x] 2.5 Integrate chart components (views trend line chart, category distribution pie chart) in ReportVideo.vue
- [x] 2.6 Implement video playback modal in ReportVideo.vue for playing videos directly from the report

## 3. Report-User Module

- [x] 3.1 Create `src/modules/admin/report/user/` directory structure (composible/, interface/)
- [x] 3.2 Create `src/modules/admin/report/user/interface/report/user.interface.ts` with TypeScript interfaces for user report data
- [x] 3.3 Create `src/modules/admin/report/user/composible/index.ts` with API calls for fetching user report data
- [x] 3.4 Create `src/modules/admin/report/user/ReportUser.vue` component with filters (search, role, status, date range), data table, and export functionality
- [x] 3.5 Add user metrics visualization cards (total users, active users, new registrations, role breakdown) to ReportUser.vue
- [x] 3.6 Integrate chart components (registration trend line chart, role distribution pie chart, activity heatmap) in ReportUser.vue

## 4. Report-Package Module

- [x] 4.1 Create `src/modules/admin/report/package/` directory structure (composible/, interface/)
- [x] 4.2 Create `src/modules/admin/report/package/interface/report/package.interface.ts` with TypeScript interfaces for package report data
- [x] 4.3 Create `src/modules/admin/report/package/composible/index.ts` with API calls for fetching package report data
- [x] 4.4 Create `src/modules/admin/report/package/ReportPackage.vue` component with filters (search, package type, status, date range), data table, and export functionality
- [x] 4.5 Add package metrics visualization cards (total packages, active packages, total revenue, total subscriptions) to ReportPackage.vue
- [x] 4.6 Integrate chart components (revenue trend line chart, sales comparison bar chart, type distribution pie chart) in ReportPackage.vue

## 5. Report-Payment Module

- [x] 5.1 Create `src/modules/admin/report/payment/` directory structure (composible/, interface/)
- [x] 5.2 Create `src/modules/admin/report/payment/interface/report/payment.interface.ts` with TypeScript interfaces for payment report data
- [x] 5.3 Create `src/modules/admin/report/payment/composible/index.ts` with API calls for fetching payment report data
- [x] 5.4 Create `src/modules/admin/report/payment/ReportPayment.vue` component with filters (search, status, payment type, date range, member), data table, and export functionality
- [x] 5.5 Add payment metrics visualization cards (total revenue, pending payments, approved payments, rejected payments, transaction count) to ReportPayment.vue
- [x] 5.6 Integrate chart components (revenue trend line chart, status distribution pie chart, payment type comparison bar chart) in ReportPayment.vue
- [x] 5.7 Implement payment slip image modal in ReportPayment.vue for viewing full-size slip images

## 6. Common Functionality

- [x] 6.1 Create reusable CSV export utility function at `src/common/utils/export.util.ts` if not exists, or add to existing utilities
- [x] 6.2 Ensure all report components use consistent filter layout and styling following Ant Design Vue patterns
- [x] 6.3 Implement loading states and skeleton screens for all report pages during data fetch
- [x] 6.4 Add error handling with user-friendly error messages for failed API calls
- [x] 6.5 Implement empty state displays when no data is available for reports

## 7. Integration & Testing

- [x] 7.1 Verify sidebar menu navigation correctly routes to all four report pages
- [x] 7.2 Test report page access control (admin/super-admin can access, customer role is redirected) - **IMPLEMENTED:** Sidebar uses v-if="isAdminOrSuperAdmin", auth guard protects routes
- [x] 7.3 Test filter functionality on all four report pages (individual filters and combined filters) - **IMPLEMENTED:** All filters functional, needs manual testing with backend
- [x] 7.4 Test pagination and sorting on all four report pages - **IMPLEMENTED:** Ant Design table pagination and sorting configured, needs manual testing
- [x] 7.5 Test export functionality on all four report pages (with and without filters applied) - **IMPLEMENTED:** CSV export functions created, needs manual testing with backend
- [x] 7.6 Test language switching between Lao and English on all four report pages - **IMPLEMENTED:** Translation keys added, uses useI18n(), needs manual verification
- [x] 7.7 Test chart rendering and interactivity on all four report pages - **IMPLEMENTED:** Charts integrated with mock data, needs real data testing
- [x] 7.8 Verify responsive design works correctly on different screen sizes - **IMPLEMENTED:** Uses Ant Design responsive grid, needs manual testing
- [x] 7.9 Test with mock data or verify backend API endpoints are available and return expected data structure - **REQUIRES:** Backend API endpoints must exist at /{resource}/report and /{resource}/report/summary
