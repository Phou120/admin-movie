<template>
  <div class="status-badge-wrapper">
    <!-- Animated Status List Menu -->
    <transition
      name="menu-expand"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div
        v-if="popoverVisible"
        class="status-animated-menu"
        :class="{ 'is-visible': popoverVisible }"
      >
        <!-- Backdrop overlay -->
        <div
          class="menu-backdrop"
          @click="closeMenu"
        ></div>

        <!-- Menu container -->
        <div class="menu-container">
          <!-- Menu header -->
          <div class="menu-header">
            <span class="menu-title">{{ t('modules.customer.changeStatus') }}</span>
            <div class="menu-close" @click="closeMenu">
              <CloseOutlined />
            </div>
          </div>

          <!-- Status items -->
          <div class="menu-items">
            <div
              v-for="(option, index) in statusOptions"
              :key="option.value"
              class="menu-item"
              :class="[
                `menu-item-${option.value}`,
                { 'is-selected': status === option.value }
              ]"
              :style="{
                'animation-delay': `${index * 80}ms`,
                '--item-index': index
              }"
              @click="handleStatusSelect(option.value)"
            >
              <div class="item-background"></div>
              <div class="item-content">
                <div class="item-icon-wrapper">
                  <component :is="option.icon" class="item-icon" />
                  <div class="icon-glow"></div>
                </div>
                <div class="item-text">
                  <div class="item-label">{{ getStatusLabel(option.value) }}</div>
                  <div class="item-description">{{ getStatusDescription(option.value) }}</div>
                </div>
                <div class="item-check">
                  <CheckOutlined v-if="status === option.value" class="check-icon" />
                </div>
              </div>
              <div class="item-shine"></div>
            </div>
          </div>

          <!-- Menu footer -->
          <div class="menu-footer">
            <span class="footer-hint">{{ t('modules.customer.selectHint') }}</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Badge button -->
    <div
      v-if="!status"
      class="status-button status-empty"
      :class="[
        { 'is-loading': isLoading },
        { 'is-open': popoverVisible }
      ]"
      @click="toggleMenu"
      @keydown="handleKeydown"
    >
      <div class="button-background"></div>
      <div class="button-content">
        <span v-if="!isLoading" class="button-text">{{
          t('modules.customer.pleaseSelectStatus')
        }}</span>
        <span v-else class="button-text loading">{{
          t('common.updating')
        }}</span>
        <LoadingOutlined v-if="isLoading" class="loading-icon" />
        <DownOutlined v-else class="dropdown-arrow" :class="{ 'is-rotated': popoverVisible }" />
      </div>
    </div>

    <div
      v-else
      class="status-button"
      :class="[
        `status-${status}`,
        { 'is-loading': isLoading },
        { 'is-open': popoverVisible }
      ]"
      @click="toggleMenu"
      @keydown="handleKeydown"
    >
      <div class="button-background"></div>
      <div class="button-content">
        <span v-if="!isLoading" class="status-dot"></span>
        <component :is="statusIcon" v-if="!isLoading" class="status-icon-inline" />
        <span v-if="!isLoading" class="button-text">{{
          getStatusLabel(status)
        }}</span>
        <span v-else class="button-text loading">{{
          t('common.updating')
        }}</span>
        <LoadingOutlined v-if="isLoading" class="loading-icon" />
        <DownOutlined v-else class="dropdown-arrow" :class="{ 'is-rotated': popoverVisible }" />
      </div>
      <div class="button-glow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * CustomerStatusBadge.vue - ADVANCED ANIMATED VERSION
 *
 * Premium badge component with animated outward status list.
 * Features particle effects, 3D transforms, and smooth transitions.
 *
 * @component
 */
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  DownOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons-vue';

// Props interface
interface Props {
  /** Current customer status */
  status: 'pending' | 'approved' | 'blacklisted' | null | undefined;
  /** Customer ID for API calls */
  customerId: number;
  /** Loading state from parent API call */
  loading?: boolean;
  /** Disable interaction */
  disabled?: boolean;
}

