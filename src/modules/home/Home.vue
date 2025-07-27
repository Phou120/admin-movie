<template>
  <a-layout>
    <a-layout-header class="header">
      <div class="logo">
        <img
          src="https://t3.ftcdn.net/jpg/03/13/59/86/360_F_313598658_3TUnxxAvA2v4oDdcAKAYVh15782FcrtW.jpg"
          alt="ApplyOnline Logo"
        />
        <span class="brand-title">ApplyOnline</span>
      </div>
      <a-menu
        mode="horizontal"
        :selectedKeys="[selectedKey]"
        class="main-menu"
        @click="onMenuClick"
      >
        <a-menu-item key="home">Home</a-menu-item>
        <a-menu-item key="about">About</a-menu-item>
        <a-menu-item key="contact">Contact</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px; min-height: 80vh">
      <div class="hero">
        <a-typography-title :level="1"
          >Apply Online Easily & Securely</a-typography-title
        >
        <a-typography-paragraph style="font-size: 18px; color: #555">
          Welcome to the easiest way to apply online. Start your application
          process in just a few clicks!
        </a-typography-paragraph>
        <a-button
          type="primary"
          size="large"
          style="
            margin-top: 24px;
            background: #ffd700;
            color: #000;
            font-weight: bold;
          "
          @click="startApplication"
        >
          Start Application
        </a-button>
      </div>

      <a-typography-title
        :level="2"
        style="text-align: center; margin-bottom: 32px"
      >
        How It Works
      </a-typography-title>
      <a-row :gutter="32" justify="center">
        <a-col
          v-for="(step, idx) in steps"
          :key="idx"
          :xs="24"
          :sm="12"
          :md="8"
          style="margin-bottom: 24px"
        >
          <a-card hoverable class="step-card">
            <component
              :is="step.icon"
              style="font-size: 32px; color: #ffd700"
            />
            <a-typography-title :level="4" style="margin-top: 16px">
              {{ step.title }}
            </a-typography-title>
            <a-typography-paragraph>
              {{ step.description }}
            </a-typography-paragraph>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      ApplyOnline &copy; {{ new Date().getFullYear() }} | All rights reserved.
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref } from "vue";
import {
  FileAddOutlined,
  SolutionOutlined,
  SmileOutlined,
} from "@ant-design/icons-vue";

// Menu selection state
const selectedKey = ref("home");
const onMenuClick = (e) => {
  selectedKey.value = e.key;
  // If using vue-router, add navigation here, e.g.
  // if (e.key === "about") router.push("/about");
};

const steps = [
  {
    title: "Fill Application",
    icon: FileAddOutlined,
    description: "Complete your application form online in a few easy steps.",
  },
  {
    title: "Review & Submit",
    icon: SolutionOutlined,
    description: "Check your details and submit your application securely.",
  },
  {
    title: "Track Status",
    icon: SmileOutlined,
    description:
      "Get real-time updates and notifications on your application status.",
  },
];

function startApplication() {
  // Add logic for starting application or navigation
  // Example: router.push('/apply');
  alert("Start Application clicked!");
}
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 40px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo img {
  height: 48px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.14);
}
.hero {
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #fffbe6 0%, #fff 50%, #fffbe6 100%);
  padding: 60px 0 40px 0;
  text-align: center;
  margin-bottom: 40px;
  /* border-radius: 16px; */
  /* box-shadow: 0 8px 32px 0 rgba(255, 215, 0, 0.13); */
}
.step-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(255, 215, 0, 0.18);
  transition: transform 0.2s;
  text-align: center;
}
.step-card:hover {
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 12px 32px rgba(255, 215, 0, 0.33);
}
</style>
