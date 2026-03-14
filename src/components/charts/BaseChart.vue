<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted, ref, watchEffect } from "vue";
import * as echarts from "echarts";
import type { EChartsCoreOption } from "echarts/core";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  option: EChartsCoreOption;
  height?: string;
  autoResize?: boolean;
  theme?: "light" | "dark";
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: "400px",
  autoResize: true,
  theme: "light",
  loading: false,
});

const chartRef = ref<HTMLElement>();
let chartInstance: echarts.ECharts | null = null;

// Responsive theme based on CSS variable
const isDarkTheme = ref(false);

const checkTheme = () => {
  isDarkTheme.value = getComputedStyle(document.documentElement)
    .getPropertyValue("--ant-design-primary") === "#1f1f1f" || false;
};

// Computed chart option with theme
const chartOption = computed(() => {
  const baseOption = { ...props.option };

  // Apply theme colors
  if (isDarkTheme.value) {
    baseOption.backgroundColor = "transparent";
  }

  return baseOption;
});

// Initialize chart on mount
onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value, isDarkTheme.value ? "dark" : "light");
    chartInstance.setOption(chartOption.value);

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      checkTheme();
      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = echarts.init(chartRef.value, isDarkTheme.value ? "dark" : "light");
        chartInstance.setOption(chartOption.value);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    onUnmounted(() => {
      observer.disconnect();
    });
  }
});

// Update chart when option changes
watch(
  () => props.option,
  (newOption) => {
    if (chartInstance) {
      chartInstance.setOption(newOption);
    }
  },
  { deep: true }
);

// Handle resize
watchEffect(() => {
  if (props.autoResize && chartInstance) {
    chartInstance.resize();
  }
});

// Show loading state
watchEffect(() => {
  if (chartInstance) {
    if (props.loading) {
      chartInstance.showLoading({
        text: t("common.loading"),
        color: isDarkTheme.value ? "#fff" : "#0d334a",
        textColor: isDarkTheme.value ? "#fff" : "#0d334a",
        maskColor: isDarkTheme.value ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,255,0.7)",
        zlevel: 0,
      });
    } else {
      chartInstance.hideLoading();
    }
  }
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});

// Expose methods for parent components
defineExpose({
  getChart: () => chartInstance,
  resize: () => chartInstance?.resize(),
  clear: () => chartInstance?.clear(),
});
</script>

<template>
  <div
    ref="chartRef"
    class="base-chart"
    :style="{ height: props.height }"
  ></div>
</template>

<style scoped>
.base-chart {
  width: 100%;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  :deep(.echarts-tooltip) {
    background-color: rgba(31, 31, 31, 0.95) !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
    color: rgba(255, 255, 255, 0.9) !important;
  }
}
</style>
