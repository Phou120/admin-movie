## Context

The current dashboard implementation in `src/modules/admin/dashboard/DashBoard.vue` has been partially redesigned with ECharts components and Ant Design styling (21/72 tasks completed in `admin-dashboard-redesign` change). However, the dashboard currently displays mock data and is not integrated with the existing report modules that contain rich business data:

- **ReportPackage module**: Package performance, revenue, subscription data at `/packages/report/summary`
- **ReportPayment module**: Payment analytics, revenue breakdown at `/payments/report/summary`
- **Member module**: Member/customer data but lacks a summary endpoint
- **Customer module**: Customer data but lacks a summary endpoint

The project uses:
- Vue 3.5 with Composition API and `<script setup>` syntax
- TypeScript with strict type checking
- Ant Design Vue 4.x for UI components
- ECharts with `echarts-for-vue` for data visualization
- Socket.io-client for real-time updates (already used for payment notifications)
- Axios with centralized configuration at `src/common/configuration/axios.config.ts`

**Constraints:**
- Cannot modify report module requirements - integration only
- Must reuse existing chart components (LineChart, AreaChart, PieChart, BarChart)
- Must maintain consistency with dashboard redesign styling (gradients, glassmorphism)
- Backend API endpoints may or may not exist for member/customer summaries
- Dashboard should load quickly despite fetching data from multiple sources

## Goals / Non-Goals

**Goals:**
- Integrate real data from report modules into the dashboard
- Display package analytics with revenue trends and distribution charts
- Display member analytics with growth trends and status breakdown
- Display financial analytics with income, expenses, and payment breakdowns
- Provide unified time range filtering across all analytics sections
- Support real-time updates via Socket.io for critical metrics (payments)
- Maintain beautiful Ant Design styling consistent with dashboard redesign
- Implement proper loading states and error handling
- Cache report data appropriately to balance freshness and performance

**Non-Goals:**
- Creating new backend report endpoints (use existing ones, create frontend aggregation if needed)
- Modifying report module functionality or requirements
- Implementing dark mode support
- Creating drill-down analytics beyond what report pages provide
- Building complex forecasting or predictive analytics

## Decisions

### Decision 1: Dashboard Layout - Hybrid Section-Based Approach

**Choice:** Use a single-page dashboard with expandable/collapsible sections for each analytics domain.

**Rationale:**
- **Pros:**
  - All data visible at a glance without navigation
  - User can collapse sections they don't need
  - Maintains context better than tabbed interface
  - Aligns with long-scroll dashboard pattern users expect
- **Cons:**
  - Longer page requiring more scrolling
  - More complex collapse state management

**Alternatives considered:**
- **Tabbed approach**: Cleaner interface but hides data, requires more clicks
- **Separate dashboards**: Better focus but fragments user experience

**Implementation:**
```vue
<template>
  <div class="dashboard">
    <!-- Hero: Quick stats from all domains -->
    <DashboardHero />

    <!-- Section 1: Package Analytics (expanded by default) -->
    <a-card>
      <template #title>
        <span>📦 Package Analytics</span>
        <a-button @click="toggleSection('packages')">
          {{ sections.packages.expanded ? '▼' : '▶' }}
        </a-button>
      </template>
      <PackageAnalytics v-if="sections.packages.expanded" />
    </a-card>

    <!-- Section 2: Member Analytics (collapsed by default) -->
    <a-card>
      <template #title>
        <span>👥 Member Analytics</span>
        <a-button @click="toggleSection('members')">
          {{ sections.members.expanded ? '▼' : '▶' }}
        </a-button>
      </template>
      <MemberAnalytics v-if="sections.members.expanded" />
    </a-card>

    <!-- Section 3: Financial Analytics (collapsed by default) -->
    <a-card>
      <template #title>
        <span>💰 Financial Analytics</span>
        <a-button @click="toggleSection('financials')">
          {{ sections.financials.expanded ? '▼' : '▶' }}
        </a-button>
      </template>
      <FinancialAnalytics v-if="sections.financials.expanded" />
    </a-card>
  </div>
</template>
```

### Decision 2: Data Layer - Create Dedicated Dashboard Analytics Composible

**Choice:** Create `useDashboardAnalytics()` composible that aggregates data from multiple report sources.

**Rationale:**
- **Pros:**
  - Centralizes all dashboard data fetching logic
  - Handles caching and error recovery in one place
  - Provides unified data interface to dashboard components
  - Easy to test and mock
  - Can parallelize API calls for better performance
- **Cons:**
  - Additional abstraction layer
  - More complex than calling report composibles directly

**Alternatives considered:**
- **Call report composibles directly**: Simpler but scatters data logic across components
- **Create new backend endpoints**: Cleaner but requires backend work

