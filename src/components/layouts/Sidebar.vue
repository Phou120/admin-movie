<template>
  <div class="logo">
    <img src="../../assets/images/logo.png" />
  </div>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    class="sidebar-menu"
    mode="inline"
  >
    <!-- Dashboard -->
    <a-menu-item key="1" @click="handlerMenu('bashBoard')">
      <DashboardOutlined />
      <span>Dashboard</span>
    </a-menu-item>

    <!-- Banner -->
    <a-menu-item key="2" @click="handlerMenu('banner')">
      <PictureOutlined />
      <span>Banner</span>
    </a-menu-item>

    <!-- Category -->
    <a-menu-item key="3" @click="handlerMenu('category')">
      <AppstoreOutlined />
      <span>Category</span>
    </a-menu-item>

    <!-- Tag -->
    <a-menu-item key="4" @click="handlerMenu('tag')">
      <TagsOutlined />
      <span>Tag</span>
    </a-menu-item>

    <!-- Tax -->
    <a-menu-item key="5" @click="handlerMenu('tax')">
      <CalculatorOutlined />
      <span>Tax</span>
    </a-menu-item>

    <a-menu-item key="6" @click="handlerMenu('package')">
      <ShoppingOutlined />
      <span>Package</span>
    </a-menu-item>

    <!-- Financial Submenu -->
    <a-sub-menu key="sub2">
      <template #title>
        <span>
          <BankOutlined />
          <span>Financial</span>
        </span>
      </template>
      <a-menu-item key="7" @click="handlerMenu('bank')">
        <BankOutlined />
        Bank
      </a-menu-item>
      <a-menu-item key="8" @click="handlerMenu('currency')">
        <DollarOutlined />
        Currency
      </a-menu-item>
      <a-menu-item key="9" @click="handlerMenu('exchange-rate')">
        <SwapOutlined />
        Exchange Rate
      </a-menu-item>
    </a-sub-menu>

    <!-- System Submenu -->
    <a-sub-menu key="sub3">
      <template #title>
        <span>
          <SettingOutlined />
          <span>System</span>
        </span>
      </template>
      <a-menu-item key="10" @click="handlerMenu('permission')">
        <SafetyOutlined />
        Permission
      </a-menu-item>
      <a-menu-item key="11" @click="handlerMenu('role')">
        <CrownOutlined />
        Role
      </a-menu-item>
      <a-menu-item key="12" @click="handlerMenu('user')">
        <UserOutlined />
        User
      </a-menu-item>
    </a-sub-menu>
    <a-menu-item key="13" @click="handlerMenu('profile')">
      <SolutionOutlined />
      <span>Profile</span>
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  UserOutlined,
  AppstoreOutlined,
  CrownOutlined,
  DashboardOutlined,
  PictureOutlined,
  TagsOutlined,
  CalculatorOutlined,
  BankOutlined,
  DollarOutlined,
  SwapOutlined,
  SettingOutlined,
  SafetyOutlined,
  ShoppingOutlined,
  SolutionOutlined,
} from "@ant-design/icons-vue";

const selectedKeys = ref<string[]>([]);

// call to use router
const router = useRouter();

// handle menu
const handlerMenu = (key: string) => {
  router.push({ name: key });
};
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8125rem 0.5rem 0.8125rem 1rem;
  width: 100%;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  img {
    width: 4rem;
    height: 4rem;
    margin-right: 0.8rem;
    margin-left: 0.25rem;
    object-fit: contain;
    border-radius: 5px;
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
    background-color: rgba(11, 46, 69, 0.1);
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
