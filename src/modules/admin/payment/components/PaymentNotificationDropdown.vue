<template>
  <!-- Notification Bell Button -->
  <a-dropdown
    :trigger="['click']"
    placement="bottomRight"
    :open="dropdownVisible"
    @update:open="dropdownVisible = $event"
    :overlay-class-name="'payment-notification-dropdown'"
  >
    <a-badge :count="unreadCount" :offset="[-5, 5]">
      <a-avatar shape="square" size="large" class="notification-bell-btn">
        <BellOutlined />
      </a-avatar>
    </a-badge>

    <template #overlay>
      <div class="notification-panel">
        <!-- Header with Modern Gradient -->
        <div class="notification-header">
          <div class="header-content">
            <div class="header-left">
              <div class="header-icon-wrapper">
                <div class="header-icon">
                  <BellOutlined />
                </div>
                <div class="icon-glow"></div>
              </div>
              <div class="header-text">
                <h3>{{ t("modules.payment.notifications.title") }}</h3>
                <span class="unread-badge" v-if="unreadCount > 0">
                  {{ unreadCount }}
                  {{
                    unreadCount === 1
                      ? t("modules.payment.notifications.notification")
                      : t("modules.payment.notifications.notifications")
                  }}
                </span>
              </div>
            </div>
            <div class="header-actions">
              <a-button
                v-if="unreadCount > 0"
                type="text"
                size="small"
                class="action-btn"
                @click="markAllAsRead"
              >
                <CheckOutlined />
                {{ t("modules.payment.notifications.markAllRead") }}
              </a-button>
            </div>
          </div>
        </div>

        <!-- Empty State / Content Area -->
        <div class="notification-content">
          <div v-if="unreadCount === 0" class="empty-state">
            <div class="empty-icon-wrapper">
              <div class="empty-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 8V12L15 15"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                </svg>
              </div>
              <div class="empty-icon-bg"></div>
            </div>
            <h4>{{ t("modules.payment.notifications.allCaughtUp") }}</h4>
            <p>
              {{ t("modules.payment.notifications.noPaymentNotifications") }}
            </p>
          </div>
          <div v-else class="notification-list">
            <div
              v-for="notification in recentNotifications"
              :key="notification.paymentId"
              class="notification-item"
              @click="viewMemberPayments(notification)"
            >
              <div class="notification-item-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    fill="currentColor"
                    fill-opacity="0.8"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="notification-item-content">
                <div class="notification-item-title">
                  {{ notification.title }}
                </div>
                <div class="notification-item-meta">
                  {{ t("modules.payment.notifications.paymentId") }}:
                  {{ notification.paymentId }}
                </div>
              </div>
              <div class="notification-item-arrow">
                <RightOutlined />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer with Gradient Button -->
        <div class="notification-footer">
          <a-button
            type="primary"
            block
            size="large"
            @click="goToPaymentPage"
            class="view-all-btn"
          >
            <UnorderedListOutlined />
            {{ t("modules.payment.notifications.viewAllPayments") }}
            <RightOutlined class="btn-arrow" />
          </a-button>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  BellOutlined,
  CheckOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons-vue";
import {
  useSocketNotification,
  type PaymentNotificationPayload,
} from "../../../../common/composables/useSocketNotification";

const { t } = useI18n();
const router = useRouter();

const {
  unreadCount,
  recentNotifications,
  markAllAsRead: markAllNotificationsAsRead,
  markAsRead,
} = useSocketNotification();

const dropdownVisible = ref(false);

// Mark all as read
const markAllAsRead = () => {
  markAllNotificationsAsRead();
};

// Go to payment page
const goToPaymentPage = () => {
  dropdownVisible.value = false;
  router.push({ name: "payment" });
};

// Navigate to member payment page and mark notification as read
const viewMemberPayments = (notification: PaymentNotificationPayload) => {
  markAsRead(notification.paymentId);
  dropdownVisible.value = false;
  router.push(`/member/${notification.paymentId}/payments`);
};
</script>

