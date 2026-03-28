<template>
  <div>
    <!-- Show CustomerDashboard for creators -->
    <CustomerDashboard v-if="isCreator" />

    <!-- Show regular Dashboard only for super-admin -->
    <DashBoard v-else-if="isSuperAdmin" />

    <!-- No dashboard for other roles (admin, member, customer, etc.) -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import DashBoard from "./DashBoard.vue";
import CustomerDashboard from "./CustomerDashboard.vue";

// Parse user roles from localStorage
const getUserRoles = (): string[] => {
  const userRolesString = localStorage.getItem("user_roles");

  if (!userRolesString) {
    return [];
  }

  // Parse user_roles - it could be a JSON string or comma-separated string
  try {
    // Try to parse as JSON
    return JSON.parse(userRolesString);
  } catch {
    // If not JSON, split by comma
    return userRolesString.split(",").map((role) => role.trim());
  }
};

// Check if user has super-admin role
const isSuperAdmin = computed(() => {
  const roles = getUserRoles();
  return roles.includes("super-admin");
});

// Check if user has creator role
const isCreator = computed(() => {
  const roles = getUserRoles();
  return roles.includes("creator");
});

onMounted(() => {
  console.log("User Roles:", localStorage.getItem("user_roles"));
  console.log("Is Super Admin:", isSuperAdmin.value);
  console.log("Is Creator:", isCreator.value);
});
</script>

<style scoped>
/* Wrapper styles if needed */
</style>
