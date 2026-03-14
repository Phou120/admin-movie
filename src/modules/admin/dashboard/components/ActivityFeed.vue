<script setup lang="ts">
import { ref, computed } from "vue";
import { UserOutlined, DollarOutlined, FileTextOutlined, InfoCircleOutlined, ClockCircleOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const emit = defineEmits<{
  loadedMore: [];
}>();

interface Activity {
  id: number;
  type: "user" | "payment" | "content" | "system";
  title: string;
  time: string;
  description: string;
}

interface Props {
  activities: Activity[];
  maxItems?: number;
  filter?: "all" | "users" | "content" | "payments" | "system";
}

const props = withDefaults(defineProps<Props>(), {
  maxItems: 10,
  filter: "all",
});

const showLoadMore = ref(false);
const loading = ref(false);
const visibleActivities = computed(() => {
  return props.activities.filter((activity) => {
    if (props.filter === "all") return true;
    if (props.filter === "users" && activity.type === "user") return true;
    if (props.filter === "content" && activity.type === "content") return true;
    if (props.filter === "payments" && activity.type === "payment") return true;
    if (props.filter === "system" && activity.type === "system") return true;
    return false;
  });
});

const displayedActivities = computed(() => {
  return visibleActivities.value.slice(0, props.maxItems);
});

const activityTypeIcon = (type: string) => {
  const icons: Record<string, any> = {
    user: UserOutlined,
    payment: DollarOutlined,
    content: FileTextOutlined,
    system: InfoCircleOutlined,
  };
  return icons[type] || ClockCircleOutlined;
};

const activityTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    user: "#1890ff",
    payment: "#52c41a",
    content: "#faad14",
    system: "#eb2f96",
  };
  return colors[type] || "#8c8c8c";
};

const loadMore = async () => {
  loading.value = true;
  showLoadMore.value = true;

  // Simulate loading more activities
  await new Promise((resolve) => setTimeout(resolve, 1000));

  loading.value = false;
  showLoadMore.value = false;
  emit("loadedMore");
};
</script>

<template>
  <a-card class="activity-feed" :loading="loading">
    <template #title>
      <div class="feed-title">
        {{ t("dashboard.activity.title") }}
      </div>
    </template>

    <div v-if="displayedActivities.length === 0" class="empty-state">
      <InfoCircleOutlined class="empty-icon" />
      <p>{{ t("dashboard.activity.empty") }}</p>
    </div>

    <div v-else class="activity-list">
      <div
        v-for="activity in displayedActivities"
        :key="activity.id"
        class="activity-item"
      >
        <div class="activity-icon" :class="`activity-icon-${activity.type}`">
          <component :is="activityTypeIcon(activity.type)" :style="{ color: activityTypeColor(activity.type) }" />
        </div>
        <div class="activity-content">
          <div class="activity-header">
            <span class="activity-title">{{ activity.title }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
          <p class="activity-description">{{ activity.description }}</p>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="showLoadMore" class="load-more-wrapper">
      <a-button type="link" @click="loadMore" :loading="loading" class="load-more-button">
        {{ t("dashboard.activity.loadMore") }}
      </a-button>
    </div>
  </a-card>
</template>

<style scoped lang="scss">
.activity-feed {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
}

.feed-title {
  font-size: 18px;
  font-weight: 600;
  color: #0d334a;
  margin-bottom: 16px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.9);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.activity-icon-user {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
}

.activity-icon-payment {
  background: linear-gradient(135deg, #52c41a 0%, #73d1d1 100%);
}

.activity-icon-content {
  background: linear-gradient(135deg, #faad14 0%, #ffd43e 100%);
}

.activity-icon-system {
  background: linear-gradient(135deg, #eb2f96 0%, #14b8a6 100%);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.activity-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

.activity-description {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 32px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 16px;
}

.load-more-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.load-more-button {
  width: 100%;
}
</style>
