<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons-vue";
import type { IViewsForm } from "../interface/views.interface";
import { formatInputNumber, parseFormattedNumber } from "../../../../common/utils/format-number.util";
import { useI18n } from "vue-i18n";
import { ViewsComposible } from "../composible/index";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";

interface Props {
  visible: boolean;
  viewData: IViewsForm | null;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();
const { updateView } = ViewsComposible();
const loading = ref(false);

const formUpdate = ref<IViewsForm>({
  id: 0,
  qty: 1,
  price: 0,
});

// Computed property for formatted price display
const formattedPrice = computed(() => {
  return formatInputNumber(formUpdate.value.price);
});

// Update form when viewData changes
watch(
  () => props.viewData,
  (newData) => {
    if (newData) {
      formUpdate.value = {
        id: newData.id,
        qty: newData.qty,
        price: newData.price,
      };
    }
  },
  { immediate: true }
);

// Handle price input
const handlePriceInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  // Update the actual price value using the parsed formatted number
  formUpdate.value.price = parseFormattedNumber(value);
};

// Prevent non-number key presses for price
const handlePriceKeyPress = (event: KeyboardEvent) => {
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

// Handle paste for price
const handlePricePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData("text") || "";

  // Parse and format the pasted data
  const parsedNumber = parseFormattedNumber(pasteData);
  formUpdate.value.price = parsedNumber;
};

// Submit form
const handleSubmit = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  try {
    const response = await updateView({ ...formUpdate.value });
    showSuccessNotification(response.message);
    emit("success");
    emit("update:visible", false);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    showErrorNotification("Failed to update view", message);
  } finally {
    loading.value = false;
  }
};

// Cancel
const handleCancel = () => {
  if (loading.value) return;
  emit("update:visible", false);
};

// Validation
const isFormValid = computed(() => {
  return formUpdate.value.qty === 1 && formUpdate.value.price > 0;
});
</script>

<template>
  <a-modal
    :open="visible"
    :title="t('modules.views.editModal')"
    :footer="null"
    :closable="!loading"
    :mask-closable="!loading"
    @cancel="handleCancel"
  >
    <a-form layout="vertical">
      <a-form-item
        :label="t('modules.views.form.quantity')"
        :validate-status="formUpdate.qty === 1 ? 'success' : 'error'"
        :help="
          formUpdate.qty !== 1 ? t('modules.views.form.validation.exactlyOne') : t('modules.views.form.validation.fixedAtOne')
        "
      >
        <a-input-number
          v-model:value="formUpdate.qty"
          :min="1"
          :max="1"
          :step="1"
          :placeholder="t('modules.views.form.placeholder.fixed')"
          style="width: 100%"
          :disabled="true"
        />
        <div style="color: #666; font-size: 12px; margin-top: 4px">
          {{ t('modules.views.form.note') }}
        </div>
      </a-form-item>

      <a-form-item
        :label="t('modules.views.form.price')"
        :validate-status="formUpdate.price > 0 ? 'success' : 'error'"
        :help="formUpdate.price <= 0 ? t('modules.views.form.validation.priceGreaterThanZero') : ''"
      >
        <a-input
          :value="formattedPrice"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          :placeholder="t('modules.views.form.placeholder.price')"
          style="width: 100%"
          @input="handlePriceInput"
          @keypress="handlePriceKeyPress"
          @paste="handlePricePaste"
        />
      </a-form-item>
    </a-form>

    <div class="modal-footer">
      <a-button
        class="custom-cancel-btn"
        :disabled="loading"
        @click="handleCancel"
      >
        <CloseOutlined />{{ t('common.cancel') }}
      </a-button>
      <a-button
        type="primary"
        class="custom-ok-btn"
        :loading="loading"
        :disabled="!isFormValid || loading"
        @click="handleSubmit"
      >
        <SaveOutlined />
        {{ t('common.update') }}
      </a-button>
    </div>
  </a-modal>
</template>

<style lang="scss" scoped>
.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.custom-cancel-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
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
</style>
