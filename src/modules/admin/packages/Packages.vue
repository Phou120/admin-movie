<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import { PackagesComposible } from "./composible/index";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type {
  IPackagesForm,
  IPackagesData,
} from "./interface/packages.interface";
import formatDate from "../../../common/utils/format-date.util";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";
import AddPackageModal from "./components/AddPackageModal.vue";
import UpdatePackageModal from "./components/UpdatePackageModal.vue";

const { fetchAll, deletePackageById, updatePackage, createPackage } =
  PackagesComposible();

const typeOptions = [
  { label: "1 Month", value: "1month" },
  { label: "3 Months", value: "3month" },
  { label: "6 Months", value: "6month" },
  { label: "1 Year", value: "1year" },
];

const columns = [
  { title: "No", dataIndex: "id", key: "no", align: "center", width: 60 },
  {
    title: "Package Type",
    dataIndex: "type",
    key: "type",
    align: "center",
    width: 150,
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    align: "center",
    width: 150,
  },
  {
    title: "Content",
    dataIndex: "content",
    key: "content",
    align: "center",
    width: 300,
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

const data = reactive<IPackagesData>({
  packages: [],
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

const selectedPackage = ref<IPackagesForm | null>(null);

// Function to get record key
function getRecordKey(record: IPackagesForm): number {
  return record.id ?? 0;
}

// Function to calculate row number
function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

// Function to load packages with pagination
async function loadPackages(
  page = data.pagination.current,
  limit = data.pagination.pageSize
) {
  loading.value = true;
  try {
    const response = await fetchAll(page, limit);

    data.packages = response.data;

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
  loadPackages();
});

// Handle table pagination change
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadPackages(current, pageSize);
}

// Open add modal
function openAddModal() {
  isAddModalVisible.value = true;
}

// Submit new package
async function submitAdd(form: IPackagesForm) {
  try {
    const response = await createPackage(form);
    showSuccessNotification(response.message);
    isAddModalVisible.value = false;
    await loadPackages();
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    showErrorNotification(message);
  }
}

// Open edit modal
function openEditModal(pkg: IPackagesForm) {
  selectedPackage.value = { ...pkg };
  isEditModalVisible.value = true;
}

// Submit update
async function submitUpdate(form: IPackagesForm) {
  try {
    const response = await updatePackage(form);
    showSuccessNotification(response.message);
    isEditModalVisible.value = false;
    selectedPackage.value = null;
    await loadPackages();
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;

    showErrorNotification(message);
  }
}

// Delete package
async function deletePackage(id: number) {
  try {
    const response = await deletePackageById(id);
    showSuccessNotification(response.message);
    await loadPackages();
  } catch (error) {
    showErrorNotification(
      "Failed to delete package: ",
      (error as Error).message
    );
  }
}

// Format price to display with commas
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US").format(price);
}

// Get package type label
function getPackageTypeLabel(type: string): string {
  const option = typeOptions.find((opt) => opt.value === type);
  return option ? option.label : type;
}
</script>

<template>
  <div class="customer-header">
    <h1>Packages</h1>
    <div>
      <a-button
        type="primary"
        class="clear-btn"
        :icon="h(PlusCircleFilled)"
        @click="openAddModal"
      >
        Add Package
      </a-button>
    </div>
  </div>

  <a-table
    :dataSource="data.packages"
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
      <template v-else-if="column.key === 'type'">
        {{ getPackageTypeLabel(record.type) }}
      </template>
      <template v-else-if="column.key === 'price'">
        ₭ {{ formatPrice(record.price) }}
      </template>
      <template v-else-if="column.key === 'content'">
        <div class="content-cell">
          <div v-if="record.content" class="rich-content" v-html="record.content"></div>
          <span v-else class="no-content">No content</span>
        </div>
      </template>
      <template v-else-if="column.key === 'created_at'">
        {{ formatDate(record.created_at) }}
      </template>
      <template v-else-if="column.key === 'updated_at'">
        {{ formatDate(record.updated_at) }}
      </template>
      <template v-else-if="column.key === 'action'">
        <span class="action-icons">
          <a-tooltip title="Edit">
            <edit-outlined class="icon edit" @click="openEditModal(record)" />
          </a-tooltip>
          <a-popconfirm
            title="Are you sure to delete this package?"
            @confirm="deletePackage(record.id)"
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
  <AddPackageModal v-model:visible="isAddModalVisible" @submit="submitAdd" />

  <!-- Update Modal Component -->
  <UpdatePackageModal
    v-model:visible="isEditModalVisible"
    :packageData="selectedPackage"
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

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.custom-cancel-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
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

// Content cell styles
.content-cell {
  max-width: 300px;

  .rich-content {
    // Quill content styles for table display
    :deep(h1) {
      font-size: 16px;
      font-weight: bold;
      margin: 4px 0;
    }

    :deep(h2) {
      font-size: 14px;
      font-weight: bold;
      margin: 4px 0;
    }

    :deep(h3) {
      font-size: 13px;
      font-weight: bold;
      margin: 4px 0;
    }

    :deep(p) {
      margin: 2px 0;
      line-height: 1.4;
    }

    :deep(strong) {
      font-weight: bold;
    }

    :deep(em) {
      font-style: italic;
    }

    :deep(u) {
      text-decoration: underline;
    }

    :deep(ul), :deep(ol) {
      margin: 2px 0;
      padding-left: 20px;
    }

    :deep(li) {
      margin: 1px 0;
    }

    :deep(blockquote) {
      border-left: 3px solid #d9d9d9;
      padding-left: 8px;
      margin: 4px 0;
      font-style: italic;
      color: #666;
    }

    :deep(a) {
      color: #1890ff;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    // Truncate long content
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    box-orient: vertical;
  }

  .no-content {
    color: #999;
    font-style: italic;
    font-size: 13px;
  }
}
</style>
