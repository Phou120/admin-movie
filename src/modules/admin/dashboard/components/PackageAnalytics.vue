<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import PackageRevenueChart from "./PackageRevenueChart.vue";
import PackageDistributionChart from "./PackageDistributionChart.vue";
import PackagePerformanceChart from "./PackagePerformanceChart.vue";
import { ReportPackageComposible } from "../../report/package/composible";

const router = useRouter();
const { t } = useI18n();

const { fetchReportData } = ReportPackageComposible();

const loading = ref(false);
const packageData = ref<any[]>([]);

// Revenue trend data (for chart)
const revenueData = computed(() => {
  // This would come from an API endpoint that provides time-series data
  // For now, returning mock structure
  return [
    { date: "Jan", revenue: 1000000 },
    { date: "Feb", revenue: 1500000 },
    { date: "Mar", revenue: 1200000 },
    { date: "Apr", revenue: 1800000 },
    { date: "May", revenue: 2000000 },
    { date: "Jun", revenue: 2200000 },
  ];
});

// Distribution data
const distributionData = computed(() => {
  if (!packageData.value || packageData.value.length === 0) {
    return [
      { type: "1 Month", count: 0, revenue: 0 },
      { type: "3 Months", count: 0, revenue: 0 },
      { type: "6 Months", count: 0, revenue: 0 },
      { type: "1 Year", count: 0, revenue: 0 },
    ];
  }

  // Aggregate from actual data
  return [
    {
      type: "1 Month",
      count: packageData.value.filter((p) => p.type === "one-month").length,
      revenue: packageData.value
        .filter((p) => p.type === "one-month")
        .reduce((sum, p) => sum + (p.total || 0), 0),
    },
    {
      type: "3 Months",
      count: packageData.value.filter((p) => p.type === "three-month").length,
      revenue: packageData.value
        .filter((p) => p.type === "three-month")
        .reduce((sum, p) => sum + (p.total || 0), 0),
    },
    {
      type: "6 Months",
      count: packageData.value.filter((p) => p.type === "six-month").length,
      revenue: packageData.value
        .filter((p) => p.type === "six-month")
        .reduce((sum, p) => sum + (p.total || 0), 0),
    },
    {
      type: "1 Year",
      count: packageData.value.filter((p) => p.type === "one-year").length,
      revenue: packageData.value
        .filter((p) => p.type === "one-year")
        .reduce((sum, p) => sum + (p.total || 0), 0),
    },
  ];
});

// Performance data
const performanceData = computed(() => {
  if (!packageData.value || packageData.value.length === 0) {
    return [];
  }

  return packageData.value.map((pkg) => ({
    type: pkg.type,
    active: pkg.count_use_package || 0,
    pending: pkg.count_user_package_pending || 0,
    total_revenue: pkg.total || 0,
  }));
});

// Load package data
const loadPackageData = async () => {
  loading.value = true;
  try {
    const response = await fetchReportData(1, 100); // Get first 100
    packageData.value = response.data || [];
  } catch (error) {
    console.error("Failed to load package data:", error);
    message.error(t("dashboard.error.loadingFailed"));
  } finally {
    loading.value = false;
  }
};

// Handle navigation to report page
const navigateToReport = (filters?: any) => {
  router.push({
    path: "/report/package",
    query: filters,
  });
};

// Handle chart interactions
const handleRevenueRangeChange = (range: string) => {
  console.log("Revenue range changed:", range);
  // In real implementation, this would fetch data for the selected range
};

const handlePackageTypeClick = (type: string) => {
  navigateToReport({ type: type.toLowerCase().replace(" ", "-") });
};

const handlePerformanceBarClick = (type: string) => {
  navigateToReport({ type: type.toLowerCase() });
};

onMounted(() => {
  loadPackageData();
});
</script>

<template>
  <div class="package-analytics">
    <a-row :gutter="[24, 24]">
      <!-- Revenue Trend Chart -->
      <a-col :xs="24" :lg="12">
        <PackageRevenueChart
          :data="revenueData"
          :loading="loading"
          @range-change="handleRevenueRangeChange"
        />
      </a-col>

      <!-- Distribution Chart -->
      <a-col :xs="24" :lg="12">
        <PackageDistributionChart
          :data="distributionData"
          :loading="loading"
          mode="revenue"
          @segment-click="handlePackageTypeClick"
        />
      </a-col>

      <!-- Performance Chart -->
      <a-col :xs="24">
        <PackagePerformanceChart
          :data="performanceData"
          :loading="loading"
          metric="subscriptions"
          @bar-click="handlePerformanceBarClick"
        />
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
.package-analytics {
  padding: 16px;
}

.quick-actions {
  margin-top: 24px;
  text-align: center;
}
</style>
