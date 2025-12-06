<template>
  <a-layout>
    <AppHeader />

    <a-layout-content style="padding: 0 50px; min-height: 80vh">
      <!-- Loading state for banners -->
      <div v-if="loadingBanners" class="banner-loading">
        <a-spin size="large" />
      </div>

      <!-- Banner carousel - only show when banners are loaded -->
      <a-carousel
        v-else-if="banners.length > 0"
        autoplay
        class="banner-carousel"
      >
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
        <a-empty description="No banners available" />
      </div>

      <a-typography-title
        :level="2"
        style="text-align: center; margin-bottom: 32px; margin-top: 40px"
      >
        How It Works
      </a-typography-title>
      <a-row :gutter="32" justify="center">
        <a-col
          v-for="(step, idx) in steps"
          :key="idx"
          :xs="24"
          :sm="12"
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
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      SAVA MOVIE &copy; {{ new Date().getFullYear() }} | All rights reserved.
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { useBanner } from "../../admin/banner/composible";
import AppHeader from "./components/AppHeader.vue";

// Composables
const { fetchAll } = useBanner();

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

// Steps data
const steps = [
  {
    title: "Fill Application",
    mediaType: "video",
    mediaSource:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description: "Complete your application form online in just a few clicks!",
  },
  {
    title: "Review & Submit",
    mediaType: "video",
    mediaSource:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Check your details and submit your application securely.",
  },
  {
    title: "Track Status",
    mediaType: "video",
    mediaSource:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description:
      "Get real-time updates and notifications on your application status.",
  },
];

// Load data on component mount
onMounted(() => {
  loadBanners();
});
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: 0;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
}

.logo img {
  height: 48px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.14);
}

.brand-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #0d334aff;
}

.main-menu {
  display: flex;
  flex: 1;
  justify-content: center;
  border-bottom: none;
}

.main-menu :deep(.ant-menu-item),
.main-menu :deep(.ant-menu-item a) {
  text-decoration: none !important;
}

.main-menu :deep(.ant-menu-item::after) {
  display: none !important;
}

.main-menu :deep(.ant-menu-item:hover),
.main-menu :deep(.ant-menu-item-selected) {
  border-bottom: none !important;
}

.main-menu :deep(.ant-menu-item-selected) {
  color: #0d334aff;
  font-weight: 500;
}

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
}

@media (max-width: 576px) {
  .header {
    height: auto;
    padding: 5px 15px;
    flex-wrap: wrap;
  }

  .logo {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .logo img {
    height: 36px;
  }

  .brand-title {
    font-size: 0.9em;
  }

  .main-menu {
    width: 100%;
    justify-content: center;
    margin-top: 8px;
  }

  .main-menu :deep(.ant-menu-item) {
    font-size: 14px;
    padding: 0 12px;
  }
}
</style>
