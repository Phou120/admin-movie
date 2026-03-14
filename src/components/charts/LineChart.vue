<script setup lang="ts">
import { computed } from "vue";
import type { EChartsCoreOption } from "echarts/core";
import * as echarts from "echarts";
import BaseChart from "./BaseChart.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  data: number[];
  labels: string[];
  color?: string;
  smooth?: boolean;
  area?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: "#1890ff",
  smooth: true,
  area: false,
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
    type: "category",
    data: props.labels,
    axisLine: {
      lineStyle: { color: "rgba(0,0,0,0.1)" },
    },
    axisLabel: {
      color: "#666",
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      lineStyle: { color: "rgba(0,0,0,0.1)" },
    },
    axisLabel: {
      color: "#666",
    },
    splitLine: {
      lineStyle: { color: "rgba(0,0,0,0.05)" },
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: "#1890ff",
    textStyle: {
      color: "#fff",
    },
    formatter: (params: any) => {
      return `<strong>${params.name}</strong><br/>${params.value}`;
    },
  },
  series: [
    {
      name: t("dashboard.charts.series.value"),
      type: "line",
      smooth: props.smooth,
      data: props.data,
      showSymbol: true,
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: props.color,
      },
      itemStyle: {
        color: props.color,
      },
      areaStyle: props.area
        ? {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 0, [
              { offset: 0, color: props.color },
              { offset: 1, color: `${props.color}10` },
            ]),
          }
        : undefined,
    },
  ],
}));
</script>

<template>
  <BaseChart :option="chartOption" />
</template>
