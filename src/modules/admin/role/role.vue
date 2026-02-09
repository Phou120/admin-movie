<template>
  <div class="customer-header">
    <h1>{{ t("modules.role.title") }}</h1>

    <!-- Search + Add Button Row -->
    <div class="right-actions">
      <!-- 🔍 Search Box -->
      <a-input
        v-model:value="search"
        :placeholder="t('modules.role.searchPlaceholder')"
        class="search-input"
        allow-clear
        @input="handleSearch"
        @keyup.enter="submitSearchNow"
      >
        <template #prefix>
          <search-outlined />
        </template>
      </a-input>

      <!-- Add Button - Navigate to Add Page -->
      <a-button
        type="primary"
        class="add-btn"
        :icon="h(PlusCircleFilled)"
        @click="navigateToAddRole"
      >
        {{ t("modules.role.addNew") }}
      </a-button>
    </div>
  </div>

  <div class="table-container">
    <a-table
      :data-source="data.roles"
      :columns="columns"
      :pagination="data.pagination"
      :loading="loading"
      row-key="id"
      :scroll="{ x: 800 }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record, index }">
        <!-- Row Number -->
        <template v-if="column.key === 'no'">
          {{ pageOffset + index + 1 }}
        </template>

        <!-- Display Name -->
        <template v-else-if="column.key === 'display_name'">
          {{ record.display_name }}
        </template>

        <template v-else-if="column.key === 'role_permissions'">
          <a-tooltip
            v-if="record.role_permissions && record.role_permissions.length > 0"
          >
            <template #title>
              <div v-for="perm in record.role_permissions" :key="perm.id">
                • {{ perm.display_name }}
              </div>
            </template>
            <a-tag color="green">
              {{ record.role_permissions.length }}
              {{ t("modules.role.permissions") }}
            </a-tag>
          </a-tooltip>
          <span v-else>-</span>
        </template>

        <!-- Created At -->
        <template v-else-if="column.key === 'created_at'">
          {{ record.created_at }}
        </template>

        <!-- Updated At -->
        <template v-else-if="column.key === 'updated_at'">
          {{ record.updated_at }}
        </template>

        <!-- Actions -->
        <template v-else-if="column.key === 'action'">
          <span class="action-icons">
            <a-tooltip :title="t('actions.edit')">
              <edit-outlined
                class="icon edit"
                @click="navigateToEditRole(record.id)"
                :title="t('actions.edit')"
              />
            </a-tooltip>
            <a-popconfirm
              :title="t('modules.role.deleteConfirm')"
              :ok-text="t('common.yes')"
              :cancel-text="t('common.no')"
              placement="topRight"
              @confirm="deleteRole(record.id)"
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from "vue";
import { useI18n } from "vue-i18n";
import { message, type TablePaginationConfig } from "ant-design-vue";
import { useRouter } from "vue-router";
import {
  SearchOutlined,
  PlusCircleFilled,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { useRoles } from "./composible";
import type { IRoles } from "./interface/role.interface";

const router = useRouter();
const { fetchAll, deleteRole: deleteRoleApi } = useRoles();
const { t } = useI18n();

const loading = ref(false);
const search = ref("");

// debounce timer id
let searchTimer: number | null = null;
const DEBOUNCE_MS = 350;

// Table Data
const data = reactive<IRoles>({
  roles: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

const pageOffset = computed(() => {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize;
});

// Columns - headers centered, data left-aligned
const columns = computed(() => [
  {
    title: t("modules.role.columns.no"),
    key: "no",
    align: "center",
    width: 70,
  },
  {
    title: t("modules.role.columns.name"),
    dataIndex: "name",
    key: "name",
    width: 200,
    align: "center",
  },
  {
    title: t("modules.role.columns.displayName"),
    dataIndex: "display_name",
    key: "display_name",
    width: 200,
    align: "center",
  },
  {
    title: t("modules.role.columns.permissions"),
    dataIndex: "role_permissions",
    key: "role_permissions",
    width: 150,
    align: "center",
  },
  {
    title: t("modules.role.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    width: 180,
    align: "center",
  },
  {
    title: t("modules.role.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    width: 180,
    align: "center",
  },
  {
    title: t("modules.role.columns.action"),
    key: "action",
    align: "center",
    width: 120,
    fixed: "right",
  },
]);

// Load data
async function loadRoles(
  page = data.pagination.current,
  limit = data.pagination.pageSize
) {
  loading.value = true;
  try {
    const res = await fetchAll(page, limit, search.value);

    data.roles = res.data ?? [];
    data.pagination = {
      current: res.pagination?.page ?? res.pagination?.current ?? 1,
      pageSize: res.pagination?.limit ?? 10,
      total: res.pagination?.total ?? 0,
      showSizeChanger: true,
    };
  } finally {
    loading.value = false;
  }
}

function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadRoles(current, pageSize);
}

function handleSearch() {
  if (searchTimer) clearTimeout(searchTimer);

  searchTimer = window.setTimeout(() => {
    data.pagination.current = 1;
    loadRoles(1, data.pagination.pageSize);
    searchTimer = null;
  }, DEBOUNCE_MS);
}

function submitSearchNow() {
  if (searchTimer) clearTimeout(searchTimer);

  data.pagination.current = 1;
  loadRoles(1, data.pagination.pageSize);
}

// Navigate to Add Role page
function navigateToAddRole() {
  router.push({ name: "addRole" });
}

// Navigate to Edit Role page
function navigateToEditRole(id: number) {
  router.push({ name: "updateRole", params: { id } });
}

// Delete Role
async function deleteRole(id: number) {
  try {
    await deleteRoleApi(id);
    message.success(t("modules.role.deleteSuccess"));

    // Reload the current page
    loadRoles();
  } catch (error: any) {
    console.error("Failed to delete role:", error);
    message.error(error.message || t("modules.role.deleteError"));
  }
}

onMounted(() => loadRoles());
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

.right-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  width: 260px;
  min-width: 200px;
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

.table-container {
  overflow-x: auto;
  padding: 0 12px;
}

/* Responsive */
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

  .search-input {
    width: 220px;
    min-width: 180px;
  }

  .action-icons .icon {
    font-size: 14px;
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

  .right-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
    min-width: auto;
  }

  .add-btn {
    width: 100%;
  }

  .action-icons {
    gap: 8px;
  }
}

@media screen and (max-width: 480px) {
  .customer-header {
    padding: 8px;

    h1 {
      font-size: 16px;
    }
  }

  .action-icons .icon {
    font-size: 13px;
  }
}
</style>
