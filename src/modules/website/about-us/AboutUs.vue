<template>
  <WebsiteLayout>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay">
        <a-typography-title :level="1" class="hero-title">
          {{ t("website.aboutUs.hero.title") }}
        </a-typography-title>
        <a-typography-paragraph class="hero-subtitle">
          {{ t("website.aboutUs.hero.subtitle") }}
        </a-typography-paragraph>
      </div>
    </section>

    <!-- Our Story Section -->
    <section class="story-section">
      <div class="container">
        <a-row :gutter="[48, 48]" align="middle" class="story-row">
          <a-col :xs="24" :md="12">
            <div class="image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                alt="Our Team"
                class="story-image"
              />
            </div>
          </a-col>
          <a-col :xs="24" :md="12">
            <div class="story-content">
              <a-typography-title :level="2" class="section-title">
                {{ t("website.aboutUs.story.title") }}
              </a-typography-title>
              <a-typography-paragraph class="story-text">
                {{ t("website.aboutUs.story.paragraph1") }}
              </a-typography-paragraph>
              <a-typography-paragraph class="story-text">
                {{ t("website.aboutUs.story.paragraph2") }}
              </a-typography-paragraph>
            </div>
          </a-col>
        </a-row>
      </div>
    </section>

    <!-- Mission & Vision Section -->
    <section class="mission-vision-section">
      <div class="container">
        <a-row :gutter="[32, 32]">
          <a-col :xs="24" :md="12">
            <a-card class="value-card mission-card" hoverable>
              <template #cover>
                <div class="card-icon-wrapper mission-icon">
                  <RocketOutlined class="card-icon" />
                </div>
              </template>
              <a-card-meta>
                <template #title>
                  <span class="card-title">{{
                    t("website.aboutUs.mission.title")
                  }}</span>
                </template>
                <template #description>
                  <p class="card-description">
                    {{ t("website.aboutUs.mission.description") }}
                  </p>
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-card class="value-card vision-card" hoverable>
              <template #cover>
                <div class="card-icon-wrapper vision-icon">
                  <EyeOutlined class="card-icon" />
                </div>
              </template>
              <a-card-meta>
                <template #title>
                  <span class="card-title">{{
                    t("website.aboutUs.vision.title")
                  }}</span>
                </template>
                <template #description>
                  <p class="card-description">
                    {{ t("website.aboutUs.vision.description") }}
                  </p>
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </section>

    <!-- Core Values Section -->
    <section class="values-section">
      <div class="container">
        <a-typography-title :level="2" class="section-title centered">
          {{ t("website.aboutUs.coreValues.title") }}
        </a-typography-title>
        <a-row :gutter="[24, 24]" style="margin-top: 48px">
          <a-col
            v-for="value in coreValues"
            :key="value.key"
            :xs="24"
            :sm="12"
            :lg="6"
          >
            <div class="value-item">
              <div class="value-icon-circle">
                <component :is="value.icon" class="value-icon" />
              </div>
              <a-typography-title :level="4" class="value-title">
                {{ value.title }}
              </a-typography-title>
              <a-typography-paragraph class="value-description">
                {{ value.description }}
              </a-typography-paragraph>
            </div>
          </a-col>
        </a-row>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <a-typography-title :level="2" class="section-title centered">
          {{ t("website.aboutUs.team.title") }}
        </a-typography-title>
        <a-typography-paragraph class="section-subtitle centered">
          {{ t("website.aboutUs.team.subtitle") }}
        </a-typography-paragraph>

        <a-row
          :gutter="[32, 32]"
          justify="center"
          style="margin-top: 48px"
          class="team-row"
        >
          <a-col
            v-for="member in teamMembers"
            :key="member.name"
            :xs="24"
            :sm="12"
            :lg="8"
          >
            <a-card class="team-card" hoverable>
              <div class="team-avatar">
                <img :src="member.avatar" :alt="member.name" />
              </div>
              <a-typography-title :level="4" class="team-name">
                {{ member.name }}
              </a-typography-title>
              <a-typography-text class="team-position">
                {{ member.position }}
              </a-typography-text>
              <div class="team-social">
                <a-button type="link" size="small">
                  <LinkedinOutlined />
                </a-button>
                <a-button type="link" size="small">
                  <TwitterOutlined />
                </a-button>
                <a-button type="link" size="small">
                  <MailOutlined />
                </a-button>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section">
      <div class="container">
        <a-row :gutter="[32, 32]">
          <a-col
            v-for="(stat, index) in statistics"
            :key="`stat-${index}`"
            :xs="12"
            :sm="6"
          >
            <div class="stat-item">
              <component :is="stat.icon" class="stat-icon" />
              <a-typography-title :level="2" class="stat-number">
                {{ stat.number }}
              </a-typography-title>
              <a-typography-text class="stat-label">
                {{ stat.label }}
              </a-typography-text>
            </div>
          </a-col>
        </a-row>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <a-typography-title :level="2" class="cta-title">
          {{ t("website.aboutUs.cta.title") }}
        </a-typography-title>
        <a-typography-paragraph class="cta-subtitle">
          {{ t("website.aboutUs.cta.subtitle") }}
        </a-typography-paragraph>
        <a-space size="large" style="margin-top: 32px">
          <a-button
            type="primary"
            size="large"
            class="cta-button"
            @click="goToHome"
          >
            {{ t("website.aboutUs.cta.getStarted") }}
          </a-button>
          <a-button
            size="large"
            class="cta-button-secondary"
            @click="goToContact"
          >
            {{ t("website.aboutUs.cta.contactUs") }}
          </a-button>
        </a-space>
      </div>
    </section>
  </WebsiteLayout>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  RocketOutlined,
  EyeOutlined,
  HeartOutlined,
  TrophyOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
  GlobalOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  MailOutlined,
} from "@ant-design/icons-vue";
import WebsiteLayout from "../components/WebsiteLayout.vue";
import phoudImg from "../../../assets/images/phoud.jpeg";
import aecImg from "../../../assets/images/aec216e7-4448-4294-8544-1cbee65d71d1.jpeg";
import logoImg from "../../../assets/images/yee.jpeg";

