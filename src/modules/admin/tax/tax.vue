<template>
  <div class="customer-header">
    <h1>Tax Management</h1>
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

        <template v-else-if="column.key === 'created_at'">
          {{ formatDateBTC(record.created_at) }}
        </template>

        <template v-else-if="column.key === 'updated_at'">
          {{ formatDateBTC(record.updated_at) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <span class="action-icons">
            <a-tooltip title="Edit">
              <edit-outlined class="icon edit" @click="openEditModal(record)" />
            </a-tooltip>
          </span>
        </template>

        <template v-else>
          {{ record[column.dataIndex] }}
        </template>
      </template>
    </a-table>
  </div>

  <a-modal
    v-model:open="isEditModalVisible"
    title="Update Banner"
    :footer="null"
    @cancel="handleCancelEdit"
    :width="modalWidth"
  >
    <a-form layout="vertical">
      <a-form-item label="Name">
        <a-input v-model:value="formEdit.name" />
      </a-form-item>

      <a-form-item label="Percentage">
        <a-input
          v-model:value="percentageValue"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          placeholder="Enter percentage (e.g., 10.5)"
          style="width: 100%"
          @input="handlePercentageInput"
          @keypress="handlePercentageKeyPress"
          @paste="handlePercentagePaste"
        />
      </a-form-item>
    </a-form>

    <div class="modal-footer">
      <a-button class="custom-cancel-btn" @click="handleCancelEdit"
        ><CloseOutlined /> Close</a-button
      >
      <a-button type="primary" class="custom-ok-btn" @click="submitEdit">
        <SaveOutlined />
        Update
      </a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import { useTax } from "./composible";
import type { ITax, ITaxForm } from "./interface/tax.interface";
import { showSuccessNotification } from "../../../common/utils/notification";
import formatDateBTC from "../../../common/utils/format-datebtc.util";

const { fetchAll, updateTax } = useTax();

// Modal controls
const isEditModalVisible = ref(false);
const loading = ref(false);

// Responsive modal width
const modalWidth = computed(() => {
  if (window.innerWidth < 576) return "90%";
  if (window.innerWidth < 768) return "80%";
  return 520;
});

// Table Data
const data = reactive<ITax>({
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

// Edit Form
const formEdit = ref<ITaxForm>({
  id: 0,
  name: "",
  percentage: 0,
});
const previewEditImage = ref("");

// Computed property for percentage input handling
const percentageValue = computed({
  get: () => formEdit.value.percentage.toString(),
  set: (value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, "");
    formEdit.value.percentage = parseFloat(cleanValue) || 0;
  },
});

// Handle percentage input with number-only restriction
const handlePercentageInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  // Only allow numbers and decimal point
  let value = input.value.replace(/[^\d.]/g, "");

  // Prevent multiple decimal points
  const decimalPoints = value.match(/\./g);
  if (decimalPoints && decimalPoints.length > 1) {
    value = value.replace(/\.(?=.*\.)/g, "");
  }

  // Convert to number and update form
  formEdit.value.percentage = parseFloat(value) || 0;
};

// Prevent non-number key presses for percentage
const handlePercentageKeyPress = (event: KeyboardEvent) => {
  const char = String.fromCharCode(event.which);
  const value = (event.target as HTMLInputElement).value;

  // Allow backspace, delete, tab, escape, enter
  if ([8, 9, 13, 27, 46].indexOf(event.which) !== -1) {
    return;
  }

  // Allow numbers and decimal point (only one)
  if (!/^\d$/.test(char) || (char === "." && value.includes("."))) {
    event.preventDefault();
  }
};

// Handle paste event for percentage
const handlePercentagePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData("text") || "";
  const numericData = pasteData.replace(/[^\d.]/g, "");

  const input = event.target as HTMLInputElement;
  const currentValue = input.value;
  const cursorPosition = input.selectionStart || 0;

  // Insert only numeric data at cursor position
  const newValue =
    currentValue.slice(0, cursorPosition) +
    numericData +
    currentValue.slice(cursorPosition);
  const numValue = parseFloat(newValue) || 0;
  formEdit.value.percentage = numValue;
};

// Table columns
const columns = [
  // IMPORTANT: dataIndex removed to allow the custom template to work
  { title: "No", key: "no", align: "center", width: 60 },
  { title: "Name", dataIndex: "name", key: "name", width: 300 },
  {
    title: "Percentage",
    dataIndex: "percentage",
    key: "percentage",
    ellipsis: true,
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    width: 200,
    align: "center",
  },
  {
    title: "Updated At",
    dataIndex: "updated_at",
    key: "updated_at",
    width: 200,
    align: "center",
  },
  { title: "Action", key: "action", width: 100, align: "center" },
];

// Load banners
async function loadBanners(
  page = data.pagination.current,
  limit = data.pagination.pageSize
) {
  loading.value = true;
  try {
    const res = await fetchAll(page, limit);
    data.banners = res.data;

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
  loadBanners(current, pageSize);
}

// Edit Banner
function openEditModal(row: any) {
  formEdit.value = { ...row };
  previewEditImage.value = row.image_url;
  isEditModalVisible.value = true;
}

async function submitEdit() {
  const response = await updateTax(formEdit.value);
  // Display the backend message
  showSuccessNotification(response.message);
  isEditModalVisible.value = false;
  loadBanners();
}

function handleCancelEdit() {
  isEditModalVisible.value = false;
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
