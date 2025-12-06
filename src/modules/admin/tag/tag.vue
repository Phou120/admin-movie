<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import { TagComposible } from "./composible/index";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { ITagForm, ITagList } from "./interface/tag.interface";
import formatDate from "../../../common/utils/format-date.util";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";
import AddTagModal from "./components/AddTagModal.vue";
import EditTagModal from "./components/EditTagModal.vue";

const { fetchAll, deleteTagById, updateTag, createTag } = TagComposible();

const columns = [
  { title: "No", dataIndex: "id", key: "no", align: "center", width: 80 },
  {
    title: "Tag Name",
    dataIndex: "name",
    key: "name",
    align: "left",
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
  { title: "Action", key: "action", align: "center", width: 120 },
];

const data = reactive<ITagList>({
  tags: [],
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
const selectedTag = ref<ITagForm | null>(null);
const addModalRef = ref();
const editModalRef = ref();

// Function to get record key
function getRecordKey(record: ITagForm): number {
  return record.id ?? 0;
}

// Function to calculate row number
function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

// Function to load tags with pagination
async function loadTags(
  page = data.pagination.current,
  limit = data.pagination.pageSize
) {
  loading.value = true;
  try {
    const response = await fetchAll(page, limit);

    data.tags = response.data;

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
  loadTags();
});

// Handle table pagination change
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadTags(current, pageSize);
}

// Modal handlers
function openAddModal() {
  isAddModalVisible.value = true;
}

function openEditModal(tag: ITagForm) {
  selectedTag.value = tag;
  isEditModalVisible.value = true;
}

// CRUD operations
async function handleAddSuccess() {
  try {
    const formData = addModalRef.value?.formData;
    if (!formData?.name?.trim()) {
      showErrorNotification("Validation Error", "Tag name is required");
      return;
    }

    const response = await createTag(formData);
    showSuccessNotification(response.message);
    await loadTags();
  } catch (error) {
    showErrorNotification("Failed to add tag:", (error as Error).message);
  }
}

async function handleEditSuccess() {
  try {
    const formData = editModalRef.value?.formData;
    if (!formData?.name?.trim()) {
      showErrorNotification("Validation Error", "Tag name is required");
      return;
    }

    const response = await updateTag(formData);
    showSuccessNotification(response.message);
    await loadTags();
  } catch (error) {
    showErrorNotification("Failed to update tag:", (error as Error).message);
  }
}

async function deleteTag(id: number) {
  try {
    const response = await deleteTagById(id);
    showSuccessNotification(response.message);
    await loadTags();
  } catch (error) {
    showErrorNotification("Failed to delete tag:", (error as Error).message);
  }
}
</script>

<template>
  <div class="tag-container">
    <!-- Header Section -->
    <div class="tag-header">
      <h1>Tag Management</h1>
      <div class="header-right">
        <a-button
          type="primary"
          class="add-btn"
          :icon="h(PlusCircleFilled)"
          @click="openAddModal"
        >
          Add New Tag
        </a-button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container">
      <a-table
        :dataSource="data.tags"
        :columns="columns"
        :pagination="data.pagination"
        :loading="loading"
        :rowKey="getRecordKey"
        @change="handleTableChange"
        class="tag-table"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            <span class="row-number">{{ getRowNumber(index) }}</span>
          </template>

          <template v-else-if="column.key === 'name'">
            <span class="tag-name-text">
              {{ record.name }}
            </span>
          </template>

          <template v-else-if="column.key === 'created_at'">
            <span class="date-text">{{ formatDate(record.created_at) }}</span>
          </template>

          <template v-else-if="column.key === 'updated_at'">
            <span class="date-text">{{ formatDate(record.updated_at) }}</span>
          </template>

          <template v-else-if="column.key === 'action'">
            <div class="action-icons">
              <a-tooltip title="Edit">
                <edit-outlined
                  class="icon edit"
                  @click="openEditModal(record)"
                />
              </a-tooltip>
              <a-popconfirm
                title="Are you sure to delete this tag?"
                placement="topRight"
                @confirm="deleteTag(record.id)"
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
    <AddTagModal
      ref="addModalRef"
      v-model:visible="isAddModalVisible"
      @success="handleAddSuccess"
    />

    <EditTagModal
      ref="editModalRef"
      v-model:visible="isEditModalVisible"
      :tag="selectedTag"
      @success="handleEditSuccess"
    />
  </div>
</template>

<style lang="scss" scoped>
.tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .header-icon {
      font-size: 32px;
      color: #1890ff;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #262626;
    }
  }

  .add-btn {
    background-color: #0d334aff;
    border-color: #0d334aff;
    color: #ffffff;
    white-space: nowrap;

    &:hover {
      background-color: #0d334acc;
      border-color: #0d334acc;
      color: #ffffff;
    }
  }
}

.tag-table {
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

.tag-name-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #262626;
}

.date-text {
  color: #8c8c8c;
  font-size: 13px;
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
  }
}
</style>
