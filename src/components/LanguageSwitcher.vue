<template>
  <a-dropdown :trigger="['click']" placement="bottomRight">
    <a-button class="lang-button">
      <GlobalOutlined class="lang-icon" />
      <span class="lang-text">{{ currentLangLabel }}</span>
      <DownOutlined class="dropdown-icon" />
    </a-button>
    <template #overlay>
      <a-menu class="lang-menu" @click="onMenuClick">
        <a-menu-item key="en" :class="{ active: currentLocale === 'en' }">
          <span class="fi fi-gb"></span>
          <span class="lang-name"> ອັງກິດ</span>
        </a-menu-item>
        <a-menu-item key="lo" :class="{ active: currentLocale === 'lo' }">
          <span class="fi fi-la"></span>
          <span class="lang-name"> ລາວ</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { GlobalOutlined, DownOutlined } from "@ant-design/icons-vue";

const { locale } = useI18n();

// Initialize from localStorage first, then fall back to i18n locale
const savedLocale = localStorage.getItem("locale") || locale.value;
const currentLocale = ref(savedLocale);

const currentLangLabel = computed(() => {
  return currentLocale.value === "en" ? "EN" : "LA";
});

const changeLanguage = (lang: string) => {
  locale.value = lang;
  currentLocale.value = lang;
  localStorage.setItem("locale", lang);
  document.documentElement.lang = lang;
};

const onMenuClick = ({ key }: { key: string }) => {
  changeLanguage(key);
};

// Initialize with current locale
onMounted(() => {
  // Sync i18n locale with localStorage on mount
  if (currentLocale.value !== locale.value) {
    locale.value = currentLocale.value;
  }
  document.documentElement.lang = currentLocale.value;
});
</script>

<style lang="scss" scoped>
.lang-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 16px;
  border: 2px solid #0d334aff;
  background: #fff;
  color: #0d334aff;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0d334aff;
    color: #fff;
    border-color: #0d334aff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(13, 51, 74, 0.2);
  }

  .lang-icon {
    font-size: 14px;
  }

  .lang-text {
    font-weight: 700;
    font-size: 0.85rem;
  }

  .dropdown-icon {
    font-size: 10px;
    transition: transform 0.3s ease;
  }
}

.lang-menu {
  min-width: 130px;
  border-radius: 10px;
  padding: 6px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  :deep(.ant-menu-item) {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 6px;
    margin: 3px 0;
    transition: all 0.2s ease;

    &:hover {
      background: #f0f2f5;
    }

    &.active {
      background: linear-gradient(135deg, #0d334aff 0%, #1a4d6b 100%);
      color: #fff;

      .lang-name {
        font-weight: 600;
      }
    }
  }

  .fi {
    font-size: 18px;
  }

  .lang-name {
    font-size: 13px;
    font-weight: 500;
  }
}

@media (max-width: 767px) {
  .lang-button {
    height: 30px;
    padding: 0 10px;
    font-size: 0.8rem;

    .lang-icon {
      font-size: 13px;
    }

    .lang-text {
      display: inline;
    }

    .dropdown-icon {
      font-size: 9px;
    }
  }
}
</style>
