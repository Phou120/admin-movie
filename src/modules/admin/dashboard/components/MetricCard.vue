<script setup lang="ts">
import { computed } from "vue";
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from "@ant-design/icons-vue";

interface Props {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  onClick?: () => void;
}

const props = defineProps<Props>();

const trendIcon = computed(() => {
  if (!props.trend) return MinusOutlined;
  if (props.trend.direction === "up") return ArrowUpOutlined;
  if (props.trend.direction === "down") return ArrowDownOutlined;
  return MinusOutlined;
});

const trendColor = computed(() => {
  if (!props.trend) return "#8c8c8c";
  if (props.trend.direction === "up") return "#52c41a";
  if (props.trend.direction === "down") return "#ff4d4f";
  return "#8c8c8c";
});

const trendLabel = computed(() => {
  if (!props.trend) return "";
  const absValue = Math.abs(props.trend.value);
  const sign = props.trend.direction === "up" ? "+" : props.trend.direction === "down" ? "-" : "";
  return `${sign}${absValue}%`;
});

const isPositiveTrend = computed(() => props.trend?.direction === "up");
const isNegativeTrend = computed(() => props.trend?.direction === "down");
</script>

<template>
  <a-card class="metric-card" :hoverable="!!props.onClick" @click="props.onClick">
    <div class="card-content">
      <div class="card-header">
        <div class="icon-wrapper" :style="{ '--icon-color': props.color }">
          <component :is="props.icon" class="card-icon" />
        </div>
        <component :is="trendIcon" class="trend-icon" :style="{ color: trendColor }" />
      </div>
      <div class="card-body">
        <h3 class="card-title">{{ props.title }}</h3>
        <div class="metric-value-wrapper">
          <a-statistic
            :value="props.value"
            :value-style="{ fontSize: '36px', fontWeight: '800', color: '#0d334a' }"
          />
        </div>
        <div v-if="props.trend" class="metric-trend">
          <span class="trend-label" :style="{ color: trendColor }">
            {{ trendLabel }}
          </span>
          <span class="trend-text">
            {{ isPositiveTrend ? 'vs last period' : isNegativeTrend ? 'vs last period' : 'No change' }}
          </span>
        </div>
      </div>
    </div>
  </a-card>
</template>

<style scoped lang="scss">
.metric-card {
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2);
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.metric-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.metric-card:hover::before {
  opacity: 1;
}

.metric-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.95);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--icon-color);
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.metric-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.card-icon {
  font-size: 28px;
  color: #fff;
}

.trend-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;
}

.metric-card:hover .trend-icon {
  transform: scale(1.15);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #5a5a5a;
  margin: 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.metric-value-wrapper {
  display: flex;
  align-items: baseline;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  width: fit-content;
}

.trend-label {
  font-size: 16px;
  font-weight: 800;
  padding: 0 4px;
}

.trend-text {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .metric-card {
    border-radius: 12px;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }

  .card-icon {
    font-size: 24px;
  }

  .trend-icon {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}
</style>
