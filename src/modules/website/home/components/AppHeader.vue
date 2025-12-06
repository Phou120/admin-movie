z
<template>
  <a-layout-header class="header">
    <div class="logo">
      <img src="../../../../assets/images/logo.png" alt="ApplyOnline Logo" />
      <span class="brand-title">SAVA MOVIE</span>
    </div>

    <a-menu
      mode="horizontal"
      :selectedKeys="[currentPage]"
      class="main-menu"
      @click="onMenuClick"
    >
      <a-menu-item key="home">Home</a-menu-item>
      <a-menu-item key="about">About</a-menu-item>
      <a-menu-item key="contact">Contact</a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// Compute current page from route name
const currentPage = computed(() => {
  return (route.name as string) || "home";
});

const onMenuClick = (e: any) => {
  if (e.key === "home") {
    router.push({ name: "home" });
  } else if (e.key === "about") {
    router.push({ name: "about" });
  } else if (e.key === "contact") {
    router.push({ name: "contact" });
  }
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
  justify-content: right;
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

@media (max-width: 576px) {
  .header {
    height: auto;
    padding: 5px 15px !important;
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
