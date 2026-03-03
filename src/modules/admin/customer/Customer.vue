<template>
  <div class="customer-header">
    <h1>{{ t("modules.customer.title") }}</h1>
    <!-- <div>
      <AddButton
        :label="t('modules.customer.addNew')"
        @click="goToAddCustomer"
      />
    </div> -->
  </div>

  <div class="search-container">
    <a-input-search
      v-model:value="searchText"
      :placeholder="t('modules.customer.searchPlaceholder')"
      style="max-width: 400px; width: 100%"
      @search="handleSearch"
      @change="handleSearchChange"
      allow-clear
      enter-button
    />
  </div>

  <div class="table-container">
    <a-table
      :data-source="data.customers"
      :columns="columns"
      :pagination="data.pagination"
      :loading="loading"
      row-key="id"
      :scroll="{ x: 800 }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'no'">
          {{ pageOffset + index + 1 }}
        </template>

        <template v-else-if="column.key === 'profile'">
          <a-avatar
            :src="record.user?.profile?.image_url"
            :size="50"
            shape="circle"
            class="customer-avatar"
          >
            <template #icon>
              <user-outlined v-if="!record.user?.profile?.image_url" />
            </template>
          </a-avatar>
        </template>

        <template v-else-if="column.key === 'name'">
          {{ record.name }}
        </template>

        <template v-else-if="column.key === 'surname'">
          {{ record.surname }}
        </template>

        <template v-else-if="column.key === 'email'">
          <a :href="`mailto:${record.email}`">{{ record.email }}</a>
        </template>

        <template v-else-if="column.key === 'tel'">
          <a :href="`tel:${record.tel}`">{{ record.tel }}</a>
        </template>

        <template v-else-if="column.key === 'address'">
          <span v-if="record.address">{{ record.address }}</span>
          <span v-else class="text-muted">-</span>
        </template>

        <template v-else-if="column.key === 'status'">
          <a-select
            :value="record.status"
            @change="(value: string) => handleStatusChange(record.id, value)"
            :loading="record.statusLoading"
            :class="['status-select', `status-${record.status}`]"
          >
            <a-select-option value="pending">
              <WarningOutlined style="color: #faad14; margin-right: 6px" />
              <span>{{ getStatusLabel("pending") }}</span>
            </a-select-option>
            <a-select-option value="approved">
              <CheckCircleOutlined style="color: #52c41a; margin-right: 6px" />
              <span>{{ getStatusLabel("approved") }}</span>
            </a-select-option>
            <a-select-option value="blacklisted">
              <CloseCircleOutlined style="color: #ff4d4f; margin-right: 6px" />
              <span>{{ getStatusLabel("blacklisted") }}</span>
            </a-select-option>
          </a-select>
        </template>

        <template v-else-if="column.key === 'created_at'">
          {{ formatDate(record.created_at) }}
        </template>

        <template v-else-if="column.key === 'updated_at'">
          {{ formatDate(record.updated_at) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <span class="action-icons">
            <a-tooltip :title="t('actions.edit')">
              <edit-outlined
                class="icon edit"
                @click="goToEditCustomer(record)"
              />
            </a-tooltip>
            <a-popconfirm
              :title="t('message.deleteConfirm')"
              @confirm="deleteCustomer(record.id)"
            >
              <a-tooltip :title="t('actions.delete')">
                <delete-outlined class="icon delete" />
              </a-tooltip>
            </a-popconfirm>
          </span>
        </template>

        <template v-else>
          {{ record[column.dataIndex] }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { ICustomer } from "./interface/customer.interface";
import { useCustomer } from "./composible/index";
import formatDate from "../../../common/utils/format-date.util";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";

const router = useRouter();
const { fetchAll, deleteCustomerById, updateStatus } = useCustomer();
const { t } = useI18n();

// State
const loading = ref(false);
const searchText = ref("");

// Table Data
const data = reactive<ICustomer>({
  customers: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

// Computed property to get the starting number for the current page
const pageOffset = computed(() => {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize;
});

// Table columns
const columns = computed(() => [
  {
    title: t("modules.customer.columns.no"),
    key: "no",
    align: "center",
    width: 70,
  },
  {
    title: t("modules.customer.columns.profile"),
    dataIndex: "profile_url",
    key: "profile",
    width: 80,
    align: "center",
  },
  {
    title: t("modules.customer.columns.name"),
    dataIndex: "name",
    key: "name",
    width: 120,
  },
  {
    title: t("modules.customer.columns.surname"),
    dataIndex: "surname",
    key: "surname",
    width: 120,
  },
  {
    title: t("modules.customer.columns.email"),
    dataIndex: "email",
    key: "email",
    width: 240,
  },
  {
    title: t("modules.customer.columns.phone"),
    dataIndex: "tel",
    key: "tel",
    width: 180,
  },
  {
    title: t("modules.customer.form.address"),
    dataIndex: "address",
    key: "address",
    width: 250,
  },
  {
    title: t("modules.customer.columns.status"),
    dataIndex: "status",
    key: "status",
    width: 180,
    align: "center",
  },
  {
    title: t("modules.customer.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    width: 180,
  },
  {
    title: t("modules.customer.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    width: 180,
  },
  {
    title: t("modules.customer.columns.action"),
    key: "action",
    width: 100,
    fixed: "right",
    align: "center",
  },
]);

// Load customers
async function loadCustomers(
  page = data.pagination.current,
  limit = data.pagination.pageSize,
  search = searchText.value,
) {
  loading.value = true;
  try {
    const res = await fetchAll(page, limit, search);
    data.customers = res.data || [];

    const paginate = res.pagination || {};

    data.pagination = {
      current: paginate.currentPage,
      pageSize: paginate.limit,
      total: paginate.total,
      showSizeChanger: true,
    };
  } finally {
    loading.value = false;
  }
}

// Table pagination
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadCustomers(current, pageSize);
}

// Search handlers
function handleSearch(value: string) {
  searchText.value = value;
  loadCustomers(1, data.pagination.pageSize, value);
}

function handleSearchChange(e: any) {
  if (!e.target.value) {
    searchText.value = "";
    loadCustomers(1, data.pagination.pageSize, "");
  }
}

// Navigation functions
function goToEditCustomer(customer: any) {
  router.push(`/customer/edit/${customer.id}`);
}

// Delete Customer
async function deleteCustomer(id: number) {
  try {
    const response = await deleteCustomerById(id);
    showSuccessNotification(response.message);
    loadCustomers();
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    showErrorNotification(message);
  }
}

// Update Customer Status
async function updateCustomerStatus(id: number, status: string) {
  try {
    const response = await updateStatus(id, status);
    showSuccessNotification(response.message);
    loadCustomers();
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    showErrorNotification(message);
  }
}

// Get translated status label
const getStatusLabel = (status: string) => {
  const statusKey = status?.toLowerCase();
  return t(`status.${statusKey}`, status?.toUpperCase() || "");
};

// Handle status change with switch
function handleStatusChange(id: number, status: string) {
  updateCustomerStatus(id, status);
}

onMounted(() => loadCustomers());
</script>

<style scoped lang="scss">
.customer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 12px;

  h1 {
    font-size: 24px;
    margin: 0;
  }
}

.search-container {
  padding: 0 12px;
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start;
}

.table-container {
  overflow-x: auto;
  padding: 0 12px;
}

.customer-avatar {
  border: 2px solid #f0f0f0;
}

.clear-btn {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}

.clear-btn:hover {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
}

.custom-ok-btn {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}

.custom-ok-btn:hover {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}

.custom-cancel-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

// Status Select Styling
.status-select {
  min-width: 150px;
  width: auto;

  :deep(.ant-select-selector) {
    font-weight: 500;
    text-transform: capitalize;
    font-size: 13px;
    display: flex;
    align-items: center;
    padding: 4px 12px !important;
    min-height: 32px;
    white-space: nowrap;
  }

  &.status-pending {
    :deep(.ant-select-selector) {
      background-color: #faad14 !important;
      border-color: #faad14 !important;
      color: #fff !important;
    }
    :deep(.ant-select-arrow) {
      color: #fff;
    }
  }

  &.status-approved {
    :deep(.ant-select-selector) {
      background-color: #52c41a !important;
      border-color: #52c41a !important;
      color: #fff !important;
    }
    :deep(.ant-select-arrow) {
      color: #fff;
    }
  }

  &.status-blacklisted {
    :deep(.ant-select-selector) {
      background-color: #ff4d4f !important;
      border-color: #ff4d4f !important;
      color: #fff !important;
    }
    :deep(.ant-select-arrow) {
      color: #fff;
    }
  }

  // Dropdown options styling
  :deep(.ant-select-item) {
    display: flex;
    align-items: center;

    .anticon {
      font-size: 14px;
    }

    span {
      font-weight: 500;
    }
  }
}

.text-muted {
  color: #999;
  font-style: italic;
}

.status-badge {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  letter-spacing: 0.5px;
}

// Responsive styles
@media screen and (max-width: 768px) {
  .customer-header {
    padding: 8px;

    h1 {
      font-size: 20px;
    }
  }

  .table-container {
    padding: 0 8px;
  }

  .customer-avatar {
    width: 40px;
    height: 40px;
  }

  .modal-footer {
    flex-wrap: wrap;

    button {
      flex: 1;
      min-width: 100px;
    }
  }
}

@media screen and (max-width: 576px) {
  .customer-header {
    flex-direction: column;
    align-items: stretch;

    h1 {
      font-size: 18px;
      text-align: center;
    }

    .clear-btn {
      width: 100%;
    }
  }

  .btn-text {
    display: inline;
  }

  .customer-avatar {
    width: 35px;
    height: 35px;
  }

  .modal-footer {
    button {
      flex: 1;
      min-width: auto;
    }
  }
}

@media screen and (max-width: 480px) {
  .customer-header h1 {
    font-size: 16px;
  }
}
</style>
