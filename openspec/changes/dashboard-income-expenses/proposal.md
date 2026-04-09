# Dashboard Income & Expenses Charts

## Summary
Replace the current multi-section analytics dashboard (hero stats, package analytics, member analytics, financial analytics) with a clean, focused layout showing two side-by-side charts: Income and Expenses.

## Motivation
The current dashboard is overloaded with collapsible sections and numerous analytics components. The user wants a simpler view focused on the two most important financial metrics.

## Scope
- Clear all existing DashBoard.vue content
- Add two side-by-side ECharts bar charts: Income (monthly) and Expenses (monthly)
- Income data sourced from existing `/payments/report/summary` and `/payments/report` APIs
- Expenses chart uses placeholder/mock data (no backend endpoint yet)
- Monthly time granularity
- Reuse existing `BaseChart` component from `src/components/charts/`
- Add i18n keys for new labels

## Out of Scope
- Backend expenses API (future work)
- Daily/weekly toggle
- Existing dashboard sub-components cleanup (they can remain unused for now)
