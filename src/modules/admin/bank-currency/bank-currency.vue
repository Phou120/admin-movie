<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BankCurrencyComposible } from "./composible/index";
import { DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IBankCurrencyList } from "./interface/bank-currency.interface";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";
import AddBankCurrencyModal from "./components/AddBankCurrencyModal.vue";
import AddButton from "../../../components/AddButton.vue";

const route = useRoute();
const router = useRouter();
const bankId = parseInt(route.params.id as string);
console.log("bankId", bankId);

// Function to go back to banks page
function goBackToBanks() {
  router.push("/bank");
}

const { fetchAll, deleteBankCurrencyById, createBankCurrency } =
  BankCurrencyComposible();

const columns = [
  { title: "No", dataIndex: "id", key: "no", align: "center", width: 80 },
  {
    title: "Currency Name",
    dataIndex: ["currency", "name"],
    key: "currency_name",
    align: "left",
    width: 200,
  },
  {
    title: "Currency Short Name",
    dataIndex: ["currency", "short_name"],
    key: "currency_short_name",
    align: "center",
    width: 150,
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 180,
  },
  {
    title: "Updated At",
    dataIndex: "updated_at",
    key: "updated_at",
    align: "center",
    width: 180,
  },
  { title: "Action", key: "action", align: "center", width: 120 },
];

const data = reactive<IBankCurrencyList>({
  bankCurrencies: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

const loading = ref(false);
const isAddModalVisible = ref(false);
const addModalRef = ref();

// Function to get record key
function getRecordKey(record: any): number {
  return record.id ?? 0;
}

// Function to calculate row number
function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

// Function to load bank currencies with pagination
async function loadBankCurrencies(page = 1, limit = 10) {
  loading.value = true;
  try {
    const response = await fetchAll(bankId, page, limit);

    data.bankCurrencies = response.data || [];

    // Handle pagination with fallbacks
    const paginate = response.pagination || {};

    // Update pagination info based on response with fallbacks
    data.pagination = {
      current: paginate.currentPage || paginate.current || page,
      pageSize: paginate.limit || paginate.pageSize || limit,
      total: paginate.total || 0,
      showSizeChanger: true,
    };
  } catch (error) {
    showErrorNotification(
      "Failed to load bank currencies:",
      (error as Error).message
    );
    // Reset to safe defaults on error
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

// Load initial data
onMounted(() => {
  loadBankCurrencies();
});

// Handle table pagination change
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadBankCurrencies(current, pageSize);
}

// Modal handlers
function openAddModal() {
  isAddModalVisible.value = true;
}

// CRUD operations
async function handleAddSuccess() {
  try {
    const formData = addModalRef.value?.formData;

    if (!formData?.currency_id || formData.currency_id === 0) {
      showErrorNotification("Validation Error", "Currency is required");
      return;
    }

    const response = await createBankCurrency({
      bank_id: bankId,
      currency_id: formData.currency_id,
    });
    showSuccessNotification(response.message);
    await loadBankCurrencies();
  } catch (error: any) {
    // Handle backend error messages properly
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create bank currency";
    showErrorNotification(errorMessage);
  }
}

async function deleteBankCurrency(id: number) {
  try {
    const response = await deleteBankCurrencyById(id);
    showSuccessNotification(response.message);
    await loadBankCurrencies();
  } catch (error: any) {
    // Handle backend error messages properly
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete bank currency";
    showErrorNotification("Failed to delete bank currency", errorMessage);
  }
}
</script>

<template>
  <div class="bank-currency-header">
    <div class="header-left">
      <a-button
        type="text"
        size="large"
        class="back-button"
        @click="goBackToBanks"
      >
        <ArrowLeftOutlined />
        Back to Banks
      </a-button>
      <h1>Bank Currency Management</h1>
    </div>
    <div class="header-right">
      <AddButton label="Add Bank Currency" @click="openAddModal" />
    </div>
  </div>

  <!-- Table Section -->
  <div class="table-container">
    <a-table
      :dataSource="data.bankCurrencies"
      :columns="columns"
      :pagination="data.pagination"
      :loading="loading"
      :rowKey="getRecordKey"
      @change="handleTableChange"
      class="bank-currency-table"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'no'">
          <span class="row-number">{{ getRowNumber(index) }}</span>
        </template>

        <template v-else-if="column.key === 'currency_name'">
          <span class="currency-name-text">
            {{ record.currency.name }}
          </span>
        </template>

        <template v-else-if="column.key === 'currency_short_name'">
          <span class="short-name-badge">{{
            record.currency.short_name.toUpperCase()
          }}</span>
        </template>

        <template v-else-if="column.key === 'created_at'">
          <span>{{ record.created_at }}</span>
        </template>

        <template v-else-if="column.key === 'updated_at'">
          <span>{{ record.updated_at }}</span>
        </template>

        <template v-else-if="column.key === 'action'">
          <div class="action-icons">
            <!-- <a-tooltip title="Edit">
              <edit-outlined class="icon edit" @click="openEditModal(record)" />
            </a-tooltip> -->
            <a-popconfirm
              title="Are you sure to delete this bank currency?"
              placement="topRight"
              @confirm="deleteBankCurrency(record.id)"
            >
              <a-tooltip title="Delete">
                <delete-outlined class="icon delete" />
              </a-tooltip>
            </a-popconfirm>
          </div>
        </template>
      </template>
    </a-table>
  </div>

  <!-- Separated Modal Components -->
  <AddBankCurrencyModal
    ref="addModalRef"
    v-model:visible="isAddModalVisible"
    :bankId="bankId"
    @success="handleAddSuccess"
  />

  <!-- <EditBankCurrencyModal
    ref="editModalRef"
    v-model:visible="isEditModalVisible"
    :bankId="bankId"
    :bankCurrency="selectedBankCurrency"
    @success="handleEditSuccess"
  /> -->
</template>

<style lang="scss" scoped>
.bank-currency-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 12px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-button {
      display: flex;
      align-items: center;
      gap: 8px;
      // color: #1890ff;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.2s;

      &:hover {
        background: #f0f0f0;
        // color: #40a9ff;
      }
    }

    h1 {
      font-size: 24px;
      margin: 0;
      color: #262626;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.bank-currency-table {
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

.row-number {
  font-weight: 600;
  color: #8c8c8c;
}

.currency-name-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #262626;
}

.short-name-badge {
  display: inline-block;
  padding: 4px 8px;
  background: #1890ff;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  min-width: 50px;
}

.action-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;

  .icon {
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;

    &.edit {
      color: #1890ff;

      &:hover {
        color: #40a9ff;
        transform: scale(1.1);
      }
    }

    &.delete {
      color: #ff4d4f;

      &:hover {
        color: #ff7875;
        transform: scale(1.1);
      }
    }
  }
}
</style>
