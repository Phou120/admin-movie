<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import { CourseCategoryComposible } from "./composible/index";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type {
  ICustomerForm,
  IUserCourseCategory,
} from "./interface/category.interface";
import formatDate from "../../../common/utils/format-date.util";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";

const { fetchAll, deleteCategoryById, updateCategory, createCategory } =
  CourseCategoryComposible();

const columns = [
  { title: "No", dataIndex: "id", key: "no", align: "center", width: 60 },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    align: "center",
    width: 200,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
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

const data = reactive<IUserCourseCategory>({
  categories: [],
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

const formUpdate = ref<ICustomerForm>({
  id: 0,
  name: "",
  description: "",
});

const formAdd = ref<ICustomerForm>({
  name: "",
  description: "",
});

// Function to get record key
function getRecordKey(record: ICustomerForm): number {
  return record.id ?? 0;
}

// Function to calculate row number
function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

// Function to load categories with pagination
async function loadCategories(
  page = data.pagination.current,
  limit = data.pagination.pageSize
) {
  loading.value = true;
  try {
    const response = await fetchAll(page, limit);

    data.categories = response.data;

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
  loadCategories();
});

// Handle table pagination change
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadCategories(current, pageSize);
}

// Open add modal
function openAddModal() {
  formAdd.value = { name: "", description: "" };
  isAddModalVisible.value = true;
}

// Submit new category
async function submitAdd() {
  try {
    const response = await createCategory(formAdd.value);
    showSuccessNotification(response.message);
    isAddModalVisible.value = false;
    await loadCategories();
  } catch (error) {
    showErrorNotification("Failed to add category: ", (error as Error).message);
  }
}

// Open edit modal
function openEditModal(category: ICustomerForm) {
  formUpdate.value = {
    id: category.id,
    name: category.name,
    description: category.description,
  };
  isEditModalVisible.value = true;
}

// Submit update
async function submitUpdate() {
  try {
    const response = await updateCategory(formUpdate.value);
    showSuccessNotification(response.message);
    isEditModalVisible.value = false;
    await loadCategories();
  } catch (err) {
    showErrorNotification(
      "Failed to update category: ",
      (err as Error).message
    );
  }
}

// Delete category
async function deleteCategory(id: number) {
  try {
    const response = await deleteCategoryById(id);
    showSuccessNotification(response.message);
    await loadCategories();
  } catch (error) {
    showErrorNotification(
      "Failed to delete category: ",
      (error as Error).message
    );
  }
}

// Cancel handlers
function handleEditCancel() {
  isEditModalVisible.value = false;
}
function handleCancel() {
  isAddModalVisible.value = false;
}
</script>

<template>
  <div class="customer-header">
    <h1>Category</h1>
    <div>
      <a-button
        type="primary"
        class="clear-btn"
        :icon="h(PlusCircleFilled)"
        @click="openAddModal"
      >
        Add Category
      </a-button>
    </div>
  </div>

  <a-table
    :dataSource="data.categories"
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
            title="Are you sure to delete this?"
            @confirm="deleteCategory(record.id)"
          >
            <a-tooltip title="Delete">
              <delete-outlined class="icon delete" />
            </a-tooltip>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>

  <!-- Edit Modal -->
  <a-modal
    v-model:open="isEditModalVisible"
    title="Edit Category"
    :footer="null"
    @cancel="handleEditCancel"
  >
    <a-form layout="vertical">
      <a-form-item
        label="Name"
        :validate-status="formUpdate.name ? 'success' : 'error'"
        :help="!formUpdate.name ? 'Category name is required' : ''"
      >
        <a-input
          v-model:value="formUpdate.name"
          placeholder="Enter category name"
        />
      </a-form-item>
      <a-form-item label="Description">
        <a-input
          v-model:value="formUpdate.description"
          placeholder="Enter description"
        />
      </a-form-item>
    </a-form>
    <div class="modal-footer">
      <a-button class="custom-cancel-btn" @click="handleEditCancel"
        ><CloseOutlined />Close</a-button
      >
      <a-button type="primary" class="custom-ok-btn" @click="submitUpdate">
        <SaveOutlined />
        Confirm
      </a-button>
    </div>
  </a-modal>

  <!-- Add Modal -->
  <a-modal
    v-model:open="isAddModalVisible"
    title="Add Category"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-form layout="vertical">
      <a-form-item
        label="Name"
        :validate-status="formAdd.name ? 'success' : 'error'"
        :help="!formAdd.name ? 'name is required' : ''"
      >
        <a-input
          v-model:value="formAdd.name"
          placeholder="Enter category name"
        />
      </a-form-item>
      <a-form-item label="Description">
        <a-input
          v-model:value="formAdd.description"
          placeholder="Enter description"
        />
      </a-form-item>
    </a-form>
    <div class="modal-footer">
      <a-button class="custom-cancel-btn" @click="handleCancel"
        ><CloseOutlined />Close</a-button
      >
      <a-button type="primary" class="custom-ok-btn" @click="submitAdd"
        ><SaveOutlined />Confirm</a-button
      >
    </div>
  </a-modal>
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
</style>
