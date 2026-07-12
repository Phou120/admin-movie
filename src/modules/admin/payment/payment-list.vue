<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PaymentComposible } from "./composible/index";
import { useI18n } from "vue-i18n";
import {
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IPaymentForm, IPaymentList } from "./interface/payment.interface";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";
import formatDate from "../../../common/utils/format-date.util";
import { useAuth } from "../../../common/composables/useAuth";

const { fetchAll, fetchByMemberId, deletePaymentById, updatePaymentStatus } =
  PaymentComposible();
const { t } = useI18n();
const { can } = useAuth();

const route = useRoute();
const router = useRouter();

// Check if this is member-specific payment view
const isMemberView = computed(() => route.name === "member-payments");
const memberId = computed(() =>
  route.params.memberId ? Number(route.params.memberId) : null,
);

const columns = computed(() => [
  {
    title: t("modules.payment.columns.no"),
    dataIndex: "id",
    key: "no",
    align: "center",
    width: 70,
  },
  {
    title: t("modules.payment.columns.member"),
    key: "member",
    align: "left",
    width: 200,
  },
  {
    title: t("modules.payment.columns.package"),
    key: "package",
    align: "left",
    width: 150,
  },
  {
    title: t("modules.payment.columns.amount"),
    key: "amount",
    align: "center",
    width: 120,
  },
  {
    title: t("modules.payment.columns.paymentType"),
    dataIndex: "payment_type",
    key: "payment_type",
    align: "center",
    width: 120,
  },
  {
    title: t("modules.payment.columns.status"),
    dataIndex: "status",
    key: "status",
    align: "center",
    width: 170,
  },
  {
    title: t("modules.payment.columns.slip"),
    key: "slip",
    align: "center",
    width: 100,
  },
  {
    title: t("modules.payment.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 180,
  },
  {
    title: t("modules.payment.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    align: "center",
    width: 180,
  },
  {
    title: t("modules.payment.columns.action"),
    key: "action",
    width: 80,
    fixed: "right",
    align: "center",
  },
]);

const data = reactive<IPaymentList>({
  payments: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

const loading = ref(false);
const searchText = ref("");
const selectedStatus = ref<string | null>(null);

// Track loading state for individual payment status updates
const paymentStatusLoading = ref<Record<number, boolean>>({});

// Function to get record key
function getRecordKey(record: IPaymentForm): number {
  return record.id ?? 0;
}

// Function to calculate row number
function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

// Function to load payments with pagination
async function loadPayments(
  page = data.pagination.current,
  limit = data.pagination.pageSize,
  search = searchText.value,
  status = selectedStatus.value,
) {
  loading.value = true;
  try {
    let response;
    if (isMemberView.value && memberId.value) {
      response = await fetchByMemberId(
        memberId.value,
        page,
        limit,
        search,
        status,
      );
    } else {
      response = await fetchAll(page, limit, search, status);
    }

    data.payments = response.data;

    const paginate = response.pagination;

    // Update pagination info based on response
    data.pagination = {
      current: paginate.currentPage,
      pageSize: paginate.limit,
      total: paginate.total,
      showSizeChanger: true,
    };
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

// Load initial data
onMounted(() => {
  loadPayments();
});

// Handle table pagination change
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadPayments(current, pageSize);
}

// Handle search
function handleSearch(value: string) {
  searchText.value = value;
  loadPayments(1, data.pagination.pageSize, value, selectedStatus.value);
}

// Handle search change
function handleSearchChange(e: any) {
  if (!e.target.value) {
    searchText.value = "";
    loadPayments(1, data.pagination.pageSize, "", selectedStatus.value);
  }
}

// Handle status filter change
function handleStatusChange(status: string) {
  selectedStatus.value = status;
  loadPayments(1, data.pagination.pageSize, searchText.value, status);
}

// View slip image
function viewSlip(slipUrl: string) {
  window.open(slipUrl, "_blank");
}

// View payment details
function viewPaymentDetails(payment: IPaymentForm) {
  router.push(`/payment/${payment.id}`);
}

async function deletePayment(id: number) {
  try {
    const response = await deletePaymentById(id);
    showSuccessNotification(response.message);
    await loadPayments();
  } catch (error) {
    showErrorNotification(
      "Failed to delete payment:",
      (error as Error).message,
    );
  }
}

// Get status color
function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case "approved":
    case "success":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
    case "failed":
      return "error";
    default:
      return "default";
  }
}

// Get status label
function getStatusLabel(status: string): string {
  return t(`status.${status?.toLowerCase()}`, status?.toUpperCase() || status);
}

// Get available statuses based on current status
function getAvailableStatuses(currentStatus: string) {
  switch (currentStatus?.toLowerCase()) {
    case "pending":
      return [
        { label: t("status.success"), value: "success" },
        { label: t("status.failed"), value: "failed" },
      ];
    case "success":
      return [
        { label: t("status.pending"), value: "pending" },
        { label: t("status.failed"), value: "failed" },
      ];
    case "failed":
      return [{ label: t("status.success"), value: "success" }];
    default:
      return [
        { label: t("status.success"), value: "success" },
        { label: t("status.failed"), value: "failed" },
      ];
  }
}

// Update payment status
async function updateStatus(id: number, newStatus: string) {
  // Defense-in-depth: refuse the action without the approve-payment permission.
  if (!can("approve", "payment")) return;

  // Set loading state for this payment
  paymentStatusLoading.value[id] = true;

  try {
    const response = await updatePaymentStatus(id, newStatus);
    showSuccessNotification(response.message || "Status updated successfully");

    // Reload payments data to reflect the change
    await loadPayments();
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    showErrorNotification(errorMessage);
  } finally {
    // Clear loading state for this payment
    paymentStatusLoading.value[id] = false;
  }
}
</script>

<template>
  <div class="payment-container">
    <!-- Header Section -->
    <div class="payment-header">
      <div class="header-left">
        <h1 v-if="isMemberView">
          {{ t("modules.payment.memberPaymentTitle") }}
        </h1>
        <h1 v-else>{{ t("modules.payment.title") }}</h1>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-controls">
        <a-input-search
          v-model="searchText"
          :placeholder="t('modules.payment.searchPlaceholder')"
          style="max-width: 400px; width: 100%"
          @search="handleSearch"
          @change="handleSearchChange"
          allow-clear
          enter-button
        />
        <a-select
          v-model="selectedStatus"
          :placeholder="t('modules.payment.filterStatus')"
          style="width: 120px; margin-left: 16px"
          @change="handleStatusChange"
          allow-clear
        >
          <a-select-option value="pending">
            <a-tag :color="getStatusColor('pending')" size="small">
              {{ t("status.pending") }}
            </a-tag>
          </a-select-option>
          <a-select-option value="success">
            <a-tag :color="getStatusColor('success')" size="small">
              {{ t("status.success") }}
            </a-tag>
          </a-select-option>
          <a-select-option value="failed">
            <a-tag :color="getStatusColor('failed')" size="small">
              {{ t("status.failed") }}
            </a-tag>
          </a-select-option>
        </a-select>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container">
      <a-table
        :dataSource="data.payments"
        :columns="columns"
        :pagination="data.pagination"
        :loading="loading"
        :rowKey="getRecordKey"
        @change="handleTableChange"
        :scroll="{ x: 1200 }"
        class="payment-table"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            <span>{{ getRowNumber(index) }}</span>
          </template>

          <template v-else-if="column.key === 'member'">
            <div class="member-info">
              <div class="member-name">
                {{ record.user?.name }} {{ record.user?.surname }}
              </div>
              <div class="member-email">{{ record.user?.email }}</div>
            </div>
          </template>

          <template v-else-if="column.key === 'package'">
            <div class="package-info">
              <div class="package-price">
                {{ record.usePackage?.package?.price }}
              </div>
              <div class="package-type">
                {{ record.usePackage?.package?.type }}
              </div>
            </div>
          </template>

          <template v-else-if="column.key === 'amount'">
            <span class="amount-text">{{
              record.usePackage?.package?.price
            }}</span>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-dropdown
              v-if="can('approve', 'payment')"
              :trigger="['click']"
              placement="bottomLeft"
            >
              <a-tag
                :color="getStatusColor(record.status)"
                class="status-badge clickable"
                style="cursor: pointer"
              >
                <loading-outlined
                  v-if="paymentStatusLoading[record.id]"
                  style="margin-right: 4px"
                />
                {{ getStatusLabel(record.status) }}
                <down-outlined
                  v-if="!paymentStatusLoading[record.id]"
                  style="margin-left: 4px; font-size: 10px"
                />
              </a-tag>
              <template #overlay>
                <a-menu class="status-dropdown-menu">
                  <a-menu-item
                    v-for="status in getAvailableStatuses(record.status)"
                    :key="status.value"
                    @click="updateStatus(record.id, status.value)"
                    :disabled="paymentStatusLoading[record.id]"
                  >
                    <a-tag
                      :color="getStatusColor(status.value)"
                      size="small"
                      style="margin-right: 8px"
                    >
                      {{ status.label }}
                    </a-tag>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <!-- Read-only status for users without approve-payment permission -->
            <a-tag v-else :color="getStatusColor(record.status)" class="status-badge">
              {{ getStatusLabel(record.status) }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'slip'">
            <a-button
              v-if="record.slip"
              type="link"
              size="small"
              @click="viewSlip(record.slip)"
            >
              <eye-outlined />
              {{ t("actions.view") }}
            </a-button>
            <span v-else class="text-muted">-</span>
          </template>

          <template v-else-if="column.key === 'created_at'">
            {{ formatDate(record.created_at) }}
          </template>

          <template v-else-if="column.key === 'updated_at'">
            {{ formatDate(record.updated_at) }}
          </template>

          <template v-else-if="column.key === 'action'">
            <div class="action-icons">
              <a-tooltip v-if="can('read', 'payment')" :title="t('actions.view')">
                <eye-outlined
                  class="icon view"
                  @click="viewPaymentDetails(record)"
                />
              </a-tooltip>
              <a-popconfirm
                v-if="can('delete', 'payment')"
                :title="t('message.deleteConfirm')"
                placement="topRight"
                @confirm="deletePayment(record.id)"
              >
                <a-tooltip :title="t('actions.delete')">
                  <delete-outlined class="icon delete" />
                </a-tooltip>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .header-icon {
      font-size: 32px;
      color: #1890ff;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #262626;
    }

    // .back-btn {
    //   padding: 0;
    //   height: auto;
    //   font-size: 14px;
    //   margin-left: 12px;
    // }
    .back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .add-btn {
    background-color: #0d334aff;
    border-color: #0d334aff;
    color: #ffffff;
    white-space: nowrap;

    &:hover {
      background-color: #0d334acc;
      border-color: #0d334acc;
      color: #ffffff;
    }
  }
}

.search-section {
  margin-bottom: 16px;
  margin-top: 20px;
  // padding: 0 5px;

  .search-controls {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.table-container {
  margin-top: 20px;
  overflow-x: auto;
}

.payment-table {
  :deep(.ant-table-thead > tr > th) {
    background: #fafafa;
    font-weight: 600;
    color: #262626;
    border-bottom: 2px solid #f0f0f0;
  }

  :deep(.ant-table-tbody > tr > td) {
    padding: 16px;
  }

  :deep(.ant-table-tbody > tr:hover > td) {
    background: #f5f5f5;
  }
}

.member-info {
  .member-name {
    font-weight: 500;
    color: #262626;
  }

  .member-email {
    font-size: 12px;
    color: #8c8c8c;
  }
}

.package-info {
  .package-price {
    font-weight: 600;
    color: #1890ff;
  }

  .package-type {
    font-size: 12px;
    color: #8c8c8c;
  }
}

.bank-info {
  display: flex;
  align-items: center;
  gap: 8px;

  .bank-logo {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }
}

.amount-text {
  font-weight: 600;
  color: #52c41a;
}

.text-muted {
  color: #999;
}

.status-badge {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  letter-spacing: 0.5px;
  min-width: 150px;
  display: inline-block;
  text-align: center;
  white-space: nowrap;

  &.clickable:hover {
    opacity: 0.8;
    transform: scale(1.05);
    transition: all 0.2s ease;
  }
}

.status-dropdown-menu {
  min-width: 160px;

  .ant-menu-item {
    padding: 8px 16px;
    min-width: 260px;
  }

  .anticon {
    margin-right: 8px;
  }
}

.action-icons {
  display: flex;
  gap: 8px;
  justify-content: center;

  .icon {
    font-size: 16px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }

    &.edit {
      color: #1890ff;
    }

    &.view {
      color: #1890ff;
    }

    &.delete {
      color: #ff4d4f;
    }
  }
}
</style>
