<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Spin } from "ant-design-vue";
import DashboardHero from "./components/DashboardHero.vue";
import MetricCard from "./components/MetricCard.vue";
import FilterControls from "./components/FilterControls.vue";
import ActivityFeed from "./components/ActivityFeed.vue";
import LineChart from "../../../components/charts/LineChart.vue";
import PieChart from "../../../components/charts/PieChart.vue";
import AreaChart from "../../../components/charts/AreaChart.vue";
import { useDashboard } from "./composible";

const { t } = useI18n();

const {
  loading,
  error,
  stats,
  periodStats,
  fetchStats,
  refreshStats,
  clearCache,
} = useDashboard();

const selectedTimeRange = ref("today");

// Chart data for charts
const chartData = {
  userGrowth: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [120, 132, 101, 134, 90, 230, 210],
  },
  revenue: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [820, 932, 901, 934, 1290, 1330, 1320],
  },
  categoryDistribution: {
    labels: ["Users", "Content", "Payments", "System"],
    data: [300, 200, 150, 100],
  },
};

// Mock activity data for ActivityFeed
const activities = ref([
  {
    id: 1,
    type: "user" as const,
    title: "New user registered",
    time: "2 minutes ago",
    description: "John Doe created a new account",
  },
  {
    id: 2,
    type: "payment" as const,
    title: "Payment received",
    time: "15 minutes ago",
    description: "$1,250.00 payment from order #1234",
  },
  {
    id: 3,
    type: "content" as const,
    title: "Course published",
    time: "1 hour ago",
    description: "Advanced Vue.js course is now live",
  },
  {
    id: 4,
    type: "system" as const,
    title: "System update",
    time: "2 hours ago",
    description: "Server maintenance completed successfully",
  },
]);

// Event handlers
const handleTimeRangeChanged = (data: any) => {
  selectedTimeRange.value = data.range;
  fetchStats(data.range, data.category);
};

const handleCategoryChanged = (data: any) => {
  fetchStats(selectedTimeRange.value, data.category);
};

onMounted(() => {
  // Fetch fresh data
  clearCache();
  fetchStats("today", "all");
});
</script>

