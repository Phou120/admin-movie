<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { message, Card, Row, Col, Button } from "ant-design-vue";
import { ReloadOutlined } from "@ant-design/icons-vue";
import BaseChart from "../../../components/charts/BaseChart.vue";
import { DashboardChartComposible } from "./composible/dashboard-chart";

const { t } = useI18n();
const { fetchMonthlyIncome, fetchMonthlyExpenses, loadingIncome, loadingExpenses } =
  DashboardChartComposible();

const loading = computed(() => loadingIncome.value || loadingExpenses.value);

// Year filter
const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

// Raw API data (month: 1-12, amount)
const incomeData = ref<{ month: number; amount: number }[]>([]);
const expensesData = ref<{ month: number; amount: number }[]>([]);

const monthKeys = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

const translatedMonths = computed(() =>
  monthKeys.map((key) => t(`dashboard.months.${key}`))
);

// Map API data (month 1-12) to amounts array aligned with month index 0-11
const getAmountForMonth = (data: { month: number; amount: number }[], monthIndex: number) => {
  const found = data.find((d) => d.month === monthIndex + 1);
  return found ? found.amount : 0;
};

const monthlyIncome = computed(() =>
  translatedMonths.value.map((name, i) => ({
    month: name,
    amount: getAmountForMonth(incomeData.value, i),
  }))
);

const monthlyExpenses = computed(() =>
  translatedMonths.value.map((name, i) => ({
    month: name,
    amount: getAmountForMonth(expensesData.value, i),
  }))
);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("lo-LA", {
    style: "currency",
    currency: "LAK",
    maximumFractionDigits: 0,
  }).format(value);
};

// Income chart ECharts option
const incomeChartOption = computed(() => ({
  grid: {
    top: "10%",
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: monthlyIncome.value.map((d) => d.month),
    axisLine: { lineStyle: { color: "rgba(0,0,0,0.1)" } },
    axisLabel: { color: "#666" },
  },
  yAxis: {
    type: "value",
    axisLine: { lineStyle: { color: "rgba(0,0,0,0.1)" } },
    axisLabel: {
      color: "#666",
      formatter: (val: number) => {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
        return val.toString();
      },
    },
    splitLine: { lineStyle: { color: "rgba(0,0,0,0.05)" } },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderColor: "#52c41a",
    borderWidth: 1,
    textStyle: { color: "#333" },
    formatter: (params: any) => {
      const p = Array.isArray(params) ? params[0] : params;
      return `<strong>${p.name}</strong><br/>${formatCurrency(p.value)}`;
    },
  },
  series: [
    {
      name: t("dashboard.income"),
      type: "bar",
      data: monthlyIncome.value.map((d) => d.amount),
      itemStyle: {
        color: "#52c41a",
        borderRadius: [4, 4, 0, 0],
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(82, 196, 26, 0.3)",
        },
      },
    },
  ],
}));

// Expenses chart ECharts option
const expensesChartOption = computed(() => ({
  grid: {
    top: "10%",
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: monthlyExpenses.value.map((d) => d.month),
    axisLine: { lineStyle: { color: "rgba(0,0,0,0.1)" } },
    axisLabel: { color: "#666" },
  },
  yAxis: {
    type: "value",
    axisLine: { lineStyle: { color: "rgba(0,0,0,0.1)" } },
    axisLabel: {
      color: "#666",
      formatter: (val: number) => {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
        return val.toString();
      },
    },
    splitLine: { lineStyle: { color: "rgba(0,0,0,0.05)" } },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderColor: "#ff4d4f",
    borderWidth: 1,
    textStyle: { color: "#333" },
    formatter: (params: any) => {
      const p = Array.isArray(params) ? params[0] : params;
      return `<strong>${p.name}</strong><br/>${formatCurrency(p.value)}`;
    },
  },
  series: [
    {
      name: t("dashboard.expenses"),
      type: "bar",
      data: monthlyExpenses.value.map((d) => d.amount),
      itemStyle: {
        color: "#ff4d4f",
        borderRadius: [4, 4, 0, 0],
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(255, 77, 79, 0.3)",
        },
      },
    },
  ],
}));

const loadData = async () => {
  const [income, expenses] = await Promise.all([
    fetchMonthlyIncome(selectedYear.value),
    fetchMonthlyExpenses(selectedYear.value),
  ]);
  incomeData.value = income;
  expensesData.value = expenses;
};

const handleYearChange = () => {
  loadData();
};

const handleRefresh = () => {
  loadData();
  message.success(t("dashboard.dataRefreshed"));
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <h2 class="dashboard-title">{{ t("sidebar.dashboard") }}</h2>
      <div class="dashboard-actions">
        <a-select
          v-model:value="selectedYear"
          class="year-select"
          @change="handleYearChange"
        >
          <a-select-option v-for="year in yearOptions" :key="year" :value="year">
            {{ year }}
          </a-select-option>
        </a-select>
        <Button @click="handleRefresh" :loading="loading">
          <template #icon>
            <ReloadOutlined />
          </template>
          {{ t("dashboard.refresh") }}
        </Button>
      </div>
    </div>

    <!-- Charts -->
    <Row :gutter="[24, 24]">
      <!-- Income Chart -->
      <Col :xs="24" :lg="12">
        <Card class="chart-card" hoverable>
          <template #title>
            <span class="chart-title chart-title--income">
              {{ t("dashboard.income") }}
            </span>
          </template>
          <a-spin :spinning="loadingIncome">
            <BaseChart
              :option="incomeChartOption"
              height="380px"
              :loading="loadingIncome"
            />
          </a-spin>
        </Card>
      </Col>

      <!-- Expenses Chart -->
      <Col :xs="24" :lg="12">
        <Card class="chart-card" hoverable>
          <template #title>
            <span class="chart-title chart-title--expenses">
              {{ t("dashboard.expenses") }}
            </span>
          </template>
          <a-spin :spinning="loadingExpenses">
            <BaseChart
              :option="expensesChartOption"
              height="380px"
              :loading="loadingExpenses"
            />
          </a-spin>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.year-select {
  width: 100px;
}

.dashboard-title {
  font-size: 24px;
  font-weight: 700;
  color: #0d334a;
  margin: 0;
}

.chart-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

.chart-title {
  font-size: 18px;
  font-weight: 600;

  &--income {
    color: #52c41a;
  }

  &--expenses {
    color: #ff4d4f;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 12px;
  }

  .dashboard-title {
    font-size: 20px;
  }
}
</style>
