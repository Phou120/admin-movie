<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import RevenueTrendChart from "./RevenueTrendChart.vue";
import PaymentMethodDistribution from "./PaymentMethodDistribution.vue";
import PaymentStatusTrend from "./PaymentStatusTrend.vue";
import MonthlyRevenueComparison from "./MonthlyRevenueComparison.vue";
import { ReportPaymentComposible } from "../../report/payment/composible";

const router = useRouter();
const { t } = useI18n();

const { fetchReportData, fetchSummary } = ReportPaymentComposible();

const loading = ref(false);
const paymentData = ref<any[]>([]);
const summaryData = ref<any>(null);

// Revenue trend data (approved, pending, rejected over time)
const revenueData = computed(() => {
  // This would come from an API endpoint with time-series data
  // For now, returning mock structure
  return [
    {
      date: "Jan",
      approved: 10000000,
      pending: 2000000,
      rejected: 500000,
    },
    {
      date: "Feb",
      approved: 12000000,
      pending: 1800000,
      rejected: 400000,
    },
    {
      date: "Mar",
      approved: 15000000,
      pending: 2500000,
      rejected: 600000,
    },
    {
      date: "Apr",
      approved: 18000000,
      pending: 2200000,
      rejected: 550000,
    },
    {
      date: "May",
      approved: 20000000,
      pending: 3000000,
      rejected: 700000,
    },
    {
      date: "Jun",
      approved: 22000000,
      pending: 2800000,
      rejected: 650000,
    },
  ];
});

// Payment method distribution
const paymentMethodData = computed(() => {
  if (!paymentData.value || paymentData.value.length === 0) {
    return [];
  }

  // Aggregate by payment type
  const methodMap = new Map<string, { amount: number; count: number }>();

  paymentData.value.forEach((payment) => {
    const method = payment.payment_type || "Unknown";
    const amount = payment.usePackage?.package?.price || 0;

    if (!methodMap.has(method)) {
      methodMap.set(method, { amount: 0, count: 0 });
    }

    const current = methodMap.get(method)!;
    current.amount += amount;
    current.count += 1;
  });

  const total = Array.from(methodMap.values()).reduce((sum, m) => sum + m.amount, 0);

  return Array.from(methodMap.entries()).map(([method, data]) => ({
    method,
    amount: data.amount,
    percentage: total > 0 ? (data.amount / total) * 100 : 0,
  }));
});

// Approval rate trend
const approvalRateData = computed(() => {
  if (!paymentData.value || paymentData.value.length === 0) {
    return [];
  }

  // This would come from API with historical approval rates
  // For now, calculating from current data
  const approved = paymentData.value.filter((p) => p.status === "success").length;
  const rejected = paymentData.value.filter((p) => p.status === "failed").length;
  const total = approved + rejected;

  const rate = total > 0 ? (approved / total) * 100 : 0;

  return [
    { date: "Jan", rate: 85 },
    { date: "Feb", rate: 88 },
    { date: "Mar", rate: 82 },
    { date: "Apr", rate: 90 },
    { date: "May", rate: 87 },
    { date: "Jun", rate: rate },
  ];
});

// Monthly revenue comparison
const monthlyRevenueData = computed(() => {
  // This would come from API with monthly breakdown
  return [
    { month: "Apr", current: 18000000, previous: 15000000, yearAgo: 12000000 },
    { month: "May", current: 20000000, previous: 18000000, yearAgo: 14000000 },
    { month: "Jun", current: 22000000, previous: 20000000, yearAgo: 16000000 },
  ];
});

// KPIs
const kpis = computed(() => {
  if (!summaryData.value) {
    return {
      averageTransactionValue: 0,
      paymentSuccessRate: 0,
      revenuePerMember: 0,
    };
  }

  const totalRevenue = parseFloat(summaryData.value.total_revenue || 0);
  const approved = parseFloat(summaryData.value.approved_payments || 0);
  const rejected = parseFloat(summaryData.value.rejected_payments || 0);
  const totalTransactions = approved + rejected;

  return {
    averageTransactionValue:
      totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
    paymentSuccessRate:
      totalTransactions > 0 ? (approved / totalTransactions) * 100 : 0,
    revenuePerMember: 0, // Would need member count
  };
});

// Load payment data
const loadPaymentData = async () => {
  loading.value = true;
  try {
    // Load summary for KPIs
    const summaryRes = await fetchSummary();
    summaryData.value = summaryRes;

    // Load detailed data for charts
    const response = await fetchReportData(1, 100);
    paymentData.value = response.data || [];
  } catch (error) {
    console.error("Failed to load payment data:", error);
    message.error(t("dashboard.error.loadingFailed"));
  } finally {
    loading.value = false;
  }
};

// Navigate to report page
const navigateToReport = (filters?: any) => {
  router.push({
    path: "/report/payment",
    query: filters,
  });
};

onMounted(() => {
  loadPaymentData();
});
</script>

<template>
  <div class="financial-analytics">
    <!-- KPI Cards -->
    <a-row :gutter="[16, 16]" class="kpi-row">
      <a-col :xs="12" :sm="8">
        <a-card class="kpi-card">
          <a-statistic
            :title="t('dashboard.analytics.avgTransaction')"
            :value="kpis.averageTransactionValue"
            :precision="0"
            prefix="₭"
          />
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="8">
        <a-card class="kpi-card">
          <a-statistic
            :title="t('dashboard.analytics.successRate')"
            :value="kpis.paymentSuccessRate"
            suffix="%"
            :value-style="{ color: kpis.paymentSuccessRate >= 80 ? '#52c41a' : '#ff4d4f' }"
          />
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="8">
        <a-card class="kpi-card">
          <a-statistic
            :title="t('dashboard.analytics.revenuePerMember')"
            :value="kpis.revenuePerMember"
            precision="0"
            prefix="₭"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts -->
    <a-row :gutter="[24, 24]">
      <!-- Revenue Trend -->
      <a-col :xs="24" :lg="12">
        <RevenueTrendChart :data="revenueData" :loading="loading" />
      </a-col>

      <!-- Payment Methods -->
      <a-col :xs="24" :lg="12">
        <PaymentMethodDistribution :data="paymentMethodData" :loading="loading" />
      </a-col>

      <!-- Approval Rate -->
      <a-col :xs="24" :lg="12">
        <PaymentStatusTrend :data="approvalRateData" :loading="loading" :threshold="80" />
      </a-col>

      <!-- Monthly Comparison -->
      <a-col :xs="24" :lg="12">
        <MonthlyRevenueComparison :data="monthlyRevenueData" :loading="loading" />
      </a-col>
    </a-row>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <a-button type="primary" @click="navigateToReport()">
        {{ t("dashboard.viewFullReport") }}
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.financial-analytics {
  padding: 16px;
}

.kpi-row {
  margin-bottom: 24px;
}

.kpi-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.kpi-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.quick-actions {
  margin-top: 24px;
  text-align: center;
}
</style>
