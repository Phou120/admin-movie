<template>
     <a-layout style="min-height: 100vh">
        <a-layout-sider
            v-model:collapsed="collapsed"
            :trigger="null"
            collapsible
            style="background: #fff"
        >
          <SidebarComponent/>
        </a-layout-sider>
        <a-layout>
            <NavbarComponent @toggle-sidebar="() => (collapsed = !collapsed)"/>
            <a-layout-content
                :style="{
                    margin: '10px 10px',
                    padding: '24px',
                    background: '#fff',
                    minHeight: '280px',
                }"
            >
              <router-view />
            </a-layout-content>
        </a-layout>
     </a-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import SidebarComponent from '../../components/layouts/Sidebar.vue';
import NavbarComponent from '../../components/layouts/Navbar.vue';

const collapsed = ref<boolean>(false);
</script>

<style lang="scss" scoped>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>