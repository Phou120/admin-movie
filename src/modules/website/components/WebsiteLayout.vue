<template>
  <a-layout class="website-layout">
    <AppHeader />
    <a-layout-content class="website-content">
      <slot />
    </a-layout-content>
    <AppFooter />
  </a-layout>
</template>

<script setup lang="ts">
import AppHeader from "./AppHeader.vue";
import AppFooter from "./AppFooter.vue";
</script>

<style scoped>
.website-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.website-content {
  flex: 1;
  padding: 0;
}
</style>
