<template>
  <div class="customer-header">
    <h1>{{ t("modules.user.title") }}</h1>
    <div class="right-actions">
      <!-- 🔍 Search Box -->
      <a-input
        v-model:value="search"
        :placeholder="t('modules.user.searchPlaceholder')"
        class="search-input"
        allow-clear
        @input="handleSearch"
        @keyup.enter="submitSearchNow"
      >
        <template #prefix>
          <SearchOutlined
            style="color: #97999aff; font-size: 16px; margin-right: 8px"
          />
        </template>
      </a-input>

      <!-- Add Button - Navigate to Add Page -->
      <a-button
        v-if="can('create', 'user')"
        type="primary"
        class="add-btn"
        :icon="h(PlusCircleFilled)"
        @click="navigateToAddUser"
      >
        {{ t("modules.user.addNew") }}
      </a-button>
    </div>
  </div>

  <div class="table-container">
    <a-table
      :data-source="data.users"
      :columns="columns"
      :pagination="data.pagination"
      :loading="loading"
      row-key="id"
      :scroll="{ x: 1200 }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'no'">
          {{ pageOffset + index + 1 }}
        </template>

        <template v-else-if="column.key === 'profile'">
          <a-avatar
            v-if="record.profile?.image_url"
            :src="record.profile.image_url"
            :size="50"
            shape="square"
            class="profile-avatar"
            @click="showImageModal(record.profile.image_url)"
          />
          <a-avatar v-else :size="50" shape="square">
            {{ getInitials(record.name) }}
          </a-avatar>
        </template>

        <template v-else-if="column.key === 'user_no'">
          {{ record.user_no || "-" }}
        </template>

        <template v-else-if="column.key === 'full_name'">
          {{ record.name }} {{ record.surname }}
        </template>

        <template v-else-if="column.key === 'roles'">
          <a-tag
            v-for="role in record.roles"
            :key="role.id"
            color="blue"
            style="margin: 2px"
          >
            {{ role.name }}
          </a-tag>
          <span v-if="!record.roles || record.roles.length === 0">-</span>
        </template>

        <template v-else-if="column.key === 'permissions'">
          <a-tooltip v-if="record.permissions && record.permissions.length > 0">
            <template #title>
              <div v-for="perm in record.permissions" :key="perm.id">
                • {{ perm.display_name }}
              </div>
            </template>
            <a-tag color="green">
              {{ record.permissions.length }} permissions
            </a-tag>
          </a-tooltip>
          <span v-else>-</span>
        </template>

        <template v-else-if="column.key === 'created_at'">
          {{ record.created_at }}
        </template>

        <template v-else-if="column.key === 'updated_at'">
          {{ record.updated_at }}
        </template>

        <template v-else-if="column.key === 'action'">
          <span class="action-icons">
            <a-tooltip v-if="can('update', 'user')" :title="t('actions.edit')">
              <edit-outlined
                class="icon edit"
                @click="navigateToEditUser(record.id)"
                :title="t('actions.edit')"
              />
            </a-tooltip>
            <a-popconfirm
              v-if="can('delete', 'user')"
              :title="t('modules.user.deleteConfirm')"
              :ok-text="t('common.yes')"
              :cancel-text="t('common.no')"
              placement="topRight"
              @confirm="handleDelete(record.id)"
            >
              <a-tooltip :title="t('actions.delete')">
                <delete-outlined
                  class="icon delete"
                  :title="t('actions.delete')"
                />
              </a-tooltip>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>
  </div>

  <a-modal
    :open="isModalVisible"
    :title="null"
    :footer="null"
    @cancel="handleModalClose"
    :maskClosable="true"
    centered
  >
    <img :src="currentImageUrl" alt="Profile Image" style="width: 100%" />
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from "vue";
import { useI18n } from "vue-i18n";
// Import the icon
import { SearchOutlined } from "@ant-design/icons-vue";

import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleFilled,
} from "@ant-design/icons-vue";

import { type TablePaginationConfig } from "ant-design-vue";
import { useUsers } from "./composible";
import type { IUsers } from "./interface/user.interface";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";
import { useRouter } from "vue-router";
import { useAuth } from "../../../common/composables/useAuth";

// Register the icons
// No need for explicit registration if using as components

const { fetchAll, deleteUser } = useUsers();

const loading = ref(false);
const router = useRouter();
const { t } = useI18n();
const { can } = useAuth();
const search = ref("");

let searchTimer: number | null = null;
const DEBOUNCE_MS = 350;

// --- Modal State for Full-Size Image ---
const isModalVisible = ref(false);
const currentImageUrl = ref("");

// Function to open the modal and set the image URL
function showImageModal(url: string) {
  if (url) {
    currentImageUrl.value = url;
    isModalVisible.value = true;
  }
}