const router = useRouter();
const { t } = useI18n();

const goToHome = () => {
  router.push({ name: "home" });
};

const goToContact = () => {
  router.push("/contact");
};

// Core values data - computed with translations
const coreValues = [
  {
    key: "passion",
    icon: HeartOutlined,
    title: t("website.aboutUs.coreValues.passion.title"),
    description: t("website.aboutUs.coreValues.passion.description"),
  },
  {
    key: "excellence",
    icon: TrophyOutlined,
    title: t("website.aboutUs.coreValues.excellence.title"),
    description: t("website.aboutUs.coreValues.excellence.description"),
  },
  {
    key: "collaboration",
    icon: TeamOutlined,
    title: t("website.aboutUs.coreValues.collaboration.title"),
    description: t("website.aboutUs.coreValues.collaboration.description"),
  },
  {
    key: "innovation",
    icon: ThunderboltOutlined,
    title: t("website.aboutUs.coreValues.innovation.title"),
    description: t("website.aboutUs.coreValues.innovation.description"),
  },
];

// Team members data
const teamMembers = [
  {
    name: "ເຮີປາວວ່າງ ຢົງເຢຍ",
    position: "CEO & Founder",
    avatar: phoudImg,
  },
  {
    name: "ໄຊຍະວົງ ບຸນປະເສີດ",
    position: "CTO",
    avatar: aecImg,
  },
  {
    name: "ເຢ້ ຢ່າງ",
    position: "Head of Design",
    avatar: logoImg,
  },
];

// Statistics data - computed with translations
const statistics = [
  {
    icon: UserOutlined,
    number: "50K+",
    label: t("website.aboutUs.stats.activeUsers"),
  },
  {
    icon: GlobalOutlined,
    number: "100+",
    label: t("website.aboutUs.stats.countries"),
  },
  {
    icon: SafetyOutlined,
    number: "99.9%",
    label: t("website.aboutUs.stats.uptime"),
  },
  {
    icon: CustomerServiceOutlined,
    number: "24/7",
    label: t("website.aboutUs.stats.support"),
  },
];
</script>

<style scoped>
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Layout and content backgrounds */
:deep(.ant-layout) {
  background: #fff !important;
}
:deep(.ant-layout-content) {
  background: #fff !important;
  padding: 0 !important;
}

/* Header styling */
:deep(.ant-layout-header) {
  padding: 0 50px;
  line-height: 64px;
  height: 64px;
  background: #fff !important;
}