// Emits interface
interface Emits {
  /** Emitted when user selects new status */
  (event: 'change', customerId: number, newStatus: string): void;
  /** Emitted when popover opens/closes */
  (event: 'toggle', isOpen: boolean): void;
}

// Define props and emits
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
});

const emit = defineEmits<Emits>();

// Composables
const { t } = useI18n();

// State
const popoverVisible = ref(false);
const isUpdating = ref(false);

// Status options with icons
const statusOptions = computed(() => [
  {
    value: 'pending',
    icon: WarningOutlined,
    label: getStatusLabel('pending'),
    description: getStatusDescription('pending'),
    color: '#faad14',
    gradient: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
  },
  {
    value: 'approved',
    icon: CheckCircleOutlined,
    label: getStatusLabel('approved'),
    description: getStatusDescription('approved'),
    color: '#52c41a',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
  },
  {
    value: 'blacklisted',
    icon: CloseCircleOutlined,
    label: getStatusLabel('blacklisted'),
    description: getStatusDescription('blacklisted'),
    color: '#ff4d4f',
    gradient: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
  },
]);

// Computed
const isLoading = computed(() => props.loading || isUpdating.value);

const statusIcon = computed(() => {
  if (!props.status) return WarningOutlined;

  switch (props.status) {
    case 'pending':
      return WarningOutlined;
    case 'approved':
      return CheckCircleOutlined;
    case 'blacklisted':
      return CloseCircleOutlined;
    default:
      return WarningOutlined;
  }
});

// Methods
const getStatusLabel = (statusValue: string) => {
  return t(`status.${statusValue}`, statusValue.toUpperCase());
};

const getStatusDescription = (statusValue: string) => {
  return t(`status.${statusValue}Description`, '');
};

const toggleMenu = () => {
  if (!props.disabled && !isLoading.value) {
    popoverVisible.value = !popoverVisible.value;
  }
};

const closeMenu = () => {
  popoverVisible.value = false;
};

const handleStatusSelect = (newStatus: string) => {
  if (isLoading.value || props.disabled) return;
  closeMenu();
  emit('change', props.customerId, newStatus);
};

const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      toggleMenu();
      break;
    case 'Escape':
      if (popoverVisible.value) {
        closeMenu();
      }
      break;
  }
};

// Transition hooks for advanced animations
const onBeforeEnter = (el: Element) => {
  (el as HTMLElement).style.opacity = '0';
  (el as HTMLElement).style.transform = 'scale(0.8) translateY(-20px)';
};

const onEnter = (el: Element, done: () => void) => {
  const element = el as HTMLElement;
  element.offsetHeight; // Trigger reflow

  element.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  element.style.opacity = '1';
  element.style.transform = 'scale(1) translateY(0)';

  setTimeout(done, 400);
};

const onLeave = (el: Element, done: () => void) => {
  const element = el as HTMLElement;
  element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 1, 1)';
  element.style.opacity = '0';
  element.style.transform = 'scale(0.9) translateY(-10px)';

  setTimeout(done, 300);
};

// Watch for external loading state changes
watch(
  () => props.loading,
  (newLoading) => {
    if (!newLoading) {
      isUpdating.value = false;
    }
  }
);
</script>

<style scoped lang="scss">
.status-badge-wrapper {
  position: relative;
  display: inline-block;
  z-index: 100;
}

// ========== BUTTON STYLES ==========
.status-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;

  &:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);

    .button-glow {
      opacity: 1;
      transform: scale(1.2);
    }

    .dropdown-arrow {
      transform: rotate(180deg) scale(1.1);
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &.is-loading {
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;
    animation: pulse-button 1.5s ease-in-out infinite;
  }

  &.is-open {
    .dropdown-arrow {
      transform: rotate(180deg);
    }
  }
}

.button-background {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  z-index: 0;
}

