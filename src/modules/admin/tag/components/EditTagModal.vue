<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons-vue";
import type { ITagForm } from "../interface/tag.interface";
import { showErrorNotification } from "../../../../common/utils/notification";

interface Props {
  visible: boolean;
  tag?: ITagForm | null;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = ref<ITagForm>({
  id: 0,
  name: "",
});

const loading = ref(false);
const inputRef = ref();
const validationError = ref("");
const showValidationError = ref(false);

// Watch for tag prop changes
watch(
  () => props.tag,
  (newTag) => {
    if (newTag) {
      formData.value = {
        id: newTag.id,
        name: newTag.name,
      };
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
  };
  validationError.value = "";
  showValidationError.value = false;
}

function handleCancel() {
  resetForm();
  emit("update:visible", false);
}

function validateForm(): boolean {
  if (!formData.value.name.trim()) {
    validationError.value = "Tag name is required";
    showValidationError.value = true;
    // Focus on input field
    nextTick(() => {
      const inputElement = inputRef.value as any;
      if (inputElement && inputElement.focus) {
        inputElement.focus();
      }
    });
    return false;
  }

  validationError.value = "";
  showValidationError.value = false;
  return true;
}

function handleInputChange() {
  if (showValidationError.value && formData.value.name.trim()) {
    validationError.value = '';
    showValidationError.value = false;
  }
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
    showErrorNotification("Failed to update tag:", (error as Error).message);
  } finally {
    loading.value = false;
  }
}

// Expose form data to parent
defineExpose({
  formData,
});
</script>

<template>
  <a-modal
    :open="visible"
    title="Edit Tag"
    width="400px"
    :footer="null"
    @cancel="handleCancel"
    class="tag-modal"
  >
    <a-form layout="vertical" :model="formData">
      <a-form-item
        label="Tag Name"
        name="name"
        :validate-status="showValidationError ? 'error' : ''"
        :help="showValidationError ? validationError : ''"
      >
        <a-input
          ref="inputRef"
          v-model:value="formData.name"
          placeholder="Enter tag name"
          size="large"
          :class="{ 'error-input': showValidationError }"
          @input="handleInputChange"
          @press-enter="handleSubmit"
        />
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

  &:focus {
    border-color: #ff4d4f !important;
    box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;
  }
}

:deep(.tag-modal .ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.tag-modal .ant-modal-header) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-bottom: none;

  .ant-modal-title {
    color: white;
    font-weight: 600;
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
