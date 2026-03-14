## Context

The current dashboard implementation at `src/modules/admin/dashboard/DashBoard.vue` displays five hardcoded statistic cards using Ant Design Vue components. There are no data visualizations, real-time updates, or interactive filtering capabilities. The auth and contact pages demonstrate sophisticated design patterns including gradient animations, glassmorphism, and rich interactions that could elevate the dashboard experience.

The project uses Vue 3.5 with TypeScript, Ant Design Vue 4.x, and SASS for styling. No charting library is currently available in dependencies.

## Goals / Non-Goals

**Goals:**
- Create a visually stunning dashboard with modern design patterns (gradients, glassmorphism, smooth animations)
- Implement real-time data updates for live metrics
- Add comprehensive data visualization with multiple chart types
- Provide interactive filtering by time range and data categories
- Ensure excellent performance with loading states and skeleton screens
- Maintain responsiveness across desktop, tablet, and mobile devices

**Non-Goals:**
- Implement backend API changes (assume endpoints exist or create new)
- Add dark mode support (defer to future consideration)
- Create complex drill-down analytics (focus on overview metrics)

## Decisions

### Chart Library Selection

**Decision: Use ECharts as the primary visualization library**

**Rationale:**
- Strong Vue 3 integration with `echarts-for-vue`
- Comprehensive chart types (line, bar, pie, area, scatter, gauge)
- Built-in animation and responsive behavior
- Excellent TypeScript support
- Lightweight compared to alternatives
- Internationalization support (important for Lao/English requirements)

**Alternatives considered:**
- **Chart.js**: Simpler API but less sophisticated animations, requires more boilerplate for Vue 3
- **Ant Design Charts**: Native to AntD Vue but limited chart types and customization options
- **ApexCharts**: Beautiful but larger bundle size, less Vue 3 + TypeScript maturity
- **D3.js**: Too low-level, excessive development time for this scope

### Design System Approach

**Decision: Extend existing auth/contact design language**

**Rationale:**
- Users already accustomed to the gradient backgrounds and glassmorphism patterns
- Maintains visual consistency across admin panel
- CSS variables and mixins from `auth.scss` can be reused

**Implementation:**
- Animated gradient background similar to contact page hero section
- Glassmorphism cards with `backdrop-filter: blur()` and semi-transparent backgrounds
- Consistent color palette (`--auth-primary: #0d334a`)
- Hover effects with scale transforms and shadow depth

### Performance Optimization

**Decision: Implement multi-layered performance strategy**

**Rationale:**
- Dashboard renders multiple charts and real-time data; without optimization could be slow
- Users expect instant feedback on filter changes
- Mobile performance is critical for admin users

**Strategy:**
- **Lazy loading**: Charts load incrementally with intersection observer or scroll-based loading
- **Debouncing**: Filter controls debounce API calls (300ms delay)
- **API caching**: Cache dashboard stats in localStorage for 5-minute TTL
- **Skeleton screens**: Show animated placeholders while data loads
- **Virtual lists**: Activity feed uses virtual scrolling if items exceed 100

### Component Architecture

**Decision: Create reusable chart wrapper components**

**Rationale:**
- Multiple charts will share configuration (themes, responsive options, event handlers)
- Centralizes chart library integration (easy to swap if needed)
- Allows consistent styling across all charts

**Structure:**
```
src/components/charts/
├── BaseChart.vue              # Base wrapper with common options
├── LineChart.vue              # Extends base for line/area charts
├── BarChart.vue               # Extends base for bar/column charts
├── PieChart.vue               # Extends base for pie/doughnut charts
└── AreaChart.vue              # Extends base for area charts
```

### Real-time Updates

**Decision: Use Socket.io for real-time metrics**

**Rationale:**
- Project already has `socket.io-client` installed
- Socket infrastructure exists at `src/common/utils/socket.util.ts`
- Payment notifications already use socket pattern

**Implementation:**
- Subscribe to dashboard-specific socket events
- Update stats incrementally (no full re-render)
- Show "live" indicator when real-time connection active
- Graceful degradation: if socket fails, fallback to periodic polling (30s)

## Risks / Trade-offs

[Risk] Chart library bundle size increase
- **Mitigation**: Use tree-shaking, lazy load chart components, target only imported chart types

[Risk] Real-time updates causing excessive re-renders
- **Mitigation**: Use `v-once` for static elements, debounce updates, consider `requestIdleCallback` for non-critical updates

[Risk] Mobile chart rendering performance
- **Mitigation**: Reduce data points on mobile (e.g., show 7 days instead of 30), simplify animations on small screens

[Risk] API rate limiting on frequent filter changes
- **Mitigation**: Client-side caching with 5-minute TTL, batch requests when filters settle

[Risk] Glassmorphism browser compatibility
- **Mitigation**: Progressive enhancement with fallback backgrounds for older browsers, use `@supports` CSS queries
