<script setup lang="ts">
import { computed } from "vue";
import LineChart from "../../../../components/charts/LineChart.vue";
import { useI18n } from "vue-i18n";

interface GrowthDataPoint {
  date: string;
  current: number;
  previous?: number;
}

interface Props {
  data: GrowthDataPoint[];
  loading?: boolean;
  showComparison?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showComparison: true,
});

const { t } = useI18n();

const chartData = computed(() => {
  if (props.showComparison && props.data.some((d) => d.previous !== undefined)) {
    return {
      labels: props.data.map((d) => d.date),
      data: props.data.map((d) => d.current),
      data2: props.data.map((d) => d.previous || 0),
    };
  }
  return {
    labels: props.data.map((d) => d.date),
    data: props.data.map((d) => d.current),
  };
});
</script>

<template>
  <a-card hoverable class="chart-card">
    <template #title>
      <span class="chart-title">
        📈 {{ t("dashboard.analytics.memberGrowth") }}
      </span>
    </template>

    <LineChart
      v-if="!loading && data.length > 0"
      :data="chartData.data"
      :data2="showComparison ? chartData.data2 : undefined"
      :labels="chartData.labels"
      color="#1890ff"
      color2="#d9d9d9"
      :smooth="true"
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

.chart-placeholder {
  height: 250px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
