<template>
  <div class="sidebar-container">
    <div class="logo" :class="{ collapsed }">
      <img src="../../assets/images/logo.png" />
    </div>
    <a-menu
      v-model="selectedKeys"
      class="sidebar-menu"
      mode="inline"
      :inline-collapsed="collapsed"
    >
      <!-- Dashboard - Admin/Super-Admin only -->
      <a-menu-item
        v-if="isAdminOrSuperAdmin"
        key="1"
        @click="handlerMenu('bashBoard')"
      >
        <DashboardOutlined />
        <span>{{ t("sidebar.dashboard") }}</span>
      </a-menu-item>

      <!-- Banner - Admin/Super-Admin only -->
      <a-menu-item
        v-if="isAdminOrSuperAdmin"
        key="2"
        @click="handlerMenu('banner')"
      >
        <PictureOutlined />
        <span>{{ t("sidebar.banner") }}</span>
      </a-menu-item>

      <!-- Category - Admin/Super-Admin only -->
      <a-menu-item
        v-if="isAdminOrSuperAdmin"
        key="3"
        @click="handlerMenu('category')"
      >
        <AppstoreOutlined />
        <span>{{ t("sidebar.category") }}</span>
      </a-menu-item>

      <!-- Video - All roles -->
      <a-menu-item key="16" @click="handlerMenu('video')">
        <VideoCameraOutlined />
        <span>{{ t("sidebar.video") }}</span>
      </a-menu-item>

      <!-- Package - Admin/Super-Admin only -->
      <a-menu-item
        v-if="isAdminOrSuperAdmin"
        key="6"
        @click="handlerMenu('package')"
      >
        <ShoppingOutlined />
        <span>{{ t("sidebar.package") }}</span>
      </a-menu-item>

      <!-- Payment - Admin/Super-Admin only -->
      <a-menu-item
        v-if="isAdminOrSuperAdmin"
        key="17"
        @click="handlerMenu('payment')"
      >
        <WalletOutlined />
        <span>{{ t("sidebar.payment") }}</span>
      </a-menu-item>

      <!-- QR Code - Admin/Super-Admin only -->
      <a-menu-item
        v-if="isAdminOrSuperAdmin"
        key="18"
        @click="handlerMenu('qr-code')"
      >
        <QrcodeOutlined />
        <span>{{ t("sidebar.qrCode") }}</span>
      </a-menu-item>

      <!-- Customer - Admin/Super-Admin only -->
      <a-menu-item
        v-if="isAdminOrSuperAdmin"
        key="14"
        @click="handlerMenu('customer')"
      >
        <TeamOutlined />
        <span>{{ t("sidebar.customer") }}</span>
      </a-menu-item>

      <!-- Member - Admin/Super-Admin only -->
      <a-menu-item
        v-if="isAdminOrSuperAdmin"
        key="15"
        @click="handlerMenu('member')"
      >
        <ContactsOutlined />
        <span>{{ t("sidebar.member") }}</span>
      </a-menu-item>

      <!-- Financial Submenu - Admin/Super-Admin only -->
      <a-sub-menu v-if="isAdminOrSuperAdmin" key="sub2">
        <template #title>
          <span>
            <BankOutlined />
            <span>{{ t("sidebar.financial") }}</span>
          </span>
        </template>
        <a-menu-item key="7" @click="handlerMenu('bank')">
          <BankOutlined />
          {{ t("sidebar.bank") }}
        </a-menu-item>
        <a-menu-item key="8" @click="handlerMenu('currency')">
          <DollarOutlined />
          {{ t("sidebar.currency") }}
        </a-menu-item>
      </a-sub-menu>

      <!-- System Submenu - Admin/Super-Admin only -->
      <a-sub-menu v-if="isAdminOrSuperAdmin" key="sub3">
        <template #title>
          <span>
            <SettingOutlined />
            <span>{{ t("sidebar.system") }}</span>
          </span>
        </template>
        <a-menu-item key="10" @click="handlerMenu('permission')">
          <SafetyOutlined />
          {{ t("sidebar.permission") }}
        </a-menu-item>
        <a-menu-item key="11" @click="handlerMenu('role')">
          <CrownOutlined />
          {{ t("sidebar.role") }}
        </a-menu-item>
        <a-menu-item key="12" @click="handlerMenu('user')">
          <UserOutlined />
          {{ t("sidebar.user") }}
        </a-menu-item>
      </a-sub-menu>

      <!-- Profile - All roles -->
      <a-menu-item key="13" @click="handlerMenu('profile')">
        <SolutionOutlined />
        <span>{{ t("sidebar.profile") }}</span>
      </a-menu-item>

      <a-sub-menu v-if="isAdminOrSuperAdmin" key="sub4">
        <template #title>
          <span>
            <StockOutlined />
            <span>{{ t("sidebar.reports") }}</span>
          </span>
        </template>
        <a-menu-item key="14" @click="handlerMenu('video-report')">
          <VideoCameraOutlined />
          {{ t("sidebar.report.video") }}
        </a-menu-item>
        <a-menu-item key="15" @click="handlerMenu('member-report')">
          <UserOutlined />
          {{ t("sidebar.report.member") }}
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  UserOutlined,
  AppstoreOutlined,
  CrownOutlined,
  DashboardOutlined,
  PictureOutlined,
  BankOutlined,
  DollarOutlined,
  SettingOutlined,
  SafetyOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  TeamOutlined,
  ContactsOutlined,
  VideoCameraOutlined,
  StockOutlined,
  WalletOutlined,
  QrcodeOutlined,
} from "@ant-design/icons-vue";

