<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { BankComposible } from "./composible/index";
import {
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IBankForm, IBankList } from "./interface/bank.interface";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";
import AddBankModal from "./components/AddBankModal.vue";
import EditBankModal from "./components/EditBankModal.vue";
import AddButton from "../../../components/AddButton.vue";

const router = useRouter();
const { fetchAll, deleteBankById, updateBank, createBank, upload } =
  BankComposible();
const { t } = useI18n();

const columns = computed(() => [
  {
    title: t("modules.bank.columns.no"),
    dataIndex: "id",
    key: "no",
    align: "center",
    width: 70,
  },
  {
    title: t("modules.bank.columns.logo"),
    dataIndex: "logo_url",
    key: "logo_url",
    align: "center",
    width: 150,
  },
  {
    title: t("modules.bank.columns.name"),
    dataIndex: "name",
    key: "name",
    align: "left",
    width: 250,
  },
  {
    title: t("modules.bank.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 180,
  },
  {
    title: t("modules.bank.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    align: "center",
    width: 180,
  },
  {
    title: t("modules.bank.columns.action"),
    key: "action",
    align: "center",
    width: 120,
  },
]);

const data = reactive<IBankList>({
  banks: [],
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
const selectedBank = ref<IBankForm | null>(null);
const addModalRef = ref();
const editModalRef = ref();

// Function to get record key
function getRecordKey(record: IBankForm): number {
  return record.id ?? 0;
}

// Function to calculate row number
function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

// Function to load banks with pagination - FIXED
async function loadBanks(
  page = data.pagination.current,
  limit = data.pagination.pageSize
) {
  loading.value = true;
  try {
    const response = await fetchAll(page, limit);

    // Set banks data
    data.banks = response.data || [];

    // Safely handle pagination with default values
    const paginate = response.pagination || {};

    data.pagination = {
      current: paginate.currentPage ?? page ?? 1,
      pageSize: paginate.limit ?? limit ?? 10,
      total: paginate.total ?? 0,
      showSizeChanger: true,
    };
  } catch (error) {
    console.error("Failed to load banks", error);
    showErrorNotification(
      t("modules.bank.form.validation.loadError"),
      (error as Error).message
    );

    // Reset to safe defaults on error
    data.banks = [];
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
  loadBanks();
});

// Handle table pagination change
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadBanks(current, pageSize);
}

// Modal handlers
function openAddModal() {
  isAddModalVisible.value = true;
}

function openEditModal(bank: any) {
  selectedBank.value = {
    id: bank.id,
    name: bank.name,
    logo: bank.logo_url, // Use logo_url for preview
  };
  isEditModalVisible.value = true;
}

function openBankCurrencyPage(bank: any) {
  console.log("id", bank.id);
  router.push(`/bank-currency/${bank.id}`);
}

// CRUD operations - FIXED with modal close
async function handleAddSuccess() {
  try {
    const formData = addModalRef.value?.formData;

    if (!formData?.name?.trim()) {
      showErrorNotification(
        t("common.error"),
        t("modules.bank.form.validation.nameRequired")
      );
      return;
    }

    if (!formData?.logo) {
      showErrorNotification(
        t("common.error"),
        t("modules.bank.form.validation.logoRequired")
      );
      return;
    }

    let logo = formData.logo;
    // If it's a File object, upload it first
    if (formData.logo instanceof File) {
      const uploadResponse = await upload(formData.logo);
      logo = uploadResponse;
    }

    const payload = {
      name: formData.name.trim(),
      logo: logo,
    };

    const response = await createBank(payload);
    showSuccessNotification(response.message);

    // Close modal before reloading
    isAddModalVisible.value = false;

    // Reload data
    await loadBanks();
  } catch (error) {
    console.error("Failed to create bank:", error);
    showErrorNotification(
      t("modules.bank.form.validation.createError"),
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
        t("modules.bank.form.validation.nameRequired")
      );
      return;
    }

    if (!formData?.id) {
      showErrorNotification(
        t("common.error"),
        t("modules.bank.form.validation.idRequired")
      );
      return;
    }

    let logo = null;
    // If it's a File object, upload it first
    if (formData.logo instanceof File) {
      const uploadResponse = await upload(formData.logo);
      logo = uploadResponse;
    }
    // If logo is null, it means user didn't upload a new logo

    const payload = {
      id: formData.id,
      name: formData.name.trim(),
      logo: logo, // Will be null if no new logo uploaded
    };

    const response = await updateBank(payload);
    showSuccessNotification(response.message || "Bank updated successfully");

    // Close modal before reloading
    isEditModalVisible.value = false;

    // Reload data
    await loadBanks();
  } catch (error) {
    console.error("Failed to update bank:", error);
    showErrorNotification(
      t("modules.bank.form.validation.updateError"),
      (error as Error).message
    );
  }
}

async function deleteBank(id: number) {
  try {
    const response = await deleteBankById(id);
    showSuccessNotification(response.message || "Bank deleted successfully");

    // Smart pagination after delete
    const totalItems = data.pagination.total ?? 0;
    const currentPage = data.pagination.current ?? 1;
    const pageSize = data.pagination.pageSize ?? 10;

    // If deleting last item on a page (not first page), go to previous page
    if (
      totalItems > 0 &&
      (totalItems - 1) % pageSize === 0 &&
      currentPage > 1
    ) {
      await loadBanks(currentPage - 1, pageSize);
    } else {
      await loadBanks();
    }
  } catch (error) {
    console.error("Failed to delete bank:", error);
    showErrorNotification(
      t("modules.bank.form.validation.deleteError"),
      (error as Error).message
    );
  }
}

// Function to handle image error
function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target) {
    // Generate a default avatar with the bank name
    const bankName = target.alt || "Bank";
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      bankName
    )}&background=1890ff&color=fff&size=80&bold=true`;
  }
}
</script>

<template>
  <div class="bank-header">
    <h1>{{ t("modules.bank.title") }}</h1>
    <div>
      <AddButton :label="t('modules.bank.addNew')" @click="openAddModal" />
    </div>
  </div>

  <!-- Table Section -->
  <div class="table-container">
    <a-table
      :dataSource="data.banks"
      :columns="columns"
      :pagination="data.pagination"
      :loading="loading"
      :rowKey="getRecordKey"
      @change="handleTableChange"
      class="bank-table"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'no'">
          <span class="row-number">{{ getRowNumber(index) }}</span>
        </template>

        <template v-else-if="column.key === 'logo_url'">
          <img
            :src="record.logo_url"
            :alt="record.name"
            class="bank-logo"
            @error="handleImageError"
          />
        </template>

        <template v-else-if="column.key === 'name'">
          <span class="bank-name-text">
            {{ record.name }}
          </span>
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
            <a-tooltip :title="t('modules.bank.manageCurrencies')">
              <dollar-outlined
                class="icon currency"
                @click="openBankCurrencyPage(record)"
              />
            </a-tooltip>
            <a-popconfirm
              :title="t('message.deleteConfirm')"
              placement="topRight"
              :ok-text="t('actions.delete')"
              :cancel-text="t('actions.cancel')"
              ok-type="danger"
              @confirm="deleteBank(record.id)"
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
  <AddBankModal
    ref="addModalRef"
    v-model:visible="isAddModalVisible"
    @success="handleAddSuccess"
  />

  <EditBankModal
    ref="editModalRef"
    v-model:visible="isEditModalVisible"
    :bank="selectedBank"
    @success="handleEditSuccess"
  />
</template>

<style lang="scss" scoped>
.bank-header {
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

.bank-table {
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

.bank-name-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #262626;

  .bank-icon {
    color: #1890ff;
    font-size: 16px;
  }
}

.bank-logo {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