/* Hero Section with animated background and overlay */
.hero-section {
  background:
    linear-gradient(135deg, #0d334aff 0%, #1a5380 100%),
    url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600")
      center/cover no-repeat;
  background-blend-mode: overlay;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 80px;
  padding: 0 20px;
  transition: background 0.5s ease;
  width: 100vw;
  transform: translateX(-50%);
  margin-left: 50%;
}

.hero-section:hover {
  background:
    linear-gradient(135deg, #0d334aff 0%, #1a5380 100%),
    url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600")
      center/cover no-repeat;
  background-blend-mode: overlay;
}

.hero-overlay {
  text-align: center;
  z-index: 2;
  padding: 20px;
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.hero-title {
  color: #fff !important;
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 16px !important;
  font-weight: 700;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  max-width: 700px;
  margin: 0 auto;
}

/* Container for content */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Section titles with emphasis and alignment */
.section-title {
  color: #0d334aff !important;
  font-weight: 600 !important;
  margin-bottom: 24px !important;
}
.section-title.centered {
  text-align: center;
}

/* Subtitle under sections */
.section-subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto 48px;
}

/* Our Story Image styling */
.story-section {
  background: #f9fafb;
  padding: 80px 0;
}
.image-wrapper {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.story-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

/* Mission & Vision Cards with animated hover */
.value-card {
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}
.value-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}
.card-icon-wrapper {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mission-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.vision-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
.card-icon {
  font-size: 64px;
  color: #fff;
}
.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0d334aff;
}
.card-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #666;
  margin-top: 12px;
}

/* Core Values with animated entry */
.values-section {
  background: #f9fafb;
}
.value-item {
  text-align: center;
  padding: 32px 20px;
  background: #fff;
  border-radius: 12px;
  /* transition: all 0.3s ease, box-shadow: 0 0 10px rgba(0,0,0,0.1); Added semicolon */
}
.value-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
.value-icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d334aff 0%, #1a5380 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  transition: transform 0.3s ease;
}
.value-icon-circle:hover {
  transform: rotate(15deg);
}
.value-icon {
  font-size: 36px;
  color: #fff;
}
.value-title {
  color: #0d334aff !important;
  margin-bottom: 12px !important;
  font-size: 1.25rem !important;
}
.value-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Team Section - Make it responsive with flexible columns */
.team-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
}
.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.team-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #f0f0f0;
}
.team-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.team-name {
  color: #0d334aff !important;
  margin-bottom: 8px !important;
  font-size: 1.1rem !important;
}
.team-position {
  color: #666;
  display: block;
  margin-bottom: 16px;
  font-size: 0.9rem;
}
.team-social {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}
:deep(.ant-btn-link) {
  color: #0d334aff;
  transition: color 0.3s ease;
}
:deep(.ant-btn-link:hover) {
  color: #1a5380;
}

