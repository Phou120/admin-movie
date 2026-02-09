<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { CurrencyComposible } from "./composible/index";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type {
  ICurrencyForm,
  ICurrencyList,
} from "./interface/currency.interface";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";
import AddCurrencyModal from "./components/AddCurrencyModal.vue";
import EditCurrencyModal from "./components/EditCurrencyModal.vue";
import AddButton from "../../../components/AddButton.vue";

const { fetchAll, deleteCurrencyById, updateCurrency, createCurrency } =
  CurrencyComposible();
const { t } = useI18n();

const columns = computed(() => [
  {
    title: t("modules.currency.columns.no"),
    dataIndex: "id",
    key: "no",
    align: "center",
    width: 70,
  },
  {
    title: t("modules.currency.columns.name"),
    dataIndex: "name",
    key: "name",
    align: "left",
    width: 200,
  },
  {
    title: t("modules.currency.columns.shortName"),
    dataIndex: "short_name",
    key: "short_name",
    align: "center",
    width: 120,
  },
  {
    title: t("modules.currency.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 180,
  },
  {
    title: t("modules.currency.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    align: "center",
    width: 180,
  },
  {
    title: t("modules.currency.columns.action"),
    key: "action",
    align: "center",
    width: 120,
  },
]);

const data = reactive<ICurrencyList>({
  currencies: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

const loading = ref(false);
const isAddModalVisible = ref(false);
const isEditModalVisible = ref(false);
const selectedCurrency = ref<ICurrencyForm | null>(null);
const addModalRef = ref();
const editModalRef = ref();

// Function to get record key
function getRecordKey(record: ICurrencyForm): number {
  return record.id ?? 0;
}

// Function to calculate row number
function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

// Function to load currencies with pagination
async function loadCurrencies(page = 1, limit = 10) {
  loading.value = true;
  try {
    const response = await fetchAll(page, limit);

    data.currencies = response.data || [];

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
      t("modules.currency.form.validation.loadError"),
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
  loadCurrencies();
});

// Handle table pagination change
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadCurrencies(current, pageSize);
}

// Modal handlers
function openAddModal() {
  isAddModalVisible.value = true;
}

function openEditModal(currency: any) {
  selectedCurrency.value = {
    id: currency.id,
    name: currency.name,
    short_name: currency.short_name,
  };
  isEditModalVisible.value = true;
}

// CRUD operations
async function handleAddSuccess() {
  try {
    const formData = addModalRef.value?.formData;

    if (!formData?.name?.trim()) {
      showErrorNotification(
        t("common.error"),
        t("modules.currency.form.validation.nameRequired")
      );
      return;
    }

    if (!formData?.short_name?.trim()) {
      showErrorNotification(
        t("common.error"),
        t("modules.currency.form.validation.shortNameRequired")
      );
      return;
    }

    const response = await createCurrency({
      name: formData.name,
      short_name: formData.short_name,
    });
    showSuccessNotification(response.message);
    await loadCurrencies();
  } catch (error) {
    showErrorNotification(
      t("modules.currency.form.validation.createError"),
      (error as Error).message
    );
  }
}

async function handleEditSuccess() {
  try {
    const formData = editModalRef.value?.formData;

    if (!formData?.name?.trim()) {
      showErrorNotification(
        t("common.error"),
        t("modules.currency.form.validation.nameRequired")
      );
      return;
    }

    if (!formData?.short_name?.trim()) {
      showErrorNotification(
        t("common.error"),
        t("modules.currency.form.validation.shortNameRequired")
      );
      return;
    }

    const response = await updateCurrency({
      id: formData.id,
      name: formData.name,
      short_name: formData.short_name,
    });
    showSuccessNotification(response.message);
    await loadCurrencies();
  } catch (error) {
    showErrorNotification(
      t("modules.currency.form.validation.updateError"),
      (error as Error).message
    );
  }
}

async function deleteCurrency(id: number) {
  try {
    const response = await deleteCurrencyById(id);
    showSuccessNotification(response.message);
    await loadCurrencies();
  } catch (error) {
    showErrorNotification(
      t("modules.currency.form.validation.deleteError"),
      (error as Error).message
    );
  }
}
</script>

<template>
  <div class="currency-header">
    <h1>{{ t("modules.currency.title") }}</h1>
    <div>
      <AddButton :label="t('modules.currency.addNew')" @click="openAddModal" />
    </div>
  </div>

  <!-- Table Section -->
  <div class="table-container">
    <a-table
      :dataSource="data.currencies"
      :columns="columns"
      :pagination="data.pagination"
      :loading="loading"
      :rowKey="getRecordKey"
      @change="handleTableChange"
      class="currency-table"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'no'">
          <span class="row-number">{{ getRowNumber(index) }}</span>
        </template>

        <template v-else-if="column.key === 'name'">
          <span class="currency-name-text">
            {{ record.name }}
          </span>
        </template>

        <template v-else-if="column.key === 'short_name'">
          <span class="short-name-badge">{{
            record.short_name.toUpperCase()
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
            <a-tooltip :title="t('actions.edit')">
              <edit-outlined class="icon edit" @click="openEditModal(record)" />
            </a-tooltip>
            <a-popconfirm
              :title="t('message.deleteConfirm')"
              placement="topRight"
              @confirm="deleteCurrency(record.id)"
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

  <!-- Separated Modal Components -->
  <AddCurrencyModal
    ref="addModalRef"
    v-model:visible="isAddModalVisible"
    @success="handleAddSuccess"
  />

  <EditCurrencyModal
    ref="editModalRef"
    v-model:visible="isEditModalVisible"
    :currency="selectedCurrency"
    @success="handleEditSuccess"
  />
</template>

<style lang="scss" scoped>
.currency-header {
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

.currency-table {
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
</style>
