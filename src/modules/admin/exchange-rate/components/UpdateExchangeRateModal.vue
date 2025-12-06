<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons-vue";
import type { IExchangeRateForm, ICurrencyOption, IOperationOption } from "../interface/exchange-rate.interface";

interface Props {
  visible: boolean;
  exchangeRateData: IExchangeRateForm | null;
  currencies?: ICurrencyOption[];
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "submit", form: IExchangeRateForm): void;
}

const props = withDefaults(defineProps<Props>(), {
  currencies: () => []
});

const emit = defineEmits<Emits>();

const operationOptions: IOperationOption[] = [
  { label: "Multiply (×)", value: "*", description: "From × To" },
  { label: "Divide (÷)", value: "/", description: "From ÷ To" }
];

const formUpdate = ref<IExchangeRateForm>({
  id: 0,
  from_currency_id: 0,
  operate: "*",
  to_currency_id: 0,
});

// Update form when exchangeRateData changes
watch(
  () => props.exchangeRateData,
  (newData) => {
    if (newData) {
      formUpdate.value = {
        id: newData.id,
        from_currency_id: newData.from_currency_id,
        operate: newData.operate,
        to_currency_id: newData.to_currency_id,
      };
    }
  },
  { immediate: true }
);

// Submit form
const handleSubmit = () => {
  if (
    formUpdate.value.from_currency_id > 0 &&
    formUpdate.value.to_currency_id > 0 &&
    formUpdate.value.from_currency_id !== formUpdate.value.to_currency_id
  ) {
    emit("submit", { ...formUpdate.value });
  }
};

// Cancel
const handleCancel = () => {
  emit("update:visible", false);
};

// Validation
const isFormValid = computed(() => {
  return (
    formUpdate.value.from_currency_id > 0 &&
    formUpdate.value.to_currency_id > 0 &&
    formUpdate.value.from_currency_id !== formUpdate.value.to_currency_id
  );
});
</script>

<template>
  <a-modal
    :open="visible"
    title="Edit Exchange Rate"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-form layout="vertical">
      <a-form-item
        label="From Currency"
        :validate-status="formUpdate.from_currency_id > 0 ? 'success' : 'error'"
        :help="formUpdate.from_currency_id <= 0 ? 'Please select a currency' : ''"
      >
        <a-select
          v-model:value="formUpdate.from_currency_id"
          :options="currencies"
          placeholder="Select from currency"
          :filter-option="(input: string, option: any) =>
            option.label.toLowerCase().includes(input.toLowerCase()) ||
            option.value.toString().includes(input)"
          show-search
        />
      </a-form-item>

      <a-form-item label="Operation">
        <a-select
          v-model:value="formUpdate.operate"
          :options="operationOptions.map(op => ({
            value: op.value,
            label: op.label
          }))"
          placeholder="Select operation"
        >
          <template #option="{ value, label }">
            <div>
              <div>{{ label }}</div>
              <small style="color: #666">
                {{ operationOptions.find(op => op.value === value)?.description }}
              </small>
            </div>
          </template>
        </a-select>
      </a-form-item>

      <a-form-item
        label="To Currency"
        :validate-status="formUpdate.to_currency_id > 0 && formUpdate.from_currency_id !== formUpdate.to_currency_id ? 'success' : 'error'"
        :help="formUpdate.to_currency_id <= 0 ? 'Please select a currency' :
               formUpdate.from_currency_id === formUpdate.to_currency_id ? 'Cannot be same as from currency' : ''"
      >
        <a-select
          v-model:value="formUpdate.to_currency_id"
          :options="currencies.filter(curr => curr.value !== formUpdate.from_currency_id)"
          placeholder="Select to currency"
          :filter-option="(input: string, option: any) =>
            option.label.toLowerCase().includes(input.toLowerCase()) ||
            option.value.toString().includes(input)"
          show-search
        />
      </a-form-item>
    </a-form>

    <div class="modal-footer">
      <a-button class="custom-cancel-btn" @click="handleCancel"
        ><CloseOutlined />Close</a-button
      >
      <a-button
        type="primary"
        class="custom-ok-btn"
        @click="handleSubmit"
        :disabled="!isFormValid"
      >
        <SaveOutlined />
        Confirm
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