defineProps<{ collapsed: boolean }>();

const selectedKeys = ref<string[]>([]);

// call to use router
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

// Route name to menu key mapping
const routeToMenuKey: Record<string, string> = {
  dashboard: "1",
  banner: "2",
  category: "3",
  video: "16",
  package: "6",
  payment: "17",
  "qr-code": "18",
  customer: "14",
  member: "15",
  bank: "7",
  currency: "8",
  permission: "10",
  role: "11",
  user: "12",
  profile: "13",
  // "video-report": "14",
  // "member-report": "15",
};

// Watch route changes and update selected menu item
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName && routeToMenuKey[newRouteName as string]) {
      selectedKeys.value = [routeToMenuKey[newRouteName as string]];
    }
  },
  { immediate: true },
);

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

// Check if user is admin or super-admin
const isAdminOrSuperAdmin = computed(() => {
  const roles = userRoles.value;
  return roles.includes("admin") || roles.includes("super-admin");
});

// handle menu
const handlerMenu = (key: string) => {
  router.push({ name: key });
};
</script>

<style lang="scss" scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8125rem 0.5rem 0.8125rem 1rem;
  width: 100%;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s;

  img {
    width: 4rem;
    height: 4rem;
    margin-right: 0.8rem;
    margin-left: 0.25rem;
    object-fit: contain;
    border-radius: 5px;
    transition: all 0.3s;
  }

  &.collapsed {
    padding: 1rem;

    img {
      width: 2.5rem;
      height: 2.5rem;
      margin: 0;
    }
  }
}

/* Scoped deep override for Ant Design Vue menu styles */
.sidebar-menu {
  ::v-deep(.ant-menu-item),
  ::v-deep(.ant-menu-submenu-title) {
    color: #000 !important;
    font-size: 16px;

    svg {
      color: #000 !important;
      font-size: 16px;
    }
  }

  ::v-deep(.ant-menu-item-selected) {
    background-color: rgba(13, 78, 122, 0.315);
    color: #0d334aff !important;

    svg {
      color: #0d334aff !important;
    }
  }

  ::v-deep(.ant-menu-item:hover),
  ::v-deep(.ant-menu-submenu-title:hover) {
    color: #0d334aff !important;

    svg {
      color: #0d334aff !important;
    }
  }

  ::v-deep(.ant-menu-submenu-open) {
    .ant-menu-submenu-title {
      color: #0d334aff !important;

      svg {
        color: #0d334aff !important;
      }
    }
  }
}
</style>
