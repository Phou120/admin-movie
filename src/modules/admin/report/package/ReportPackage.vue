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
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPackage.metrics.activePackages')"
              :value="summary.active_packages"
              :value-style="{ color: '#3f8600' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPackage.metrics.totalRevenue')"
              :value="summary.total_revenue"
              :precision="2"
              :value-style="{ color: '#cf1322' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPackage.metrics.totalSubscriptions')"
              :value="summary.total_subscriptions"
              :value-style="{ color: '#1890ff' }"
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
          <a-col :xs="24" :sm="12" :md="8" :lg="8">
            <a-select
              v-model:value="selectedStatus"
              :placeholder="t('modules.reportPackage.selectStatus')"
              allow-clear
              style="width: 100%"
            >
              <a-select-option value="active">
                {{ t("modules.reportPackage.statusActive") }}
              </a-select-option>
              <a-select-option value="inactive">
                {{ t("modules.reportPackage.statusInactive") }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :xs="24" :sm="12" :md="12" :lg="8">
            <a-range-picker
              v-model:value="dateRange"
              :placeholder="[t('common.startDate'), t('common.endDate')]"
              style="width: 100%"
              @change="handleDateRangeChange"
            />
          </a-col>
          <a-col :xs="24" :sm="12" :md="12" :lg="16">
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
          <template v-else-if="column.key === 'name'">
            {{ record.name }}
          </template>
          <template v-else-if="column.key === 'type'">
            <a-tag color="blue">{{ record.type }}</a-tag>
          </template>
          <template v-else-if="column.key === 'price'">
            ${{ record.price?.toFixed(2) }}
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'green' : 'red'">
              {{
                record.status === "active"
                  ? t("modules.reportPackage.statusActive")
                  : t("modules.reportPackage.statusInactive")
              }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'created_at'">
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

const { fetchReportData, fetchSummary, getPackageTypes, exportToCSV } =
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
    title: t("modules.reportPackage.columns.name"),
    dataIndex: "name",
    key: "name",
    align: "left" as const,
    width: 200,
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
    width: 100,
  },
  {
    title: t("modules.reportPackage.columns.totalSales"),
    key: "totalSales",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportPackage.columns.totalRevenue"),
    key: "totalRevenue",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportPackage.columns.activeSubscriptions"),
    key: "activeSubscriptions",
    align: "center" as const,
    width: 150,
  },
  {
    title: t("modules.reportPackage.columns.status"),
    key: "status",
    align: "center" as const,
    width: 100,
  },
  {
    title: t("modules.reportPackage.columns.createdAt"),
    key: "created_at",
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
  };
}>({
  packages: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
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

    if (response && response.data) {
      data.packages = response.data;
      data.pagination.total = response.pagination?.total || 0;
    } else if (Array.isArray(response)) {
      data.packages = response;
      data.pagination.total = response.length;
    }
  } catch (error) {
    console.error("Error loading report data:", error);
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

function handleDateRangeChange() {
  data.pagination.current = 1;
  loadReportData(1, data.pagination.pageSize);
}

async function handleExport() {
  exporting.value = true;
  try {
    const startDate = dateRange.value?.[0]
      ? dateRange.value[0].format("YYYY-MM-DD")
      : undefined;
    const endDate = dateRange.value?.[1]
      ? dateRange.value[1].format("YYYY-MM-DD")
      : undefined;

    const response = await exportToCSV({
      search: searchText.value,
      package_type: selectedPackageType.value,
      status: selectedStatus.value,
      start_date: startDate,
      end_date: endDate,
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `package-report-${new Date().getTime()}.csv`);
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
