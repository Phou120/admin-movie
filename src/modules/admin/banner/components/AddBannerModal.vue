<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import {
  CloseOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import type { IBannerForm } from "../interface/banner.interface";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";
import { useBanner } from "../composible/index";

interface Props {
  visible: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();
const { createBanner, upload } = useBanner();

const formData = ref<IBannerForm>({
  file_banner: "",
  link: "",
  order_by: 0,
});

const loading = ref(false);
const previewAddImage = ref("");
const fileInputRef = ref();
const linkInputRef = ref<HTMLInputElement>();
const orderBy = ref();
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
    file_banner: "",
    link: "",
    order_by: 0,
  };
  previewAddImage.value = "";
  validationError.value = "";
  showValidationError.value = false;
}

function handleCancel() {
  resetForm();
  emit("update:visible", false);
}

function validateForm(): boolean {
  // Check if file_banner is empty (could be empty string, null, or undefined)
  const isEmptyBanner =
    !formData.value.file_banner ||
    (typeof formData.value.file_banner === "string" &&
      formData.value.file_banner.trim() === "");

  if (isEmptyBanner) {
    validationError.value = t('modules.banner.form.validation.imageRequired');
    showValidationError.value = true;
    nextTick(() => {
      fileInputRef.value?.focus();
    });
    return false;
  }

  if (!formData.value.link.trim()) {
    validationError.value = t('modules.banner.form.validation.linkRequired');
    showValidationError.value = true;
    nextTick(() => {
      linkInputRef.value?.focus();
    });
    return false;
  }

  if (!formData.value.order_by) {
    validationError.value = t('modules.banner.form.validation.orderRequired');
    showValidationError.value = true;
    nextTick(() => {
      orderBy.value?.focus();
    });
    return false;
  }

  validationError.value = "";
  showValidationError.value = false;
  return true;
}

function handleInputChange() {
  if (showValidationError.value && formData.value.link.trim()) {
    validationError.value = "";
    showValidationError.value = false;
  }
}

function beforeUpload(file: File) {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    showErrorNotification("Error", t('modules.banner.form.validation.invalidImage'));
    return false;
  }

  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    showErrorNotification("Error", t('modules.banner.form.validation.imageTooLarge'));
    return false;
  }

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewAddImage.value = e.target?.result as string;
    formData.value.file_banner = file;
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
    let file_banner = formData.value.file_banner;
    if (formData.value.file_banner instanceof File) {
      file_banner = await upload(formData.value.file_banner);
    }

    const response = await createBanner({
      ...formData.value,
      file_banner,
    });

    showSuccessNotification(response.message);
    emit("success");
    handleCancel();
  } catch (error) {
    showErrorNotification("Failed to create banner", (error as Error).message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <a-modal
    :open="visible"
    :title="t('modules.banner.addModal')"
    :footer="null"
    @cancel="handleCancel"
    :width="modalWidth"
    class="banner-modal"
  >
    <a-form layout="vertical" :model="formData">
      <a-form-item
        :label="t('modules.banner.form.bannerImage')"
        :validate-status="
          showValidationError && !formData.file_banner ? 'error' : ''
        "
        :help="
          showValidationError && !formData.file_banner ? validationError : ''
        "
      >
        <a-upload
          ref="fileInputRef"
          name="image"
          list-type="picture-card"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :class="{
            'error-input': showValidationError && !formData.file_banner,
          }"
        >
          <div v-if="!previewAddImage">
            <plus-outlined />
            <div style="margin-top: 8px">{{ t('modules.banner.form.upload') }}</div>
          </div>
          <img
            v-else
            :src="previewAddImage"
            alt="banner"
            style="width: 100%; height: 100%; object-fit: cover"
          />
        </a-upload>
      </a-form-item>

      <a-form-item
        :label="t('modules.banner.form.link')"
        :validate-status="
          showValidationError && !formData.link.trim() ? 'error' : ''
        "
        :help="
          showValidationError && !formData.link.trim() ? validationError : ''
        "
      >
        <a-input
          ref="linkInputRef"
          v-model:value="formData.link"
          :placeholder="t('modules.banner.form.placeholder.link')"
          size="large"
          :class="{
            'error-input': showValidationError && !formData.link.trim(),
          }"
          @input="handleInputChange"
          @press-enter="handleSubmit"
        />
      </a-form-item>

      <a-form-item :label="t('modules.banner.form.order')">
        <a-input-number
          v-model:value="formData.order_by"
          :min="0"
          :precision="0"
          :placeholder="t('modules.banner.form.placeholder.order')"
          size="large"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>

    <div class="modal-footer">
      <a-button
        class="custom-cancel-btn"
        @click="handleCancel"
        :disabled="loading"
      >
        <CloseOutlined />{{ t('actions.close') }}
      </a-button>
      <a-button
        class="custom-ok-btn"
        type="primary"
        @click="handleSubmit"
        :loading="loading"
      >
        <SaveOutlined />{{ t('actions.create') }}
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

:deep(.banner-modal .ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.banner-modal .ant-modal-header) {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  border-bottom: none;

  .ant-modal-title {
    color: white;
    font-weight: 600;
  }
}

:deep(.ant-upload.ant-upload-select-picture-card) {
  width: 200px;
  height: 120px;
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
