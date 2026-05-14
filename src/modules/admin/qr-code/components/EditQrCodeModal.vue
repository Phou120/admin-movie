<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  CloseOutlined,
  SaveOutlined,
  QrcodeOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons-vue";
import type { IQrCodeForm } from "../interface/qr-code.interface";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";
import type { UploadProps } from "ant-design-vue";
import { QrCodeComposible } from "../composible/index";

interface Props {
  visible: boolean;
  qrCode?: IQrCodeForm | null;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();
const { updateQrCode, upload } = QrCodeComposible();

const formData = ref<IQrCodeForm>({
  id: 0,
  file: "",
});

const loading = ref(false);
const displayImageUrl = ref(""); // For displaying in UI (image_url)
const selectedFileName = ref(""); // For display purposes
const hasNewFile = ref(false); // Track if user selected a new file
const isHovering = ref(false); // Track hover state for drag effect

// File list for upload component
const fileList = ref<any[]>([]);

// Responsive modal width
const modalWidth = computed(() => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 576) return "90%";
    if (window.innerWidth < 768) return "80%";
  }
  return 600;
});

// Watch for qrCode prop changes
watch(
  () => props.qrCode,
  (newQrCode) => {
    if (newQrCode) {
      formData.value = {
        id: newQrCode.id,
        file: newQrCode.file, // Keep the original image_url initially
      };
      // Display the image_url from API
      if (newQrCode.file && typeof newQrCode.file === "string") {
        displayImageUrl.value = newQrCode.file;
        selectedFileName.value = newQrCode.file.split("/").pop() || "";
      }
      hasNewFile.value = false;
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
    file: "",
  };
  displayImageUrl.value = "";
  selectedFileName.value = "";
  fileList.value = [];
  hasNewFile.value = false;
  isHovering.value = false;
}

function handleCancel() {
  if (loading.value) return;
  resetForm();
  emit("update:visible", false);
}

const handleImageChange: UploadProps["onChange"] = (info) => {
  if (info.fileList.length > 0) {
    const file = info.fileList[0].originFileObj;

    if (file) {
      // Validate file type
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        showErrorNotification(
          t("common.error"),
          t("modules.qrCode.form.validation.invalidImage")
        );
        fileList.value = [];
        return;
      }

      // Validate file size
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        showErrorNotification(
          t("common.error"),
          t("modules.qrCode.form.validation.imageTooLarge")
        );
        fileList.value = [];
        return;
      }

      // Create preview for display
      const reader = new FileReader();
      reader.onload = (e) => {
        displayImageUrl.value = e.target?.result as string; // Show new file preview
        selectedFileName.value = file.name;
        formData.value.file = file; // Store File object for upload
        hasNewFile.value = true; // Mark that we have a new file
      };
      reader.readAsDataURL(file);
    }
  } else {
    // File was removed - revert to original image_url
    if (props.qrCode?.file && typeof props.qrCode.file === "string") {
      displayImageUrl.value = props.qrCode.file;
      selectedFileName.value = props.qrCode.file.split("/").pop() || "";
      formData.value.file = props.qrCode.file; // Revert to string (image_url)
      hasNewFile.value = false; // No new file
    }
  }
};

const beforeUpload: UploadProps["beforeUpload"] = () => {
  // Prevent automatic upload
  return false;
};

