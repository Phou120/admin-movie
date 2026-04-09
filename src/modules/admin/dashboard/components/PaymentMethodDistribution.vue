<script setup lang="ts">
import { computed } from "vue";
import BarChart from "../../../../components/charts/BarChart.vue";
import { useI18n } from "vue-i18n";

interface PaymentMethodData {
  method: string;
  amount: number;
  percentage: number;
}

interface Props {
  data: PaymentMethodData[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const { t } = useI18n();

const chartData = computed(() => ({
  labels: props.data.map((d) => d.method),
  data: props.data.map((d) => d.amount),
}));

const chartColors = [
  "#1890ff",
  "#52c41a",
  "#faad14",
  "#722ed1",
  "#eb2f96",
];
</script>

<template>
  <a-card hoverable class="chart-card">
    <template #title>
      <span class="chart-title">
        💳 {{ t("dashboard.analytics.paymentMethods") }}
      </span>
    </template>

    <BarChart
      v-if="!loading && data.length > 0"
      :data="chartData.data"
      :labels="chartData.labels"
      :colors="chartColors"
      horizontal
    />

    <!-- Legend with percentages -->
    <div v-if="!loading && data.length > 0" class="method-details">
      <div v-for="(item, index) in data" :key="item.method" class="method-item">
        <span
          class="method-color"
          :style="{ background: chartColors[index % chartColors.length] }"
        />
        <span class="method-name">{{ item.method }}</span>
        <span class="method-percentage">{{ item.percentage.toFixed(1) }}%</span>
      </div>
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

.method-details {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.method-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.method-name {
  flex: 1;
  color: #666;
}

.method-percentage {
  font-weight: 600;
  color: #0d334a;
}
</style>
