<template>
  <div class="customer-header">
    <h1>{{ t("modules.banner.title") }}</h1>
    <div>
      <AddButton v-if="can('create', 'banner')" :label="t('modules.banner.addNew')" @click="openAddModal" />
    </div>
  </div>

  <div class="table-container">
    <a-table
      :data-source="data.banners"
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

        <template v-else-if="column.key === 'image_url'">
          <img :src="record.image_url" class="banner-image" />
        </template>

        <template v-else-if="column.key === 'link'">
          {{ record.link }}
        </template>

        <template v-else-if="column.key === 'order_by'">
          {{ record.order_by }}
        </template>

        <template v-else-if="column.key === 'created_at'">
          {{ record.created_at }}
        </template>

        <template v-else-if="column.key === 'updated_at'">
          {{ record.updated_at }}
        </template>

        <template v-else-if="column.key === 'action'">
          <span class="action-icons">
            <a-tooltip v-if="can('update', 'banner')" :title="t('actions.edit')">
              <edit-outlined class="icon edit" @click="openEditModal(record)" />
            </a-tooltip>
            <a-popconfirm
              v-if="can('delete', 'banner')"
              :title="t('message.deleteConfirm')"
              @confirm="deleteBanner(record.id)"
            >
              <a-tooltip :title="t('actions.delete')">
                <delete-outlined class="icon delete" />
              </a-tooltip>
            </a-popconfirm>
          </span>
        </template>

        <template v-else>
          {{ record[column.dataIndex] }}
        </template>
      </template>
    </a-table>
  </div>

  <!-- Separated Modal Components -->
  <AddBannerModal
    v-model:visible="isAddModalVisible"
    @success="loadBanners"
  />

  <EditBannerModal
    v-model:visible="isEditModalVisible"
    :banner="selectedBanner"
    @success="loadBanners"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IBanner, IBannerForm } from "./interface/banner.interface";
import { useBanner } from "./composible/index";
import AddButton from "../../../components/AddButton.vue";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";
import AddBannerModal from "./components/AddBannerModal.vue";
import EditBannerModal from "./components/EditBannerModal.vue";
import { useAuth } from "../../../common/composables/useAuth";

const { fetchAll, deleteBannerById } = useBanner();
const { t } = useI18n();
const { can } = useAuth();

// Modal controls
const isAddModalVisible = ref(false);
const isEditModalVisible = ref(false);
const loading = ref(false);
const selectedBanner = ref<IBannerForm | null>(null);

// Table Data
const data = reactive<IBanner>({
  banners: [],
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
    title: t("modules.banner.columns.no"),
    key: "no",
    align: "center",
    width: 70,
  },
  {
    title: t("modules.banner.columns.image"),
    dataIndex: "image_url",
    key: "image_url",
    width: 100,
  },
  {
    title: t("modules.banner.columns.link"),
    dataIndex: "link",
    key: "link",
    width: 300,
  },
  {
    title: t("modules.banner.columns.order"),
    dataIndex: "order_by",
    key: "order_by",
    width: 80,
    align: "center",
  },
  {
    title: t("modules.banner.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    width: 180,
  },
  {
    title: t("modules.banner.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    width: 180,
  },
  {
    title: t("modules.banner.columns.action"),
    key: "action",
    width: 100,
    fixed: "right",
    align: "center",
  },
]);

// Load banners
async function loadBanners(
  page = data.pagination.current,
  limit = data.pagination.pageSize
) {
  loading.value = true;
  try {
    const res = await fetchAll(page, limit);
    data.banners = res.data || [];

    const paginate = res.pagination || {};

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
  loadBanners(current, pageSize);
}

// Modal handlers
function openAddModal() {
  isAddModalVisible.value = true;
}

function openEditModal(banner: any) {
  selectedBanner.value = {
    id: banner.id,
    file_banner: banner.image_url,
    link: banner.link,
    order_by: banner.order_by,
  };
  isEditModalVisible.value = true;
}

// Delete Banner
async function deleteBanner(id: number) {
  loading.value = true;
  try {
    const response = await deleteBannerById(id);
    showSuccessNotification(response.message);
    await loadBanners();
  } catch (error) {
    showErrorNotification("Failed to delete banner", (error as Error).message);
  } finally {
    loading.value = false;
  }
}

onMounted(() => loadBanners());
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
