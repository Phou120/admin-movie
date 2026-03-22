<template>
  <div class="view-video-page">
    <a-card :bordered="false" class="video-detail-card">
      <!-- Header -->
      <template #title>
        <div class="card-title">
          <LeftOutlined @click="goBack" class="back-button" />
          <span>{{ t("modules.video.viewDetails") }}</span>
        </div>
      </template>

      <a-spin :spinning="loading">
        <div v-if="videoData" class="video-detail-content">
          <!-- Video Preview Section -->
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :md="12">
              <div class="detail-section">
                <h3>{{ t("modules.video.information") }}</h3>

                <!-- Image -->
                <div class="detail-item">
                  <label>{{ t("modules.video.columns.image") }}</label>
                  <div class="image-preview">
                    <a-image
                      v-if="videoData.image_url || videoData.image"
                      :src="videoData.image_url || videoData.image"
                      :alt="videoData.title"
                      style="max-width: 100%; border-radius: 8px"
                    />
                    <span v-else class="no-data">{{
                      t("common.noImage")
                    }}</span>
                  </div>
                </div>

                <!-- Title -->
                <div class="detail-item">
                  <label>{{ t("modules.video.columns.title") }}</label>
                  <p>{{ videoData.title }}</p>
                </div>

                <!-- Content -->
                <div class="detail-item">
                  <label>{{ t("modules.video.columns.content") }}</label>
                  <div
                    class="content-text"
                    v-html="videoData.content || '-'"
                  ></div>
                </div>

                <!-- Customer -->
                <div class="detail-item">
                  <label>{{ t("modules.video.columns.customer") }}</label>
                  <p>
                    {{
                      videoData.customer
                        ? `${videoData.customer.name} ${videoData.customer.surname || ""}`
                        : "-"
                    }}
                  </p>
                </div>

                <!-- Categories -->
                <div class="detail-item">
                  <label>{{ t("modules.video.columns.categories") }}</label>
                  <div class="tag-list">
                    <template
                      v-if="
                        videoData.movie_categories &&
                        videoData.movie_categories.length > 0
                      "
                    >
                      <a-tag
                        v-for="category in videoData.movie_categories"
                        :key="category.id"
                        color="blue"
                      >
                        {{ category.name }}
                      </a-tag>
                    </template>
                    <span v-else class="no-data">-</span>
                  </div>
                </div>

                <!-- Status -->
                <div class="detail-item">
                  <label>{{ t("modules.video.columns.status") }}</label>
                  <a-tag
                    :color="videoData.status === 'active' ? 'green' : 'red'"
                  >
                    {{
                      videoData.status === "active"
                        ? t("modules.video.statusActive")
                        : t("modules.video.statusInactive")
                    }}
                  </a-tag>
                </div>

                <!-- Dates -->
                <div class="detail-item">
                  <label>{{ t("modules.video.columns.createdAt") }}</label>
                  <p>{{ formatDate(videoData.created_at) }}</p>
                </div>

                <div class="detail-item">
                  <label>{{ t("modules.video.columns.updatedAt") }}</label>
                  <p>{{ formatDate(videoData.updated_at) }}</p>
                </div>
              </div>
            </a-col>

            <a-col :xs="24" :md="12">
              <div class="detail-section">
                <h3>{{ t("modules.video.media") }}</h3>

                <!-- Video -->
                <div class="detail-item">
                  <label>{{ t("modules.video.columns.video") }}</label>
                  <div class="media-preview">
                    <a-button
                      v-if="videoData.video_url"
                      type="primary"
                      @click="playVideo(videoData.video_url, videoData.title)"
                      block
                    >
                      <PlayCircleOutlined />
                      {{ t("modules.video.actions.play") }}
                    </a-button>
                    <span v-else class="no-data">-</span>
                  </div>
                </div>

                <!-- Trailer -->
                <div class="detail-item">
                  <label>{{ t("modules.video.columns.trailer") }}</label>
                  <div class="media-preview">
                    <a-button
                      v-if="videoData.trailer_url"
                      type="default"
                      @click="
                        playVideo(
                          videoData.trailer_url,
                          `${videoData.title} - Trailer`,
                        )
                      "
                      block
                    >
                      <PlayCircleOutlined />
                      {{ t("modules.video.actions.playTrailer") }}
                    </a-button>
                    <span v-else class="no-data">-</span>
                  </div>
                </div>

                <!-- Statistics -->
                <h3 style="margin-top: 24px">
                  {{ t("modules.video.statistics") }}
                </h3>

                <div class="stats-grid">
                  <a-card class="stat-card">
                    <a-statistic
                      :title="t('modules.video.columns.totalViews')"
                      :value="videoData.total_views || 0"
                      :value-style="{ color: '#3f8600' }"
                    >
                      <template #prefix>
                        <EyeOutlined />
                      </template>
                    </a-statistic>
                  </a-card>

                  <a-card class="stat-card">
                    <a-statistic
                      :title="t('modules.video.columns.totalLikes')"
                      :value="videoData.total_likes || 0"
                      :value-style="{ color: '#cf1322' }"
                    >
                      <template #prefix>
                        <HeartOutlined />
                      </template>
                    </a-statistic>
                  </a-card>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

        <a-empty
          v-else-if="!loading"
          :description="t('modules.video.noData')"
        />
      </a-spin>
    </a-card>

    <!-- Video Player Modal -->
    <a-modal
      v-model:open="isVideoModalVisible"
      :title="currentVideoTitle"
      :footer="null"
      width="800px"
      @cancel="closeVideoModal"
    >
      <video
        v-if="currentVideoUrl"
        :src="currentVideoUrl"
        controls
        style="width: 100%"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { VideoComposible } from "../composible/index";
