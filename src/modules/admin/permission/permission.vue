<template>
  <div class="customer-header">
    <h1>{{ t("modules.permission.title") }}</h1>
  </div>

  <div class="table-container">
    <a-table
      :data-source="data.permissions"
      :columns="columns"
      :pagination="data.pagination"
      :loading="loading"
      row-key="id"
      :scroll="{ x: 800 }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'no'">
          {{ pageOffset + index + 1 }}
        </template>

        <template v-else-if="column.key === 'display_name'">
          {{ record.display_name }}
        </template>

        <template v-else-if="column.key === 'created_at'">
          {{ formatDateBTC(record.created_at) }}
        </template>

        <template v-else-if="column.key === 'updated_at'">
          {{ formatDateBTC(record.updated_at) }}
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { type TablePaginationConfig } from "ant-design-vue";
import { usePermission } from "./composible";
import type { IPermission } from "./interface/permission.interface";
import formatDateBTC from "../../../common/utils/format-datebtc.util";

const { fetchAll } = usePermission();
const { t } = useI18n();

// Modal controls
const loading = ref(false);

// Table Data
const data = reactive<IPermission>({
  permissions: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

// 💡 FIX: Computed property to get the starting number for the current page
const pageOffset = computed(() => {
  // Use optional chaining/nullish coalescing for safety, although 'data' is reactive
  // and should be initialized. This is a safeguard.
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;

  return (current - 1) * pageSize;
});

// Table columns
const columns = computed(() => [
  // IMPORTANT: dataIndex removed to allow the custom template to work
  {
    title: t("modules.permission.columns.no"),
    key: "no",
    align: "center",
    width: 70,
  },
  {
    title: t("modules.permission.columns.name"),
    align: "center",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: t("modules.permission.columns.displayName"),
    align: "center",
    dataIndex: "display_name",
    key: "display_name",
    width: 200,
  },
  {
    title: t("modules.permission.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 150,
  },
  {
    title: t("modules.permission.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    align: "center",
    width: 150,
  },
]);

// Load permissions
async function loadPermissions(
  page = data.pagination.current,
  limit = data.pagination.pageSize
) {
  loading.value = true;
  try {
    const res = await fetchAll(page, limit);
    data.permissions = res.data;

    const paginate = res.pagination;

    data.pagination = {
      current: paginate.currentPage,
      pageSize: paginate.limit,
      total: paginate.total,
      showSizeChanger: true,
    };
  } finally {
    loading.value = false;
  }
}

// Table pagination
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadPermissions(current, pageSize);
}

onMounted(() => loadPermissions());
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

.banner-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.action-icons {
  display: flex;
  gap: 8px;
}

.action-icons .icon {
  cursor: pointer;
  font-size: 16px;
}

.action-icons .edit {
  color: #1890ff;
}

.action-icons .delete {
  color: #ff4d4f;
}

.clear-btn {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}

.clear-btn:hover {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
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

.custom-cancel-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
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

  .banner-image {
    width: 60px;
    height: 45px;
  }

  .action-icons .icon {
    font-size: 14px;
  }

  .modal-footer {
    flex-wrap: wrap;

    button {
      flex: 1;
      min-width: 100px;
    }
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

    .clear-btn {
      width: 100%;
    }
  }

  .btn-text {
    display: inline;
  }

  .banner-image {
    width: 50px;
    height: 40px;
  }

  .modal-footer {
    button {
      flex: 1;
      min-width: auto;
    }
  }
}

@media screen and (max-width: 480px) {
  .customer-header h1 {
    font-size: 16px;
  }

  .action-icons {
    gap: 6px;
  }

  .action-icons .icon {
    font-size: 13px;
  }
}
</style>
