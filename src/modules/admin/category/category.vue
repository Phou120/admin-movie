<script setup lang="ts">
import { h, onMounted, reactive, ref, computed } from "vue";
import { CourseCategoryComposible } from "./composible/index";
import { useI18n } from "vue-i18n";
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
import { useAuth } from "../../../common/composables/useAuth";

const { fetchAll, deleteCategoryById, updateCategory, createCategory } =
  CourseCategoryComposible();
const { t } = useI18n();
const { can } = useAuth();

const columns = computed(() => [
  {
    title: t("modules.category.columns.no"),
    dataIndex: "id",
    key: "no",
    align: "center",
    width: 70,
  },
  {
    title: t("modules.category.columns.name"),
    dataIndex: "name",
    key: "name",
    align: "center",
    width: 200,
  },
  {
    title: t("modules.category.columns.description"),
    dataIndex: "description",
    key: "description",
    align: "center",
    width: 300,
  },
  {
    title: t("modules.category.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 200,
  },
  {
    title: t("modules.category.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    align: "center",
    width: 200,
  },
  {
    title: t("modules.category.columns.action"),
    key: "action",
    align: "center",
    width: 80,
  },
]);

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
const submitting = ref(false);

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
  if (!formAdd.value.name?.trim()) return;

  submitting.value = true;
  try {
    const response = await createCategory(formAdd.value);
    showSuccessNotification(response.message);
    isAddModalVisible.value = false;
    await loadCategories();
  } catch (error) {
    showErrorNotification("Failed to add category", (error as Error).message);
  } finally {
    submitting.value = false;
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
  if (!formUpdate.value.name?.trim()) return;

  submitting.value = true;
  try {
    const response = await updateCategory(formUpdate.value);
    showSuccessNotification(response.message);
    isEditModalVisible.value = false;
    await loadCategories();
  } catch (err) {
    showErrorNotification("Failed to update category", (err as Error).message);
  } finally {
    submitting.value = false;
  }
}

// Delete category
async function deleteCategory(id: number) {
  loading.value = true;
  try {
    const response = await deleteCategoryById(id);
    showSuccessNotification(response.message);
    await loadCategories();
  } catch (error) {
    showErrorNotification("Failed to delete category", (error as Error).message);
  } finally {
    loading.value = false;
  }
}

// Cancel handlers
function handleEditCancel() {
  if (submitting.value) return;
  isEditModalVisible.value = false;
}
function handleCancel() {
  if (submitting.value) return;
  isAddModalVisible.value = false;
}
</script>

<template>
  <div class="customer-header">
    <h1>{{ t("modules.category.title") }}</h1>
    <div>
      <a-button
        v-if="can('create', 'category')"
        type="primary"
        class="clear-btn"
        :icon="h(PlusCircleFilled)"
        @click="openAddModal"
      >
        {{ t("modules.category.addNew") }}
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
          <a-tooltip v-if="can('update', 'category')" :title="t('actions.edit')">
            <edit-outlined class="icon edit" @click="openEditModal(record)" />
          </a-tooltip>
          <a-popconfirm
            v-if="can('delete', 'category')"
            :title="t('message.deleteConfirm')"
            @confirm="deleteCategory(record.id)"
          >
            <a-tooltip :title="t('actions.delete')">
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
    :title="t('modules.category.edit')"
    :footer="null"
    :closable="!submitting"
    :mask-closable="!submitting"
    @cancel="handleEditCancel"
  >
    <a-form layout="vertical">
      <a-form-item
        :label="t('modules.category.form.name')"
        :validate-status="formUpdate.name ? 'success' : 'error'"
        :help="
          !formUpdate.name
            ? t('modules.category.form.validation.nameRequired')
            : ''
        "
      >
        <a-input
          v-model:value="formUpdate.name"
          :placeholder="t('modules.category.form.placeholder.name')"
        />
      </a-form-item>
      <a-form-item :label="t('modules.category.form.description')">
        <a-input
          v-model:value="formUpdate.description"
          :placeholder="t('modules.category.form.placeholder.description')"
        />
      </a-form-item>
    </a-form>
    <div class="modal-footer">
      <a-button
        class="custom-cancel-btn"
        :disabled="submitting"
        @click="handleEditCancel"
        ><CloseOutlined />{{ t("actions.close") }}</a-button
      >
      <a-button
        type="primary"
        class="custom-ok-btn"
        :loading="submitting"
        @click="submitUpdate"
      >
        <SaveOutlined />
        {{ t("actions.update") }}
      </a-button>
    </div>
  </a-modal>

  <!-- Add Modal -->
  <a-modal
    v-model:open="isAddModalVisible"
    :title="t('modules.category.addNew')"
    :footer="null"
    :closable="!submitting"
    :mask-closable="!submitting"
    @cancel="handleCancel"
  >
    <a-form layout="vertical">
      <a-form-item
        :label="t('modules.category.form.name')"
        :validate-status="formAdd.name ? 'success' : 'error'"
        :help="
          !formAdd.name
            ? t('modules.category.form.validation.nameRequired')
            : ''
        "
      >
        <a-input
          v-model:value="formAdd.name"
          :placeholder="t('modules.category.form.placeholder.name')"
        />
      </a-form-item>
      <a-form-item :label="t('modules.category.form.description')">
        <a-input
          v-model:value="formAdd.description"
          :placeholder="t('modules.category.form.placeholder.description')"
        />
      </a-form-item>
    </a-form>
    <div class="modal-footer">
      <a-button
        class="custom-cancel-btn"
        :disabled="submitting"
        @click="handleCancel"
        ><CloseOutlined />{{ t("actions.close") }}</a-button
      >
      <a-button
        type="primary"
        class="custom-ok-btn"
        :loading="submitting"
        @click="submitAdd"
        ><SaveOutlined />{{ t("actions.create") }}</a-button
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
