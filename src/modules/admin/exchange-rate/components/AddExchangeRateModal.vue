<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { CurrencyComposible } from "../../currency/composible";

const { fetchAll } = CurrencyComposible();

interface Props {
  visible: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "submit", form: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Fetch currencies from API
const currencies = ref<any[]>([]);
const loading = ref(false);

const operations = ref([
  { value: "*", label: "Multiply (×)" },
  { value: "/", label: "Divide (÷)" },
]);

// Fetch currencies from API
const fetchCurrencies = async () => {
  try {
    loading.value = true;

    const response = await fetchAll(1, 100);
    console.log("Currencies API response:", response.data);

    if (Array.isArray(response.data)) {
      currencies.value = response.data.map((curr: any) => ({
        value: curr.id,
        label: `${curr.name} (${curr.short_name})`,
      }));
      console.log("Formatted currencies:", currencies.value);
    } else {
      console.error("Invalid currency data format:", response.data);
    }
  } catch (error) {
    console.error("Failed to load currencies:", error);
  } finally {
    loading.value = false;
  }
};

const form = ref({
  from_currency_id: undefined as number | undefined,
  to_currency_id: undefined as number | undefined,
  operate: "*",
});

// Reset form when modal opens and fetch currencies
watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      form.value = {
        from_currency_id: undefined,
        to_currency_id: undefined,
        operate: "*",
      };
      // Fetch currencies when modal opens
      await fetchCurrencies();
    }
  }
);

// Also fetch currencies on component mount for initial load
onMounted(() => {
  fetchCurrencies();
});

const handleSubmit = () => {
  if (
    form.value.from_currency_id &&
    form.value.to_currency_id &&
    form.value.from_currency_id !== form.value.to_currency_id
  ) {
    emit("submit", {
      from_currency_id: form.value.from_currency_id,
      to_currency_id: form.value.to_currency_id,
      operate: form.value.operate,
    });
    emit("update:visible", false);
  }
};

const handleCancel = () => {
  emit("update:visible", false);
};

const isFormValid = computed(() => {
  return (
    form.value.from_currency_id &&
    form.value.to_currency_id &&
    form.value.from_currency_id !== form.value.to_currency_id
  );
});

// Get filtered currencies for To dropdown
const getToCurrencies = () => {
  return currencies.value.filter(
    (c) => c.value !== form.value.from_currency_id
  );
};
</script>

<template>
  <a-modal
    :open="visible"
    title="Add Exchange Rate"
    :footer="null"
    @cancel="handleCancel"
    width="600px"
  >
    <a-form layout="vertical">
      <a-form-item
        label="From Currency"
        :validate-status="form.from_currency_id ? 'success' : 'error'"
        :help="!form.from_currency_id ? 'Please select a currency' : ''"
      >
        <a-select
          v-model:value="form.from_currency_id"
          :options="currencies"
          placeholder="Select from currency"
          show-search
          size="large"
          :loading="loading"
          :disabled="loading"
        />
        <div
          v-if="loading"
          style="color: #1890ff; font-size: 12px; margin-top: 4px"
        >
          Loading currencies...
        </div>
        <div
          v-else-if="currencies.length === 0"
          style="color: #ff4d4f; font-size: 12px; margin-top: 4px"
        >
          No currencies available
        </div>
      </a-form-item>

      <a-form-item label="Operation">
        <a-select
          v-model:value="form.operate"
          :options="operations"
          placeholder="Select operation"
          size="large"
        />
      </a-form-item>

      <a-form-item
        label="To Currency"
        :validate-status="
          form.to_currency_id && form.from_currency_id !== form.to_currency_id
            ? 'success'
            : 'error'
        "
        :help="
          !form.to_currency_id
            ? 'Please select a currency'
            : form.from_currency_id === form.to_currency_id
            ? 'Cannot be same as from currency'
            : ''
        "
      >
        <a-select
          v-model:value="form.to_currency_id"
          :options="getToCurrencies()"
          placeholder="Select to currency"
          show-search
          size="large"
          :loading="loading"
          :disabled="loading"
        />
        <div
          v-if="loading"
          style="color: #1890ff; font-size: 12px; margin-top: 4px"
        >
          Loading currencies...
        </div>
        <div
          v-else-if="getToCurrencies().length === 0"
          style="color: #ff4d4f; font-size: 12px; margin-top: 4px"
        >
          No currencies available
        </div>
      </a-form-item>

      <div
        style="
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        "
      >
        <div style="display: flex; gap: 12px; justify-content: flex-end">
          <a-button @click="handleCancel" size="large"> Cancel </a-button>
          <a-button
            type="primary"
            @click="handleSubmit"
            :disabled="!isFormValid"
            size="large"
          >
            Confirm
          </a-button>
        </div>
      </div>
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped>
// Add any custom styles if needed
</style>
