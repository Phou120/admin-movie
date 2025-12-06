<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ViewsComposible } from "./composible/index";
import { EditOutlined } from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IViewsData, IViewsForm } from "./interface/views.interface";
import formatDate from "../../../common/utils/format-date.util";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";
import UpdateViewModal from "./components/UpdateViewModal.vue";

const { fetchAll, updateView } = ViewsComposible();

const columns = [
  { title: "No", dataIndex: "id", key: "no", align: "center", width: 60 },
  {
    title: "Quantity",
    dataIndex: "qty",
    key: "qty",
    align: "center",
    width: 100,
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    align: "center",
    width: 150,
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 200,
  },
  {
    title: "Action",
    key: "action",
    align: "center",
    width: 100,
  },
];

const data = reactive<IViewsData>({
  views: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

const isUpdateModalVisible = ref(false);
const selectedView = ref<IViewsForm | null>(null);
const loading = ref(false);

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

// Function to load views with pagination
async function loadViews(
  page = data.pagination.current,
  limit = data.pagination.pageSize
) {
  loading.value = true;
  try {
    const response = await fetchAll(page, limit);

    data.views = response.data || [];

    const paginate = response.pagination;

    // Update pagination info based on response
    data.pagination = {
      current: paginate?.currentPage || paginate?.current || page,
      pageSize: paginate?.limit || limit,
      total: paginate?.total || 0,
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
  loadViews();
});

// Handle table pagination change
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadViews(current, pageSize);
}

// Open update modal
function openUpdateModal(record: any) {
  selectedView.value = {
    id: record.id,
    qty: record.qty,
    price: record.price,
  };
  isUpdateModalVisible.value = true;
}

// Submit updated view
async function submitUpdate(form: IViewsForm) {
  try {
    const response = await updateView(form);
    showSuccessNotification(response.message);
    isUpdateModalVisible.value = false;
    await loadViews();
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    showErrorNotification(message);
  }
}

// Format price to display with commas
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US").format(price);
}
</script>

<template>
  <div class="customer-header">
    <h1>Views</h1>
  </div>

  <a-table
    :dataSource="data.views"
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
      <template v-else-if="column.key === 'price'">
        ₭ {{ formatPrice(record.price) }}
      </template>
      <template v-else-if="column.key === 'created_at'">
        {{ formatDate(record.created_at) }}
      </template>
      <template v-else-if="column.key === 'action'">
        <span class="action-icons">
          <a-tooltip title="Edit">
            <edit-outlined class="icon edit" @click="openUpdateModal(record)" />
          </a-tooltip>
        </span>
      </template>
    </template>
  </a-table>

  <!-- Update Modal Component -->
  <UpdateViewModal
    v-model:visible="isUpdateModalVisible"
    :viewData="selectedView"
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
</style>
