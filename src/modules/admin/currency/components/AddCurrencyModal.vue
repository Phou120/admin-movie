<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import {
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";
import type { ICurrencyForm } from "../interface/currency.interface";
import { showErrorNotification } from "../../../../common/utils/notification";

interface Props {
  visible: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = ref<ICurrencyForm>({
  name: "",
  short_name: "",
});

const loading = ref(false);
const nameInputRef = ref<HTMLInputElement>();
const shortNameInputRef = ref<HTMLInputElement>();
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
    name: "",
    short_name: "",
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
    validationError.value = "Currency name is required";
    showValidationError.value = true;
    nextTick(() => {
      nameInputRef.value?.focus();
    });
    return false;
  }

  if (!formData.value.short_name.trim()) {
    validationError.value = "Currency short name is required";
    showValidationError.value = true;
    nextTick(() => {
      shortNameInputRef.value?.focus();
    });
    return false;
  }

  if (formData.value.short_name.trim().length > 5) {
    validationError.value = "Currency short name should be 5 characters or less";
    showValidationError.value = true;
    nextTick(() => {
      shortNameInputRef.value?.focus();
    });
    return false;
  }

  validationError.value = "";
  showValidationError.value = false;
  return true;
}

function handleInputChange() {
  if (showValidationError.value && formData.value.name.trim() && formData.value.short_name.trim()) {
    validationError.value = "";
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
    showErrorNotification("Failed to create currency:", (error as Error).message);
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
    title="Add Currency"
    :footer="null"
    @cancel="handleCancel"
    :width="modalWidth"
    class="currency-modal"
  >
    <a-form layout="vertical" :model="formData">
      <a-form-item
        label="Currency Name"
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
          placeholder="Enter currency name"
          size="large"
          :class="{
            'error-input': showValidationError && !formData.name.trim(),
          }"
          @input="handleInputChange"
          @press-enter="handleSubmit"
        />
      </a-form-item>

      <a-form-item
        label="Currency Short Name"
        :validate-status="
          showValidationError && !formData.short_name.trim() ? 'error' : ''
        "
        :help="
          showValidationError && !formData.short_name.trim() ? validationError : ''
        "
      >
        <a-input
          ref="shortNameInputRef"
          v-model:value="formData.short_name"
          placeholder="Enter currency short name (e.g., LAK, USD, EUR)"
          size="large"
          maxlength="5"
          :class="{
            'error-input': showValidationError && !formData.short_name.trim(),
          }"
          @input="handleInputChange"
          @press-enter="handleSubmit"
          style="text-transform: uppercase"
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
        <SaveOutlined />Create
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

:deep(.currency-modal .ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.currency-modal .ant-modal-header) {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
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