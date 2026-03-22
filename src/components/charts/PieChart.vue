<script setup lang="ts">
import { computed } from "vue";
import type { EChartsCoreOption } from "echarts/core";
import BaseChart from "./BaseChart.vue";

interface Props {
  data: number[];
  labels: string[];
  colors?: string[];
  donut?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ["#1890ff", "#52c41a", "#faad14", "#eb2f96", "#722ed1"],
  donut: false,
});

const chartOption = computed<EChartsCoreOption>(() => ({
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderColor: "#ccc",
    borderWidth: 1,
    textStyle: {
      color: "#333",
      fontSize: 14,
    },
    formatter: (params: any) => {
      const value = params.value;
      const percentage = params.percent;
      return `<strong>${params.name}</strong><br/>${value} (${percentage}%)`;
    },
  },
  legend: {
    orient: "vertical",
    right: "right",
    top: "center",
    textStyle: {
      color: "#666",
      fontSize: 13,
    },
    itemGap: 12,
  },
  series: [
    {
      name: "Distribution",
      type: "pie",
      radius: props.donut ? ["40%", "70%"] : [0, "75%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: "bold",
          color: "#333",
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: "rgba(0,0,0,0.5)",
        },
      },
      labelLine: {
        show: false,
      },
      data: props.data.map((value, index) => ({
        value,
        name: props.labels[index],
        itemStyle: {
          color: props.colors[index % props.colors.length],
        },
      })),
    },
  ],
}));
</script>

<template>
  <BaseChart :option="chartOption" :height="props.donut ? '300px' : '400px'" />
</template>
