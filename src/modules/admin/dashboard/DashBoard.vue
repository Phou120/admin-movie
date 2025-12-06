<script setup>
import { ref, onMounted, computed } from "vue";
import { Row, Col, Card, Statistic } from "ant-design-vue";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  ReadOutlined,
  SolutionOutlined,
} from "@ant-design/icons-vue";

// Define reactive totals
const totalUsers = ref(0);
const totalRoles = ref(0);
const totalCourses = ref(0);
const totalStudents = ref(0);
const totalTeachers = ref(0);

// Computed list of cards with current ref values
const cards = computed(() => [
  {
    title: "Total Users",
    value: totalUsers.value,
    icon: UserOutlined,
    color: "#1890ff",
  },
  {
    title: "Total Roles",
    value: totalRoles.value,
    icon: TeamOutlined,
    color: "#52c41a",
  },
  {
    title: "Total Courses",
    value: totalCourses.value,
    icon: BookOutlined,
    color: "#faad14",
  },
  {
    title: "Total Students",
    value: totalStudents.value,
    icon: ReadOutlined,
    color: "#eb2f96",
  },
  {
    title: "Total Teachers",
    value: totalTeachers.value,
    icon: SolutionOutlined,
    color: "#722ed1",
  },
]);

// Simulate fetching from API
const fetchDashboardStats = async () => {
  // Replace with real API calls here
  totalUsers.value = 120;
  totalRoles.value = 5;
  totalCourses.value = 18;
  totalStudents.value = 90;
  totalTeachers.value = 12;
};

onMounted(fetchDashboardStats);
</script>

<template>
  <div class="dashboard">
    <h1 class="title">📊 Dashboard</h1>

    <a-row gutter="16">
      <a-col
        v-for="card in cards"
        :key="card.title"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        class="mb-4"
      >
        <a-card hoverable class="card">
          <template #title>
            <component
              :is="card.icon"
              :style="{
                color: card.color,
                fontSize: '24px',
                marginRight: '8px',
              }"
            />
            {{ card.title }}
          </template>
          <a-statistic :value="card.value" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}

.card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: all 0.5s;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
