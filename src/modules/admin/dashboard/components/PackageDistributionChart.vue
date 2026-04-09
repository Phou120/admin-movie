<script setup lang="ts">
import { computed } from "vue";
import PieChart from "../../../../components/charts/PieChart.vue";
import { useI18n } from "vue-i18n";

interface PackageDistribution {
  type: string;
  count: number;
  revenue: number;
}

interface Props {
  data: PackageDistribution[];
  loading?: boolean;
  mode?: "count" | "revenue";
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  mode: "revenue",
});

const { t } = useI18n();

const chartData = computed(() => ({
  labels: props.data.map((d) => d.type),
  data: props.data.map((d) => (props.mode === "revenue" ? d.revenue : d.count)),
}));

const chartColors = [
  "#1890ff", // Blue
  "#52c41a", // Green
  "#faad14", // Gold
  "#eb2f96", // Magenta
  "#722ed1", // Purple
];

const emit = defineEmits<{
  segmentClick: [type: string];
}>();

const handleSegmentClick = (index: number) => {
  emit("segmentClick", props.data[index].type);
};
</script>

<template>
  <a-card hoverable class="chart-card">
    <template #title>
      <span class="chart-title">
        🥧 {{ t("dashboard.analytics.packageDistribution") }}
      </span>
    </template>

    <PieChart
      v-if="!loading && data.length > 0"
      :data="chartData.data"
      :labels="chartData.labels"
      :colors="chartColors"
      @on-click="handleSegmentClick"
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
