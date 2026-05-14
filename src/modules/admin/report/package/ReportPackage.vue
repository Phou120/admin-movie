<template>
  <div class="report-page">
    <a-card :title="t('modules.reportPackage.title')" :bordered="false">
      <!-- Summary Cards -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPackage.metrics.totalPackages')"
              :value="summary.total_packages"
              :value-style="{ color: '#3f8600' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPackage.metrics.activePackages')"
              :value="summary.active_packages"
              :value-style="{ color: '#F39A00' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPackage.metrics.totalRevenue')"
              :value="summary.total_revenue"
              :precision="2"
              :value-style="{ color: '#3f8600' }"
              suffix="LAK"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPackage.metrics.totalPending')"
              :value="summary.total_subscriptions"
              :precision="2"
              :value-style="{ color: '#F39A00' }"
              suffix="LAK"
            />
          </a-card>
        </a-col>
      </a-row>

      <!-- Filters -->
      <a-card style="margin-bottom: 16px">
        <a-row :gutter="[12, 12]">
          <a-col :xs="24" :sm="12" :md="8" :lg="8">
            <a-input
              v-model:value="searchText"
              :placeholder="t('modules.reportPackage.searchPlaceholder')"
              allow-clear
              @pressEnter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="8">
            <a-select
              v-model:value="selectedPackageType"
              :placeholder="t('modules.reportPackage.selectType')"
              allow-clear
              style="width: 100%"
            >
              <a-select-option
                v-for="type in packageTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.label }}
              </a-select-option>
            </a-select>
          </a-col>

          <a-col :xs="24" :sm="12" :md="12" :lg="8">
            <a-space :size="8" wrap>
              <a-button type="primary" @click="handleSearch">
                <SearchOutlined />
                {{ t("common.search") }}
              </a-button>
              <a-button @click="handleReset">
                <ClearOutlined />
                {{ t("common.reset") }}
              </a-button>
              <a-button
                type="primary"
                danger
                @click="handleExport"
                :loading="exporting"
              >
                <DownloadOutlined />
                {{ t("common.export") }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-card>

      <!-- Table -->
      <a-table
        :columns="columns"
        :data-source="data.packages"
        :loading="loading"
        :pagination="data.pagination"
        :row-key="getRecordKey"
        @change="handleTableChange"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            {{ getRowNumber(index) }}
          </template>

          <template v-else-if="column.key === 'type'">
            <a-tag color="blue">{{ record.type }}</a-tag>
          </template>
          <template v-else-if="column.key === 'price'">
            <a-tag class="stat-tag">
              {{ formatCurrency(record.price || 0) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'personUse'">
            <a-space :size="4">
              <span>{{ Number(record.count_use_package || 0) }}</span>
              {{ t("modules.reportPackage.times") }}
            </a-space>
          </template>
          <template v-else-if="column.key === 'totalRevenue'">
            <div class="stats-display">
              <a-tag color="green" class="stat-tag">
                {{ formatCurrency(record.total || 0) }}
              </a-tag>
            </div>
          </template>

          <template v-else-if="column.key === 'personPending'">
            <a-space :size="4">
              <span>{{ Number(record.count_user_package_pending || 0) }}</span>
              {{ t("modules.reportPackage.times") }}
            </a-space>
          </template>
          <template v-else-if="column.key === 'totalPending'">
            <div class="stats-display">
              <a-tag color="orange" class="stat-tag">
                {{ formatCurrency(record.total_pending || 0) }}
              </a-tag>
            </div>
          </template>

          <template v-else-if="column.key === 'created_at'">
            {{ formatDate(record.created_at) }}
          </template>
          <template v-else-if="column.key === 'updated_at'">
            {{ formatDate(record.created_at) }}
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { ReportPackageComposible } from "./composible/index";
import { useI18n } from "vue-i18n";
import {
  SearchOutlined,
  ClearOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IReportPackage } from "./interface/report-package.interface";
import formatDate from "../../../../common/utils/format-date.util";
import { formatCurrency } from "../../../../common/utils/format-number.util";

const { fetchReportData, fetchSummary, getPackageTypes, exportToExcel } =
  ReportPackageComposible();
const { t } = useI18n();

const columns = computed(() => [
  {
    title: t("modules.reportPackage.columns.no"),
    key: "no",
    align: "center" as const,
    width: 70,
  },
  {
    title: t("modules.reportPackage.columns.type"),
    key: "type",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportPackage.columns.price"),
    key: "price",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportPackage.columns.person_use"),
    key: "personUse",
    align: "center" as const,
    width: 140,
  },
  {
    title: t("modules.reportPackage.columns.totalRevenue"),
    key: "totalRevenue",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportPackage.columns.person_pending"),
    key: "personPending",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportPackage.columns.totalPending"),
    key: "totalPending",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportPackage.columns.createdAt"),
    key: "created_at",
    align: "center" as const,
    width: 150,
  },
  {
    title: t("modules.reportPackage.columns.updatedAt"),
    key: "updated_at",
    align: "center" as const,
    width: 150,
  },
]);

const data = reactive<{
  packages: IReportPackage[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
  };
}>({
  packages: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

const loading = ref(false);
const exporting = ref(false);
const summaryLoading = ref(false);

const summary = reactive({
  total_packages: 0,
  active_packages: 0,
  total_revenue: 0,
  total_subscriptions: 0,
});

const searchText = ref("");
const selectedPackageType = ref<string | undefined>(undefined);
const selectedStatus = ref<string | undefined>(undefined);
const dateRange = ref<any[]>([]);
const packageTypes = getPackageTypes();

function getRecordKey(record: IReportPackage): number {
  return record.id ?? 0;
}

function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

async function loadReportData(
  page = data.pagination.current,
  limit = data.pagination.pageSize,
) {
  loading.value = true;
  try {
    const startDate = dateRange.value?.[0]
      ? dateRange.value[0].format("YYYY-MM-DD")
      : "";
    const endDate = dateRange.value?.[1]
      ? dateRange.value[1].format("YYYY-MM-DD")
      : "";

    const response = await fetchReportData(
      page,
      limit,
      searchText.value,
      selectedPackageType.value ?? "",
      selectedStatus.value ?? "",
      startDate,
      endDate,
    );

    // Set packages data
    data.packages = response.data || [];

    // Safely handle pagination with default values
    const paginate = response.pagination || {};

    data.pagination = {
      current: paginate.currentPage ?? page ?? 1,
      pageSize: paginate.limit ?? limit ?? 10,
      total: paginate.total ?? 0,
      showSizeChanger: true,
    };
  } catch (error) {
    console.error("Error loading report data:", error);

    // Reset to safe defaults on error
    data.packages = [];
    data.pagination = {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
    };
  } finally {
    loading.value = false;
  }
}

async function loadSummary() {
  summaryLoading.value = true;
  try {
    const response = await fetchSummary();
    Object.assign(summary, response);
  } catch (error) {
    console.error("Error loading summary:", error);
  } finally {
    summaryLoading.value = false;
  }
}

function handleSearch() {
  data.pagination.current = 1;
  loadReportData(1, data.pagination.pageSize);
}

function handleReset() {
  searchText.value = "";
  selectedPackageType.value = undefined;
  selectedStatus.value = undefined;
  dateRange.value = [];
  data.pagination.current = 1;
  loadReportData(1, data.pagination.pageSize);
}

function handleTableChange(pagination: TablePaginationConfig) {
  data.pagination.current = pagination.current || 1;
  data.pagination.pageSize = pagination.pageSize || 10;
  loadReportData(data.pagination.current, data.pagination.pageSize);
}

async function handleExport() {
  exporting.value = true;
  try {
    const response = await exportToExcel({
      search: searchText.value,
      type: selectedPackageType.value,
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `package-report-${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting data:", error);
  } finally {
    exporting.value = false;
  }
}

onMounted(() => {
  loadReportData();
  loadSummary();
});
</script>

<style lang="scss" scoped>
.report-page {
  padding: 16px;
}
</style>
