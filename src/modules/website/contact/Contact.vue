<template>
  <WebsiteLayout>
    <!-- Hero Section with animated particles -->
    <section class="hero-section">
      <div class="hero-bg-animation"></div>
      <div class="hero-overlay">
        <a-typography-title :level="1" class="hero-title">
          {{ t("website.contact.hero.title") }}
        </a-typography-title>
        <a-typography-paragraph class="hero-subtitle">
          {{ t("website.contact.hero.subtitle") }}
        </a-typography-paragraph>
        <a-space size="large" style="margin-top: 32px">
          <a-button size="large" class="hero-btn" @click="scrollToForm">
            <MailOutlined />
            {{ t("website.contact.form.submit") }}
          </a-button>
          <a-button
            size="large"
            class="hero-btn-call"
            href="tel:+8562012345678"
          >
            <PhoneOutlined />
            {{ t("website.contact.form.callNow") }}
          </a-button>
        </a-space>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <a-row :gutter="[32, 32]">
          <a-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-icon-wrapper">
                <CustomerServiceOutlined class="stat-icon" />
              </div>
              <a-typography-title :level="3" class="stat-number">
                {{ t("website.contact.statsValues.support247") }}
              </a-typography-title>
              <a-typography-text class="stat-label">{{
                t("website.contact.stats.support")
              }}</a-typography-text>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-icon-wrapper">
                <ClockCircleOutlined class="stat-icon" />
              </div>
              <a-typography-title :level="3" class="stat-number">
                {{ t("website.contact.statsValues.responseTime1hr") }}
              </a-typography-title>
              <a-typography-text class="stat-label">{{
                t("website.contact.stats.responseTime")
              }}</a-typography-text>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-icon-wrapper">
                <CheckCircleOutlined class="stat-icon" />
              </div>
              <a-typography-title :level="3" class="stat-number">
                {{ t("website.contact.statsValues.satisfaction100") }}
              </a-typography-title>
              <a-typography-text class="stat-label">{{
                t("website.contact.stats.satisfaction")
              }}</a-typography-text>
            </div>
          </a-col>
          <a-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-icon-wrapper">
                <TeamOutlined class="stat-icon" />
              </div>
              <a-typography-title :level="3" class="stat-number">
                {{ t("website.contact.statsValues.team50plus") }}
              </a-typography-title>
              <a-typography-text class="stat-label">{{
                t("website.contact.stats.teamMembers")
              }}</a-typography-text>
            </div>
          </a-col>
        </a-row>
      </div>
    </section>

    <!-- Contact Info Cards -->
    <section class="contact-info-section">
      <div class="container">
        <a-typography-title :level="2" class="section-title centered">
          {{ t("website.contact.sidebar.title") }}
        </a-typography-title>
        <a-typography-paragraph class="section-subtitle centered">
          {{ t("website.contact.sidebar.subtitle") }}
        </a-typography-paragraph>
        <a-row :gutter="[24, 32]" style="margin-top: 48px">
          <a-col :xs="24" :sm="8">
            <a-card class="info-card" hoverable>
              <div class="card-icon-wrapper address-icon">
                <EnvironmentOutlined class="card-icon" />
              </div>
              <a-card-meta>
                <template #title>
                  <span class="card-title">{{
                    t("website.contact.infoCards.address.title")
                  }}</span>
                </template>
                <template #description>
                  <p class="card-description">
                    {{ t("website.contact.infoCards.address.value") }}
                  </p>
                </template>
              </a-card-meta>
              <a-button
                type="link"
                class="card-link"
                href="https://www.google.com/maps/place/Soutsaka+Institute+of+Technology/@17.9889633,102.6286179,947m/data=!3m2!1e3!4b1!4m6!3m5!1s0x312467e7bd8e66a5:0xf85c9af1fa1bea14!8m2!3d17.9889582!4d102.6311928!16s%2Fg%2F1hc6tgsvn?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
              >
                {{ t("website.contact.sidebar.map") }} <ArrowRightOutlined />
              </a-button>
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="8">
            <a-card class="info-card" hoverable>
              <div class="card-icon-wrapper phone-icon">
                <PhoneOutlined class="card-icon" />
              </div>
              <a-card-meta>
                <template #title>
                  <span class="card-title">{{
                    t("website.contact.infoCards.phone.title")
                  }}</span>
                </template>
                <template #description>
                  <p class="card-description">
                    {{ t("website.contact.infoCards.phone.value") }}
                  </p>
                  <p class="card-description">
                    {{ t("website.contact.infoCards.hours.value") }}
                  </p>
                </template>
              </a-card-meta>
              <a-button type="link" class="card-link" href="tel:+8562012345678">
                {{ t("website.contact.form.callNow") }} <ArrowRightOutlined />
              </a-button>
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="8">
            <a-card class="info-card" hoverable>
              <div class="card-icon-wrapper email-icon">
                <MailOutlined class="card-icon" />
              </div>
              <a-card-meta>
                <template #title>
                  <span class="card-title">{{
                    t("website.contact.infoCards.email.title")
                  }}</span>
                </template>
                <template #description>
                  <p class="card-description">
                    {{ t("website.contact.infoCards.email.value") }}
                  </p>
                  <p class="card-description">support@savamovie.com</p>
                </template>
              </a-card-meta>
              <a-button
                type="primary"
                size="large"
                class="card-action-btn"
                href="mailto:contact@savamovie.com"
                block
              >
                <MailOutlined />
                {{ t("website.contact.form.sendEmail") }}
              </a-button>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </section>

    <!-- Contact Form & Map Section -->
    <section id="contact-form" class="form-section">
      <div class="container">
        <a-row :gutter="[48, 48]" align="top">
          <!-- Contact Form -->
          <a-col :xs="24" :lg="14">
            <div class="form-container">
              <div class="form-header">
                <a-typography-title :level="2" class="form-title">
                  {{ t("website.contact.form.title") }}
                </a-typography-title>
                <a-typography-paragraph class="form-subtitle">
                  {{ t("website.contact.sidebar.subtitle") }}
                </a-typography-paragraph>
              </div>

              <a-form
                ref="formRef"
                :model="formState"
                layout="vertical"
                @finish="handleSubmit"
                class="contact-form"
              >
                <a-row :gutter="16">
                  <a-col :xs="24" :md="12">
                    <a-form-item
                      :label="t('website.contact.form.name')"
                      name="name"
                      :rules="[
                        {
                          required: true,
                          message: t(
                            'website.register.validation.firstNameRequired',
                          ),
                        },
                      ]"
                    >
                      <a-input
                        v-model:value="formState.name"
                        size="large"
                        :placeholder="
                          t('website.register.placeholder.firstName')
                        "
                        :prefix="h(UserOutlined)"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :md="12">
                    <a-form-item
                      :label="t('website.contact.form.email')"
                      name="email"
                      :rules="[
                        {
                          required: true,
                          message: t(
                            'website.register.validation.emailRequired',
                          ),
                        },
                        {
                          type: 'email',
                          message: t(
                            'website.register.validation.emailInvalid',
                          ),
                        },
                      ]"
                    >
                      <a-input
                        v-model:value="formState.email"
                        size="large"
                        :placeholder="t('website.register.placeholder.email')"
                        :prefix="h(MailOutlined)"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :xs="24" :md="12">
                    <a-form-item
                      :label="t('website.register.form.phone')"
                      name="phone"
                    >
                      <a-input
                        v-model:value="formState.phone"
                        size="large"
                        :placeholder="t('website.register.placeholder.phone')"
                        :prefix="h(PhoneOutlined)"
                        allow-clear
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :md="12">
                    <a-form-item
                      :label="t('website.contact.form.subject')"
                      name="subject"
                      :rules="[
                        {
                          required: true,
                          message: t('validation.selectOption'),
                        },
                      ]"
                    >
                      <a-select
                        v-model:value="formState.subject"
                        size="large"
                        :placeholder="t('website.contact.form.subject')"
                        allow-clear
                      >
                        <a-select-option value="general">
                          <span class="select-option">
                            <QuestionCircleOutlined />
                            General Inquiry
                          </span>
                        </a-select-option>
                        <a-select-option value="support">
                          <span class="select-option">
                            <CustomerServiceOutlined />
                            Technical Support
                          </span>
                        </a-select-option>
                        <a-select-option value="billing">
                          <span class="select-option">
                            <DollarOutlined />
                            Billing Question
                          </span>
                        </a-select-option>
                        <a-select-option value="feedback">
                          <span class="select-option">
                            <LikeOutlined />
                            Feedback
                          </span>
                        </a-select-option>
                        <a-select-option value="other">
                          <span class="select-option">
                            <MoreOutlined />
                            Other
                          </span>
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item
                  :label="t('website.contact.form.message')"
                  name="message"
                  :rules="[
                    { required: true, message: t('validation.required') },
                  ]"
                >
                  <a-textarea
                    v-model:value="formState.message"
                    size="large"
                    :rows="5"
                    :placeholder="t('website.contact.form.message')"
                    show-count
                    :maxlength="500"
                    allow-clear
                  />
                </a-form-item>

                <a-form-item>
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    :loading="loading"
                    class="submit-button"
                    block
                  >
                    <template #icon>
                      <SendOutlined />
                    </template>
                    {{
                      loading
                        ? t("common.loading")
                        : t("website.contact.form.submit")
                    }}
                  </a-button>
                </a-form-item>
              </a-form>
            </div>
          </a-col>

          <!-- Map & Info Sidebar -->
          <a-col :xs="24" :lg="10">
            <div class="info-sidebar">
              <!-- Map Card -->
              <a-card class="map-card" :bordered="false" hoverable>
                <template #title>
                  <span class="sidebar-title">
                    <EnvironmentOutlined />
                    {{ t("website.contact.infoCards.address.title") }}
                  </span>
                </template>
                <div class="map-content">
                  <!-- Map Mode Switcher -->
                  <div class="map-mode-switcher">
                    <a-button
                      v-for="(config, mode) in mapConfig"
                      :key="mode"
                      :type="mapMode === mode ? 'primary' : 'default'"
                      size="small"
                      @click="changeMapMode(mode)"
                      class="map-mode-btn"
                    >
                      <component :is="config.icon" />
                      {{ config.name }}
                    </a-button>
                  </div>
                  <div class="map-wrapper">
                    <iframe
                      :src="currentMapUrl"
                      width="100%"
                      height="400"
                      style="border: 0; border-radius: 8px"
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                      allowfullscreen
                    ></iframe>
                  </div>
                  <a-button
                    type="primary"
                    href="https://www.google.com/maps/place/Soutsaka+Institute+of+Technology/@17.9889633,102.6286179,947m/data=!3m2!1e3!4b1!4m6!3m5!1s0x312467e7bd8e66a5:0xf85c9af1fa1bea14!8m2!3d17.9889582!4d102.6311928!16s%2Fg%2F1hc6tgsvn?entry=ttu&g_ep=EgoyMDI2MDIyNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    block
                    size="large"
                    style="margin-top: 12px; width: 100%"
                  >
                    {{ t("website.contact.sidebar.map") }}
                    <ArrowRightOutlined />
                  </a-button>
                </div>
              </a-card>

              <!-- Business Hours -->
              <a-card class="hours-card" :bordered="false">
                <template #title>
                  <span class="sidebar-title">
                    <ClockCircleOutlined />
                    {{ t("website.contact.infoCards.hours.title") }}
                  </span>
                </template>
                <a-timeline>
                  <a-timeline-item color="green">
                    <div class="timeline-item">
                      <strong>Monday - Friday</strong>
                      <br />
                      <span class="timeline-time">9:00 AM - 6:00 PM</span>
                    </div>
                  </a-timeline-item>
                  <a-timeline-item color="blue">
                    <div class="timeline-item">
                      <strong>Saturday</strong>
                      <br />
                      <span class="timeline-time">9:00 AM - 4:00 PM</span>
                    </div>
                  </a-timeline-item>
                  <a-timeline-item color="red">
                    <div class="timeline-item">
                      <strong>Sunday</strong>
                      <br />
                      <span class="timeline-time">Closed</span>
                    </div>
                  </a-timeline-item>
                </a-timeline>
              </a-card>

              <!-- Social Media -->
              <a-card class="social-card" :bordered="false">
                <template #title>
                  <span class="sidebar-title">
                    <TeamOutlined />
                    {{ t("website.contact.sidebar.social.title") }}
                  </span>
                </template>
                <a-row :gutter="[12, 12]">
                  <a-col :span="12">
                    <a-button
                      block
                      size="large"
                      class="social-button facebook"
                      href="https://facebook.com"
                      target="_blank"
                    >
                      <FacebookOutlined />
                      Facebook
                    </a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button
                      block
                      size="large"
                      class="social-button twitter"
                      href="https://twitter.com"
                      target="_blank"
                    >
                      <TwitterOutlined />
                      Twitter
                    </a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button
                      block
                      size="large"
                      class="social-button instagram"
                      href="https://instagram.com"
                      target="_blank"
                    >
                      <InstagramOutlined />
                      Instagram
                    </a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button
                      block
                      size="large"
                      class="social-button youtube"
                      href="https://youtube.com"
                      target="_blank"
                    >
                      <YoutubeOutlined />
                      YouTube
                    </a-button>
                  </a-col>
                </a-row>
              </a-card>
            </div>
          </a-col>
        </a-row>
      </div>
    </section>

    <!-- FAQ Section with Accordion -->
    <section class="faq-section">
      <div class="container">
        <a-typography-title :level="2" class="section-title centered">
          {{ t("website.contact.faq.title") }}
        </a-typography-title>
        <a-typography-paragraph class="section-subtitle centered">
          {{ t("website.contact.sidebar.subtitle") }}
        </a-typography-paragraph>

        <a-row :gutter="[32, 32]" justify="center" style="margin-top: 48px">
          <a-col :xs="24" :lg="16">
            <a-collapse
              v-model:activeKey="activeKey"
              accordion
              class="faq-collapse"
            >
              <a-collapse-panel
                key="1"
                :header="t('website.contact.faq.q1.question')"
              >
                <p class="faq-content">
                  {{ t("website.contact.faq.q1.answer") }}
                </p>
              </a-collapse-panel>
              <a-collapse-panel
                key="2"
                :header="t('website.contact.faq.q2.question')"
              >
                <p class="faq-content">
                  {{ t("website.contact.faq.q2.answer") }}
                </p>
              </a-collapse-panel>
              <a-collapse-panel
                key="3"
                :header="t('website.contact.faq.q3.question')"
              >
                <p class="faq-content">
                  {{ t("website.contact.faq.q3.answer") }}
                </p>
              </a-collapse-panel>
              <a-collapse-panel
                key="4"
                :header="t('website.contact.faq.q3.question')"
              >
                <p class="faq-content">
                  {{ t("website.contact.faq.q3.answer") }}
                </p>
              </a-collapse-panel>
            </a-collapse>
          </a-col>
        </a-row>
      </div>
    </section>
  </WebsiteLayout>
