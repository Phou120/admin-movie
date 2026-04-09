<template>
  <WebsiteLayout>
    <!-- Loading state for banners -->
    <div v-if="loadingBanners" class="banner-loading">
      <a-spin size="large" />
    </div>

    <!-- Banner carousel - only show when banners are loaded -->
    <a-carousel v-else-if="banners.length > 0" autoplay class="banner-carousel">
      <div v-for="banner in banners" :key="banner.id" class="banner-slide">
        <img
          :src="banner.image_url || banner.image"
          :alt="banner.title"
          class="banner-image"
        />
        <div class="banner-content">
          <a-typography-title :level="1">
            {{ banner.title }}
          </a-typography-title>
          <a-typography-paragraph style="font-size: 18px; color: #eee">
            {{ banner.description }}
          </a-typography-paragraph>
          <a-button
            v-if="banner.link"
            type="primary"
            size="large"
            style="
              margin-top: 24px;
              background: #0d334aff;
              color: #fff;
              font-weight: bold;
            "
            @click="navigateTo(banner.link)"
          >
            {{ banner.button_text || "Learn More" }}
          </a-button>
        </div>
      </div>
    </a-carousel>

    <!-- Fallback message if no banners -->
    <div v-else class="no-banners">
      <a-empty
        :description="t('website.noBannersAvailable') || 'No banners available'"
      />
    </div>

    <a-typography-title
      :level="2"
      style="text-align: center; margin-bottom: 32px; margin-top: 40px"
    >
      {{ t("website.home.howItWorks") }}
    </a-typography-title>
    <div class="custom">
      <a-row :gutter="32" justify="center">
        <a-col
          v-for="(step, idx) in steps"
          :key="idx"
          :xs="20"
          :sm="10"
          :md="8"
          style="margin-bottom: 24px"
        >
          <a-card hoverable class="step-card">
            <div class="step-media-container">
              <img
                v-if="step.mediaType === 'image'"
                :src="step.mediaSource"
                :alt="step.title"
                class="step-media"
              />
              <video
                v-else-if="step.mediaType === 'video'"
                :src="step.mediaSource"
                controls
                autoplay
                loop
                muted
                class="step-media"
              />
            </div>
            <a-typography-title :level="4" style="margin-top: 16px">
              {{ step.title }}
            </a-typography-title>
            <a-typography-paragraph>
              {{ step.description }}
            </a-typography-paragraph>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </WebsiteLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { useBanner } from "../../admin/banner/composible";
import WebsiteLayout from "../components/WebsiteLayout.vue";

// Import video assets
import step1Video from "../../../assets/videos/1765385133200-290324360.mp4";
import step2Video from "../../../assets/videos/1765711898724-492505555.mp4";
import step3Video from "../../../assets/videos/videoplayback (1).mp4";
import step4Video from "../../../assets/videos/videoplayback (2).mp4";
import step5Video from "../../../assets/videos/videoplayback (3).mp4";
import step6Video from "../../../assets/videos/videoplayback.mp4";

// Composables
const { fetchAll } = useBanner();
const { t } = useI18n();

// Banner state
const banners = ref<any[]>([]);
const loadingBanners = ref(false);

// Load banners from API
async function loadBanners() {
  loadingBanners.value = true;
  try {
    const res = await fetchAll(1, 10); // Get first 10 banners
    banners.value = res.data || [];

    if (banners.value.length === 0) {
      console.warn("No banners found");
    }
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    message.error("Failed to load banners");
    banners.value = [];
  } finally {
    loadingBanners.value = false;
  }
}

// Navigate to banner link
function navigateTo(link: string) {
  if (link) {
    window.location.href = link;
  }
}

// Steps data - using computed to get translated values
const steps = computed(() => [
  {
    title: t("website.home.step1.title"),
    mediaType: "video",
    mediaSource: step1Video,
    description: t("website.home.step1.description"),
  },
  {
    title: t("website.home.step2.title"),
    mediaType: "video",
    mediaSource: step2Video,
    description: t("website.home.step2.description"),
  },
  {
    title: t("website.home.step3.title"),
    mediaType: "video",
    mediaSource: step3Video,
    description: t("website.home.step3.description"),
  },
  {
    title: t("website.home.step4.title"),
    mediaType: "video",
    mediaSource: step4Video,
    description: t("website.home.step4.description"),
  },
  {
    title: t("website.home.step5.title"),
    mediaType: "video",
    mediaSource: step5Video,
    description: t("website.home.step5.description"),
  },
  {
    title: t("website.home.step6.title"),
    mediaType: "video",
    mediaSource: step6Video,
    description: t("website.home.step6.description"),
  },
]);

// Load data on component mount
onMounted(() => {
  loadBanners();
});
</script>

<style scoped>
/* Banner carousel styles */
.banner-carousel {
  position: relative;
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  height: 400px;
  overflow: hidden;
  margin-bottom: 80px;
  margin-top: 0;
}

.banner-slide {
  height: 400px;
  position: relative;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.banner-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 20px;
  color: #fff;
}

.banner-content .ant-typography-title,
.banner-content .ant-typography-paragraph {
  color: #fff !important;
}

.banner-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  background: #f0f0f0;
  margin-bottom: 40px;
}

.no-banners {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  background: #fafafa;
  margin-bottom: 40px;
}

.step-card {
  border-radius: 12px;
  box-shadow: 0 1px 5px 0 rgba(18, 35, 104, 0.33);
  transition: transform 0.1s;
  text-align: center;
}

.step-card:hover {
  transform: translateY(-1px) scale(1);
  box-shadow: 0 2px 6px rgba(18, 35, 104, 0.33);
}

.step-media-container {
  margin: 0 auto 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.step-media {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  object-fit: contain;
  padding: 8px;
}

.custom {
  margin: 0 auto;
  padding: 0 15px;
}
</style>
