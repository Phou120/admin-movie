# Website Components

This directory contains shared components for the website module.

## Components

### AppHeader.vue
Global header component for the website. Includes:
- Logo and brand title
- Navigation menu (Home, About Us, Contact)
- Language switcher
- Sign In and Register buttons

### AppFooter.vue
Global footer component for the website. Includes:
- Copyright text with i18n support
- Responsive design

### WebsiteLayout.vue
Main layout wrapper that includes:
- AppHeader component
- Content slot for page content
- AppFooter component

## Usage

```vue
<template>
  <WebsiteLayout>
    <!-- Your page content here -->
  </WebsiteLayout>
</template>

<script setup lang="ts">
import WebsiteLayout from "../components/WebsiteLayout.vue";
</script>
```

## Pages Using This Layout

- Home page (`/website/home/Home.vue`)
- About Us page (`/website/about-us/AboutUs.vue`)
- Contact page (`/website/contact/Contact.vue`)