async function handleSubmit() {
  if (!formData.value.id) {
    showErrorNotification(
      t("common.error"),
      t("modules.qrCode.form.validation.idRequired")
    );
    return;
  }

  loading.value = true;
  try {
    const payload: any = { id: formData.value.id };

    // Only upload + include file if user picked a new one
    if (hasNewFile.value && formData.value.file instanceof File) {
      payload.file = await upload(formData.value.file);
    }

    const response = await updateQrCode(payload);
    showSuccessNotification(
      response.message || "QR Code updated successfully"
    );
    emit("success");
    resetForm();
    emit("update:visible", false);
  } catch (error) {
    showErrorNotification(
      t("modules.qrCode.form.validation.updateError"),
      (error as Error).message
    );
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <a-modal
    :open="visible"
    :title="t('modules.qrCode.editModal')"
    :footer="null"
    :closable="!loading"
    :mask-closable="!loading"
    @cancel="handleCancel"
    :width="modalWidth"
    class="qr-code-modal"
  >
    <a-form layout="vertical" :model="formData">
      <!-- Single Box for File Selection and Preview -->
      <a-form-item :label="t('modules.qrCode.form.qrCodeFile')">
        <a-upload
          v-model:file-list="fileList"
          :before-upload="beforeUpload"
          @change="handleImageChange"
          :max-count="1"
          :show-upload-list="false"
          class="qr-upload-box"
          :accept="'image/*'"
          :multiple="false"
          drag
          @mouseenter="isHovering = true"
          @mouseleave="isHovering = false"
        >
          <div class="qr-upload-container" :class="{ hovering: isHovering || fileList.length > 0 }">
            <!-- QR Code Preview/Image -->
            <div class="qr-preview-area">
              <div v-if="displayImageUrl" class="qr-image-wrapper">
                <img :src="displayImageUrl" alt="QR Code" class="qr-image" />
                <!-- Overlay with upload icon on hover -->
                <div class="qr-overlay" :class="{ visible: isHovering || fileList.length > 0 }">
                  <cloud-upload-outlined class="upload-cloud-icon" />
                  <div class="upload-text">{{ t("modules.qrCode.form.dragOrClick") }}</div>
                </div>
              </div>
              <div v-else class="qr-placeholder">
                <qrcode-outlined class="qr-placeholder-icon" />
                <div class="qr-placeholder-text">{{ t("modules.qrCode.form.noImage") }}</div>
                <cloud-upload-outlined class="upload-cloud-icon-placeholder" />
              </div>
            </div>

            <!-- File Info Badge -->
            <div v-if="displayImageUrl" class="file-info-badge">
              <qrcode-outlined class="file-badge-icon" />
              <span class="file-badge-text">{{ selectedFileName }}</span>
              <a-tag v-if="hasNewFile" color="green" size="small" class="new-badge">
                {{ t("modules.qrCode.form.newFile") }}
              </a-tag>
            </div>

            <!-- Upload Hint -->
            <div v-if="!displayImageUrl" class="upload-hint-bottom">
              <span class="hint-icon">💡</span>
              {{ t("modules.qrCode.form.uploadHint") }}
            </div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>

    <div class="modal-footer">
      <a-space>
        <a-button
          class="custom-cancel-btn"
          @click="handleCancel"
          :disabled="loading"
        >
          <CloseOutlined />{{ t("actions.close") }}
        </a-button>
        <a-button
          class="custom-ok-btn"
          type="primary"
          @click="handleSubmit"
          :loading="loading"
        >
          <SaveOutlined />{{ t("actions.update") }}
        </a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<style lang="scss" scoped>
.qr-code-modal {
  :deep(.ant-modal-content) {
    border-radius: 16px;
    overflow: hidden;
  }

  :deep(.ant-modal-header) {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border-bottom: none;

    .ant-modal-title {
      color: white;
      font-weight: 600;
    }
  }

  :deep(.ant-modal-body) {
    padding: 32px 32px 24px 32px;
  }
}

.qr-upload-box {
  width: 100%;

  :deep(.ant-upload) {
    width: 100%;
    background: transparent;
    border: none;
    padding: 0;
  }

  :deep(.ant-upload-drag) {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
  }
}

.qr-upload-container {
  min-height: 360px;
  border: 2px dashed #d9d9d9;
  border-radius: 16px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &.hovering {
    border-color: #1890ff;
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    box-shadow: 0 4px 20px rgba(24, 144, 255, 0.15);
  }

  :deep(.ant-upload-drag-container) {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.qr-preview-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  min-height: 280px;

  .qr-image-wrapper {
    position: relative;
    display: inline-block;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    background: white;
    transition: all 0.3s ease;

    .qr-image {
      display: block;
      max-width: 240px;
      max-height: 240px;
      object-fit: contain;
      min-width: 200px;
      min-height: 200px;
    }

    .qr-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(4px);

      &.visible {
        opacity: 1;
      }

      .upload-cloud-icon {
        font-size: 64px;
        color: white;
        margin-bottom: 16px;
      }

      .upload-text {
        color: white;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        padding: 0 16px;
      }
    }
  }

  .qr-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .qr-placeholder-icon {
      font-size: 80px;
      color: #1890ff;
      opacity: 0.5;
    }

    .qr-placeholder-text {
      font-size: 18px;
      font-weight: 500;
      color: #595959;
    }

    .upload-cloud-icon-placeholder {
      font-size: 48px;
      color: #1890ff;
    }
  }
}

.file-info-badge {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: white;
  border-radius: 50px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border: 1px solid #e8e8e8;

  .file-badge-icon {
    font-size: 20px;
    color: #1890ff;
  }

  .file-badge-text {
    font-size: 14px;
    font-weight: 500;
    color: #262626;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .new-badge {
    margin-left: 8px;
  }
}

.upload-hint-bottom {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;

  .hint-icon {
    font-size: 16px;
  }

  font-size: 13px;
  color: #595959;
  text-align: center;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.custom-ok-btn {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
  height: 40px;
  padding: 0 24px;
  font-weight: 500;

  &:hover {
    background-color: #0a293ecc;
    border-color: #0a293ecc;
    color: #ffffff;
  }
}

.custom-cancel-btn {
  height: 40px;
  padding: 0 24px;
  font-weight: 500;

  &:hover {
    border-color: #ff4d4f;
    color: #ff4d4f;
  }
}

// Responsive design
@media (max-width: 768px) {
  .qr-upload-container {
    min-height: 300px;

    .qr-preview-area {
      padding: 20px;
      min-height: 220px;

      .qr-image-wrapper .qr-image {
        max-width: 180px;
        max-height: 180px;
        min-width: 150px;
        min-height: 150px;
      }

      .qr-placeholder .qr-placeholder-icon {
        font-size: 60px;
      }
    }
  }
}
</style>