</template>

<script setup lang="ts">
import { ref, reactive, h, computed } from "vue";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  SendOutlined,
  ArrowRightOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  QuestionCircleOutlined,
  CustomerServiceOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  DollarOutlined,
  LikeOutlined,
  MoreOutlined,
  FullscreenOutlined,
  GlobalOutlined,
  EnvironmentTwoTone,
} from "@ant-design/icons-vue";
import WebsiteLayout from "../components/WebsiteLayout.vue";

const { t } = useI18n();

const formRef = ref();
const loading = ref(false);
const activeKey = ref(["1"]);

// Form state
const formState = reactive({
  name: "",
  email: "",
  phone: "",
  subject: undefined,
  message: "",
});

// Map modes
type MapMode = "standard" | "satellite" | "hybrid" | "terrain" | "osm";
const mapMode = ref<MapMode>("standard");

// Map mode configurations
const mapConfig = {
  standard: {
    name: "Standard",
    icon: GlobalOutlined,
    url: "https://maps.google.com/maps?q=17.9889633,102.6286179&z=15&output=embed",
  },
  satellite: {
    name: "Satellite",
    icon: EnvironmentTwoTone,
    url: "https://maps.google.com/maps?q=17.9889633,102.6286179&z=15&t=k&output=embed",
  },
  hybrid: {
    name: "Hybrid",
    icon: FullscreenOutlined,
    url: "https://maps.google.com/maps?q=17.9889633,102.6286179&z=15&t=h&output=embed",
  },
  terrain: {
    name: "Terrain",
    icon: EnvironmentOutlined,
    url: "https://maps.google.com/maps?q=17.9889633,102.6286179&z=15&t=p&output=embed",
  },
  osm: {
    name: "OpenStreet",
    icon: EnvironmentOutlined,
    url: "https://www.openstreetmap.org/export/embed.html?bbox=102.618,17.978,102.639,17.998&layer=mapnik&marker=17.9889633,102.6286179",
  },
};

