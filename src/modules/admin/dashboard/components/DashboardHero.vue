<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { CloudUploadOutlined, FileTextOutlined, UserOutlined, LineChartOutlined } from "@ant-design/icons-vue";

const { t } = useI18n();

const currentGreeting = ref("");
const currentTime = ref("");

// Feature cards
const features = ref([
  {
    icon: UserOutlined,
    title: "Real-time Analytics",
    description: "Track live data updates instantly",
    color: "#1890ff",
  },
  {
    icon: LineChartOutlined,
    title: "Interactive Charts",
    description: "Visualize trends and patterns",
    color: "#52c41a",
  },
  {
    icon: FileTextOutlined,
    title: "Comprehensive Reports",
    description: "Detailed insights for decisions",
    color: "#faad14",
  },
  {
    icon: CloudUploadOutlined,
    title: "Quick Export",
    description: "Download data in multiple formats",
    color: "#eb2f96",
  },
]);

const updateGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    currentGreeting.value = "Good Morning";
  } else if (hour < 18) {
    currentGreeting.value = "Good Afternoon";
  } else {
    currentGreeting.value = "Good Evening";
  }
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  updateGreeting();
  updateTime();
  const interval = setInterval(() => {
    updateTime();
  }, 60000); // Update every minute

  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<template>
  <div class="dashboard-hero">
    <div class="hero-background"></div>
    <div class="hero-content">
      <div class="greeting-section">
        <span class="greeting-text">{{ currentGreeting }}, Admin!</span>
        <p class="date-text">{{ currentTime }}</p>
      </div>
      <h1 class="hero-title">
        {{ t("dashboard.hero.title") }}
      </h1>
      <p class="hero-subtitle">
        {{ t("dashboard.hero.subtitle") }}
      </p>

      <!-- Feature Cards -->
      <div class="feature-cards">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="feature-card"
          :style="{ '--feature-color': feature.color }"
        >
          <component :is="feature.icon" class="feature-icon" />
          <div class="feature-content">
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-hero {
  position: relative;
  background:
    linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: 200% 200%;
  animation: gradientFlow 10s ease infinite;
  padding: 48px 32px;
  border-radius: 20px;
  margin-bottom: 32px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(102, 126, 234, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: floatBubbles 15s ease-in-out infinite;
  pointer-events: none;
}

@keyframes floatBubbles {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.greeting-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 24px;
}

.greeting-text {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  opacity: 0.95;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.6s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.date-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 500;
}

.hero-title {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  color: #fff;
  margin: 0 0 16px 0;
  text-shadow:
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.2);
  animation: fadeInUp 0.8s ease-out 0.2s both;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: clamp(15px, 2vw, 18px);
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 32px 0;
  line-height: 1.7;
  font-weight: 400;
  animation: fadeInUp 0.8s ease-out 0.4s both;
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

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2);
  animation: cardFloat 0.8s ease-out 0.6s both;
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

@keyframes cardFloat {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--feature-color);
  border-radius: 14px;
  font-size: 28px;
  color: #fff;
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 6px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.feature-description {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  line-height: 1.5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-hero {
    padding: 32px 20px;
    border-radius: 16px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 15px;
  }

  .feature-cards {
    grid-template-columns: 1fr;
  }

  .greeting-text {
    font-size: 18px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .feature-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
