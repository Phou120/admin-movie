<script setup lang="ts">
interface Props {
  variant?: "card" | "chart" | "text";
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "card",
  count: 1,
});
</script>

<template>
  <div class="skeleton-loader" :class="`skeleton-${props.variant}`">
    <template v-for="i in props.count" :key="i">
      <!-- Card Skeleton -->
      <div v-if="variant === 'card' || variant === 'chart'" class="skeleton-card">
        <div class="skeleton-header">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-title"></div>
        </div>
        <div class="skeleton-body">
          <div class="skeleton-value"></div>
        </div>
      </div>

      <!-- Chart Skeleton -->
      <div v-if="variant === 'chart'" class="skeleton-chart">
        <div class="skeleton-chart-bar" v-for="n in 5" :key="'bar-' + n"></div>
      </div>

      <!-- Text Skeleton -->
      <div v-if="variant === 'text'" class="skeleton-text">
        <div class="skeleton-line" v-for="n in 3" :key="'line-' + n"></div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.skeleton-loader {
  display: grid;
  gap: 16px;
}

.skeleton-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 16px;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f 25%, #e0e0e 50%, #f0f0f 75%);
  background-size: 200% 200%;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-title {
  width: 120px;
  height: 20px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-body {
  display: flex;
  gap: 16px;
}

.skeleton-value {
  width: 100px;
  height: 32px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-chart {
  height: 200px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  animation: shimmer 2s ease-in-out infinite;
}

.skeleton-text {
  height: 16px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
