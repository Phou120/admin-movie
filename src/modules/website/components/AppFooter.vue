<template>
  <a-layout-footer class="footer">
    <div class="footer-content">
      <a-typography-text class="footer-text">
        SAVA MOVIE &copy; {{ new Date().getFullYear() }} | {{ t('website.allRightsReserved') }}
      </a-typography-text>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #0d334aff 0%, #1a5380 100%);
  padding: 32px 50px;
  margin-top: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.footer-text {
  color: #fff;
  font-size: 0.95rem;
}

@media (max-width: 576px) {
  .footer {
    padding: 24px 20px;
  }

  .footer-text {
    font-size: 0.85rem;
  }
}
</style>
