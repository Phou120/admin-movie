<script setup lang="ts">
import { computed } from "vue";
import PieChart from "../../../../components/charts/PieChart.vue";
import { useI18n } from "vue-i18n";

interface MemberStatus {
  status: string;
  count: number;
}

interface Props {
  data: MemberStatus[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const { t } = useI18n();

const chartData = computed(() => ({
  labels: props.data.map((d) => getStatusLabel(d.status)),
  data: props.data.map((d) => d.count),
}));

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: t("dashboard.active"),
    inactive: t("dashboard.inactive"),
    pending: t("dashboard.pending"),
    suspended: t("dashboard.suspended"),
  };
  return labels[status] || status;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: "#52c41a",
    inactive: "#ff4d4f",
    pending: "#faad14",
    suspended: "#8c8c8c",
  };
  return colors[status] || "#d9d9d9";
};

const chartColors = computed(() =>
  props.data.map((d) => getStatusColor(d.status))
);

const emit = defineEmits<{
  segmentClick: [status: string];
}>();

const handleSegmentClick = (index: number) => {
  emit("segmentClick", props.data[index].status);
};
</script>

<template>
  <a-card hoverable class="chart-card">
    <template #title>
      <span class="chart-title">
        👥 {{ t("dashboard.analytics.memberStatus") }}
      </span>
    </template>

    <PieChart
      v-if="!loading && data.length > 0"
      :data="chartData.data"
      :labels="chartData.labels"
      :colors="chartColors"
      @on-click="handleSegmentClick"
    />

    <!-- Legend with counts -->
    <div v-if="!loading && data.length > 0" class="status-legend">
      <div
        v-for="item in data"
        :key="item.status"
        class="status-item"
        @click="$emit('segmentClick', item.status)"
      >
        <span
          class="status-color"
          :style="{ background: getStatusColor(item.status) }"
        />
        <span class="status-label">{{ getStatusLabel(item.status) }}</span>
        <span class="status-count">{{ item.count }}</span>
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

.status-legend {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.status-item:hover {
  background: #f5f5f5;
}

.status-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.status-label {
  flex: 1;
  color: #666;
}

.status-count {
  font-weight: 600;
  color: #0d334a;
}
</style>