import { useI18n } from "vue-i18n";
import {
  LeftOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  HeartOutlined,
} from "@ant-design/icons-vue";
import formatDate from "../../../../common/utils/format-date.util";
// @ts-expect-error - TextEditor imported for future use
import TextEditor from "../../../../components/TextEditor.vue";

const route = useRoute();
const router = useRouter();
const { getVideoById } = VideoComposible();
const { t } = useI18n();

const loading = ref(false);
const videoData = ref<any>(null);
const isVideoModalVisible = ref(false);
const currentVideoUrl = ref("");
const currentVideoTitle = ref("");

async function loadVideoDetail() {
  const id = route.params.id as string;
  if (!id) return;

  loading.value = true;
  try {
    const response = await getVideoById(parseInt(id));
    videoData.value = response;
  } catch (error) {
    console.error("Error loading video detail:", error);
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.back();
}

function playVideo(url: string, title: string) {
  currentVideoUrl.value = url;
  currentVideoTitle.value = title;
  isVideoModalVisible.value = true;
}

function closeVideoModal() {
  isVideoModalVisible.value = false;
  currentVideoUrl.value = "";
  currentVideoTitle.value = "";
}

onMounted(() => {
  loadVideoDetail();
});
</script>

<style lang="scss" scoped>
.view-video-page {
  padding: 24px;
}

.video-detail-card {
  .card-title {
    display: flex;
    align-items: center;
    gap: 12px;

    .back-button {
      cursor: pointer;
      font-size: 18px;
      color: #1890ff;
      transition: color 0.2s;

      &:hover {
        color: #40a9ff;
      }
    }
  }
}

.video-detail-content {
  .detail-section {
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #262626;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #f0f0f0;
    }

    .detail-item {
      margin-bottom: 20px;

      label {
        display: block;
        font-weight: 500;
        color: #595959;
        margin-bottom: 8px;
        font-size: 14px;
      }

      p {
        margin: 0;
        color: #262626;
        font-size: 14px;
        line-height: 1.6;
      }

      .content-text {
        word-break: break-word;
        line-height: 1.6;

        // Render HTML content properly
        :deep(p) {
          margin-bottom: 8px;
        }

        :deep(ul),
        :deep(ol) {
          padding-left: 20px;
          margin-bottom: 8px;
        }

        :deep(img) {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 8px 0;
        }

        :deep(h1),
        :deep(h2),
        :deep(h3) {
          margin-top: 12px;
          margin-bottom: 8px;
          font-weight: 600;
        }

        :deep(a) {
          color: #1890ff;
          text-decoration: underline;
        }

        :deep(blockquote) {
          border-left: 3px solid #1890ff;
          padding-left: 12px;
          margin: 8px 0;
          color: #666;
        }
      }

      .image-preview {
        text-align: center;
        padding: 16px;
        background: #fafafa;
        border-radius: 8px;
        border: 1px solid #f0f0f0;
      }

      .no-data {
        color: #bfbfbf;
        font-style: italic;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 16px;

      .stat-card {
        text-align: center;
      }
    }
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.media-preview {
  .no-data {
    color: #bfbfbf;
    font-style: italic;
  }
}

// Mobile Responsive
@media (max-width: 768px) {
  .view-video-page {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
