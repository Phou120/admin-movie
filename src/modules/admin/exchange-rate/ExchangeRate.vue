<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import { ExchangeRateComposible } from "./composible/index";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type {
  IExchangeRateForm,
  IExchangeRateData,
  ICurrencyOption,
} from "./interface/exchange-rate.interface";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";
import AddExchangeRateModal from "./components/AddExchangeRateModal.vue";
import UpdateExchangeRateModal from "./components/UpdateExchangeRateModal.vue";

const {
  fetchAll,
  deleteExchangeRateById,
  updateExchangeRate,
  createExchangeRate,
  fetchCurrencies,
} = ExchangeRateComposible();

const operationOptions = [
  { label: "Multiply (×)", value: "*", description: "From × To" },
  { label: "Divide (÷)", value: "/", description: "From ÷ To" },
];

const columns = [
  { title: "No", dataIndex: "id", key: "no", align: "center", width: 60 },
  {
    title: "From Currency",
    key: "from_currency",
    align: "center",
    width: 150,
  },
  {
    title: "Operator",
    key: "operator",
    align: "center",
    width: 120,
  },
  {
    title: "To Currency",
    key: "to_currency",
    align: "center",
    width: 150,
  },
  {
    title: "Formula",
    key: "formula",
    align: "center",
    width: 200,
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 200,
  },
  {
    title: "Updated At",
    dataIndex: "updated_at",
    key: "updated_at",
    align: "center",
    width: 200,
  },
  { title: "Action", key: "action", align: "center", width: 110 },
];

