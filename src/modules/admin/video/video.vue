<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { VideoComposible } from "./composible/index";
import { useI18n } from "vue-i18n";
import {
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  ClearOutlined,
  EyeOutlined,
  HeartOutlined,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IVideoForm, IVideoList } from "./interface/video.interface";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";

const router = useRouter();
const { fetchAll, deleteVideoById, getCategories, getCustomers, updateStatus } =
  VideoComposible();
const { t } = useI18n();

// User role check
const userRoles = computed(() => {
  const rolesString = localStorage.getItem("user_roles");
  if (!rolesString) return [];

  try {
    // Parse if it's a JSON string, otherwise handle as comma-separated
    if (rolesString.startsWith("[") || rolesString.startsWith("{")) {
      return JSON.parse(rolesString);
    }
    // Handle comma-separated string
    return rolesString.split(",").map((role) => role.trim());
  } catch (error) {
    console.error("Error parsing user_roles from localStorage:", error);
    return [];
  }
});

// Get current customer ID for customer role
const getCurrentCustomerId = computed(() => {
  // For customer role, use customer_id from localStorage
  const customerId = localStorage.getItem("customer_id");
  if (customerId) {
    return parseInt(customerId);
  }
  return null;
});

// Check if user can select customers (admin or super-admin)
const canSelectCustomer = computed(() => {
  const roles = userRoles.value;
  // Check if any role in the array is 'admin' or 'super-admin'
  return roles.includes("admin") || roles.includes("super-admin");
});

// Check if user can manage videos (create, update, delete) - only for creator role
const canManageVideos = computed(() => {
  const roles = userRoles.value;
  // Only creator role can manage videos
  return roles.includes("creator");
});

