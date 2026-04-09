<script setup lang="ts">
import { computed } from "vue";
import BarChart from "../../../../components/charts/BarChart.vue";
import { useI18n } from "vue-i18n";

interface PackageTier {
  tier: string;
  members: number;
}

interface Props {
  data: PackageTier[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const { t } = useI18n();

const chartData = computed(() => ({
  labels: props.data.map((d) => d.tier),
  data: props.data.map((d) => d.members),
}));

defineEmits<{
  barClick: [tier: string];
}>();
</script>

<template>
  <a-card hoverable class="chart-card">
    <template #title>
      <span class="chart-title">
        🎯 {{ t("dashboard.analytics.memberEngagement") }}
      </span>
    </template>

    <BarChart
      v-if="!loading && data.length > 0"
      :data="chartData.data"
      :labels="chartData.labels"
      color="#722ed1"
      horizontal
      @on-click="(index) => $emit('barClick', data[index].tier)"
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
