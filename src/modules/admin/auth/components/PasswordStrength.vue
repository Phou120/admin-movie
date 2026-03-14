<template>
  <div class="password-strength">
    <div class="password-strength-label">
      <span :class="strengthClass">{{ strength.label }}</span>
      <span :class="strengthClass">{{ strength.percent }}%</span>
    </div>
    <a-progress
      :percent="strength.percent"
      :status="strength.status as any"
      :show-info="false"
      :stroke-color="strokeColor"
      :stroke-width="6"
      :trail-color="trailColor"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  password?: string;
}

interface Emits {
  (e: 'strength-change', value: { score: number; label: string; percent: number; status: string }): void;
}

const props = withDefaults(defineProps<Props>(), {
  password: '',
});

const emit = defineEmits<Emits>();

/**
 * Calculate password strength score (0-5)
 * Based on:
 * - Length
 * - Lowercase letters
 * - Uppercase letters
 * - Numbers
 * - Special characters
 */
const calculateScore = (password: string): number => {
  if (!password) return 0;

  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  return Math.min(score, 5);
};

/**
 * Get strength information based on score
 */
const strength = computed(() => {
  const score = calculateScore(props.password);

  if (score <= 1) {
    return { score, label: 'Weak', percent: 25, status: 'error', class: 'password-strength-weak' };
  }
  if (score <= 2) {
    return { score, label: 'Fair', percent: 50, status: 'exception', class: 'password-strength-fair' };
  }
  if (score <= 3) {
    return { score, label: 'Medium', percent: 65, status: 'normal', class: 'password-strength-medium' };
  }
  if (score <= 4) {
    return { score, label: 'Good', percent: 85, status: 'active', class: 'password-strength-good' };
  }
  return { score, label: 'Strong', percent: 100, status: 'success', class: 'password-strength-strong' };
});

/**
 * Get CSS class for strength text
 */
const strengthClass = computed(() => strength.value.class);

/**
 * Get progress bar stroke color
 */
const strokeColor = computed(() => {
  const status = strength.value.status;
  switch (status) {
    case 'error': return '#e04b4b';
    case 'exception': return '#faad14';
    case 'normal': return '#2d6991';
    case 'active': return '#0d334a';
    case 'success': return '#52c41a';
    default: return '#d9d9d9';
  }
});

/**
 * Get progress bar trail color
 */
const trailColor = computed(() => {
  return '#f0f0f0';
});

// Emit strength changes
import { watch } from 'vue';
watch(
  () => strength.value,
  (newStrength) => {
    emit('strength-change', newStrength);
  }
);
</script>

<style scoped lang="scss">
.password-strength {
  margin-bottom: 16px;
}

.password-strength-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
}

.password-strength-weak { color: #e04b4b; }
.password-strength-fair { color: #faad14; }
.password-strength-medium { color: #2d6991; }
.password-strength-good { color: #0d334a; }
.password-strength-strong { color: #52c41a; }

// Override Ant Design Progress styles
:deep(.ant-progress-bg) {
  border-radius: 3px;
  transition: all 0.3s ease;
}

:deep(.ant-progress-outer) {
  border-radius: 3px;
}
</style>