/* Statistics section styles */
.stats-section {
  background: linear-gradient(135deg, #0d334aff 0%, #1a5380 100%);
  padding: 60px 0;
  color: #fff;
  width: 100vw;
  transform: translateX(-50%);
  margin-left: 50%;
}
.stat-item {
  text-align: center;
  padding: 20px;
}
.stat-icon {
  font-size: 48px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}
.stat-icon:hover {
  transform: scale(1.2);
}
.stat-number {
  color: #fff !important;
  font-weight: 700 !important;
  margin-bottom: 8px !important;
  font-size: clamp(2rem, 4vw, 3rem);
}
.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* CTA Section styles */
.cta-section {
  background: #f9fafb;
  padding: 80px 20px;
  text-align: center;
}
.cta-title {
  color: #0d334aff !important;
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 16px !important;
  transition: transform 0.3s ease;
}
.cta-title:hover {
  transform: scale(1.05);
}
.cta-subtitle {
  color: #666;
  font-size: 1.15rem;
  max-width: 600px;
  margin: 0 auto 48px;
}
.cta-button {
  background: #0d334aff;
  border-color: #0d334aff;
  height: 48px;
  padding: 0 40px;
  font-size: 1rem;
  font-weight: 500;
  transition:
    background 0.3s ease,
    transform 0.3s ease;
}
.cta-button:hover {
  background: #1a5380;
  transform: translateY(-2px);
}
.cta-button-secondary {
  height: 48px;
  padding: 0 40px;
  font-size: 1rem;
  font-weight: 500;
  border: 2px solid #0d334aff;
  color: #0d334aff;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}
.cta-button-secondary:hover {
  background: #0d334aff;
  color: #fff;
}

/* Responsive adjustments for all devices */

/* iPhone SE and very small phones (320px - 374px) */
@media (max-width: 374px) {
  .hero-section {
    height: 320px !important;
  }

  .hero-title {
    font-size: clamp(1.8rem, 8vw, 2.2rem) !important;
  }

  .hero-subtitle {
    font-size: clamp(0.9rem, 4vw, 1.1rem) !important;
  }

  .hero-overlay {
    padding: 16px !important;
  }

  .container {
    padding: 0 16px !important;
  }

  /* Story Section */
  .story-section {
    padding: 40px 0 !important;
  }

  .image-wrapper {
    margin-bottom: 24px;
  }

  /* Values Section */
  .values-section {
    padding: 40px 0 !important;
  }

  .section-title {
    font-size: 1.5rem !important;
  }

  .value-item {
    padding: 24px 12px !important;
    margin-bottom: 16px;
  }

  .value-icon-circle {
    width: 60px !important;
    height: 60px !important;
  }

  .value-icon {
    font-size: 28px !important;
  }

  .value-title {
    font-size: 1.1rem !important;
  }

  .value-description {
    font-size: 0.85rem !important;
  }

  /* Mission & Vision Cards */
  .card-icon-wrapper {
    height: 140px !important;
  }

  .card-icon {
    font-size: 48px !important;
  }

  .card-title {
    font-size: 1.25rem !important;
  }

  .card-description {
    font-size: 0.9rem !important;
  }

  /* Team Section */
  .team-section {
    padding: 40px 0 !important;
  }

  .team-avatar {
    width: 100px !important;
    height: 100px !important;
  }

  .team-name {
    font-size: 1rem !important;
  }

  .team-position {
    font-size: 0.85rem !important;
  }

  .team-social {
    gap: 4px !important;
  }

  /* Statistics Section */
  .stats-section {
    padding: 40px 0 !important;
  }

  .stat-item {
    padding: 16px 8px !important;
  }

  .stat-icon {
    font-size: 36px !important;
    margin-bottom: 12px;
  }

  .stat-number {
    font-size: clamp(1.5rem, 5vw, 2rem) !important;
  }

  .stat-label {
    font-size: 0.85rem !important;
  }

  /* CTA Section */
  .cta-section {
    padding: 48px 16px !important;
  }

  .cta-title {
    font-size: clamp(1.5rem, 5vw, 2rem) !important;
  }

  .cta-subtitle {
    font-size: 1rem !important;
    margin: 0 auto 32px !important;
  }

  .cta-button,
  .cta-button-secondary {
    width: 100% !important;
    margin: 0 0 12px 0 !important;
  }

  /* Footer */
  .footer-text {
    font-size: 0.8rem;
  }
}

/* Small iPhones (375px - 414px) - iPhone 12, 13, 14 */
@media (min-width: 375px) and (max-width: 414px) {
  .hero-section {
    height: 360px !important;
  }

  .hero-title {
    font-size: clamp(2rem, 6vw, 2.8rem) !important;
  }

  .hero-subtitle {
    font-size: clamp(1rem, 3vw, 1.25rem) !important;
  }

  .container {
    padding: 0 20px !important;
  }

  /* Story Section */
  .story-section {
    padding: 48px 0 !important;
  }

  /* Values */
  .value-item {
    padding: 28px 16px !important;
  }

  .value-icon-circle {
    width: 70px;
    height: 70px;
  }

  /* Team */
  .team-avatar {
    width: 110px;
    height: 110px;
  }

  /* Stats */
  .stat-icon {
    font-size: 40px;
  }

  .stat-number {
    font-size: clamp(1.8rem, 4vw, 2.5rem) !important;
  }
}

/* Large iPhones (415px - 479px) - iPhone 14 Plus, 14 Pro Max */
@media (min-width: 415px) and (max-width: 479px) {
  .hero-section {
    height: 380px !important;
  }

  .container {
    padding: 0 24px !important;
  }

  .story-section,
  .values-section,
  .team-section {
    padding: 56px 0 !important;
  }

  /* Stats */
  .stat-item {
    padding: 18px 12px;
  }

  /* CTA */
  .cta-section {
    padding: 64px 20px !important;
  }
}

/* iPads and tablets (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .hero-section {
    height: 350px !important;
  }

  .container {
    padding: 0 32px !important;
  }

  .story-section,
  .values-section,
  .team-section {
    padding: 64px 0 !important;
  }

  .section-title {
    font-size: 1.75rem !important;
  }

  .value-item {
    padding: 28px 20px;
  }

  .value-icon-circle {
    width: 70px;
    height: 70px;
  }

  .value-icon {
    font-size: 32px;
  }

  /* Team */
  .team-avatar {
    width: 110px;
    height: 110px;
  }

  /* Stats */
  .stat-icon {
    font-size: 42px;
  }

  .stat-number {
    font-size: 2.5rem !important;
  }

  /* CTA */
  .cta-section {
    padding: 72px 32px !important;
  }

  .cta-button,
  .cta-button-secondary {
    width: auto;
  }
}

/* Small tablets and landscape phones (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .hero-section {
    height: 340px !important;
  }

  .container {
    padding: 0 20px !important;
  }

  /* Mission & Vision cards */
  .card-icon-wrapper {
    height: 160px !important;
  }

  .card-icon {
    font-size: 56px !important;
  }

  /* Team cards */
  .team-avatar {
    width: 100px;
    height: 100px;
  }

  /* Stats */
  .stat-number {
    font-size: 2.2rem !important;
  }

  /* CTA buttons */
  .cta-button,
  .cta-button-secondary {
    width: auto !important;
  }
}

