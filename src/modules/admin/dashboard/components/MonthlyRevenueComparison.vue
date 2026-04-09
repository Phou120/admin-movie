<script setup lang="ts">
import { computed } from "vue";
import BarChart from "../../../../components/charts/BarChart.vue";
import { useI18n } from "vue-i18n";

interface MonthlyRevenue {
  month: string;
  current: number;
  previous: number;
  yearAgo: number;
}

interface Props {
  data: MonthlyRevenue[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const { t } = useI18n();

const chartData = computed(() => ({
  labels: props.data.map((d) => d.month),
  data: props.data.map((d) => d.current),
  data2: props.data.map((d) => d.previous),
  data3: props.data.map((d) => d.yearAgo),
}));

// Calculate growth percentage
const calculateGrowth = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const currentMonthGrowth = computed(() => {
  if (props.data.length === 0) return 0;
  const latest = props.data[props.data.length - 1];
  return calculateGrowth(latest.current, latest.previous);
});
</script>

<template>
  <a-card hoverable class="chart-card">
    <template #title>
      <div class="chart-header">
        <span class="chart-title">
          📊 {{ t("dashboard.analytics.monthlyRevenue") }}
        </span>
        <a-tag
          v-if="!loading && data.length > 0"
          :color="currentMonthGrowth >= 0 ? 'success' : 'error'"
        >
          {{ currentMonthGrowth >= 0 ? "+" : ""
          }}{{ currentMonthGrowth.toFixed(1) }}%
        </a-tag>
      </div>
    </template>

    <div class="chart-legend">
      <span class="legend-item current">{{ t("dashboard.thisMonth") }}</span>
      <span class="legend-item previous">{{ t("dashboard.lastMonth") }}</span>
      <span class="legend-item year-ago">{{ t("dashboard.yearAgo") }}</span>
    </div>

    <BarChart
      v-if="!loading && data.length > 0"
      :data="chartData.data"
      :data2="chartData.data2"
      :data3="chartData.data3"
      :labels="chartData.labels"
      color="#1890ff"
      color2="#8c8c8c"
      color3="#d9d9d9"
    />

    <a-spin v-if="loading" :spinning="loading">
      <div class="chart-placeholder" />
    </a-spin>

    <a-empty
      v-if="!loading && data.length === 0"
      :description="t('dashboard.noData')"
    />
  </a-card>
</template>

<style scoped>
.chart-card {
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #0d334a;
}

.chart-legend {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
}

.legend-item.current {
  color: #1890ff;
}

.legend-item.previous {
  color: #8c8c8c;
}

.legend-item.year-ago {
  color: #d9d9d9;
}

.chart-placeholder {
  height: 250px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
