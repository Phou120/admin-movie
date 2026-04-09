<script setup lang="ts">
import { computed, ref } from "vue";
import AreaChart from "../../../../components/charts/AreaChart.vue";
import { useI18n } from "vue-i18n";

interface PackageDataPoint {
  date: string;
  revenue: number;
}

interface Props {
  data: PackageDataPoint[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const { t } = useI18n();

const selectedRange = ref("30d");

const ranges = computed(() => [
  { value: "7d", label: t("dashboard.time.range7Days") },
  { value: "30d", label: t("dashboard.time.range30Days") },
  { value: "90d", label: t("dashboard.time.range90Days") },
]);

const emit = defineEmits<{
  rangeChange: [range: string];
}>();

const chartData = computed(() => ({
  labels: props.data.map((d) => d.date),
  data: props.data.map((d) => d.revenue),
}));

const handleRangeChange = (range: string) => {
  selectedRange.value = range;
  emit("rangeChange", range);
};
</script>

<template>
  <a-card hoverable class="chart-card">
    <template #title>
      <div class="chart-header">
        <span class="chart-title">
          📦 {{ t("dashboard.analytics.packageRevenue") }}
        </span>
        <a-select
          v-model:value="selectedRange"
          size="small"
          style="width: 120px"
          @change="handleRangeChange"
        >
          <a-select-option
            v-for="range in ranges"
            :key="range.value"
            :value="range.value"
          >
            {{ range.label }}
          </a-select-option>
        </a-select>
      </div>
    </template>

    <AreaChart
      v-if="!loading && data.length > 0"
      :data="chartData.data"
      :labels="chartData.labels"
      color="#52c41a"
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
</style>
