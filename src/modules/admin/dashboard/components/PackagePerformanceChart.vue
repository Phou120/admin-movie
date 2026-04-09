<script setup lang="ts">
import { computed } from "vue";
import BarChart from "../../../../components/charts/BarChart.vue";
import { useI18n } from "vue-i18n";

interface PackagePerformance {
  type: string;
  active: number;
  pending: number;
  total_revenue: number;
}

interface Props {
  data: PackagePerformance[];
  loading?: boolean;
  metric?: "subscriptions" | "revenue";
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  metric: "subscriptions",
});

const { t } = useI18n();

const chartData = computed(() => {
  if (props.metric === "subscriptions") {
    return {
      labels: props.data.map((d) => d.type),
      data: props.data.map((d) => d.active),
      data2: props.data.map((d) => d.pending),
    };
  } else {
    return {
      labels: props.data.map((d) => d.type),
      data: props.data.map((d) => d.total_revenue),
    };
  }
});

defineEmits<{
  barClick: [type: string];
}>();
</script>

<template>
  <a-card hoverable class="chart-card">
    <template #title>
      <span class="chart-title">
        📊 {{ t("dashboard.analytics.packagePerformance") }}
      </span>
    </template>

    <BarChart
      v-if="!loading && data.length > 0"
      :data="chartData.data"
      :labels="chartData.labels"
      color="#1890ff"
      :data2="metric === 'subscriptions' ? chartData.data2 : undefined"
      color2="#faad14"
      @on-click="(index) => $emit('barClick', data[index].type)"
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
