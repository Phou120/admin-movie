<template>
  <div class="report-page">
    <a-card :title="t('modules.reportUser.title')" :bordered="false">
      <!-- Summary Cards -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportUser.metrics.totalUsers')"
              :value="summary.total_users"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportUser.metrics.activeUsers')"
              :value="summary.active_users"
              :value-style="{ color: '#3f8600' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportUser.metrics.newRegistrations')"
              :value="summary.new_registrations"
              :value-style="{ color: '#1890ff' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportUser.metrics.roleBreakdown')"
              :value="
                Object.values(summary.role_breakdown).reduce((a, b) => a + b, 0)
              "
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
              :placeholder="t('modules.reportUser.searchPlaceholder')"
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
              v-model:value="selectedRole"
              :placeholder="t('modules.reportUser.selectRole')"
              allow-clear
              style="width: 100%"
            >
              <a-select-option
                v-for="role in roles"
                :key="role.value"
                :value="role.value"
              >
                {{ role.label }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="8">
            <a-select
              v-model:value="selectedStatus"
              :placeholder="t('modules.reportUser.selectStatus')"
              allow-clear
              style="width: 100%"
            >
              <a-select-option value="active">
                {{ t("modules.reportUser.statusActive") }}
              </a-select-option>
              <a-select-option value="inactive">
                {{ t("modules.reportUser.statusInactive") }}
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
        :data-source="data.users"
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
          <template v-else-if="column.key === 'profile'">
            <a-avatar
              v-if="record.profile_image"
              :src="record.profile_image"
              :size="32"
            />
            <a-avatar v-else :size="32">{{ record.name?.charAt(0) }}</a-avatar>
          </template>
          <template v-else-if="column.key === 'name'">
            {{ record.name }} {{ record.surname }}
          </template>
          <template v-else-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">
              {{ t(`modules.reportUser.role${record.role?.replace("-", "")}`) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'green' : 'red'">
              {{
                record.status === "active"
                  ? t("modules.reportUser.statusActive")
                  : t("modules.reportUser.statusInactive")
              }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'registration_date'">
            {{ formatDate(record.registration_date) }}
          </template>
          <template v-else-if="column.key === 'last_login'">
            {{ record.last_login ? formatDate(record.last_login) : "-" }}
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { ReportUserComposible } from "./composible/index";
import { useI18n } from "vue-i18n";
import {
  SearchOutlined,
  ClearOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IReportUser } from "./interface/report-user.interface";
import formatDate from "../../../../common/utils/format-date.util";

const { fetchReportData, fetchSummary, getRoles, exportToCSV } =
  ReportUserComposible();
const { t } = useI18n();

const columns = computed(() => [
  {
    title: t("modules.reportUser.columns.no"),
    key: "no",
    align: "center" as const,
    width: 70,
  },
  {
    title: "",
    key: "profile",
    align: "center" as const,
    width: 80,
  },
  {
    title: t("modules.reportUser.columns.name"),
    key: "name",
    align: "left" as const,
    width: 200,
  },
  {
    title: t("modules.reportUser.columns.email"),
    dataIndex: "email",
    key: "email",
    align: "left" as const,
    width: 220,
  },
  {
    title: t("modules.reportUser.columns.role"),
    key: "role",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportUser.columns.status"),
    key: "status",
    align: "center" as const,
    width: 100,
  },
  {
    title: t("modules.reportUser.columns.registrationDate"),
    key: "registration_date",
    align: "center" as const,
    width: 150,
  },
  {
    title: t("modules.reportUser.columns.lastLogin"),
    key: "last_login",
    align: "center" as const,
    width: 150,
  },
  {
    title: t("modules.reportUser.columns.loginCount"),
    dataIndex: "login_count",
    key: "login_count",
    align: "center" as const,
    width: 100,
  },
]);

const data = reactive<{
  users: IReportUser[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}>({
  users: [],
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
  total_users: 0,
  active_users: 0,
  new_registrations: 0,
  role_breakdown: {
    admin: 0,
    super_admin: 0,
    customer: 0,
  },
});

const searchText = ref("");
const selectedRole = ref<string | undefined>(undefined);
const selectedStatus = ref<string | undefined>(undefined);
const dateRange = ref<any[]>([]);
const roles = getRoles();

function getRecordKey(record: IReportUser): number {
  return record.id ?? 0;
}

function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

function getRoleColor(role?: string): string {
  switch (role) {
    case "admin":
      return "blue";
    case "super-admin":
      return "purple";
    case "customer":
      return "green";
    default:
      return "default";
  }
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
      selectedRole.value ?? "",
      selectedStatus.value ?? "",
      startDate,
      endDate,
    );

    if (response && response.data) {
      data.users = response.data;
      data.pagination.total = response.pagination?.total || 0;
    } else if (Array.isArray(response)) {
      data.users = response;
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
  selectedRole.value = undefined;
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
      role: selectedRole.value,
      status: selectedStatus.value,
      start_date: startDate,
      end_date: endDate,
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `user-report-${new Date().getTime()}.csv`);
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