**Implementation:**
```typescript
// src/modules/admin/dashboard/composible/analytics.ts
import { ref } from 'vue';
import apiClient from '../../../../common/configuration/axios.config';

export function useDashboardAnalytics() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const packageMetrics = ref(null);
  const memberMetrics = ref(null);
  const financialMetrics = ref(null);

  // Fetch all analytics data in parallel
  const fetchAllAnalytics = async (timeRange?: string) => {
    loading.value = true;
    error.value = null;

    try {
      const [packages, payments] = await Promise.all([
        apiClient.get('/packages/report/summary'),
        apiClient.get('/payments/report/summary')
      ]);

      packageMetrics.value = packages.data.data;
      financialMetrics.value = payments.data.data;

      // Member data might need aggregation
      memberMetrics.value = await aggregateMemberMetrics(timeRange);

    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    packageMetrics,
    memberMetrics,
    financialMetrics,
    fetchAllAnalytics
  };
}
```

### Decision 3: Member/Customer Data - Frontend Aggregation Strategy

**Choice:** Aggregate member data on the frontend if summary endpoint doesn't exist.

**Rationale:**
- **Pros:**
  - No backend changes required
  - Faster implementation
  - Can cache aggregated results
- **Cons:**
  - More data transferred (full list vs summary)
  - Slower on first load
  - Client-side computation

**Alternatives considered:**
- **Create backend summary endpoints**: More efficient but requires backend development
- **Show member metrics only in report page**: Limits dashboard value

**Implementation:**
```typescript
// If member summary endpoint doesn't exist
const aggregateMemberMetrics = async () => {
  try {
    // Try summary endpoint first
    const response = await apiClient.get('/members/report/summary');
    return response.data.data;
  } catch (err) {
    // Fallback: aggregate from list endpoint
    const members = await apiClient.get('/customers', {
      params: { type: 'member', limit: 1000 }
    });

    const data = members.data.data;

    return {
      total_members: data.length,
      active_members: data.filter(m => m.status === 'active').length,
      inactive_members: data.filter(m => m.status === 'inactive').length,
      pending_members: data.filter(m => m.status === 'pending').length
    };
  }
};
```

### Decision 4: Real-Time Updates - Hybrid Approach

**Choice:** Use Socket.io for payment updates, periodic polling for member/package data.

**Rationale:**
- **Pros:**
  - Payment data is time-critical (business impact)
  - Member/package changes are less frequent
  - Reduces server load compared to all-real-time
- **Cons:**
  - Mixed update strategies
  - More complex implementation

**Alternatives considered:**
- **Full real-time**: Excessive server load, unnecessary for slower-changing data
- **Full polling**: Simpler but stale payment data
- **Manual refresh only**: Poorest user experience

**Implementation:**
```typescript
// In useDashboardAnalytics
const { socket } = useSocket(); // Existing socket util

onMounted(() => {
  // Listen for payment updates
  socket.on('payment_notification', (payment) => {
    if (payment.status === 'approved') {
      financialMetrics.value.approved_payments += payment.amount;
    }
    updateCharts();
  });

  // Poll member data every 5 minutes
  const pollInterval = setInterval(() => {
    fetchMemberMetrics();
  }, 5 * 60 * 1000);

  onUnmounted(() => {
    clearInterval(pollInterval);
    socket.off('payment_notification');
  });
});
```

### Decision 5: Chart Component Strategy - Reuse with Domain-Specific Wrappers

**Choice:** Create domain-specific chart wrapper components that use existing base chart components.

**Rationale:**
- **Pros:**
  - Reuses existing BaseChart, LineChart, AreaChart, PieChart, BarChart
  - Encapsulates domain-specific data transformation
  - Maintains consistent styling across all charts
  - Each wrapper knows how to fetch its data
- **Cons:**
  - More component files
  - Slight duplication across wrappers

**Alternatives considered:**
- **Use chart components directly**: Mixes data logic with presentation
- **Create mega-chart component**: Too complex, hard to maintain

**Implementation:**
```vue
<!-- src/modules/admin/dashboard/components/PackageRevenueChart.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import AreaChart from '../../../../components/charts/AreaChart.vue';

interface Props {
  data: PackageMetricData[];
  timeRange: string;
}

const props = defineProps<Props>();

const chartData = computed(() => ({
  labels: props.data.map(d => d.date),
  data: props.data.map(d => d.revenue)
}));
</script>

<template>
  <a-card title="Package Revenue Trend">
    <AreaChart
      :data="chartData.data"
      :labels="chartData.labels"
      color="#52c41a"
      :loading="loading"
    />
  </a-card>
</template>
```

### Decision 6: Caching Strategy - Multi-Level Approach

**Choice:** Implement localStorage caching with different TTLs per data type.

**Rationale:**
- **Pros:**
  - Reduces API calls
  - Fast dashboard loads
  - Fresh data where it matters
- **Cons:**
  - Stale data possible
  - Cache invalidation complexity