<template>
  <div class="dashboard">
    <!-- Hero Section -->
    <DashboardHero />

    <!-- Quick Stats Row -->
    <a-row :gutter="[20, 20]" class="metrics-row">
      <a-col
        v-for="metric in [
          {
            title: t('modules.dashboard.cards.totalUsers'),
            value: stats?.totalUsers || 0,
            icon: 'UserOutlined',
            color: '#1890ff',
            trend: periodStats?.users,
            onClick: () => fetchStats('today', 'users'),
          },
          {
            title: t('modules.dashboard.cards.totalRoles'),
            value: stats?.totalRoles || 0,
            icon: 'TeamOutlined',
            color: '#52c41a',
            trend: periodStats?.roles,
            onClick: () => fetchStats('today', 'roles'),
          },
          {
            title: t('modules.dashboard.cards.totalCourses'),
            value: stats?.totalCourses || 0,
            icon: 'BookOutlined',
            color: '#faad14',
            trend: periodStats?.courses,
            onClick: () => fetchStats('today', 'content'),
          },
          {
            title: t('modules.dashboard.cards.totalStudents'),
            value: stats?.totalStudents || 0,
            icon: 'ReadOutlined',
            color: '#eb2f96',
            trend: periodStats?.students,
            onClick: () => fetchStats('today', 'users'),
          },
          {
            title: t('modules.dashboard.cards.totalTeachers'),
            value: stats?.totalTeachers || 0,
            icon: 'SolutionOutlined',
            color: '#722ed1',
            trend: periodStats?.teachers,
            onClick: () => fetchStats('today', 'system'),
          },
        ]"
        :key="metric.title"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="4"
        :xl="4"
        class="metric-col"
      >
        <MetricCard
          :title="metric.title"
          :value="metric.value"
          :icon="metric.icon"
          :color="metric.color"
          :trend="metric.trend"
          :onClick="metric.onClick"
        />
      </a-col>
    </a-row>

    <!-- Filter Controls -->
    <FilterControls
      @timeRangeChanged="handleTimeRangeChanged"
      @categoryChanged="handleCategoryChanged"
      @filtersCleared="refreshStats"
    />

    <!-- Main Content Row -->
    <a-row :gutter="[24, 24]" class="content-row">
      <!-- Charts Column -->
      <a-col :xs="24" :lg="16">
        <!-- Charts Row -->
        <a-row :gutter="[24, 24]" class="charts-row">
          <!-- User Growth Line Chart -->
          <a-col :xs="24" :md="12">
            <a-card class="chart-card" hoverable>
              <template #title>
                <div class="card-title">
                  <span>{{ t("dashboard.charts.userGrowth") }}</span>
                  <span class="trend-badge">+12.5%</span>
                </div>
              </template>
              <LineChart
                :data="chartData.userGrowth.data"
                :labels="chartData.userGrowth.labels"
                color="#1890ff"
                :loading="loading"
              />
            </a-card>
          </a-col>

          <!-- Revenue Area Chart -->
          <a-col :xs="24" :md="12">
            <a-card class="chart-card" hoverable>
              <template #title>
                <div class="card-title">
                  <span>{{ t("dashboard.charts.revenue") }}</span>
                  <span class="trend-badge trend-up">+8.3%</span>
                </div>
              </template>
              <AreaChart
                :data="chartData.revenue.data"
                :labels="chartData.revenue.labels"
                color="#52c41a"
                :loading="loading"
              />
            </a-card>
          </a-col>
        </a-row>

        <!-- Category Distribution Row -->
        <a-row :gutter="[24, 24]" class="distribution-row">
          <!-- Category Distribution Pie Chart -->
          <a-col :xs="24" :md="12">
            <a-card class="chart-card" hoverable>
              <template #title>
                <div class="card-title">
                  <span>{{ t("dashboard.charts.categoryDistribution") }}</span>
                </div>
              </template>
              <PieChart
                :data="chartData.categoryDistribution.data"
                :labels="chartData.categoryDistribution.labels"
                :colors="['#1890ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1']"
                :loading="loading"
              />
            </a-card>
          </a-col>

          <!-- Summary Stats Card -->
          <a-col :xs="24" :md="12">
            <a-card class="stats-card" hoverable>
              <template #title>
                <div class="card-title">
                  <span>Quick Stats</span>
                </div>
              </template>
              <div class="stats-content">
                <div class="stat-item">
                  <span class="stat-label">Total Revenue</span>
                  <span class="stat-value">$12,543.00</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Active Users</span>
                  <span class="stat-value">1,234</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Conversion Rate</span>
                  <span class="stat-value">4.2%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Avg. Order Value</span>
                  <span class="stat-value">$89.50</span>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-col>

      <!-- Activity Feed Column -->
      <a-col :xs="24" :lg="8">
        <ActivityFeed :activities="activities" :maxItems="8" />
      </a-col>
    </a-row>

    <!-- Loading State -->
    <div v-if="loading" class="loading-wrapper">
      <Spin size="large">
        <template #indicator>
          <a-icon type="loading" style="font-size: 24px" spin />
        </template>
        {{ t("common.loading") }}
      </Spin>
    </div>

    <!-- Error State -->
    <a-alert
      v-if="error"
      type="error"
      :message="error"
      show-icon
      closable
      @close="error = ''"
      class="error-alert"
    >
      <template #action>
        <a-button type="link" size="small" @click="refreshStats">
          {{ t("common.retry") }}
        </a-button>
      </template>
    </a-alert>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.metrics-row {
  margin-bottom: 32px;
}

.metric-col {
  margin-bottom: 16px;
}

.content-row {
  margin-bottom: 24px;
}

.charts-row {
  margin-bottom: 24px;
}

.distribution-row {
  margin-bottom: 24px;
}

.chart-card {
  height: 380px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.chart-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #0d334a;
}

.trend-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.trend-up {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.stats-card {
  height: 380px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.stats-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(4px);
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #0d334a;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
}

.error-alert {
  margin-bottom: 24px;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .chart-card,
  .stats-card {
    height: 340px;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }

  .metrics-row {
    margin-bottom: 24px;
  }

  .chart-card,
  .stats-card {
    height: 300px;
  }

  .card-title {
    font-size: 14px;
  }
}
</style>
