<script setup lang="ts">
import { computed } from "vue";
import AreaChart from "../../../../components/charts/AreaChart.vue";
import { useI18n } from "vue-i18n";

interface RevenueDataPoint {
  date: string;
  approved: number;
  pending: number;
  rejected: number;
}

interface Props {
  data: RevenueDataPoint[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const { t } = useI18n();

const chartData = computed(() => ({
  labels: props.data.map((d) => d.date),
  data: props.data.map((d) => d.approved),
  data2: props.data.map((d) => d.pending),
  data3: props.data.map((d) => d.rejected),
}));
</script>

<template>
  <a-card hoverable class="chart-card">
    <template #title>
      <span class="chart-title">
        💰 {{ t("dashboard.analytics.revenueTrend") }}
      </span>
    </template>

    <div class="chart-legend">
      <span class="legend-item approved">{{ t("dashboard.approved") }}</span>
      <span class="legend-item pending">{{ t("dashboard.pending") }}</span>
      <span class="legend-item rejected">{{ t("dashboard.rejected") }}</span>
    </div>

    <AreaChart
      v-if="!loading && data.length > 0"
      :data="chartData.data"
      :data2="chartData.data2"
      :data3="chartData.data3"
      :labels="chartData.labels"
      color="#52c41a"
      color2="#faad14"
      color3="#ff4d4f"
      :smooth="true"
      :area="true"
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

.legend-item::before {
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-item.approved::before {
  background: #52c41a;
}

.legend-item.pending::before {
  background: #faad14;
}

.legend-item.rejected::before {
  background: #ff4d4f;
}

.chart-placeholder {
  height: 250px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