**Cache TTLs:**
- Package metrics: 10 minutes (changes infrequently)
- Member metrics: 5 minutes (moderate frequency)
- Financial metrics: 2 minutes (changes frequently)
- Time-series data: 5 minutes (chart data)

**Implementation:**
```typescript
const CACHE_KEYS = {
  PACKAGES: 'dashboard_packages',
  MEMBERS: 'dashboard_members',
  FINANCIAL: 'dashboard_financial'
};

const CACHE_TTL = {
  PACKAGES: 10 * 60 * 1000,
  MEMBERS: 5 * 60 * 1000,
  FINANCIAL: 2 * 60 * 1000
};

const getCached = (key: string) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  const age = Date.now() - timestamp;

  if (age < CACHE_TTL[key.toUpperCase()]) {
    return data;
  }
  return null;
};
```

## Risks / Trade-offs

### Risk 1: Missing Backend Endpoints

**Risk**: Member and customer summary endpoints may not exist, requiring frontend aggregation.

**Mitigation**:
- Try summary endpoint first, fallback to list aggregation
- Show loading message while aggregating
- Cache aggregated results aggressively (10-minute TTL)
- Consider requesting backend endpoints if performance is poor

### Risk 2: Performance with Multiple API Calls

**Risk**: Calling 3-4 endpoints on every dashboard load could be slow.

**Mitigation**:
- Use `Promise.all()` for parallel requests
- Implement aggressive caching with appropriate TTLs
- Show skeleton loaders during fetch
- Load critical data first (financials), defer less critical (member trends)

### Risk 3: Stale Data with Caching

**Risk**: Cached data may not reflect recent changes, especially for payments.

**Mitigation**:
- Short TTL for financial metrics (2 minutes)
- Socket.io updates for approved payments (real-time)
- Clear cache on manual refresh
- Show "Last updated" timestamp

### Risk 4: Chart Complexity on Mobile

**Risk**: Multiple charts may be slow or hard to use on mobile devices.

**Mitigation**:
- Reduce data points on mobile (7 days vs 30 days)
- Lazy load charts below the fold
- Use responsive chart sizing
- Simplify chart interactions on touch devices

### Risk 5: Real-Time Update Conflicts

**Risk**: Socket.io updates may conflict with cached data or user selections.

**Mitigation**:
- Update cache when socket events received
- Show visual indicator of live update
- Debounce rapid updates (300ms)
- Allow user to disable real-time if problematic

## Migration Plan

### Phase 1: Foundation (Week 1)
1. Create `useDashboardAnalytics()` composible
2. Integrate ReportPackage summary endpoint
3. Integrate ReportPayment summary endpoint
4. Implement frontend member aggregation
5. Add localStorage caching layer
6. Test error handling for missing endpoints

### Phase 2: Package Analytics (Week 2)
1. Create PackageRevenueChart component
2. Create PackageDistributionChart component
3. Create PackagePerformanceChart component
4. Build PackageAnalytics section component
5. Integrate package metrics into DashboardHero

### Phase 3: Financial Analytics (Week 2-3)
1. Create RevenueTrendChart component
2. Create PaymentMethodDistribution component
3. Create PaymentStatusTrend component
4. Build FinancialAnalytics section component
5. Integrate financial metrics into DashboardHero
6. Add Socket.io payment notifications

### Phase 4: Member Analytics (Week 3)
1. Create MemberGrowthChart component
2. Create MemberStatusDistribution component
3. Create MemberEngagementChart component
4. Build MemberAnalytics section component
5. Integrate member metrics into DashboardHero

### Phase 5: Integration & Polish (Week 4)
1. Build collapsible section UI
2. Implement unified time range filtering
3. Add loading states and error handling
4. Implement export functionality
5. Performance optimization and testing
6. Documentation and handoff

**Rollback Strategy**:
- Each phase can be independently deployed and rolled back
- Feature flags can enable/disable sections
- Mock data fallback if endpoints fail
- Existing dashboard remains functional during migration

## Open Questions

1. **Member Summary Endpoint**: Does `/members/report/summary` or `/customers/report/summary` exist?
   - **Decision needed**: Before Phase 1
   - **Impact**: Affects data fetching strategy

2. **Time-Series Data Availability**: Do endpoints support date range queries for charts?
   - **Decision needed**: Before Phase 2
   - **Impact**: Affects chart implementation approach

3. **Socket.io Events**: What payment-related socket events are currently available?
   - **Decision needed**: Before Phase 3
   - **Impact**: Affects real-time implementation

4. **Chart Data Granularity**: Should charts show daily, weekly, or monthly data points?
   - **Decision needed**: During Phase 2 design
   - **Impact**: Affects chart UX and backend query complexity

5. **Mobile Behavior**: Should charts be hidden, simplified, or full-featured on mobile?
   - **Decision needed**: During Phase 4 design
   - **Impact**: Affects responsive design approach
