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

          <a-col :xs="24" :sm="12" :md="12" :lg="8">
            <a-range-picker
              v-model:value="dateRange"
              :placeholder="[t('common.startDate'), t('common.endDate')]"
              style="width: 100%"
              @change="handleDateRangeChange"
            />
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
        :data-source="data.users"
        :loading="loading"
        :pagination="data.pagination"
        :row-key="getRecordKey"
        @change="handleTableChange"
        :scroll="{ x: 1400 }"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            {{ getRowNumber(index) }}
          </template>
          <template v-else-if="column.key === 'profile'">
            <a-avatar
              v-if="record.profile?.image_url"
              :src="record.profile.image_url"
              :size="40"
              shape="circle"
              style="cursor: pointer"
              @click="viewProfile(record)"
            />
            <a-avatar
              v-else
              :size="40"
              shape="circle"
              style="cursor: pointer"
              @click="viewProfile(record)"
            >
              {{ record.name?.charAt(0) }}
            </a-avatar>
          </template>
          <template v-else-if="column.key === 'name'">
            {{ record.name }} {{ record.surname }}
          </template>
          <template v-else-if="column.key === 'role'">
            <a-tag
              v-if="record.roles && record.roles.length > 0"
              :color="getRoleColor(record.roles[0].name)"
            >
              {{ formatRoleName(record.roles[0].name) }}
            </a-tag>
            <span v-else class="text-muted">-</span>
          </template>
          <template v-else-if="column.key === 'created_at'">
            {{ formatDate(record.created_at) }}
          </template>
          <template v-else-if="column.key === 'updated_at'">
            {{ formatDate(record.updated_at) }}
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Profile Modal -->
    <a-modal
      v-model:open="isProfileModalVisible"
      :title="`${selectedUser?.name} ${selectedUser?.surname}`"
      :footer="null"
      width="500px"
    >
      <div v-if="selectedUser" class="profile-modal-content">
        <div class="profile-header">
          <a-avatar
            v-if="selectedUser.profile?.image_url"
            :src="selectedUser.profile.image_url"
            :size="120"
            shape="circle"
          />
          <a-avatar v-else :size="120" shape="circle">
            {{ selectedUser.name?.charAt(0) }}
          </a-avatar>
        </div>

        <div class="profile-info">
          <a-descriptions :column="1" bordered>
            <a-descriptions-item :label="t('modules.reportUser.columns.name')">
              {{ selectedUser.name }} {{ selectedUser.surname }}
            </a-descriptions-item>
            <a-descriptions-item label="Email">
              {{ selectedUser.email }}
            </a-descriptions-item>
            <a-descriptions-item label="Tel">
              {{ selectedUser.tel || "-" }}
            </a-descriptions-item>
            <a-descriptions-item :label="t('modules.reportUser.columns.role')">
              <a-tag v-if="selectedUser.roles && selectedUser.roles.length > 0">
                {{ selectedUser.roles[0].name }}
              </a-tag>
              <span v-else>-</span>
            </a-descriptions-item>
            <a-descriptions-item
              :label="t('modules.reportUser.columns.createdAt')"
            >
              {{ formatDate(selectedUser.created_at) }}
            </a-descriptions-item>
            <a-descriptions-item
              :label="t('modules.reportUser.columns.updatedAt')"
            >
              {{ formatDate(selectedUser.updated_at) }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </a-modal>
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

const { fetchReportData, fetchSummary, exportToCSV } = ReportUserComposible();
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
    title: t("modules.reportUser.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    align: "center" as const,
    width: 150,
  },
  {
    title: t("modules.reportUser.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    align: "center" as const,
    width: 150,
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

// Profile modal state
const isProfileModalVisible = ref(false);
const selectedUser = ref<any>(null);

function getRecordKey(record: IReportUser): number {
  return record.id ?? 0;
}

function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

function getRoleColor(role?: string): string {
  const roleLower = role?.toLowerCase();
  switch (roleLower) {
    case "admin":
      return "blue";
    case "superadmin":
    case "super-admin":
      return "purple";
    case "customer":
      return "green";
    case "creator":
      return "cyan";
    case "editor":
      return "orange";
    case "viewer":
      return "default";
    default:
      return "blue";
  }
}

// Format role name for display
function formatRoleName(roleName: string): string {
  // Capitalize first letter and handle special cases
  if (!roleName) return "";

  const specialCases: Record<string, string> = {
    superadmin: "Super Admin",
    "super-admin": "Super Admin",
  };

  const lowerName = roleName.toLowerCase();
  if (specialCases[lowerName]) {
    return specialCases[lowerName];
  }

  // Capitalize first letter
  return roleName.charAt(0).toUpperCase() + roleName.slice(1);
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

    // Set users data
    data.users = response.data || [];

    // Safely handle pagination with default values
    const paginate = response.pagination || {};

    data.pagination = {
      current: paginate.currentPage ?? page ?? 1,
      pageSize: paginate.limit ?? limit ?? 10,
      total: paginate.total ?? 0,
    };
  } catch (error) {
    console.error("Error loading report data:", error);

    // Reset to safe defaults on error
    data.users = [];
    data.pagination = {
      current: 1,
      pageSize: 10,
      total: 0,
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

// View user profile
function viewProfile(user: any) {
  selectedUser.value = user;
  isProfileModalVisible.value = true;
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

.profile-modal-content {
  .profile-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px 0;
  }

  .profile-info {
    :deep(.ant-descriptions) {
      .ant-descriptions-item-label {
        font-weight: 600;
        width: 120px;
      }
    }
  }
}
</style>
