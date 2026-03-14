<script setup lang="ts">
import { computed } from "vue";
import type { EChartsCoreOption } from "echarts/core";
import BaseChart from "./BaseChart.vue";

interface Props {
  data: number[];
  labels: string[];
  colors?: string[];
  horizontal?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ["#1890ff"],
  horizontal: false,
});

const chartOption = computed<EChartsCoreOption>(() => ({
  grid: {
    top: "10%",
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: props.horizontal ? "value" : "category",
    data: props.horizontal ? undefined : props.labels,
    axisLine: {
      lineStyle: { color: "rgba(0,0,0,0.1)" },
    },
    axisLabel: {
      color: "#666",
    },
  },
  yAxis: {
    type: props.horizontal ? "category" : "value",
    data: props.horizontal ? props.labels : undefined,
    axisLine: {
      lineStyle: { color: "rgba(0,0,0,0.1)" },
    },
    axisLabel: {
      color: "#666",
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(255,255,255,0.9)",
    textStyle: {
      color: "#fff",
    },
    formatter: (params: any) => {
      return `<strong>${params.name}</strong><br/>${params.value}`;
    },
  },
  series: props.data.map((item, index) => ({
    name: props.labels[index] || `Category ${index + 1}`,
    type: "bar",
    data: [item],
    itemStyle: {
      color: props.colors[index % props.colors.length],
      borderRadius: [4, 4, 0, 0],
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: "rgba(0,0,0,0.5)",
      },
    },
    label: props.horizontal
      ? {
          show: true,
          position: "right",
          valueAnimation: true,
        }
      : {
          show: true,
          position: "top",
          valueAnimation: true,
        },
  })),
}));
</script>

<template>
  <BaseChart
    :option="chartOption"
    :height="props.horizontal ? '300px' : '400px'"
  />
</template>
