<script setup lang="ts">
import { computed } from "vue";
import LineChart from "../../../../components/charts/LineChart.vue";
import { useI18n } from "vue-i18n";

interface ApprovalRateData {
  date: string;
  rate: number;
}

interface Props {
  data: ApprovalRateData[];
  loading?: boolean;
  threshold?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  threshold: 80,
});

const { t } = useI18n();

const chartData = computed(() => ({
  labels: props.data.map((d) => d.date),
  data: props.data.map((d) => d.rate),
}));

// Check if rate is below threshold
const isBelowThreshold = computed(() => {
  if (props.data.length === 0) return false;
  const latestRate = props.data[props.data.length - 1].rate;
  return latestRate < props.threshold;
});

const thresholdColor = computed(() =>
  isBelowThreshold.value ? "#ff4d4f" : "#52c41a"
);
</script>

<template>
  <a-card hoverable class="chart-card">
    <template #title>
      <div class="chart-header">
        <span class="chart-title">
          📈 {{ t("dashboard.analytics.approvalRate") }}
        </span>
        <a-tag
          v-if="!loading && data.length > 0"
          :color="isBelowThreshold ? 'error' : 'success'"
        >
          {{ t("dashboard.threshold") }}: {{ threshold }}%
        </a-tag>
      </div>
    </template>

    <LineChart
      v-if="!loading && data.length > 0"
      :data="chartData.data"
      :labels="chartData.labels"
      :color="thresholdColor"
      :smooth="true"
    />

    <div v-if="isBelowThreshold" class="threshold-warning">
      <a-alert
        :message="t('dashboard.lowApprovalRate')"
        :description="t('dashboard.lowApprovalRateDesc')"
        type="warning"
        show-icon
      />
    </div>

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

.chart-placeholder {
  height: 250px;
  background: #f5f5f5;
  border-radius: 8px;
}

.threshold-warning {
  margin-top: 16px;
}
</style>