const columns = computed(() => [
  {
    title: t("modules.video.columns.no"),
    dataIndex: "id",
    key: "no",
    align: "center",
    width: 70,
  },
  {
    title: t("modules.video.columns.customer"),
    key: "customer",
    align: "center",
    width: 150,
  },
  {
    title: t("modules.video.columns.title"),
    dataIndex: "title",
    key: "title",
    align: "left",
    width: 250,
    ellipsis: true,
  },
  {
    title: t("modules.video.columns.content"),
    dataIndex: "content",
    key: "content",
    align: "left",
    width: 300,
    ellipsis: true,
  },
  {
    title: t("modules.video.columns.image"),
    key: "image",
    align: "center",
    width: 150,
  },
  {
    title: t("modules.video.columns.video"),
    key: "video_name",
    align: "center",
    width: 100,
  },
  {
    title: t("modules.video.columns.trailer"),
    key: "trailer",
    align: "center",
    width: 100,
  },
  {
    title: t("modules.video.columns.categories"),
    key: "category_id",
    align: "center",
    width: 150,
  },
  {
    title: t("modules.video.columns.totalViews"),
    key: "total_views",
    align: "center",
    width: 115,
  },
  {
    title: t("modules.video.columns.totalLikes"),
    key: "total_likes",
    align: "center",
    width: 115,
  },
  {
    title: t("modules.video.columns.viewPrice"),
    key: "view_price",
    align: "center",
    width: 130,
  },
  {
    title: t("modules.video.columns.status"),
    key: "status",
    align: "center",
    width: 100,
  },
  {
    title: t("modules.video.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    width: 190,
  },
  {
    title: t("modules.video.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    align: "center",
    width: 190,
  },
  {
    title: t("modules.video.columns.action"),
    key: "action",
    align: "center",
    width: 100,
    fixed: "right" as const,
  },
]);

const data = reactive<IVideoList>({
  videos: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

const loading = ref(false);

// Video player modal state
const isVideoModalVisible = ref(false);
const currentVideoUrl = ref("");
const currentVideoTitle = ref("");

// Track loading state for individual video status updates
const statusLoadingMap = ref<Map<number, boolean>>(new Map());

// Search and filter state
const searchText = ref("");
const selectedCategoryId = ref<number | undefined>(undefined);
const selectedCustomerId = ref<number | undefined>(undefined);

// Filter options
const categories = ref<any[]>([]);
const customers = ref<any[]>([]);

// Function to get record key
function getRecordKey(record: IVideoForm): number {
  return record.id ?? 0;
}

// Function to calculate row number
function getRowNumber(index: number): number {
  const current = data.pagination.current ?? 1;
  const pageSize = data.pagination.pageSize ?? 10;
  return (current - 1) * pageSize + index + 1;
}

// Function to format view price
function formatViewPrice(price: number | undefined): string {
  const value = price || 0;
  if (value > 0) {
    // Format with commas and .00 decimal places (without LAK suffix)
    const formattedNumber = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    return formattedNumber;
  } else {
    // Return just 0 if value is 0 or less
    return "0";
  }
}

// Function to load videos with pagination, search, and filters
async function loadVideos(
  page = data.pagination.current,
  limit = data.pagination.pageSize,
) {
  loading.value = true;
  try {
    const params = {
      page,
      limit,
      search: searchText.value,
      category_id: selectedCategoryId.value
        ? selectedCategoryId.value.toString()
        : "",
      customer_id: selectedCustomerId.value
        ? selectedCustomerId.value.toString()
        : "",
    };

    const response = await fetchAll(
      page,
      limit,
      params.search,
      params.category_id,
      params.customer_id,
    );

    console.log("=== VIDEO LIST RESPONSE ===");
    console.log("Full response:", response);
    console.log("response type:", typeof response);
    console.log("Is array?", Array.isArray(response));

    // Handle different possible response structures
    let videosArray: any[] = [];
    let paginate: any = {};

    if (Array.isArray(response)) {
      // API returns array directly
      videosArray = response;
      console.log("Response is array, length:", videosArray.length);
    } else if (response && response.data) {
      // API returns { data: [...], pagination: {...} }
      videosArray = response.data;
      paginate = response.pagination || {};
      console.log("Response has .data property, length:", videosArray.length);
    } else if (response && typeof response === "object") {
      // Try to find data in different properties
      if (response.videos) {
        videosArray = response.videos;
        paginate = response.pagination || {};
        console.log(
          "Found videos in .videos property, length:",
          videosArray.length,
        );
      } else if (response.items) {
        videosArray = response.items;
        paginate = response.pagination || {};
        console.log(
          "Found items in .items property, length:",
          videosArray.length,
        );
      }
    }

    data.videos = videosArray.map((video: any) => ({
      ...video,
      statusLoading: statusLoadingMap.value.get(video.id) || false,
    }));

    // Update pagination info based on response
    data.pagination = {
      current: paginate.currentPage || page,
      pageSize: paginate.limit || limit,
      total: paginate.total || videosArray.length,
      showSizeChanger: true,
    };
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

// Fetch filter options
const fetchCategories = async () => {
  try {
    const data = await getCategories();
    categories.value = data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

const fetchCustomers = async () => {
  // Only fetch customers if user can select them (admin/super-admin)
  if (!canSelectCustomer.value) {
    // For customer role, set their own customer ID as filter
    if (getCurrentCustomerId.value) {
      selectedCustomerId.value = getCurrentCustomerId.value;
    }
    return;
  }

  try {
    const data = await getCustomers();
    customers.value = data;
  } catch (error) {
    console.error("Failed to fetch customers:", error);
  }
};

// Handle search and filter changes
const handleSearch = () => {
  loadVideos(1); // Reset to first page when searching
};

const handleCategoryFilter = () => {
  loadVideos(1); // Reset to first page when filtering
};

const handleCustomerFilter = () => {
  loadVideos(1); // Reset to first page when filtering
};

const clearFilters = () => {
  searchText.value = "";
  selectedCategoryId.value = undefined;

  // For customer role, keep their customer ID selected
  if (!canSelectCustomer.value && getCurrentCustomerId.value) {
    selectedCustomerId.value = getCurrentCustomerId.value;
  } else {
    selectedCustomerId.value = undefined;
  }

  loadVideos(1);
};

// Load initial data
onMounted(() => {
  loadVideos();
  fetchCategories();
  fetchCustomers();
});

// Handle table pagination change
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  loadVideos(current, pageSize);
}

// Helper functions
const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const getImageUrl = (imagePath: string, imageUrl?: string) => {
  // Use the full URL if available, otherwise construct from image path
  if (imageUrl) {
    return imageUrl;
  }
  return imagePath
    ? `${
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      }/uploads/images/${imagePath}`
    : "";
};

// Function to strip HTML tags from content
const stripHtmlTags = (html: string): string => {
  if (!html) return "";

  // Create a temporary div to parse HTML
  const temp = document.createElement("div");
  temp.innerHTML = html;

  // Get the text content
  const text = temp.textContent || temp.innerText || "";

  // Clean up multiple whitespace and line breaks
  return text.replace(/\s+/g, " ").replace(/\n+/g, " ").trim();
};

// Open video in modal
const openVideoModal = (record: any, type: "video" | "trailer") => {
  const url = type === "video" ? record.video_url : record.trailer_url;
  const title =
    type === "video" ? `${record.title} - Video` : `${record.title} - Trailer`;

  if (url) {
    currentVideoUrl.value = url;
    currentVideoTitle.value = title;
    isVideoModalVisible.value = true;
  }
};

// Close video modal
const closeVideoModal = () => {
  isVideoModalVisible.value = false;
  currentVideoUrl.value = "";
  currentVideoTitle.value = "";
};

// Navigation handlers
function openAddPage() {
  router.push({ name: "create-video" });
}

function openEditPage(id: number) {
  router.push({ name: "edit-video", params: { id } });
}

function openViewPage(id: number) {
  router.push({ name: "view-video", params: { id } });
}

async function deleteVideo(id: number) {
  try {
    const response = await deleteVideoById(id);
    showSuccessNotification(response.message);
    await loadVideos();
  } catch (error) {
    showErrorNotification("Failed to delete video:", (error as Error).message);
  }
}

// Update Video Status
async function updateVideoStatus(id: number, status: string) {
  // Set loading state for this video
  statusLoadingMap.value.set(id, true);

  try {
    const response = await updateStatus(id, status);
    showSuccessNotification(response.message);
    await loadVideos();
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    showErrorNotification(message);
  } finally {
    // Clear loading state for this video
    statusLoadingMap.value.delete(id);
  }
}

// Get translated status label
const getStatusLabel = (status: string) => {
  const statusKey = status?.toLowerCase();
  return t(`status.${statusKey}`, status?.toUpperCase() || "");
};

// Check if video status is currently being updated
const isStatusLoading = (videoId: number) => {
  return statusLoadingMap.value.get(videoId) || false;
};

// Handle status change with switch
function handleStatusChange(id: number, checked: boolean) {
  const newStatus = checked ? "active" : "inactive";
  updateVideoStatus(id, newStatus);
}
</script>

<template>
  <div class="video-container">
    <!-- Header Section -->
    <div class="video-header">
      <div class="header-left">
        <h1>{{ t("modules.video.title") }}</h1>
      </div>
      <div class="header-right" v-if="canManageVideos">
        <a-button type="primary" class="add-btn" @click="openAddPage">
          {{ t("modules.video.addNew") }}
        </a-button>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="filter-section">
      <div class="filter-content">
        <div class="filter-left">
          <a-space :size="12" wrap>
            <a-input
              v-model:value="searchText"
              :placeholder="t('modules.video.searchPlaceholder')"
              @pressEnter="handleSearch"
              allowClear
              style="width: 300px"
            >
              <template #prefix>
                <search-outlined />
              </template>
            </a-input>

            <a-select
              v-model:value="selectedCategoryId"
              :placeholder="t('video.filterByCategory')"
              allowClear
              @change="handleCategoryFilter"
              :options="categories"
              :field-names="{ label: 'name', value: 'id' }"
              style="width: 200px"
            />

            <a-select
              v-if="canSelectCustomer"
              v-model:value="selectedCustomerId"
              :placeholder="t('video.filterByCustomer')"
              allowClear
              @change="handleCustomerFilter"
              :options="
                customers.map((customer) => ({
                  value: customer.id,
                  label: `${customer.name} ${customer.surname}`.trim(),
                }))
              "
              style="width: 200px"
            />
          </a-space>
        </div>

        <div class="filter-right">
          <a-space size="middle">
            <a-button class="btn-search" type="primary" @click="handleSearch">
              <search-outlined />
              {{ t("common.search") }}
            </a-button>
            <a-button class="clear-btn" @click="clearFilters">
              <clear-outlined />
              {{ t("common.clear") }}
            </a-button>
          </a-space>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container">
      <a-table
        :dataSource="data.videos"
        :columns="columns"
        :pagination="data.pagination"
        :loading="loading"
        :rowKey="getRecordKey"
        @change="handleTableChange"
        class="video-table"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            <span class="row-number">{{ getRowNumber(index) }}</span>
          </template>

          <template v-else-if="column.key === 'customer'">
            <div class="customer-display">
              <span v-if="record.customer">
                {{ record.customer.name }} {{ record.customer.surname }}
              </span>
              <span v-else class="no-customer">No customer</span>
            </div>
          </template>

          <template v-else-if="column.key === 'title'">
            <div class="video-title">
              <span class="title-text">{{ record.title }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'content'">
            <div class="content-display">
              <a-tooltip
                v-if="record.content"
                :title="stripHtmlTags(record.content)"
              >
                <span class="content-text">{{
                  truncateText(stripHtmlTags(record.content), 150)
                }}</span>
              </a-tooltip>
              <span v-else class="no-content">No content</span>
            </div>
          </template>

          <template v-else-if="column.key === 'image'">
            <div class="media-preview">
              <a-image
                v-if="record.image_url || record.image"
                :width="80"
                :height="60"
                :src="getImageUrl(record.image, record.image_url)"
                class="preview-image"
                :alt="record.title"
                :preview="{
                  mask: 'View Image',
                  maskClosable: true,
                }"
              />
              <span v-else class="no-preview">No Image</span>
            </div>
          </template>

          <template v-else-if="column.key === 'video_name'">
            <div class="media-preview">
              <a-button
                v-if="record.video_url || record.video_name"
                type="link"
                size="small"
                @click="openVideoModal(record, 'video')"
                class="play-button"
              >
                <PlayCircleOutlined /> Open
              </a-button>
              <span v-else class="no-preview">No Video</span>
            </div>
          </template>

          <template v-else-if="column.key === 'trailer'">
            <div class="media-preview">
              <a-button
                v-if="record.trailer_url || record.trailer"
                type="link"
                size="small"
                @click="openVideoModal(record, 'trailer')"
                class="play-button"
              >
                <PlayCircleOutlined /> Open
              </a-button>
              <span v-else class="no-preview">No Trailer</span>
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
              <span v-else class="no-data">No Categories</span>
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

          <template v-else-if="column.key === 'view_price'">
            <div class="stats-display">
              <a-tag color="green" class="stat-tag">
                {{ formatViewPrice(record.view_price) }} LAK
              </a-tag>
            </div>
          </template>

          <template v-else-if="column.key === 'status'">
            <div class="status-toggle-wrapper">
              <a-switch
                :checked="record.status === 'active'"
                :checked-children="getStatusLabel('active')"
                :un-checked-children="getStatusLabel('inactive')"
                @change="
                  (checked: boolean) => handleStatusChange(record.id, checked)
                "
                :loading="isStatusLoading(record.id)"
                :class="[
                  'status-toggle',
                  record.status === 'active'
                    ? 'status-active'
                    : 'status-inactive',
                ]"
              />
            </div>
          </template>

          <template v-else-if="column.key === 'created_at'">
            <span>{{ record.created_at }}</span>
          </template>
          <template v-else-if="column.key === 'updated_at'">
            <span>{{ record.updated_at }}</span>
          </template>

          <template v-else-if="column.key === 'action'">
            <div class="action-icons">
              <a-tooltip :title="t('actions.viewDetails')">
                <EyeOutlined
                  class="icon view"
                  @click="openViewPage(record.id)"
                />
              </a-tooltip>
              <a-tooltip v-if="canManageVideos" :title="t('actions.edit')">
                <EditOutlined
                  class="icon edit"
                  @click="openEditPage(record.id)"
                />
              </a-tooltip>
              <a-popconfirm
                v-if="canManageVideos"
                :title="t('message.deleteConfirm')"
                placement="topRight"
                @confirm="deleteVideo(record.id)"
              >
                <a-tooltip :title="t('actions.delete')">
                  <delete-outlined class="icon delete" />
                </a-tooltip>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Video Player Modal -->
    <a-modal
      :open="isVideoModalVisible"
      :title="currentVideoTitle"
      :footer="null"
      :width="900"
      @cancel="closeVideoModal"
      class="video-modal"
    >
      <div class="video-player-container">
        <video
          v-if="currentVideoUrl"
          :src="currentVideoUrl"
          controls
          autoplay
          class="video-player"
          @ended="closeVideoModal"
        >
          Your browser does not support the video tag.
        </video>
        <div v-else class="no-video">
          <p>No video URL available</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.video-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  .header-left {
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #262626;
    }

    .subtitle {
      margin: 4px 0 0 0;
      color: #8c8c8c;
      font-size: 14px;
    }
  }

  .add-btn {
    background-color: #0d334aff;
    border-color: #0d334aff;
    color: #ffffff;
    white-space: nowrap;

    &:hover {
      background-color: #0d334acc;
      border-color: #0d334acc;
      color: #ffffff;
    }
  }
}

.filter-section {
  margin-bottom: 16px;
  font-size: 24px;

  .filter-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .filter-left {
    flex: 1;
  }

  .filter-right {
    flex-shrink: 0;
  }

  .clear-btn {
    border-color: #ff4d4f;
    color: #ff4d4f;

    &:hover {
      border-color: #ff7875;
      color: #ff7875;
    }
  }

  .btn-search {
    background: #0d334aff;
    border-color: #0d334aff;
    color: #ffffff;

    &:hover {
      background: #0d334acc;
      border-color: #0d334acc;
      color: #ffffff;
    }
  }

  // Responsive layout
  @media (max-width: 768px) {
    .filter-content {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-left {
      width: 100%;
    }

    .filter-right {
      width: 100%;
      margin-top: 16px;

      .ant-space {
        width: 100%;
        justify-content: flex-end;
      }
    }
  }

  @media (max-width: 576px) {
    .filter-left {
      .ant-row {
        flex-direction: column;
      }

      .ant-col {
        width: 100% !important;
        margin-bottom: 12px;
      }
    }

    .filter-right {
      .ant-space {
        justify-content: stretch;

        .ant-btn {
          flex: 1;
        }
      }
    }
  }
}

.video-table {
  :deep(.ant-table-thead > tr > th) {
    background: #fafafa;
    font-weight: 600;
    color: #262626;
    border-bottom: 2px solid #f0f0f0;
  }

  :deep(.ant-table-tbody > tr > td) {
    padding: 16px;
  }

  :deep(.ant-table-tbody > tr:hover > td) {
    background: #f5f5f5;
  }
}

.row-number {
  font-weight: 600;
  color: #8c8c8c;
}

.video-title {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .title-text {
    font-weight: 500;
    color: #262626;
  }

  .content-preview {
    font-size: 12px;
    opacity: 0.7;
  }
}

.content-text {
  color: #595959;
  font-size: 13px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-display {
  max-width: 300px;

  .no-content {
    color: #bfbfbf;
    font-size: 12px;
    font-style: italic;
  }
}

.customer-display {
  font-weight: 500;
  color: #262626;
  font-size: 14px;
  line-height: 1.4;

  .no-customer {
    color: #bfbfbf;
    font-size: 12px;
    font-style: italic;
  }
}

.media-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;

  .preview-image {
    border-radius: 4px;
    object-fit: cover;
    border: 1px solid #f0f0f0;
  }

  .no-preview {
    color: #bfbfbf;
    font-size: 12px;
  }

  .play-button {
    color: #1890ff;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      color: #40a9ff;
      transform: scale(1.05);
    }
  }
}

.no-data {
  color: #bfbfbf;
  font-size: 12px;
}

.date-text {
  color: #8c8c8c;
  font-size: 13px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 120px;

  .category-tag,
  .tag-item {
    font-size: 11px;
    padding: 2px 6px;
    margin: 0;
    border-radius: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .category-tag {
    background-color: #e6f7ff;
    border-color: #91d5ff;
    color: #1890ff;
  }

  .tag-item {
    background-color: #f6ffed;
    border-color: #b7eb8f;
    color: #52c41a;
  }
}

.stats-display {
  display: flex;
  justify-content: center;
  align-items: center;

  .stat-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 4px;
    margin: 0;

    .stat-icon {
      font-size: 14px;
    }
  }
}

// Status Toggle Switch Styling
.status-toggle-wrapper {
  display: inline-block;

  .status-toggle {
    // When ACTIVE (checked state) - GREEN
    &.status-active {
      background-color: #52c41a !important;

      &:hover:not(.ant-switch-disabled) {
        background-color: #73d13d !important;
      }
    }

    // When INACTIVE (unchecked state) - RED
    &.status-inactive {
      background-color: #ff4d4f !important;

      &:hover:not(.ant-switch-disabled) {
        background-color: #ff7875 !important;
      }
    }

    // Override Ant Design default checked state
    &.ant-switch-checked {
      background-color: #52c41a !important;

      &:hover:not(.ant-switch-disabled) {
        background-color: #73d13d !important;
      }
    }
  }
}

@media (max-width: 768px) {
  .video-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

// Video Modal Styles - Following project pattern
.video-modal {
  .ant-modal-content {
    background: #1a1a1a;
    border-radius: 8px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: #1a1a1a;
    border-bottom: 1px solid #333;

    .ant-modal-title {
      color: #fff;
      font-weight: 500;
    }
  }

  .ant-modal-body {
    background: #1a1a1a;
    padding: 16px;
  }

  .ant-modal-close {
    color: #fff;
    top: 12px;
    right: 12px;

    &:hover {
      color: #f0f0f0;
    }
  }
}

.video-player-container {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.video-player {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.no-video {
  padding: 40px;
  text-align: center;
  color: #666;

  p {
    margin: 0;
    font-size: 16px;
  }
}

// Action Icons Styling
.action-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  .icon {
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 4px;
    border-radius: 4px;

    &.view {
      color: #1890ff;

      &:hover {
        color: #40a9ff;
        background-color: #e6f7ff;
      }
    }

    &.edit {
      color: #faad14;

      &:hover {
        color: #ffc53d;
        background-color: #fffbe6;
      }
    }

    &.delete {
      color: #ff4d4f;

      &:hover {
        color: #ff7875;
        background-color: #fff1f0;
      }
    }
  }
}

// Mobile Responsive
@media (max-width: 768px) {
  .video-modal {
    .ant-modal {
      margin: 0;
      max-width: 100vw;
    }

    .ant-modal-content {
      border-radius: 0;
      min-height: 100vh;
    }
  }

  .video-player {
    max-height: 60vh;
  }
}
</style>