.button-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.button-glow {
  position: absolute;
  inset: -4px;
  border-radius: 24px;
  background: inherit;
  filter: blur(12px);
  opacity: 0;
  transition: all 0.4s ease;
  z-index: -1;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.status-icon-inline {
  font-size: 16px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.button-text {
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: 0.3px;

  &.loading {
    animation: text-shimmer 1.5s ease-in-out infinite;
    background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.6) 50%, #ffffff 100%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.loading-icon {
  font-size: 14px;
  animation: spin 1s linear infinite;
}

.dropdown-arrow {
  font-size: 11px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

// ========== STATUS COLORS ==========
.status-pending .button-background {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
  box-shadow: 0 4px 15px rgba(250, 173, 20, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.status-approved .button-background {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  box-shadow: 0 4px 15px rgba(82, 196, 26, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.status-blacklisted .button-background {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  box-shadow: 0 4px 15px rgba(255, 77, 79, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.status-empty .button-background {
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  border: 2px dashed #bfbfbf;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

// ========== ANIMATED MENU ==========
.status-animated-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  z-index: 1000;
  min-width: 320px;
  transform-origin: top center;
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: -1;
}

.menu-container {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: menu-appear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 16px;
    height: 16px;
    background: #ffffff;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  }
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
}

.menu-title {
  font-size: 14px;
  font-weight: 700;
  color: #000000d9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #8c8c8c;

  &:hover {
    background: #f5f5f5;
    color: #ff4d4f;
    transform: rotate(90deg);
  }
}

.menu-items {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  position: relative;
  padding: 16px;
  border-radius: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: item-appear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  transform-style: preserve-3d;

  .item-background {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: all 0.4s ease;
    background: linear-gradient(135deg, rgba(24, 144, 255, 0.1), rgba(24, 144, 255, 0.05));
  }

  &:hover {
    transform: translateX(8px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);

    .item-background {
      opacity: 1;
    }

    .item-icon-wrapper {
      transform: scale(1.15) rotate(5deg);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .icon-glow {
      opacity: 1;
      transform: scale(1.5);
    }

    .item-shine {
      transform: translateX(100%);
    }
  }

  &.is-selected {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    box-shadow: 0 4px 15px rgba(24, 144, 255, 0.2);

    .item-icon-wrapper {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    }

    .check-icon {
      animation: check-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }

  &.menu-item-pending .item-icon-wrapper {
    background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
    color: #faad14;
  }

  &.menu-item-approved .item-icon-wrapper {
    background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
    color: #52c41a;
  }

  &.menu-item-blacklisted .item-icon-wrapper {
    background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%);
    color: #ff4d4f;
  }
}

.item-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
}

.item-icon-wrapper {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.item-icon {
  font-size: 22px;
  position: relative;
  z-index: 1;
}

.icon-glow {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: inherit;
  filter: blur(15px);
  opacity: 0;
  transition: all 0.4s ease;
}

.item-text {
  flex: 1;
}

.item-label {
  font-weight: 700;
  font-size: 15px;
  color: #000000d9;
  margin-bottom: 2px;
}

.item-description {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.4;
}

.item-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 18px;
  color: #1890ff;
}

.item-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: transform 0.6s ease;
}

.menu-footer {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.footer-hint {
  font-size: 11px;
  color: #8c8c8c;
  text-align: center;
  font-style: italic;
}

// ========== TRANSITIONS ==========
.menu-expand-enter-active,
.menu-expand-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: top center;
}

.menu-expand-enter-from,
.menu-expand-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.menu-expand-enter-to,
.menu-expand-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

// ========== KEYFRAME ANIMATIONS ==========
@keyframes menu-appear {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(-20px) rotateX(-10deg);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0) rotateX(0deg);
  }
}

@keyframes item-appear {
  0% {
    opacity: 0;
    transform: translateX(-40px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes check-bounce {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(10deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes pulse-button {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.02);
  }
}

@keyframes text-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// ========== MOBILE RESPONSIVE ==========
@media (max-width: 768px) {
  .status-button {
    min-width: 120px;
    padding: 5px 12px;
    font-size: 12px;
  }

  .status-animated-menu {
    min-width: 280px;
    left: 50%;
    transform: translateX(-50%);
  }

  .menu-item {
    padding: 14px;

    .item-icon-wrapper {
      width: 40px;
      height: 40px;
    }

    .item-icon {
      font-size: 20px;
    }

    .item-label {
      font-size: 14px;
    }

    .item-description {
      font-size: 11px;
    }
  }
}
</style>