const data = reactive<IExchangeRateData>({
  exchange_rates: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

const isEditModalVisible = ref(false);
const isAddModalVisible = ref(false);
const loading = ref(false);
const currencies = ref<ICurrencyOption[]>([]);
const selectedExchangeRate = ref<IExchangeRateForm | null>(null);

// Function to get record key
function getRecordKey(record: IExchangeRateForm): number {
  return record.id ?? 0;
}

// Function to calculate row number
function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

// Function to load exchange rates with pagination
async function loadExchangeRates(
  page = data.pagination.current,
  limit = data.pagination.pageSize
) {
  loading.value = true;
  try {
    console.log("Loading exchange rates with page:", page, "limit:", limit);
    const response = await fetchAll(page, limit);

    console.log("Exchange rates API response:", response);

    data.exchange_rates = response.data || [];

    // Handle pagination safely - check if pagination exists in response
    if (response.pagination) {
      const paginate = response.pagination;

      // Update pagination info based on response
      data.pagination = {
        current: paginate.currentPage || paginate.current || page,
        pageSize: paginate.limit || limit,
        total: paginate.total || 0,
        showSizeChanger: true,
      };
    } else {
      // Keep existing pagination if no pagination in response
      console.warn("No pagination in response, keeping existing pagination");
    }
  } catch (error) {
    console.error("Failed to load exchange rates:", error);
    showErrorNotification(
      "Failed to load exchange rates: " + (error as Error).message
    );
  } finally {
    loading.value = false;
  }
}

// Function to load currencies
async function loadCurrencies() {
  try {
    console.log("Loading currencies from API...");
    const response = await fetchCurrencies();
    console.log("Currencies API response:", response.data); // Debug log

    // Check if response data has the expected structure
    if (Array.isArray(response.data)) {
      currencies.value = response.data.map((curr: any) => {
        console.log("Processing currency:", curr); // Debug individual currency
        return {
          value: curr.id,
          label: `${curr.name} (${curr.short_name})`,
        };
      });
      console.log("Formatted currencies for dropdown:", currencies.value); // Debug log
    } else {
      console.error("Unexpected API response format:", response.data);
    }
  } catch (error) {
    console.error("Failed to load currencies:", error);
    // Add some test data as fallback
    currencies.value = [
      { value: 1, label: "Test Dollar (USD)" },
      { value: 2, label: "Test Kip (LAK)" },
      { value: 3, label: "Test Baht (THB)" },
    ];
    console.log("Using fallback test currencies:", currencies.value);
  }
}

// Load initial data
onMounted(() => {
  loadExchangeRates();
  loadCurrencies();
});

// Handle table pagination change
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadExchangeRates(current, pageSize);
}

// Open add modal
function openAddModal() {
  isAddModalVisible.value = true;
}

// Submit new exchange rate
async function submitAdd(form: IExchangeRateForm) {
  try {
    const response = await createExchangeRate(form);
    showSuccessNotification(response.message);
    isAddModalVisible.value = false;
    await loadExchangeRates();
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    showErrorNotification(message);
  }
}

// Open edit modal
function openEditModal(exchangeRate: any) {
  selectedExchangeRate.value = {
    id: exchangeRate.id,
    from_currency_id: exchangeRate.from_currency_id,
    operate: exchangeRate.operator,
    to_currency_id: exchangeRate.to_currency_id,
  };
  isEditModalVisible.value = true;
}

// Submit update
async function submitUpdate(form: IExchangeRateForm) {
  try {
    const response = await updateExchangeRate(form);
    showSuccessNotification(response.message);
    isEditModalVisible.value = false;
    selectedExchangeRate.value = null;
    await loadExchangeRates();
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    showErrorNotification(message);
  }
}

// Delete exchange rate
async function deleteExchangeRate(id: number) {
  try {
    const response = await deleteExchangeRateById(id);
    showSuccessNotification(response.message);
    await loadExchangeRates();
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    showErrorNotification(message);
  }
}

// Get currency display name from record data in format "name(short_name)"
function getCurrencyName(record: any, type: "from" | "to"): string {
  const currencyKey = type === "from" ? "fromCurrency" : "toCurrency";
  const currency = record[currencyKey];
  if (currency) {
    return `${currency.name} (${currency.short_name})`;
  }
  return `ID: ${record[`${type}_currency_id`]}`;
}

// Get currency code from record data
function getCurrencyCode(record: any, type: "from" | "to"): string {
  const currencyKey = type === "from" ? "fromCurrency" : "toCurrency";
  const currency = record[currencyKey];
  return currency
    ? currency.short_name
    : `ID: ${record[`${type}_currency_id`]}`;
}

// Get operation label
function getOperationLabel(operate: string): string {
  const option = operationOptions.find((op) => op.value === operate);
  return option ? option.label : operate;
}

// Get operation symbol
function getOperationSymbol(operate: string): string {
  return operate === "*" ? "×" : "÷";
}
</script>

<template>
  <div class="customer-header">
    <h1>Exchange Rates</h1>
    <div>
      <a-button
        type="primary"
        class="clear-btn"
        :icon="h(PlusCircleFilled)"
        @click="openAddModal"
      >
        Add Exchange Rate
      </a-button>
    </div>
  </div>

  <a-table
    :dataSource="data.exchange_rates"
    :columns="columns"
    :pagination="data.pagination"
    :loading="loading"
    :rowKey="getRecordKey"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'no'">
        {{ getRowNumber(index) }}
      </template>
      <template v-else-if="column.key === 'from_currency'">
        <div class="currency-display">
          {{ getCurrencyName(record, "from") }}
        </div>
      </template>
      <template v-else-if="column.key === 'operator'">
        <a-tag :color="record.operator === '*' ? 'blue' : 'green'">
          {{ getOperationLabel(record.operator) }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'to_currency'">
        <div class="currency-display">
          {{ getCurrencyName(record, "to") }}
        </div>
      </template>
      <template v-else-if="column.key === 'formula'">
        <code>
          {{ getCurrencyCode(record, "from") }}
          {{ getOperationSymbol(record.operator) }}
          {{ getCurrencyCode(record, "to") }}
        </code>
      </template>
      <template v-else-if="column.key === 'created_at'">
        {{ record.created_at }}
      </template>
      <template v-else-if="column.key === 'updated_at'">
        {{ record.updated_at }}
      </template>
      <template v-else-if="column.key === 'action'">
        <span class="action-icons">
          <a-tooltip title="Edit">
            <edit-outlined class="icon edit" @click="openEditModal(record)" />
          </a-tooltip>
          <a-popconfirm
            title="Are you sure to delete this exchange rate?"
            @confirm="deleteExchangeRate(record.id)"
          >
            <a-tooltip title="Delete">
              <delete-outlined class="icon delete" />
            </a-tooltip>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>

  <!-- Add Modal Component -->
  <AddExchangeRateModal
    v-model:visible="isAddModalVisible"
    @submit="submitAdd"
  />

  <!-- Update Modal Component -->
  <UpdateExchangeRateModal
    v-model:visible="isEditModalVisible"
    :exchangeRateData="selectedExchangeRate"
    :currencies="currencies"
    @submit="submitUpdate"
  />
</template>

<style lang="scss" scoped>
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

.action-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
}

.clear-btn {
  background-color: #0d334acc;
  border-color: #0d334acc;
  color: #ffffff;
}

.clear-btn:hover {
  background-color: #0d334acc;
  border-color: #0d334acc;
  color: #ffffff;
}

code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  font-size: 12px;
}

.currency-display {
  font-weight: 500;
  color: #262626;
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
}
</style>
