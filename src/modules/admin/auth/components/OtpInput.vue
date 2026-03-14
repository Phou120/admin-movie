<template>
  <div class="otp-input-container">
    <a-input
      v-for="(_, index) in digitCount"
      :key="index"
      :ref="(el: any) => setRef(index, el as HTMLInputElement | null)"
      v-model:value="digits[index]"
      :maxlength="1"
      size="large"
      class="otp-digit-input"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
      @paste="onPaste"
      :aria-label="`OTP digit ${index + 1}`"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface Props {
  modelValue?: string;
  digitCount?: number;
  disabled?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'complete', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  digitCount: 4,
  disabled: false,
});

const emit = defineEmits<Emits>();

const digits = ref<string[]>([]);
const inputRefs = ref<(HTMLInputElement | null)[]>([]);

/**
 * Set reference for each input element
 */
const setRef = (index: number, el: HTMLInputElement | null) => {
  if (el) {
    inputRefs.value[index] = el;
  }
};

/**
 * Handle input in each digit box
 */
const onInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  // Only allow numeric digits
  if (!/^\d*$/.test(value)) {
    target.value = '';
    digits.value[index] = '';
    return;
  }

  // Update digits array
  digits.value[index] = value.slice(-1); // Take only last character

  // Emit updated value
  emit('update:modelValue', digits.value.join(''));

  // Auto-focus next input
  if (value && index < props.digitCount - 1) {
    inputRefs.value[index + 1]?.focus();
  }

  // Check if complete
  const otpValue = digits.value.join('');
  if (otpValue.length === props.digitCount) {
    emit('complete', otpValue);
  }
};

/**
 * Handle keyboard navigation
 */
const onKeydown = (index: number, event: KeyboardEvent) => {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      // If current input is empty, go to previous
      inputRefs.value[index - 1]?.focus();
    }
  }

  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus();
  }
  if (event.key === 'ArrowRight' && index < props.digitCount - 1) {
    inputRefs.value[index + 1]?.focus();
  }
};

/**
 * Handle paste event for full OTP code
 */
const onPaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pastedData = event.clipboardData?.getData('text');

  if (!pastedData) return;

  // Extract only digits
  const digitsOnly = pastedData.replace(/\D/g, '');

  // Fill inputs
  for (let i = 0; i < Math.min(digitsOnly.length, props.digitCount); i++) {
    digits.value[i] = digitsOnly[i];
  }

  // Emit updated value
  emit('update:modelValue', digits.value.join(''));

  // Focus the next empty input or the last filled one
  const nextEmptyIndex = digits.value.findIndex(d => !d);
  const focusIndex = nextEmptyIndex === -1 ? props.digitCount - 1 : nextEmptyIndex;
  inputRefs.value[focusIndex]?.focus();

  // Check if complete
  if (digits.value.filter(d => d).length === props.digitCount) {
    emit('complete', digits.value.join(''));
  }
};

/**
 * Clear all inputs
 */
const clear = () => {
  digits.value = Array(props.digitCount).fill('');
  emit('update:modelValue', '');
  inputRefs.value[0]?.focus();
};

/**
 * Focus first input
 */
const focusFirst = () => {
  inputRefs.value[0]?.focus();
};

// Watch for external modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      const newDigits = newValue.split('').slice(0, props.digitCount);
      for (let i = 0; i < newDigits.length; i++) {
        digits.value[i] = newDigits[i];
      }
    } else {
      digits.value = Array(props.digitCount).fill('');
    }
  }
);

// Expose methods
defineExpose({
  clear,
  focusFirst,
});
</script>

<style scoped lang="scss">
.otp-input-container {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.otp-digit-input {
  width: 60px !important;
  height: 60px !important;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.otp-digit-input:focus {
  border-color: var(--auth-primary);
  box-shadow: 0 0 0 3px rgba(13, 51, 74, 0.1);
}

// Responsive adjustments
@media (max-width: 767px) {
  .otp-digit-input {
    width: 50px !important;
    height: 50px !important;
    font-size: 20px;
  }

  .otp-input-container {
    gap: 8px;
  }
}
</style>
