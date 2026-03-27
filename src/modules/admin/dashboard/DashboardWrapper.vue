<template>
  <div>
    <!-- Show CustomerDashboard for creators -->
    <CustomerDashboard v-if="isCreator" />

    <!-- Show regular Dashboard for other roles -->
    <DashBoard v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import DashBoard from "./DashBoard.vue";
import CustomerDashboard from "./CustomerDashboard.vue";

const router = useRouter();

// Check if user has creator role
const isCreator = computed(() => {
  const userRolesString = localStorage.getItem("user_roles");

  if (!userRolesString) {
    return false;
  }

  // Parse user_roles - it could be a JSON string or comma-separated string
  let userRoles: string[] = [];

  try {
    // Try to parse as JSON
    userRoles = JSON.parse(userRolesString);
  } catch {
    // If not JSON, split by comma
    userRoles = userRolesString.split(",").map((role) => role.trim());
  }

  // Check if user has "creator" role
  return userRoles.includes("creator");
});

onMounted(() => {
  console.log("User Roles:", localStorage.getItem("user_roles"));
  console.log("Is Creator:", isCreator.value);
});
</script>

<style scoped>
/* Wrapper styles if needed */
</style>
