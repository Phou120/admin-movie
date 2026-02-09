<template>
  <a-layout-header class="header">
    <div class="logo">
      <img src="../../../assets/images/logo.png" alt="ApplyOnline Logo" />
      <span class="brand-title">SAVA MOVIE</span>
    </div>

    <a-menu
      mode="horizontal"
      :selectedKeys="[currentPage]"
      class="main-menu"
      @click="onMenuClick"
    >
      <a-menu-item key="home">{{ t('website.menu.home') }}</a-menu-item>
      <a-menu-item key="about-us">{{ t('website.menu.aboutUs') }}</a-menu-item>
      <a-menu-item key="contact">{{ t('website.menu.contact') }}</a-menu-item>
    </a-menu>

    <div class="header-actions">
      <LanguageSwitcher />
      <a-button class="login-btn" @click="goToLogin">
        <LoginOutlined />
        <span class="btn-text">{{ t('website.menu.signIn') }}</span>
      </a-button>
      <a-button type="primary" class="register-btn" @click="goToRegister">
        <UserAddOutlined />
        <span class="btn-text">{{ t('website.menu.register') }}</span>
      </a-button>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons-vue";
import LanguageSwitcher from "../../../components/LanguageSwitcher.vue";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

// Compute current page from route name
const currentPage = computed(() => {
  return (route.name as string) || "home";
});

const onMenuClick = (e: any) => {
  if (e.key === "home") {
    router.push({ name: "home" });
  } else if (e.key === "about-us") {
    router.push({ name: "about-us" });
  } else if (e.key === "contact") {
    router.push({ name: "contact" });
  }
};

const goToLogin = () => {
  router.push("/login");
};

const goToRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: 0;
  z-index: 100;
  padding: 0 50px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
  margin: 0 40px;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.language-switcher) {
  .ant-select {
    .ant-select-selector {
      border: 1px solid #e8e8e8;
    }
  }
}

.login-btn {
  height: 32px;
  padding: 0 14px;
  border-radius: 16px;
  border: 2px solid #0d334aff;
  color: #0d334aff;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: #fff;

  &:hover {
    background: #0d334aff;
    color: #fff;
    border-color: #0d334aff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(13, 51, 74, 0.2);
  }

  .btn-text {
    display: inline;
  }
}

.register-btn {
  height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0d334aff 0%, #1a4d6b 100%);
  border: none;
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(13, 51, 74, 0.25);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(13, 51, 74, 0.35);
    background: linear-gradient(135deg, #1a4d6b 0%, #0d334aff 100%);
  }

  &:active {
    transform: translateY(0);
  }

  .btn-text {
    display: inline;
  }
}

@media (max-width: 991px) {
  .header {
    padding: 0 30px !important;
  }

  .main-menu {
    margin: 0 20px;
  }

  .header-actions {
    gap: 6px;
  }

  .login-btn,
  .register-btn {
    height: 30px;
    padding: 0 12px;
    font-size: 0.8rem;
  }

  .btn-text {
    display: none;
  }

  .login-btn,
  .register-btn {
    padding: 0 10px;
  }
}

@media (max-width: 767px) {
  .header {
    flex-wrap: wrap;
    padding: 12px 20px !important;
  }

  .logo {
    margin-bottom: 8px;
  }

  .logo img {
    height: 40px;
  }

  .brand-title {
    font-size: 1em;
  }

  .main-menu {
    width: 100%;
    justify-content: center;
    margin: 8px 0;
    order: 3;
  }

  .main-menu :deep(.ant-menu-item) {
    font-size: 14px;
    padding: 0 12px;
  }

  .header-actions {
    order: 2;
    margin-left: auto;
  }

  .login-btn,
  .register-btn {
    height: 28px;
    padding: 0 10px;
  }
}

@media (max-width: 576px) {
  .header {
    padding: 10px 15px !important;
  }

  .logo {
    gap: 8px;
  }

  .logo img {
    height: 36px;
  }

  .brand-title {
    font-size: 0.9em;
  }

  .header-actions {
    gap: 6px;
  }

  .login-btn,
  .register-btn {
    height: 26px;
    padding: 0 8px;
    font-size: 0.75rem;
  }

  .main-menu :deep(.ant-menu-item) {
    font-size: 13px;
    padding: 0 10px;
  }
}
</style>
