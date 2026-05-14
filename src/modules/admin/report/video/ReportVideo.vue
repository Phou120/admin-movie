<template>
  <div class="report-page">
    <a-card :title="t('modules.reportVideo.title')" :bordered="false">
      <!-- Summary Cards -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportVideo.metrics.totalViews')"
              :value="summary.total_views"
              :value-style="{ color: '#3f8600' }"
            >
              <template #prefix>
                <EyeOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportVideo.metrics.totalLikes')"
              :value="summary.total_likes"
              :value-style="{ color: '#cf1322' }"
            >
              <template #prefix>
                <HeartOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportVideo.metrics.activeVideos')"
              :value="summary.active_videos"
              :value-style="{ color: '#1890ff' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :loading="summaryLoading">
            <a-statistic
              :title="t('modules.reportVideo.metrics.totalVideos')"
              :value="summary.total_videos"
            />
          </a-card>
        </a-col>
      </a-row>

      <!-- Filters -->
      <a-card style="margin-bottom: 16px">
        <a-row :gutter="[12, 12]">
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-input
              v-model:value="searchText"
              :placeholder="t('modules.reportVideo.searchPlaceholder')"
              allow-clear
              @pressEnter="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-select
              v-model:value="selectedCategoryId"
              :placeholder="t('modules.reportVideo.selectCategory')"
              allow-clear
              show-search
              :filter-option="filterCategoryOption"
              style="width: 100%"
              :loading="categoriesLoading"
            >
              <a-select-option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-select
              v-model:value="selectedCustomerId"
              :placeholder="t('modules.reportVideo.selectCustomer')"
              allow-clear
              show-search
              :filter-option="filterCustomerOption"
              style="width: 100%"
              :loading="customersLoading"
            >
              <a-select-option
                v-for="customer in customers"
                :key="customer.id"
                :value="customer.id"
              >
                {{ customer.name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-select
              v-model:value="selectedStatus"
              :placeholder="t('modules.reportVideo.selectStatus')"
              allow-clear
              show-search
              :filter-option="filterStatusOption"
              style="width: 100%"
            >
              <a-select-option value="active">
                {{ t("modules.reportVideo.statusActive") }}
              </a-select-option>
              <a-select-option value="inactive">
                {{ t("modules.reportVideo.statusInactive") }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-range-picker
              v-model:value="dateRange"
              :placeholder="[t('common.startDate'), t('common.endDate')]"
              style="width: 100%"
              @change="handleDateRangeChange"
            />
          </a-col>
          <a-col :xs="24" :sm="12" :md="16" :lg="18">
            <a-space :size="8" wrap>
              <a-button type="primary" @click="handleSearch">
                <SearchOutlined />
                {{ t("common.search") }}
              </a-button>
              <a-button @click="handleReset">
                <ClearOutlined />
                {{ t("common.reset") }}
              </a-button>
              <a-button
                type="primary"
                danger
                @click="handleExport"
                :loading="exporting"
              >
                <DownloadOutlined />
                {{ t("common.export") }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-card>

      <!-- Table -->
      <a-table
        :columns="columns"
        :data-source="data.videos"
        :loading="loading"
        :pagination="data.pagination"
        :row-key="getRecordKey"
        @change="handleTableChange"
        :scroll="{ x: 1600 }"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            {{ getRowNumber(index) }}
          </template>
          <template v-else-if="column.key === 'image'">
            <div class="media-preview">
              <a-image
                v-if="record.image_url || record.image"
                :src="record.image_url || record.image"
                :width="80"
                :height="60"
                style="object-fit: cover; border-radius: 4px"
                :alt="record.title"
                :preview="{
                  mask: t('common.viewImage'),
                  maskClosable: true,
                }"
              />
              <span v-else class="no-preview">{{ t("common.noImage") }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'title'">
            <div class="video-title">
              <span class="title-text">{{ record.title }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'customer_name'">
            <div class="customer-display">
              <span v-if="record.customer && record.customer.name">
                {{ record.customer.name }} {{ record.customer.surname }}
              </span>
              <span v-else class="no-customer">{{
                t("common.noCustomer")
              }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'video_url'">
            <div class="media-preview">
              <a-button
                v-if="record.video_url"
                type="link"
                size="small"
                @click="playVideo(record.video_url, record.title)"
                class="play-button"
              >
                <PlayCircleOutlined /> {{ t("modules.reportVideo.play") }}
              </a-button>
              <span v-else class="no-preview">-</span>
            </div>
          </template>
          <template v-else-if="column.key === 'trailer_url'">
            <div class="media-preview">
              <a-button
                v-if="record.trailer_url"
                type="link"
                size="small"
                @click="
                  playVideo(record.trailer_url, `${record.title} - Trailer`)
                "
                class="play-button"
              >
                <PlayCircleOutlined /> {{ t("modules.reportVideo.play") }}
              </a-button>
              <span v-else class="no-preview">-</span>
            </div>
          </template>
          <template v-else-if="column.key === 'total_views'">
            <div class="stats-display">
              <a-tag color="blue" class="stat-tag">
                <EyeOutlined class="stat-icon" />
                {{ record.total_views || 0 }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.key === 'total_likes'">
            <div class="stats-display">
              <a-tag color="red" class="stat-tag">
                <HeartOutlined class="stat-icon" />
                {{ record.total_likes || 0 }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.key === 'total_views_price'">
            <div class="stats-display">
              <a-tag color="green" class="stat-tag">
                {{ formatCurrency(record.view_price || 0) }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.key === 'category_id'">
            <div class="tag-list">
              <template
                v-if="
                  record.movie_categories && record.movie_categories.length > 0
                "
              >
                <a-tag
                  v-for="category in record.movie_categories"
                  :key="category.id"
                  color="blue"
                  class="category-tag"
                >
                  {{ category.name }}
                </a-tag>
              </template>
              <span v-else class="no-data">-</span>
            </div>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'green' : 'red'">
              {{
                record.status === "active"
                  ? t("modules.reportVideo.statusActive")
                  : t("modules.reportVideo.statusInactive")
              }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'created_at'">
            {{ formatDate(record.created_at) }}
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Video Player Modal -->
    <a-modal
      v-model:open="isVideoModalVisible"
      :title="currentVideoTitle"
      :footer="null"
      width="800px"
    >
      <video
        v-if="currentVideoUrl"
        :src="currentVideoUrl"
        controls
        controlslist="nodownload noremoteplayback"
        disablepictureinpicture
        playsinline
        @contextmenu.prevent
        style="width: 100%"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { ReportVideoComposible } from "./composible/index";
import { useI18n } from "vue-i18n";
import {
  SearchOutlined,
  ClearOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IReportVideo } from "./interface/report-video.interface";
import formatDate from "../../../../common/utils/format-date.util";
import { formatCurrency } from "../../../../common/utils/format-number.util";

const {
  fetchReportData,
  fetchSummary,
  getCategories,
  getCustomers,
  exportToExcel,
} = ReportVideoComposible();
const { t } = useI18n();

const columns = computed(() => [
  {
    title: t("modules.reportVideo.columns.no"),
    key: "no",
    align: "center" as const,
    width: 70,
  },
  {
    title: t("modules.reportVideo.columns.image"),
    key: "image",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportVideo.columns.title"),
    dataIndex: "title",
    key: "title",
    align: "left" as const,
    width: 200,
    ellipsis: true,
  },
  {
    title: t("modules.reportVideo.columns.customer"),
    key: "customer_name",
    align: "center" as const,
    width: 150,
  },
  {
    title: t("modules.reportVideo.columns.categories"),
    key: "category_id",
    align: "center" as const,
    width: 150,
  },
  {
    title: t("modules.reportVideo.columns.video"),
    key: "video_url",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportVideo.columns.trailer"),
    key: "trailer_url",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportVideo.columns.totalViews"),
    key: "total_views",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportVideo.columns.totalLikes"),
    key: "total_likes",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportVideo.columns.totalViewsPrice"),
    key: "total_views_price",
    align: "center" as const,
    width: 120,
  },
  {
    title: t("modules.reportVideo.columns.status"),
    key: "status",
    align: "center" as const,
    width: 100,
  },
  {
    title: t("modules.reportVideo.columns.createdAt"),
    key: "created_at",
    align: "center" as const,
    width: 180,
  },
]);

const data = reactive<{
  videos: IReportVideo[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
  };
}>({
  videos: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

const loading = ref(false);
const exporting = ref(false);
const categoriesLoading = ref(false);
const customersLoading = ref(false);
const summaryLoading = ref(false);

// Summary state
const summary = reactive({
  total_views: 0,
  total_likes: 0,
  active_videos: 0,
  total_videos: 0,
});

// Search and filter state
const searchText = ref("");
const selectedCategoryId = ref<number | undefined>(undefined);
const selectedCustomerId = ref<number | undefined>(undefined);
const selectedStatus = ref<string | undefined>(undefined);
const dateRange = ref<any[]>([]);

// Filter options
const categories = ref<any[]>([]);
const customers = ref<any[]>([]);

// Video player modal state
const isVideoModalVisible = ref(false);
const currentVideoUrl = ref("");
const currentVideoTitle = ref("");

function getRecordKey(record: IReportVideo): number {
  return record.id ?? 0;
}

function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

// Filter function for category select
function filterCategoryOption(input: string, option: any) {
  const category = categories.value.find((c) => c.id === option.value);
  return category?.name?.toLowerCase().includes(input.toLowerCase()) ?? false;
}

// Filter function for customer select
function filterCustomerOption(input: string, option: any) {
  const customer = customers.value.find((c) => c.id === option.value);
  const fullName = `${customer?.name || ''} ${customer?.surname || ''}`.toLowerCase();
  return fullName.includes(input.toLowerCase());
}

// Filter function for status select
function filterStatusOption(input: string, option: any) {
  const statusText = option.children?.[0]?.children || '';
  return statusText.toLowerCase().includes(input.toLowerCase());
}

async function loadReportData(
  page = data.pagination.current,
  limit = data.pagination.pageSize,
) {
  loading.value = true;
  try {
    const startDate = dateRange.value?.[0]
      ? dateRange.value[0].format("YYYY-MM-DD")
      : "";
    const endDate = dateRange.value?.[1]
      ? dateRange.value[1].format("YYYY-MM-DD")
      : "";

    const response = await fetchReportData(
      page,
      limit,
      searchText.value,
      selectedCategoryId.value?.toString() ?? "",
      selectedCustomerId.value?.toString() ?? "",
      selectedStatus.value ?? "",
      startDate,
      endDate,
    );

    // Set videos data
    data.videos = response.data || [];

    // Safely handle pagination with default values
    const paginate = response.pagination || {};

    data.pagination = {
      current: paginate.currentPage ?? page ?? 1,
      pageSize: paginate.limit ?? limit ?? 10,
      total: paginate.total ?? 0,
      showSizeChanger: true,
    };
  } catch (error) {
    console.error("Error loading report data:", error);

    // Reset to safe defaults on error
    data.videos = [];
    data.pagination = {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
    };
  } finally {
    loading.value = false;
  }
}

async function loadSummary() {
  summaryLoading.value = true;
  try {
    const response = await fetchSummary();
    Object.assign(summary, response);
  } catch (error) {
    console.error("Error loading summary:", error);
  } finally {
    summaryLoading.value = false;
  }
}

async function loadFilters() {
  categoriesLoading.value = true;
  customersLoading.value = true;
  try {
    const [categoriesData, customersData] = await Promise.all([
      getCategories(),
      getCustomers(),
    ]);
    categories.value = categoriesData;
    customers.value = customersData;
  } catch (error) {
    console.error("Error loading filters:", error);
  } finally {
    categoriesLoading.value = false;
    customersLoading.value = false;
  }
}

function handleSearch() {
  data.pagination.current = 1;
  loadReportData(1, data.pagination.pageSize);
}

function handleReset() {
  searchText.value = "";
  selectedCategoryId.value = undefined;
  selectedCustomerId.value = undefined;
  selectedStatus.value = undefined;
  dateRange.value = [];
  data.pagination.current = 1;
  loadReportData(1, data.pagination.pageSize);
}

function handleTableChange(pagination: TablePaginationConfig) {
  data.pagination.current = pagination.current || 1;
  data.pagination.pageSize = pagination.pageSize || 10;
  loadReportData(data.pagination.current, data.pagination.pageSize);
}

function handleDateRangeChange() {
  // Auto-refresh when date range changes
  data.pagination.current = 1;
  loadReportData(1, data.pagination.pageSize);
}

function playVideo(url: string, title: string) {
  currentVideoUrl.value = url;
  currentVideoTitle.value = title;
  isVideoModalVisible.value = true;
}

async function handleExport() {
  exporting.value = true;
  try {
    const startDate = dateRange.value?.[0]
      ? dateRange.value[0].format("YYYY-MM-DD")
      : undefined;
    const endDate = dateRange.value?.[1]
      ? dateRange.value[1].format("YYYY-MM-DD")
      : undefined;

    const response = await exportToExcel({
      category_id: selectedCategoryId.value,
      customer_id: selectedCustomerId.value,
      status: selectedStatus.value,
      start_date: startDate,
      end_date: endDate,
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `video-report-${new Date().getTime()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting data:", error);
  } finally {
    exporting.value = false;
  }
}

onMounted(() => {
  loadReportData();
  loadFilters();
  loadSummary();
});
</script>

<style lang="scss" scoped>
.report-page {
  padding: 16px;
}

.media-preview {
  display: flex;
  align-items: center;
  justify-content: center;

  .no-preview {
    color: #999;
    font-size: 12px;
  }

  .play-button {
    font-size: 12px;
  }
}

.customer-display {
  .no-customer {
    color: #999;
    font-style: italic;
    font-size: 13px;
  }
}

.video-title {
  .title-text {
    font-weight: 500;
    color: #333;
  }
}

.stats-display {
  .stat-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 13px;

    .stat-icon {
      font-size: 12px;
    }
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  .category-tag {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .no-data {
    color: #999;
    font-size: 13px;
  }
}
</style>
