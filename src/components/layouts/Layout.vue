<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      :collapsed="collapsed"
      :trigger="null"
      collapsible
      :width="220"
      :collapsed-width="80"
      style="background: #fff"
    >
      <SidebarComponent :collapsed="collapsed" />
    </a-layout-sider>
    <a-layout>
      <NavbarComponent
        :collapsed="collapsed"
        @toggle-sidebar="() => (collapsed = !collapsed)"
      />
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
import { onMounted, onUnmounted, ref } from "vue";
import SidebarComponent from "../../components/layouts/Sidebar.vue";
import NavbarComponent from "../../components/layouts/Navbar.vue";
import {
  useSocketNotification,
  type PaymentNotificationPayload,
} from "../../common/composables/useSocketNotification";

const collapsed = ref<boolean>(false);

const { connect, disconnect, onPaymentNotification } = useSocketNotification();

onMounted(() => {
  // Connect to WebSocket
  connect();

  // Listen for payment notifications from backend
  const cleanup = onPaymentNotification(
    (payload: PaymentNotificationPayload) => {
      console.log("Payment notification received:", payload);
    },
  );

  // Store cleanup for onUnmounted
  onUnmounted(() => {
    cleanup();
  });
});

onUnmounted(() => {
  disconnect();
});
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
