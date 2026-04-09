# Design: Dashboard Income & Expenses

## Layout
```
┌─────────────────────────────────────────────────┐
│  Dashboard Title          [Refresh] [Year: 2026]│
├───────────────────────┬─────────────────────────┤
│   Income Chart (Bar)  │  Expenses Chart (Bar)   │
│                       │                         │
│   █                   │        █                │
│   █  █                │     █  █                │
│   █  █  █    █        │  █  █  █  █             │
│   █  █  █  █ █        │  █  █  █  █  █          │
│  Jan Feb Mar Apr May  │ Jan Feb Mar Apr May     │
│                       │                         │
│  Monthly income from  │  Monthly expenses       │
│  approved payments    │  (placeholder data)     │
└───────────────────────┴─────────────────────────┘
```

## Components
- **DashBoard.vue** — Cleared and rewritten with simple layout
- Uses `BaseChart` directly with ECharts bar chart options
- No new sub-components needed (charts are simple enough to inline)

## Data Flow
- Income: `ReportPaymentComposible().fetchReportData()` → aggregate by month → bar chart
- Expenses: Static mock data array → bar chart
- Currency: LAK (₭), formatted with Intl.NumberFormat

## Chart Config
- Type: ECharts bar chart via BaseChart
- Colors: Income = green (#52c41a), Expenses = red (#ff4d4f)
- Tooltip: Shows formatted currency on hover
- Responsive: Ant Design Row/Col grid (xs=24, lg=12)
