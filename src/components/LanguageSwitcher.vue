<template>
  <a-select
    v-model:value="currentLocale"
    style="width: 120px"
    @change="changeLanguage"
    :bordered="false"
    size="large"
  >
    <a-select-option value="en">
      <span class="language-option"> 🇬🇧 English </span>
    </a-select-option>
    <a-select-option value="lo">
      <span class="language-option"> 🇱🇦 ລາວ </span>
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const currentLocale = ref("en");

const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem("locale", lang);
  // Update document direction if needed (Lao uses LTR, same as English)
  document.documentElement.lang = lang;
};

// Initialize with current locale
onMounted(() => {
  currentLocale.value = locale.value;
  document.documentElement.lang = locale.value;
});
</script>

<style lang="scss" scoped>
.language-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.ant-select-selector) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-select-selector:focus),
:deep(.ant-select-selector:active),
:deep(.ant-select-open .ant-select-selector) {
  border: none !important;
  box-shadow: none !important;
}
</style>