<style lang="scss">
// ==================== Notification Bell Button ====================
.notification-bell-btn {
  background-color: #0d334aff;
  color: rgb(255, 255, 255);
  width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 50% !important;
  padding-right: 0;
  padding-left: 0;
  text-align: center !important;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover {
    cursor: pointer;
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  .anticon {
    font-size: 18px;
    animation: bellRing 2s ease-in-out infinite;
  }
}

@keyframes bellRing {
  0%,
  90%,
  100% {
    transform: rotate(0deg);
  }
  92%,
  98% {
    transform: rotate(15deg);
  }
  94%,
  96% {
    transform: rotate(-15deg);
  }
}

// ==================== Badge ====================
:deep(.ant-badge-count) {
  background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.4);
  font-weight: 600;
  border: 2px solid #fff;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

// ==================== Dropdown Panel ====================
.ant-dropdown.payment-notification-dropdown {
  .ant-dropdown-menu {
    padding: 0;
    background: transparent;
    box-shadow: none;
  }

  .notification-panel {
    width: 460px;
    max-height: 580px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.15),
      0 8px 24px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    animation: panelSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes panelSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
}

// ==================== Header ====================
.notification-header {
  background: linear-gradient(135deg, #1a4d6f 0%, #0d334a 100%);
  padding: 24px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    border-radius: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 150px;
    height: 150px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 70%
    );
    border-radius: 50%;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-icon-wrapper {
    position: relative;
    width: 52px;
    height: 52px;

    .header-icon {
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      position: relative;
      z-index: 2;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .icon-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.3) 0%,
        transparent 70%
      );
      border-radius: 50%;
      z-index: 1;
      animation: glowPulse 3s ease-in-out infinite;
    }
  }

  @keyframes glowPulse {
    0%,
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.5;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.8;
    }
  }

  .header-text {
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.2;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .unread-badge {
      display: inline-block;
      margin-top: 6px;
      font-size: 13px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .header-actions {
    .action-btn {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      height: auto;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 6px;

      &:hover {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .anticon {
        font-size: 14px;
      }
    }
  }
}

// ==================== Content Area ====================
.notification-content {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #1a4d6f 0%, #0d334a 100%);
    border-radius: 3px;
  }
}

.empty-state {
  padding: 48px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .empty-icon-wrapper {
    position: relative;
    margin-bottom: 24px;

    .empty-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
      animation: floatIcon 3s ease-in-out infinite;
    }

    @keyframes floatIcon {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    .empty-icon-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      background: radial-gradient(
        circle,
        rgba(102, 126, 234, 0.1) 0%,
        transparent 70%
      );
      border-radius: 50%;
      z-index: 1;
    }
  }

  h4 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 700;
    color: #1a1a2e;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #8b8b9e;
  }
}

.notification-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.05) 0%,
      rgba(118, 75, 162, 0.05) 100%
    );
    border-color: rgba(102, 126, 234, 0.2);
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: translateX(2px);
  }

  .notification-item-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #1a4d6f 0%, #0d334a 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .notification-item-content {
    flex: 1;
    min-width: 0;

    .notification-item-title {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .notification-item-meta {
      font-size: 12px;
      color: #8b8b9e;
    }
  }

  .notification-item-arrow {
    color: #1a4d6f;
    font-size: 12px;
    flex-shrink: 0;
  }
}

// ==================== Footer ====================
.notification-footer {
  padding: 20px;
  background: #ffffff;
  border-top: 1px solid #f0f0f0;

  .view-all-btn {
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #1a4d6f 0%, #0d334a 100%);
    color: white;
    border: none;
    font-weight: 600;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.6s;
    }

    &:hover {
      background: linear-gradient(135deg, #1a4d6f 0%, #0d334a 100%);
      transform: translateY(-2px);

      &::before {
        left: 100%;
      }

      .btn-arrow {
        transform: translateX(4px);
      }
    }

    &:active {
      transform: translateY(0);
    }

    .anticon {
      font-size: 16px;
    }

    .btn-arrow {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
}

// ==================== Responsive Design ====================
@media (max-width: 768px) {
  .ant-dropdown.payment-notification-dropdown {
    .notification-panel {
      width: 360px;
      max-height: 500px;
    }
  }

  .notification-header {
    padding: 20px 16px;

    .header-left {
      gap: 12px;
    }

    .header-icon-wrapper {
      width: 44px;
      height: 44px;

      .header-icon {
        font-size: 18px;
      }
    }

    .header-text h3 {
      font-size: 16px;
    }
  }

  .notification-summary {
    padding: 24px;
    flex-direction: column;
    text-align: center;
  }

  .notification-footer {
    padding: 16px;
  }
}
</style>
