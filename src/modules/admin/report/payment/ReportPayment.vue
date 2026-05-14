<template>
  <div class="report-page">
    <a-card :title="t('modules.reportPayment.title')" :bordered="false">
      <!-- Summary Cards -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPayment.metrics.totalRevenue')"
              :value="summary.total_revenue"
              :precision="2"
              suffix="LAK"
              :value-style="{ color: '#3f8600' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPayment.metrics.pendingPayments')"
              :value="summary.pending_payments"
              :precision="2"
              suffix="LAK"
              :value-style="{ color: '#faad14' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPayment.metrics.approvedPayments')"
              :value="summary.approved_payments"
              :precision="2"
              suffix="LAK"
              :value-style="{ color: '#52c41a' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPayment.metrics.rejectedPayments')"
              :value="summary.rejected_payments"
              :precision="2"
              suffix="LAK"
              :value-style="{ color: '#ff4d4f' }"
            />
          </a-card>
        </a-col>
        <!-- <a-col :span="4">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportPayment.metrics.transactionCount')"
              :value="summary.transaction_count"
            />
          </a-card>
        </a-col> -->
      </a-row>

      <!-- Filters -->
      <a-card style="margin-bottom: 16px">
        <a-row :gutter="[12, 12]">
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-input
              v-model:value="searchText"
              :placeholder="t('modules.reportPayment.searchPlaceholder')"
              allow-clear
              @pressEnter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-select
              v-model:value="selectedStatus"
              :placeholder="t('modules.reportPayment.selectStatus')"
              allow-clear
              style="width: 100%"
            >
              <a-select-option value="pending">
                {{ t("modules.reportPayment.statusPending") }}
              </a-select-option>
              <a-select-option value="success">
                {{ t("modules.reportPayment.statusApproved") }}
              </a-select-option>
              <a-select-option value="failed">
                {{ t("modules.reportPayment.statusRejected") }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-select
              v-model:value="selectedPaymentType"
              :placeholder="t('modules.reportPayment.selectPaymentType')"
              allow-clear
              style="width: 100%"
            >
              <a-select-option
                v-for="type in paymentTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.label }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-select
              v-model:value="selectedMemberId"
              :placeholder="t('modules.reportPayment.selectMember')"
              allow-clear
              style="width: 100%"
              :loading="membersLoading"
              show-search
              :filter-option="filterMemberOption"
            >
              <a-select-option
                v-for="member in members"
                :key="member.id"
                :value="member.id"
              >
                {{ member.name }}
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
        :data-source="data.payments"
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
          <template v-else-if="column.key === 'member_name'">
            <div style="display: flex; align-items: center; gap: 12px">
              <img
                v-if="record.user?.user_profile?.image_url"
                :src="record.user.user_profile.image_url"
                alt="Profile"
                style="
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  object-fit: cover;
                "
              />
              <div
                v-else
                style="
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  background-color: #ccc;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 18px;
                  color: #fff;
                "
              >
                {{ record.customer?.name?.charAt(0) || "?" }}
              </div>
              <div>
                <div>
                  {{ record.customer?.name }} {{ record.customer?.surname }}
                </div>
                <div style="font-size: 12px; color: #666">
                  {{ record.customer?.email }}
                </div>
                <div style="font-size: 12px; color: #666">
                  {{ record.customer?.tel }}
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'packageName'">
            {{ record.usePackage.package.type }}
          </template>
          <template v-else-if="column.key === 'amount'">
            <a-tag class="stat-tag">
              {{ formatCurrency(record.usePackage.package.price || 0) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'payment_type'">
            <a-tag color="blue">{{ record.payment_type }}</a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag
              :color="
                record.status === 'success'
                  ? 'green'
                  : record.status === 'pending'
                    ? 'orange'
                    : record.status === 'failed'
                      ? 'red'
                      : 'orange'
              "
            >
              {{
                record.status === "success"
                  ? t("modules.reportPayment.statusApproved")
                  : record.status === "pending"
                    ? t("modules.reportPayment.statusPending")
                    : record.status === "failed"
                      ? t("modules.reportPayment.statusRejected")
                      : t("modules.reportPayment.statusRejected")
              }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'slip'">
            <a-button
              v-if="record.slip"
              type="link"
              size="small"
              @click="viewSlip(record.slip)"
            >
              {{ t("modules.reportPayment.viewSlip") }}
            </a-button>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.key === 'payment_date'">
            {{ formatDate(record.created_at) }}
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Slip Image Modal -->
    <a-modal
      v-model:open="isSlipModalVisible"
      title=""
      :footer="null"
      width="600px"
    >
      <img
        v-if="currentSlipUrl"
        :src="currentSlipUrl"
        alt="Payment Slip"
        style="width: 100%"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { ReportPaymentComposible } from "./composible/index";
import { useI18n } from "vue-i18n";
import {
  SearchOutlined,
  ClearOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IReportPayment } from "./interface/report-payment.interface";
import formatDate from "../../../../common/utils/format-date.util";
import { formatCurrency } from "../../../../common/utils/format-number.util";

const {
  fetchReportData,
  fetchSummary,
  getPaymentTypes,
  getMembers,
  exportToExcel,
} = ReportPaymentComposible();
const { t } = useI18n();

const columns = computed(() => [
  {
    title: t("modules.reportPayment.columns.no"),
    key: "no",
    align: "center" as const,
    width: 70,
  },
  {
    title: t("modules.reportPayment.columns.member"),
    key: "member_name",
    align: "left" as const,
    width: 150,
  },
  {
    title: t("modules.reportPayment.columns.packageName"),
    key: "packageName",
    align: "left" as const,
    width: 150,
  },
  {
    title: t("modules.reportPayment.columns.amount"),
    key: "amount",
    align: "center" as const,
    width: 100,
  },
  {
    title: t("modules.reportPayment.columns.paymentType"),
    key: "payment_type",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportPayment.columns.status"),
    key: "status",
    align: "center" as const,
    width: 100,
  },
  {
    title: t("modules.reportPayment.columns.slip"),
    key: "slip",
    align: "center" as const,
    width: 80,
  },
  {
    title: t("modules.reportPayment.columns.paymentDate"),
    key: "payment_date",
    align: "center" as const,
    width: 150,
  },
]);

const data = reactive<{
  payments: IReportPayment[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
  };
}>({
  payments: [],
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
const membersLoading = ref(false);

const summary = reactive({
  total_revenue: 0,
  pending_payments: 0,
  approved_payments: 0,
  rejected_payments: 0,
  transaction_count: 0,
});

const searchText = ref("");
const selectedStatus = ref<string | undefined>(undefined);
const selectedPaymentType = ref<string | undefined>(undefined);
const selectedMemberId = ref<number | undefined>(undefined);
const dateRange = ref<any[]>([]);
const members = ref<any[]>([]);
const paymentTypes = computed(() => getPaymentTypes());

// Slip modal state
const isSlipModalVisible = ref(false);
const currentSlipUrl = ref("");

function getRecordKey(record: IReportPayment): number {
  return record.id ?? 0;
}

function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

function filterMemberOption(input: string, option: any) {
  return option.children?.[0]?.children
    ?.toLowerCase()
    .includes(input.toLowerCase());
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
      selectedStatus.value ?? "",
      selectedPaymentType.value ?? "",
      selectedMemberId.value?.toString() ?? "",
      startDate,
      endDate,
    );

    // Set payments data
    data.payments = response.data || [];

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
    data.payments = [];
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

async function loadMembers() {
  membersLoading.value = true;
  try {
    members.value = await getMembers();
  } catch (error) {
    console.error("Error loading members:", error);
  } finally {
    membersLoading.value = false;
  }
}

function handleSearch() {
  data.pagination.current = 1;
  loadReportData(1, data.pagination.pageSize);
}

function handleReset() {
  searchText.value = "";
  selectedStatus.value = undefined;
  selectedPaymentType.value = undefined;
  selectedMemberId.value = undefined;
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

function viewSlip(url: string) {
  currentSlipUrl.value = url;
  isSlipModalVisible.value = true;
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

    const response = await exportToExcel({
      search: searchText.value,
      status: selectedStatus.value,
      payment_type: selectedPaymentType.value,
      member_id: selectedMemberId.value,
      start_date: startDate,
      end_date: endDate,
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `payment-report-${new Date().getTime()}.xlsx`,
    );
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
  loadMembers();
});
</script>

<style lang="scss" scoped>
.report-page {
  padding: 16px;
}
</style>