// Function to close the modal
function handleModalClose() {
  isModalVisible.value = false;
  currentImageUrl.value = "";
}
// ----------------------------------------

// Table Data
const data = reactive<IUsers>({
  users: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

// Page offset for numbering
const pageOffset = computed(() => {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize;
});

// Table columns
const columns = computed(() => [
  {
    title: t("modules.user.columns.no"),
    key: "no",
    align: "center",
    width: 70,
  },
  {
    title: t("modules.user.columns.profile"),
    key: "profile",
    align: "center",
    width: 80,
  },
  {
    title: t("modules.user.columns.name"),
    key: "full_name",
    width: 200,
    align: "center",
  },
  {
    title: t("modules.user.columns.email"),
    dataIndex: "email",
    key: "email",
    width: 200,
    align: "center",
  },
  {
    title: t("modules.user.columns.telephone"),
    dataIndex: "tel",
    key: "tel",
    width: 150,
    align: "center",
  },
  {
    title: t("modules.user.columns.roles"),
    key: "roles",
    width: 150,
    align: "center",
  },
  { title: t("modules.user.columns.status"), key: "permissions", width: 150 },
  { title: t("modules.user.columns.createdAt"), key: "created_at", width: 180 },
  { title: t("modules.user.columns.updatedAt"), key: "updated_at", width: 180 },
  {
    title: t("modules.user.columns.action"),
    key: "action",
    width: 120,
    align: "center",
    fixed: "right",
  },
]);

// Get initials for avatar
function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function handleSearch() {
  if (searchTimer) clearTimeout(searchTimer);

  searchTimer = window.setTimeout(() => {
    data.pagination.current = 1;
    loadUsers(1, data.pagination.pageSize);
    searchTimer = null;
  }, DEBOUNCE_MS);
}

function submitSearchNow() {
  if (searchTimer) clearTimeout(searchTimer);

  data.pagination.current = 1;
  loadUsers(1, data.pagination.pageSize);
}

// Load users
async function loadUsers(
  page = data.pagination.current,
  limit = data.pagination.pageSize,
) {
  loading.value = true;
  try {
    const res = await fetchAll(page, limit, search.value);
    data.users = res.data || [];

    const paginate = res.pagination;
    data.pagination = {
      current: paginate.page || paginate.currentPage || 1,
      pageSize: paginate.limit || 30,
      total: paginate.total || 0,
      showSizeChanger: true,
    };
  } catch (error) {
    console.error("Failed to load users:", error);
    showErrorNotification("Failed to load users");
  } finally {
    loading.value = false;
  }
}

// Table pagination
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 30;
  loadUsers(current, pageSize);
}

// Handle delete
async function handleDelete(id: number) {
  try {
    await deleteUser(id);
    showSuccessNotification(t("modules.user.deleteSuccess"));
    loadUsers();
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    showErrorNotification(error.message || t("modules.user.deleteError"));
  }
}

// Navigate to Add User page
function navigateToAddUser() {
  router.push({ name: "addUser" });
}

// Navigate to Edit User page
function navigateToEditUser(id: number) {
  router.push({ name: "updateUser", params: { id } });
}

onMounted(() => loadUsers());
</script>

<style scoped lang="scss">
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

.table-container {
  overflow-x: auto;
  padding: 0 12px;
}

// ** New: Avatar Styling for Clickability **
.profile-avatar {
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
}
// -------------------------------------------

// Center table headers while keeping body data left-aligned
:deep(.ant-table-thead > tr > th) {
  text-align: center !important;
}

:deep(.ant-table-tbody > tr > td) {
  text-align: left !important;
}

// Keep specific columns centered
:deep(.ant-table-tbody > tr > td:first-child),
:deep(.ant-table-tbody > tr > td:nth-child(2)),
:deep(.ant-table-tbody > tr > td:last-child) {
  text-align: center !important;
}

.search-input {
  width: 260px;
  min-width: 200px;
  margin-right: 10px;
}

// Responsive styles
@media screen and (max-width: 768px) {
  .customer-header {
    padding: 8px;

    h1 {
      font-size: 20px;
    }
  }

  .table-container {
    padding: 0 8px;
  }

  .action-icons .icon {
    font-size: 14px;
  }

  .search-input {
    width: 220px;
    min-width: 180px;
  }
}

@media screen and (max-width: 576px) {
  .customer-header {
    flex-direction: column;
    align-items: stretch;

    h1 {
      font-size: 18px;
      text-align: center;
    }
  }

  .action-icons {
    gap: 8px;
  }

  .search-input {
    width: 100%;
    min-width: auto;
  }
}

@media screen and (max-width: 480px) {
  .customer-header h1 {
    font-size: 16px;
  }

  .action-icons .icon {
    font-size: 13px;
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
</style>
