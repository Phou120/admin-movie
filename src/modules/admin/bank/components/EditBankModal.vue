<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import {
  CloseOutlined,
  SaveOutlined,
  BankOutlined,
} from "@ant-design/icons-vue";
import type { IBankForm } from "../interface/bank.interface";
import { showErrorNotification } from "../../../../common/utils/notification";

interface Props {
  visible: boolean;
  bank?: IBankForm | null;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = ref<IBankForm>({
  id: 0,
  name: "",
  logo: "",
});

const loading = ref(false);
const previewLogoImage = ref("");
const fileInputRef = ref();
const nameInputRef = ref<HTMLInputElement>();
const validationError = ref("");
const showValidationError = ref(false);

// Responsive modal width
const modalWidth = computed(() => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 576) return "90%";
    if (window.innerWidth < 768) return "80%";
  }
  return 520;
});

// Watch for bank prop changes
watch(
  () => props.bank,
  (newBank) => {
    if (newBank) {
      formData.value = {
        id: newBank.id,
        name: newBank.name,
        logo: newBank.logo,
      };
      // Set preview image if it exists
      if (newBank.logo && typeof newBank.logo === "string") {
        previewLogoImage.value = newBank.logo;
      } else if (newBank.logo instanceof File) {
        // If it's a File object, create a preview
        const reader = new FileReader();
        reader.onload = (e) => {
          previewLogoImage.value = e.target?.result as string;
        };
        reader.readAsDataURL(newBank.logo);
      }
    }
  },
  { immediate: true }
);

// Watch for modal visibility changes
watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  }
);

function resetForm() {
  formData.value = {
    id: 0,
    name: "",
    logo: "",
  };
  previewLogoImage.value = "";
  validationError.value = "";
  showValidationError.value = false;
}

function handleCancel() {
  resetForm();
  emit("update:visible", false);
}

function validateForm(): boolean {
  if (!formData.value.name.trim()) {
    validationError.value = "Bank name is required";
    showValidationError.value = true;
    nextTick(() => {
      nameInputRef.value?.focus();
    });
    return false;
  }

  // Check if logo is empty (could be empty string, null, or undefined)
  const isEmptyLogo =
    !formData.value.logo ||
    (typeof formData.value.logo === "string" &&
      formData.value.logo.trim() === "");

  if (isEmptyLogo) {
    validationError.value = "Please upload a bank logo";
    showValidationError.value = true;
    nextTick(() => {
      fileInputRef.value?.focus();
    });
    return false;
  }

  validationError.value = "";
  showValidationError.value = false;
  return true;
}

function handleInputChange() {
  if (showValidationError.value && formData.value.name.trim()) {
    validationError.value = "";
    showValidationError.value = false;
  }
}

function beforeUpload(file: File) {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    showErrorNotification("Error", "You can only upload image files!");
    return false;
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    showErrorNotification("Error", "Logo must be smaller than 2MB!");
    return false;
  }

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewLogoImage.value = e.target?.result as string;
    formData.value.logo = file;
  };
  reader.readAsDataURL(file);

  return false; // Prevent automatic upload
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  try {
    // This will be handled by parent component
    emit("success");
    handleCancel();
  } catch (error) {
    showErrorNotification("Failed to update bank:", (error as Error).message);
  } finally {
    loading.value = false;
  }
}

// Expose form data to parent
defineExpose({
  formData,
  previewLogoImage,
});
</script>

<template>
  <a-modal
    :open="visible"
    title="Edit Bank"
    :footer="null"
    @cancel="handleCancel"
    :width="modalWidth"
    class="bank-modal"
  >
    <a-form layout="vertical" :model="formData">
      <a-form-item
        label="Bank Name"
        :validate-status="
          showValidationError && !formData.name.trim() ? 'error' : ''
        "
        :help="
          showValidationError && !formData.name.trim() ? validationError : ''
        "
      >
        <a-input
          ref="nameInputRef"
          v-model:value="formData.name"
          placeholder="Enter bank name"
          size="large"
          :class="{
            'error-input': showValidationError && !formData.name.trim(),
          }"
          @input="handleInputChange"
          @press-enter="handleSubmit"
        />
      </a-form-item>

      <a-form-item
        label="Bank Logo"
        :validate-status="showValidationError && !formData.logo ? 'error' : ''"
        :help="showValidationError && !formData.logo ? validationError : ''"
      >
        <a-upload
          ref="fileInputRef"
          name="logo"
          list-type="picture-card"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :class="{ 'error-input': showValidationError && !formData.logo }"
        >
          <div v-if="!previewLogoImage" class="upload-placeholder">
            <bank-outlined class="upload-icon" />
            <div class="upload-text">Upload Logo</div>
          </div>
          <img
            v-else
            :src="previewLogoImage"
            alt="bank logo"
            class="logo-preview"
          />
        </a-upload>
      </a-form-item>
    </a-form>

    <div class="modal-footer">
      <a-button
        class="custom-cancel-btn"
        @click="handleCancel"
        :disabled="loading"
      >
        <CloseOutlined />Close
      </a-button>
      <a-button
        class="custom-ok-btn"
        type="primary"
        @click="handleSubmit"
        :loading="loading"
      >
        <SaveOutlined />Update
      </a-button>
    </div>
  </a-modal>
</template>

<style lang="scss" scoped>
.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.error-input {
  border-color: #ff4d4f !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;

  &:focus,
  &:focus-within {
    border-color: #ff4d4f !important;
    box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .upload-icon {
    font-size: 24px;
    color: #8c8c8c;
    margin-bottom: 8px;
  }

  .upload-text {
    color: #8c8c8c;
    font-size: 12px;
  }
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

:deep(.bank-modal .ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.bank-modal .ant-modal-header) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-bottom: none;

  .ant-modal-title {
    color: white;
    font-weight: 600;
  }
}

:deep(.ant-upload.ant-upload-select-picture-card) {
  width: 200px;
  height: 120px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;

  &:hover {
    border-color: #1890ff;
  }
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
</style>
