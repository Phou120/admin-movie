<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import { CourseCategoryComposible } from "./composible/index";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
} from "@ant-design/icons-vue";
import { message, type TablePaginationConfig } from "ant-design-vue";
import type {
  ICustomerForm,
  IUserCourseCategory,
} from "./interface/course-category.interface";
import formatDate from "../../common/utils/format-date.util";

const { fetchAll, deleteCategoryById, updateCategory, createCategory } =
  CourseCategoryComposible();

const columns = [
  { title: "No", dataIndex: "id", key: "no", align: "center", width: 60 },
  { title: "Name", dataIndex: "name", key: "name", align: "left" },
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
  { title: "Action", key: "action", align: "center", width: 110 },
];

// We'll track categories and pagination state here
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
});

const formAdd = ref<ICustomerForm>({
  name: "",
});

// Load categories with pagination parameters
async function loadCategories(
  page = data.pagination.current,
  limit = data.pagination.pageSize
) {
  loading.value = true;
  try {
    const response = await fetchAll(page, limit);

    data.categories = response.data;

    const paginate = response.pagination;

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

// Load initial data on mount
onMounted(() => {
  loadCategories();
});

// Handler for table pagination/sorting/filter changes
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadCategories(current, pageSize);
}

function openAddModal(category: ICustomerForm) {
  formAdd.value = { name: category.name };
  isAddModalVisible.value = true;
}

async function submitAdd() {
  try {
    await createCategory(formAdd.value);
    message.success("Category added successfully");
    isAddModalVisible.value = false;
    await loadCategories();
  } catch (err) {
    message.error("Failed to add category");
  }
}

function openEditModal(category: ICustomerForm) {
  formUpdate.value = {
    id: category.id,
    name: category.name,
  };
  isEditModalVisible.value = true;
}

async function submitUpdate() {
  try {
    await updateCategory(formUpdate.value);
    message.success("Category updated successfully");
    isEditModalVisible.value = false;
    await loadCategories();
  } catch (err) {
    message.error("Failed to update category");
  }
}

async function deleteCategory(id: number) {
  try {
    await deleteCategoryById(id);
    message.success("Category deleted");
    await loadCategories();
  } catch (error) {
    message.error("Failed to delete category");
  }
}

function handleEditCancel() {
  isEditModalVisible.value = false;
}

function handleCancel() {
  isAddModalVisible.value = false;
}
</script>

<template>
  <div class="customer-header">
    <h1>Course Category</h1>
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
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'no'">
        {{
          (data.pagination.current - 1) * data.pagination.pageSize + index + 1
        }}
      </template>
      <template v-else-if="column.key === 'created_at'">
        {{ formatDate(record.created_at) }}
      </template>

      <template v-else-if="column.key === 'updated_at'">
        {{ formatDate(record.updated_at) }}
      </template>
      <template v-else-if="column.key === 'action'">
        <span class="action-icons">
          <edit-outlined class="icon edit" @click="openEditModal(record)" />
          <a-popconfirm
            title="Are you sure to delete this?"
            @confirm="deleteCategory(record.id)"
          >
            <delete-outlined class="icon delete" />
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
        <!-- <a-input
          v-model:value="formUpdate.name"
          placeholder="Enter category name"
        /> -->
        <a-textarea
          v-model:value="formUpdate.name"
          placeholder="Enter category name"
          :rows="4"
          :status="formUpdate.name ? '' : 'error'"
        />
      </a-form-item>
    </a-form>
    <div class="modal-footer">
      <a-button @click="handleEditCancel">Cancel</a-button>
      <a-button type="primary" class="custom-ok-btn" @click="submitUpdate"
        >Confirm</a-button
      >
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
        :help="!formAdd.name ? 'Category name is required' : ''"
      >
        <!-- <a-input
          v-model:value="formAdd.name"
          placeholder="Enter category name"
        /> -->
        <a-textarea
          v-model:value="formAdd.name"
          placeholder="Enter category name"
          :rows="4"
          :status="formAdd.name ? '' : 'error'"
        />
      </a-form-item>
    </a-form>
    <div class="modal-footer">
      <a-button @click="handleCancel">Cancel</a-button>
      <a-button type="primary" class="custom-ok-btn" @click="submitAdd"
        >Confirm</a-button
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
}

.action-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
}

.icon {
  cursor: pointer;
  font-size: 18px;
}

.icon.edit {
  color: #ffd700;
}

.icon.delete {
  color: red;
}

.clear-btn {
  background-color: #ffd700;
  border-color: #ffd700;
  color: #ffffff;
}

.clear-btn:hover {
  background-color: #e6c200;
  border-color: #e6c200;
  color: #ffffff;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.custom-ok-btn {
  background-color: #ffd700;
  border-color: #ffd700;
  color: #000;
}

.custom-ok-btn:hover {
  background-color: #e6c200;
  border-color: #e6c200;
  color: #000;
}
</style>
