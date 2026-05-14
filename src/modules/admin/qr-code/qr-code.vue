<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { QrCodeComposible } from "./composible/index";
import { EditOutlined } from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IQrCodeForm, IQrCodeList } from "./interface/qr-code.interface";
import { showErrorNotification } from "../../../common/utils/notification";
import EditQrCodeModal from "./components/EditQrCodeModal.vue";
import { useAuth } from "../../../common/composables/useAuth";

const { fetchAll } = QrCodeComposible();
const { t } = useI18n();
const { can } = useAuth();

const columns = computed(() => [
  {
    title: t("modules.qrCode.columns.no"),
    dataIndex: "id",
    key: "no",
    align: "center",
    width: 10,
  },
  {
    title: t("modules.qrCode.columns.image"),
    dataIndex: "image_url",
    key: "image_url",
    align: "center",
    width: 150,
  },
  {
    title: t("modules.qrCode.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 180,
  },
  {
    title: t("modules.qrCode.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    align: "center",
    width: 180,
  },
  {
    title: t("modules.qrCode.columns.action"),
    key: "action",
    align: "center",
    width: 120,
  },
]);

const data = reactive<IQrCodeList>({
  qrCodes: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

const loading = ref(false);
const isEditModalVisible = ref(false);
const selectedQrCode = ref<IQrCodeForm | null>(null);

// Function to get record key
function getRecordKey(record: IQrCodeForm): number {
  return record.id ?? 0;
}

// Function to calculate row number
function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

// Function to load qr codes with pagination
async function loadQrCodes(
  page = data.pagination.current,
  limit = data.pagination.pageSize,
) {
  loading.value = true;
  try {
    const response = await fetchAll(page, limit);

    // Set qr codes data
    data.qrCodes = response.data || [];

    // Safely handle pagination with default values
    const paginate = response.pagination || {};

    data.pagination = {
      current: paginate.currentPage ?? page ?? 1,
      pageSize: paginate.limit ?? limit ?? 10,
      total: paginate.total ?? 0,
      showSizeChanger: true,
    };
  } catch (error) {
    console.error("Failed to load qr codes", error);
    showErrorNotification(
      t("modules.qrCode.form.validation.loadError"),
      (error as Error).message,
    );

    // Reset to safe defaults on error
    data.qrCodes = [];
    data.pagination = {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
    };
  } finally {
    loading.value = false;
  }
}

// Load initial data
onMounted(() => {
  loadQrCodes();
});

// Handle table pagination change
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadQrCodes(current, pageSize);
}

// Modal handlers
function openEditModal(qrCode: any) {
  selectedQrCode.value = {
    id: qrCode.id,
    file: qrCode.image_url,
  };
  isEditModalVisible.value = true;
}

// Function to handle image error
function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target) {
    // Generate a default QR code placeholder
    target.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QR+Code`;
  }
}
</script>

<template>
  <div class="qr-code-header">
    <h1>{{ t("modules.qrCode.title") }}</h1>
  </div>

  <!-- Table Section -->
  <div class="table-container">
    <a-table
      :dataSource="data.qrCodes"
      :columns="columns"
      :pagination="data.pagination"
      :loading="loading"
      :rowKey="getRecordKey"
      @change="handleTableChange"
      class="qr-code-table"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'no'">
          <span class="row-number">{{ getRowNumber(index) }}</span>
        </template>

        <template v-else-if="column.key === 'image_url'">
          <img
            :src="record.image_url"
            alt="QR Code"
            class="qr-code-image"
            @error="handleImageError"
          />
        </template>

        <template v-else-if="column.key === 'created_at'">
          <span>{{ record.created_at }}</span>
        </template>

        <template v-else-if="column.key === 'updated_at'">
          <span>{{ record.updated_at }}</span>
        </template>

        <template v-else-if="column.key === 'action'">
          <div class="action-icons">
            <a-tooltip v-if="can('update', 'qr-code')" :title="t('actions.edit')">
              <edit-outlined class="icon edit" @click="openEditModal(record)" />
            </a-tooltip>
          </div>
        </template>
      </template>
    </a-table>
  </div>

  <!-- Edit Modal Component -->
  <EditQrCodeModal
    v-model:visible="isEditModalVisible"
    :qrCode="selectedQrCode"
    @success="loadQrCodes"
  />
</template>

<style lang="scss" scoped>
.qr-code-header {
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

.qr-code-table {
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

.file-name-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #262626;
}

.qr-code-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 1px solid #d9d9d9;
  padding: 5px;
  background: #fff;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