/* General mobile improvements */
@media (max-width: 767px) {
  /* Fix for full-width sections */
  .hero-section,
  .stats-section {
    width: 100vw !important;
    transform: translateX(-50%) !important;
    margin-left: 50% !important;
  }

  /* Ensure proper spacing on mobile */
  section {
    overflow: hidden;
  }

  /* Story section - stack vertically */
  .story-row {
    flex-direction: column !important;
  }

  .story-section {
    padding: 48px 0 !important;
  }

  .image-wrapper {
    margin-bottom: 32px;
  }

  /* Mission & Vision - full width cards on mobile */
  .value-card {
    margin-bottom: 24px;
  }

  /* Team section */
  .team-section {
    padding: 48px 0 !important;
  }

  .team-row {
    flex-direction: column !important;
  }

  .team-card {
    margin-bottom: 24px;
  }

  /* Values section */
  .values-section {
    padding: 48px 0 !important;
  }

  /* Statistics section */
  .stats-section {
    padding: 48px 0 !important;
  }

  /* CTA Section */
  .cta-section {
    padding: 56px 20px !important;
  }

  .cta-space {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    gap: 12px !important;
  }

  .cta-button,
  .cta-button-secondary {
    width: 100% !important;
  }

  /* Footer */
  .footer-text {
    font-size: 0.85rem;
    padding: 0 16px;
  }
}

/* Landscape mobile fixes */
@media (max-width: 767px) and (orientation: landscape) {
  .hero-section {
    height: 280px !important;
  }

  .hero-title {
    font-size: clamp(1.5rem, 4vw, 2rem) !important;
  }

  .hero-subtitle {
    font-size: clamp(0.85rem, 2.5vw, 1rem) !important;
  }

  .stat-number {
    font-size: 1.8rem !important;
  }
}

/* iPad Mini and small tablets (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Story section */
  .story-section {
    padding: 64px 0 !important;
  }

  /* Values */
  .value-item {
    padding: 32px 24px;
  }

  /* Team */
  .team-avatar {
    width: 110px;
    height: 110px;
  }

  /* Stats */
  .stat-icon {
    font-size: 44px;
  }

  .stat-number {
    font-size: 2.5rem !important;
  }

  /* CTA */
  .cta-section {
    padding: 72px 32px !important;
  }
}

/* Large tablets and small laptops (1024px - 1199px) */
@media (min-width: 1024px) and (max-width: 1199px) {
  .container {
    padding: 0 32px;
  }

  .section-title {
    font-size: 1.8rem !important;
  }
}

/* Extra small devices */
@media (max-width: 320px) {
  .hero-section {
    height: 300px !important;
  }

  .hero-title {
    font-size: 1.8rem !important;
  }

  .hero-subtitle {
    font-size: 0.9rem !important;
  }

  .value-icon-circle {
    width: 50px !important;
    height: 50px !important;
  }

  .value-icon {
    font-size: 24px !important;
  }

  .value-title {
    font-size: 1rem !important;
  }

  .team-avatar {
    width: 80px !important;
    height: 80px !important;
  }

  .card-icon-wrapper {
    height: 120px !important;
  }

  .card-icon {
    font-size: 40px !important;
  }

  .stat-icon {
    font-size: 32px !important;
  }

  .stat-number {
    font-size: 1.5rem !important;
  }

  .stat-label {
    font-size: 0.75rem !important;
  }
}
</style>