// Current map URL
const currentMapUrl = computed(() => mapConfig[mapMode.value].url);

// Change map mode
const changeMapMode = (mode: string) => {
  mapMode.value = mode as MapMode;
};

// Scroll to form
const scrollToForm = () => {
  const element = document.getElementById("contact-form");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

// Handle form submission
const handleSubmit = async () => {
  loading.value = true;

  // Simulate API call
  setTimeout(() => {
    loading.value = false;
    message.success(
      `${t("common.success")}! ${t("website.contact.sidebar.subtitle")}`,
    );

    // Reset form
    Object.assign(formState, {
      name: "",
      email: "",
      phone: "",
      subject: undefined,
      message: "",
    });

    // Reset form validation
    formRef.value?.clearValidate();
  }, 1500);
};
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

/* Hero Section with animated background */
.hero-section {
  background:
    linear-gradient(135deg, #0d334aff 0%, #1a5380 100%),
    url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600")
      center/cover no-repeat;
  background-blend-mode: overlay;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 20px;
  width: 100vw;
  transform: translateX(-50%);
  margin-left: 50%;
  overflow: hidden;
}

.hero-bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 20% 50%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.hero-overlay {
  text-align: center;
  z-index: 2;
  padding: 20px;
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  color: #fff !important;
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 16px !important;
  font-weight: 700;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.95) !important;
  font-size: clamp(1rem, 2.5vw, 1.35rem);
  max-width: 700px;
  margin: 0 auto 24px;
  line-height: 1.6;
}

.hero-btn {
  height: 48px;
  padding: 0 40px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 24px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.hero-btn-secondary {
  height: 48px;
  padding: 0 40px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 24px;
  border: 2px solid #fff;
  color: #fff;
  background: transparent;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.hero-btn-call {
  height: 52px;
  padding: 0 40px;
  font-size: 1.05rem;
  font-weight: 700;
  border-radius: 26px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  border: none;
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.1);
}

.hero-btn-call:hover {
  background: linear-gradient(135deg, #ff5252 0%, #e84848 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
}

.hero-btn-secondary:hover {
  background: #fff;
  color: #0d334aff;
}

/* Stats Section */
.stats-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
  padding: 60px 0;
}

.stat-item {
  text-align: center;
  padding: 24px;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: scale(1.05);
}

.stat-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d334aff 0%, #1a5380 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 4px 12px rgba(13, 51, 74, 0.2);
}

.stat-icon {
  font-size: 36px;
  color: #fff;
}

.stat-number {
  color: #0d334aff !important;
  font-weight: 700 !important;
  margin-bottom: 8px !important;
  font-size: 2rem !important;
}

.stat-label {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

/* Container for content */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Contact Info Section */
.contact-info-section {
  padding: 80px 0;
}

.section-title {
  color: #0d334aff !important;
  font-weight: 700 !important;
  margin-bottom: 16px !important;
  font-size: 2rem !important;
}

.section-title.centered {
  text-align: center;
}

.section-subtitle {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.section-subtitle.centered {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.info-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-align: center;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.info-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0d334aff 0%, #1a5380 100%);
}

.info-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.card-icon-wrapper {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 16px;
  border-radius: 16px;
}

.address-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.phone-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.email-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card-icon {
  font-size: 48px;
  color: #fff;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0d334aff;
  display: block;
  margin-bottom: 12px;
}

.card-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 4px;
}

.card-link {
  margin-top: 16px;
  font-weight: 600;
  color: #0d334aff;
  transition: all 0.3s ease;
}

.card-link:hover {
  color: #1a5380;
}

.card-action-btn {
  height: 44px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0d334aff 0%, #1a5380 100%);
  border: none;
  color: #fff;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.card-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(13, 51, 74, 0.3);
  background: linear-gradient(135deg, #1a5380 0%, #0d334aff 100%);
}

/* Form Section */
.form-section {
  background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
  padding: 80px 0;
}

.form-container {
  background: #fff;
  padding: 48px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  color: #0d334aff !important;
  font-weight: 700 !important;
  margin-bottom: 12px !important;
}

.form-subtitle {
  color: #666;
  font-size: 1rem;
}

.contact-form {
  margin-top: 24px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

/* Enhanced Input Styling */
:deep(.ant-input-affix-wrapper) {
  border-radius: 12px;
  border: 2px solid #e8e8e8;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  padding: 4px 12px;
}

:deep(.ant-input-affix-wrapper:hover) {
  border-color: #0d334aff;
  box-shadow: 0 4px 12px rgba(13, 51, 74, 0.1);
}

:deep(.ant-input-affix-wrapper-focused) {
  border-color: #0d334aff;
  box-shadow:
    0 0 0 3px rgba(13, 51, 74, 0.1),
    0 4px 12px rgba(13, 51, 74, 0.15);
}

:deep(.ant-input-affix-wrapper-lg) {
  font-size: 1rem;
  padding: 8px 12px;
}

/* Input Prefix Icon Styling */
:deep(.ant-input-prefix) {
  margin-right: 8px;
  color: #0d334aff;
  font-size: 16px;
}

:deep(.ant-input-suffix) {
  margin-left: 8px;
}

/* Select Dropdown Styling */
:deep(.ant-select-selector) {
  border-radius: 12px !important;
  border: 2px solid #e8e8e8 !important;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  padding: 4px 12px !important;
}

:deep(.ant-select:hover .ant-select-selector) {
  border-color: #0d334aff !important;
  box-shadow: 0 4px 12px rgba(13, 51, 74, 0.1);
}

:deep(.ant-select-focused .ant-select-selector) {
  border-color: #0d334aff !important;
  box-shadow:
    0 0 0 3px rgba(13, 51, 74, 0.1),
    0 4px 12px rgba(13, 51, 74, 0.15) !important;
}

/* Textarea Styling */
:deep(.ant-input-textarea-show-count::after) {
  float: right;
  margin-top: 8px;
  color: #999;
  font-size: 0.85rem;
}

:deep(.ant-input-textarea) {
  border-radius: 12px;
  border: 2px solid #e8e8e8;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  padding: 8px 12px;
}

:deep(.ant-input-textarea:hover) {
  border-color: #0d334aff;
  box-shadow: 0 4px 12px rgba(13, 51, 74, 0.1);
}

:deep(.ant-input-textarea-focused) {
  border-color: #0d334aff;
  box-shadow:
    0 0 0 3px rgba(13, 51, 74, 0.1),
    0 4px 12px rgba(13, 51, 74, 0.15);
}

/* Clear Button Styling */
:deep(.ant-input-clear-button) {
  color: #999;
  transition: color 0.3s ease;
}

:deep(.ant-input-clear-button:hover) {
  color: #ff4d4f;
}

.select-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-button {
  height: 52px;
  font-size: 1.05rem;
  font-weight: 600;
  background: linear-gradient(135deg, #0d334aff 0%, #1a5380 100%);
  border: none;
  border-radius: 12px;
  margin-top: 24px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-button :deep(.ant-btn-icon) {
  display: inline-flex;
  align-items: center;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(13, 51, 74, 0.3);
}

/* Info Sidebar */
.info-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.map-card,
.hours-card,
.social-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #0d334aff;
}

.map-content {
  padding: 0;
}

/* Map Mode Switcher */
.map-mode-switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.map-mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  padding: 4px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.map-mode-btn:hover {
  transform: translateY(-1px);
}

.map-placeholder {
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.map-icon {
  font-size: 64px;
  color: #0d334aff;
  margin-bottom: 16px;
}

.map-text {
  color: #0d334aff;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.map-subtext {
  color: #666;
  margin-bottom: 24px;
}

.map-wrapper {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.map-wrapper {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-wrapper:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(13, 51, 74, 0.2);
}

.map-wrapper:active {
  transform: scale(0.98);
}

.map-wrapper iframe {
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: none;
}

.timeline-item {
  color: #333;
}

.timeline-time {
  color: #0d334aff;
  font-weight: 500;
}

/* Social Buttons */
.social-button {
  height: 48px;
  text-align: left;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.social-button.facebook {
  background: #1877f2;
  border-color: #1877f2;
  color: #fff;
}

.social-button.twitter {
  background: #1da1f2;
  border-color: #1da1f2;
  color: #fff;
}

.social-button.instagram {
  background: linear-gradient(
    45deg,
    #f09433 0%,
    #e6683c 25%,
    #dc2743 50%,
    #cc2366 75%,
    #bc1888 100%
  );
  border: none;
  color: #fff;
}

.social-button.youtube {
  background: #ff0000;
  border-color: #ff0000;
  color: #fff;
}

.social-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* FAQ Section */
.faq-section {
  background: #f8f9ff;
  padding: 80px 0;
}

.faq-collapse {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

:deep(.ant-collapse-item) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-collapse-item:last-child) {
  border-bottom: none;
}

:deep(.ant-collapse-header) {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  padding: 20px 24px;
}

:deep(.ant-collapse-header:hover) {
  color: #0d334aff;
}

:deep(.ant-collapse-content) {
  background: #fafafa;
}

:deep(.ant-collapse-content-box) {
  padding: 20px 24px;
}

.faq-content {
  color: #666;
  line-height: 1.7;
  font-size: 0.95rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    height: 380px;
  }

  .hero-btn,
  .hero-btn-secondary {
    width: 100%;
    margin-bottom: 8px;
  }

  .form-container {
    padding: 32px 24px;
  }

  .form-section,
  .faq-section {
    padding: 48px 0;
  }

  .map-placeholder {
    padding: 32px 24px;
  }
}

@media (max-width: 576px) {
  .stat-item {
    padding: 16px 8px;
  }

  .stat-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .stat-icon {
    font-size: 28px;
  }

  .stat-number {
    font-size: 1.5rem !important;
  }
}
</style>
