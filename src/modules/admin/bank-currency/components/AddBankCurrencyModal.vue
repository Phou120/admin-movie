<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons-vue";
import type { IBankCurrencyForm } from "../interface/bank-currency.interface";
import { showErrorNotification } from "../../../../common/utils/notification";
import { CurrencyComposible } from "../../currency/composible";

const { fetchAll } = CurrencyComposible();

interface Props {
  visible: boolean;
  bankId: number;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();

const formData = ref<Omit<IBankCurrencyForm, "bank_id">>({
  currency_id: 0,
});

const loading = ref(false);
const currencyOptions = ref<{ id: number; name: string; short_name: string }[]>(
  []
);
const currencyInputRef = ref();
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

// Fetch currencies on mount and auto-select first one
onMounted(async () => {
  await fetchCurrencyOptions();
  // Auto-select first currency if available
  if (currencyOptions.value.length > 0) {
    formData.value.currency_id = currencyOptions.value[0].id;
  }
});

async function fetchCurrencyOptions() {
  try {
    const response = await fetchAll(1, 100);
    currencyOptions.value = response.data || [];
  } catch (error) {
    console.error("Failed to fetch currencies:", error);
  }
}

function resetForm() {
  // Auto-select first currency if available, otherwise default to 0
  formData.value = {
    currency_id:
      currencyOptions.value.length > 0 ? currencyOptions.value[0].id : 0,
  };
  validationError.value = "";
  showValidationError.value = false;
}

function handleCancel() {
  resetForm();
  emit("update:visible", false);
}

function validateForm(): boolean {
  // Check if a valid currency is selected (exists in options)
  const isValidCurrency =
    formData.value.currency_id > 0 &&
    currencyOptions.value.some(
      (currency) => currency.id === formData.value.currency_id
    );

  if (!isValidCurrency) {
    validationError.value = t('modules.bankCurrency.addForm.validation.currencyRequired');
    showValidationError.value = true;
    nextTick(() => {
      currencyInputRef.value?.focus();
    });
    return false;
  }

  validationError.value = "";
  showValidationError.value = false;
  return true;
}

function handleInputChange() {
  if (showValidationError.value && formData.value.currency_id) {
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
    showErrorNotification(
      t('modules.bankCurrency.addForm.validation.createError'),
      (error as Error).message
    );
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
    :title="t('modules.bankCurrency.addForm.title')"
    :footer="null"
    @cancel="handleCancel"
    :width="modalWidth"
    class="bank-currency-modal"
  >
    <a-form layout="vertical" :model="formData">
      <a-form-item
        :label="t('modules.bankCurrency.addForm.currency')"
        :validate-status="
          showValidationError && !formData.currency_id ? 'error' : ''
        "
        :help="
          showValidationError && !formData.currency_id ? validationError : ''
        "
      >
        <a-select
          ref="currencyInputRef"
          v-model:value="formData.currency_id"
          :placeholder="t('modules.bankCurrency.addForm.placeholder.currency')"
          size="large"
          :class="{
            'error-input': showValidationError && !formData.currency_id,
          }"
          @change="handleInputChange"
          show-search
          :filter-option="(input: string, option: any) => option.name.toLowerCase().includes(input.toLowerCase())"
        >
          <a-select-option
            v-for="currency in currencyOptions"
            :key="currency.id"
            :value="currency.id"
            :label="`${currency.name} (${currency.short_name})`"
          >
            {{ currency.name }} ({{ currency.short_name }})
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <div class="modal-footer">
      <a-button
        class="custom-cancel-btn"
        @click="handleCancel"
        :disabled="loading"
      >
        <CloseOutlined />{{ t('common.cancel') }}
      </a-button>
      <a-button
        class="custom-ok-btn"
        type="primary"
        @click="handleSubmit"
        :loading="loading"
      >
        <SaveOutlined />{{ t('modules.bankCurrency.addForm.actions.create') }}
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

:deep(.bank-currency-modal .ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.bank-currency-modal .ant-modal-header) {
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
