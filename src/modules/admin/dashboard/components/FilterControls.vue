<script setup lang="ts">
import { ref, computed } from "vue";
import { CalendarOutlined, FilterOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits<{
  timeRangeChanged: [data: { range: string; category?: string; startDate?: Date; endDate?: Date }];
  categoryChanged: [data: { category: string; timeRange: string }];
  filtersCleared: [];
}>();

const timeRanges = [
  { value: "today", label: "dashboard.filters.timeRange.options.today" },
  { value: "week", label: "dashboard.filters.timeRange.options.week" },
  { value: "month", label: "dashboard.filters.timeRange.options.month" },
  { value: "year", label: "dashboard.filters.timeRange.options.year" },
  { value: "custom", label: "dashboard.filters.timeRange.options.custom" },
] as const;

const categories = [
  { value: "users", label: "dashboard.filters.category.options.users" },
  { value: "content", label: "dashboard.filters.category.options.content" },
  { value: "payments", label: "dashboard.filters.category.options.payments" },
  { value: "system", label: "dashboard.filters.category.options.system" },
] as const;

const selectedTimeRange = ref<"today" | "week" | "month" | "year" | "custom">("today");
const selectedCategory = ref<"all" | "users" | "content" | "payments" | "system">("all");
const showCustomDate = ref(false);
const customDateRange = ref<{ start: Date; end: Date } | null>(null);

const timeRangeLabel = computed(() => {
  return timeRanges.find((range) => range.value === selectedTimeRange.value)?.label || "";
});

const handleTimeRangeChange = (range: string) => {
  selectedTimeRange.value = range as any;
  showCustomDate.value = range === "custom";
  if (range !== "custom") {
    customDateRange.value = null;
  }
  emit("timeRangeChanged", { range, category: selectedCategory.value });
};

const handleCategoryChange = (category: string) => {
  selectedCategory.value = category as any;
  emit("categoryChanged", { category, timeRange: selectedTimeRange.value });
};

const handleCustomDateOk = () => {
  if (customDateRange.value) {
    emit("timeRangeChanged", {
      range: "custom",
      category: selectedCategory.value,
      startDate: customDateRange.value.start,
      endDate: customDateRange.value.end,
    });
  }
};

const handleClearFilters = () => {
  selectedTimeRange.value = "today";
  selectedCategory.value = "all";
  customDateRange.value = null;
  emit("filtersCleared");
};
</script>

<template>
  <a-card class="filter-controls">
    <template #title>
      <div class="filter-title">
        <CalendarOutlined />
        {{ t("dashboard.filters.title") }}
      </div>
    </template>

    <div class="filter-section">
      <!-- Time Range Filter -->
      <div class="filter-group">
        <h4 class="filter-label">{{ t("dashboard.filters.timeRange.title") }}</h4>
        <a-radio-group v-model:value="selectedTimeRange" @change="handleTimeRangeChange">
          <a-radio-button
            v-for="range in timeRanges"
            :key="range.value"
            :value="range.value"
          >
            {{ range.label }}
          </a-radio-button>
        </a-radio-group>

        <!-- Custom Date Range Picker -->
        <div v-if="showCustomDate" class="custom-date-picker">
          <a-range-picker
            v-model:value="customDateRange"
            :format="'YYYY-MM-DD'"
            @ok="handleCustomDateOk"
          >
            <template #separator>→</template>
          </a-range-picker>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="filter-group">
        <h4 class="filter-label">{{ t("dashboard.filters.category.title") }}</h4>
        <a-checkbox-group v-model:value="selectedCategory" @change="handleCategoryChange">
          <a-checkbox
            v-for="cat in categories"
            :key="cat.value"
            :value="cat.value"
          >
            {{ cat.label }}
          </a-checkbox>
        </a-checkbox-group>
      </div>

      <!-- Clear Filters Button -->
      <a-button type="link" @click="handleClearFilters" class="clear-filters">
        <template #icon>
          <FilterOutlined />
        </template>
        {{ t("common.clear") }}
      </a-button>
    </div>

    <!-- Selected Filters Display -->
    <div v-if="selectedTimeRange !== 'today' || selectedCategory !== 'all'" class="active-filters">
      <a-tag color="blue" closable @close="selectedTimeRange = 'today'" v-if="selectedTimeRange !== 'today'">
        {{ timeRangeLabel }}
      </a-tag>
      <template v-for="cat in categories" :key="cat.value">
        <a-tag
          v-if="selectedCategory === cat.value"
          color="green"
          closable
          @close="selectedCategory = 'all'"
        >
          {{ cat.label }}
        </a-tag>
      </template>
    </div>
  </a-card>
</template>

<style scoped lang="scss">
.filter-controls {
  margin-bottom: 24px;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.filter-section {
  margin-top: 16px;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.custom-date-picker {
  margin-top: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.active-filters {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-filters {
  margin-left: auto;
}
</style>
