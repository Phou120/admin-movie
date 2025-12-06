<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons-vue";
import type { IPackagesForm } from "../interface/packages.interface";
import TextEditor from "./TextEditor.vue";
import { formatNumber, parseFormattedNumber } from "../../../../common/utils/format-number.util";

interface Props {
  visible: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "submit", form: IPackagesForm): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const typeOptions = [
  { label: "1 Month", value: "one-month" },
  { label: "3 Months", value: "three-month" },
  { label: "6 Months", value: "six-month" },
  { label: "1 Year", value: "one-year" },
];

const formAdd = ref<IPackagesForm>({
  type: "one-month",
  price: 0,
  content: "",
});

// Computed property for formatted price display
const formattedPrice = computed({
  get: () => formatNumber(formAdd.value.price),
  set: (value: string) => {
    // Only allow numbers, remove all other characters
    const cleanValue = value.replace(/[^\d.]/g, '');
    formAdd.value.price = parseFormattedNumber(cleanValue);
  }
});

// Handle price input with number-only restriction
const handlePriceInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  // Only allow numbers, decimal point, and backspace/delete
  let value = input.value.replace(/[^\d.]/g, '');

  // Prevent multiple decimal points
  const decimalPoints = value.match(/\./g);
  if (decimalPoints && decimalPoints.length > 1) {
    value = value.replace(/\.(?=.*\.)/g, '');
  }

  formattedPrice.value = value;
};

// Prevent non-number key presses
const handleKeyPress = (event: KeyboardEvent) => {
  const char = String.fromCharCode(event.which);
  const value = (event.target as HTMLInputElement).value;

  // Allow backspace, delete, tab, escape, enter
  if ([8, 9, 13, 27, 46].indexOf(event.which) !== -1) {
    return;
  }

  // Allow numbers and decimal point (only one)
  if (!/^\d$/.test(char) || (char === '.' && value.includes('.'))) {
    event.preventDefault();
  }
};

// Handle paste event to remove non-numeric characters
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text') || '';
  const numericData = pasteData.replace(/[^\d.]/g, '');

  const input = event.target as HTMLInputElement;
  const currentValue = input.value;
  const cursorPosition = input.selectionStart || 0;

  // Insert only numeric data at cursor position
  const newValue = currentValue.slice(0, cursorPosition) + numericData + currentValue.slice(cursorPosition);
  formattedPrice.value = newValue;
};

// Reset form when modal opens
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      formAdd.value = {
        type: "one-month",
        price: 0,
        content: "",
      };
    }
  }
);

// Submit form
const handleSubmit = () => {
  if (formAdd.value.type && formAdd.value.price > 0) {
    emit("submit", { ...formAdd.value });
  }
};

// Cancel
const handleCancel = () => {
  emit("update:visible", false);
};
</script>

<template>
  <a-modal
    :open="visible"
    title="Add Package"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-form layout="vertical">
      <a-form-item
        label="Package Type"
        :validate-status="formAdd.type ? 'success' : 'error'"
        :help="!formAdd.type ? 'Package type is required' : ''"
      >
        <a-select
          v-model:value="formAdd.type"
          :options="typeOptions"
          placeholder="Select package type"
        />
      </a-form-item>
      <a-form-item
        label="Price"
        :validate-status="formAdd.price > 0 ? 'success' : 'error'"
        :help="formAdd.price <= 0 ? 'Price must be greater than 0' : ''"
      >
        <a-input
          v-model:value="formattedPrice"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          style="width: 100%"
          placeholder="Enter price (e.g., 1,000,000)"
          @input="handlePriceInput"
          @keypress="handleKeyPress"
          @paste="handlePaste"
        />
      </a-form-item>
      <a-form-item label="Content">
        <TextEditor
          v-model="formAdd.content"
          placeholder="Enter package content description"
          height="120px"
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
        :disabled="!formAdd.type || formAdd.price <= 0"
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
