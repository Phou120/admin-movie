<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

interface RetentionMetrics {
  renewalRate: number;
  churnRate: number;
  period: string;
}

interface Props {
  data: RetentionMetrics;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  data: () => ({ renewalRate: 0, churnRate: 0, period: "30d" }),
});

const { t } = useI18n();

const isGoodRenewalRate = computed(() => props.data.renewalRate >= 70);
const isGoodChurnRate = computed(() => props.data.churnRate <= 10);
</script>

<template>
  <a-card hoverable class="metrics-card">
    <template #title>
      <span class="chart-title">
        🔄 {{ t("dashboard.analytics.retention") }}
      </span>
    </template>

    <div v-if="!loading" class="metrics-content">
      <div class="metric-item">
        <div class="metric-header">
          <span class="metric-label">{{ t("dashboard.renewalRate") }}</span>
          <a-tag
            :color="isGoodRenewalRate ? 'success' : 'warning'"
            class="metric-tag"
          >
            {{ data.renewalRate.toFixed(1) }}%
          </a-tag>
        </div>
        <a-progress
          :percent="data.renewalRate"
          :stroke-color="isGoodRenewalRate ? '#52c41a' : '#faad14'"
          :show-info="false"
        />
      </div>

      <div class="metric-item">
        <div class="metric-header">
          <span class="metric-label">{{ t("dashboard.churnRate") }}</span>
          <a-tag
            :color="isGoodChurnRate ? 'success' : 'error'"
            class="metric-tag"
          >
            {{ data.churnRate.toFixed(1) }}%
          </a-tag>
        </div>
        <a-progress
          :percent="data.churnRate"
          :stroke-color="isGoodChurnRate ? '#52c41a' : '#ff4d4f'"
          :show-info="false"
        />
      </div>

      <div v-if="data.churnRate > 10" class="churn-warning">
        <a-alert
          :message="t('dashboard.highChurnWarning')"
          type="warning"
          show-icon
          closable
        >
          <template #description>
            {{ t("dashboard.highChurnWarningDesc") }}
          </template>
        </a-alert>
      </div>
    </div>

    <a-spin v-if="loading" :spinning="loading">
      <div class="chart-placeholder" />
    </a-spin>
  </a-card>
</template>

<style scoped>
.metrics-card {
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.metrics-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #0d334a;
}

.metrics-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.metric-tag {
  font-weight: 600;
}

.churn-warning {
  margin-top: 8px;
}

.chart-placeholder {
  height: 150px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>
