<template>
  <div class="member-view">
    <div class="member-view-header">
      <a-button @click="goBack">
        <arrow-left-outlined />
        {{ t("modules.member.view.backToMembers") }}
      </a-button>
      <h1>{{ getHeaderText() }} {{ t("modules.member.view.details") }}</h1>
    </div>

    <div class="form-container">
      <div v-if="!loading">
        <a-card
          :title="`${getHeaderText()} ${t('modules.member.view.information')}`"
          class="member-view-card"
        >
          <a-descriptions :column="2" bordered>
            <!-- Profile Image -->
            <a-descriptions-item
              :label="t('modules.member.view.profileImage')"
              :span="2"
            >
              <a-avatar
                :src="member.user?.profile?.image_url"
                :size="100"
                shape="circle"
                class="profile-avatar"
              >
                <template #icon>
                  <user-outlined v-if="!member.user?.profile?.image_url" />
                </template>
              </a-avatar>
            </a-descriptions-item>

            <!-- Basic Information -->
            <a-descriptions-item :label="t('modules.member.columns.name')">
              {{ member.name || "-" }}
            </a-descriptions-item>
            <a-descriptions-item :label="t('modules.member.columns.surname')">
              {{ member.surname || "-" }}
            </a-descriptions-item>
            <a-descriptions-item :label="t('modules.member.columns.email')">
              <a :href="`mailto:${member.email}`">{{ member.email || "-" }}</a>
            </a-descriptions-item>
            <a-descriptions-item :label="t('modules.member.columns.phone')">
              <a :href="`tel:${member.tel}`">{{ member.tel || "-" }}</a>
            </a-descriptions-item>
            <a-descriptions-item
              :label="t('modules.member.view.type')"
              :span="2"
            >
              <a-tag :color="getTypeColor(member.type)" class="type-badge">
                {{ member.type?.toUpperCase() || "-" }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item
              :label="t('modules.member.columns.status')"
              :span="2"
            >
              <a-tag
                :color="getStatusColor(member.status)"
                class="status-badge"
              >
                {{ member.status?.toUpperCase() || "-" }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item
              :label="t('modules.member.columns.address')"
              :span="2"
            >
              {{ member.address || "-" }}
            </a-descriptions-item>

            <!-- System Information -->
            <a-descriptions-item :label="t('modules.member.columns.createdAt')">
              {{ formatDate(member.created_at) }}
            </a-descriptions-item>
            <a-descriptions-item :label="t('modules.member.columns.updatedAt')">
              {{ formatDate(member.updated_at) }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </div>

      <!-- Loading skeleton -->
      <a-card class="member-view-card" v-else>
        <a-skeleton active :paragraph="{ rows: 8 }" />
      </a-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useMember } from "../composible/index";
import formatDate from "../../../../common/utils/format-date.util";

const router = useRouter();
const route = useRoute();
const { getById } = useMember();
const { t } = useI18n();

const loading = ref(false);
const member = ref<any>({});

// Get header text based on member type
const getHeaderText = () => {
  const type = member.value.type?.toLowerCase();
  switch (type) {
    case "user":
      return t("modules.member.usersTab");
    case "member":
      return t("modules.member.membersTab");
    default:
      return t("modules.member.membersTab");
  }
};

// Load member data
const loadMemberData = async () => {
  loading.value = true;
  try {
    const memberId = Number(route.params.id);
    console.log("Loading member with ID:", memberId);

    const response = await getById(memberId);
    member.value = response.data || response;

    console.log("Member data loaded:", member.value);
  } catch (error) {
    console.error("Error loading member data:", error);
    message.error(t("modules.member.view.loadError"));
    router.push("/member");
  } finally {
    loading.value = false;
  }
};

// Get status color for badges
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "success"; // Green
    case "pending":
      return "warning"; // Orange/Yellow
    case "rejected":
      return "error"; // Red
    case "active":
      return "processing"; // Blue
    case "inactive":
      return "default"; // Gray
    default:
      return "blue"; // Default blue
  }
};

// Get type color for badges
const getTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case "user":
      return "blue"; // Blue for users
    case "member":
      return "green"; // Green for members
    case "admin":
      return "purple"; // Purple for admin
    default:
      return "default"; // Gray default
  }
};

// Navigation functions
const goBack = () => {
  router.push("/member");
};

onMounted(() => {
  loadMemberData();
});
</script>

<style lang="scss" scoped>
.member-view-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  h1 {
    font-size: 24px;
    margin: 0;
  }

  .ant-btn {
    border: none;
    background: transparent;
    color: #666;
    padding: 4px 8px;
    height: auto;

    &:hover {
      color: #0d334aff;
      background: transparent;
      border: none;
    }

    &:focus {
      color: #0d334aff;
      background: transparent;
      border: none;
    }
  }
}

.form-container {
  padding: 0 12px;
}

.member-view-card {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-avatar {
  border: 3px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-badge,
.type-badge {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  letter-spacing: 0.5px;
}

.view-actions {
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;

  .ant-btn {
    min-width: 120px;
    height: 40px;
    font-size: 14px;
    font-weight: 500;
  }
}

:deep(.ant-descriptions-item-label) {
  font-weight: 600;
  color: #666;
}

:deep(.ant-descriptions-item-content) {
  color: #333;
}

:deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
  background-color: #fafafa;
}

:deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
  background-color: #fff;
}

// Responsive styles
@media screen and (max-width: 768px) {
  .member-view-header {
    padding: 8px;
    flex-direction: column;
    align-items: flex-start;

    h1 {
      font-size: 20px;
    }
  }

  .form-container {
    padding: 0 8px;
  }

  .member-view-card {
    margin: 0;
  }

  :deep(.ant-descriptions) {
    .ant-descriptions-item {
      padding: 8px 12px;
    }
  }

  .view-actions {
    .ant-btn {
      width: 100%;
      margin: 8px 0;

      &:not(:last-child) {
        margin-right: 0;
        margin-bottom: 8px;
      }
    }
  }
}

@media screen and (max-width: 576px) {
  .member-view-header h1 {
    font-size: 18px;
  }

  :deep(.ant-descriptions) {
    .ant-descriptions-item-label,
    .ant-descriptions-item-content {
      padding: 6px 8px;
    }
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
  }
}
</style>
