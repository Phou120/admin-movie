<template>
  <div class="logo">
    <!-- <img
      src="https://t3.ftcdn.net/jpg/03/13/59/86/360_F_313598658_3TUnxxAvA2v4oDdcAKAYVh15782FcrtW.jpg"
    /> -->
    <img src="https://pngimg.com/d/batman_PNG41.png" />
  </div>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    class="sidebar-menu"
    mode="inline"
  >
    <!-- menu customer -->
    <a-menu-item key="1" @click="handlerMenu('bashBoard')">
      <DashboardOutlined />
      <span>Dashboard</span>
    </a-menu-item>
    <a-menu-item key="2" @click="handlerMenu('customer')">
      <user-outlined />
      <span>Customer</span>
    </a-menu-item>
    <a-menu-item key="3" @click="handlerMenu('course-category')">
      <AppstoreOutlined />
      <span>Category</span>
    </a-menu-item>
    <a-menu-item key="4" @click="handlerMenu('course')">
      <user-outlined />
      <span>Course</span>
    </a-menu-item>
    <a-menu-item key="5" @click="handlerMenu('student')">
      <user-outlined />
      <span>Teacher</span>
    </a-menu-item>
    <a-menu-item key="6">
      <BookOutlined />
      <span>Student Education</span>
    </a-menu-item>
    <a-sub-menu key="sub2">
      <template #title>
        <span>
          <team-outlined />
          <span>Team</span>
        </span>
      </template>
      <a-menu-item key="6">Team 1</a-menu-item>
      <a-menu-item key="8">Team 2</a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  UserOutlined,
  BookOutlined,
  AppstoreOutlined,
  TeamOutlined,
  DashboardOutlined,
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
    color: #000 !important; // gold text
    font-size: 16px;

    svg {
      color: #000 !important; // black icon
      font-size: 16px;
    }
  }

  ::v-deep(.ant-menu-item-selected) {
    background-color: rgba(0, 0, 0, 0.05);
    color: #ffd700 !important;

    svg {
      color: #000 !important;
    }
  }

  ::v-deep(.ant-menu-item:hover),
  ::v-deep(.ant-menu-submenu-title:hover) {
    color: #ffd700 !important;

    svg {
      color: #ffd700 !important;
    }
  }
}
</style>
