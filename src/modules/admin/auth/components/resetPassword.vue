<template>
  <div class="reset-password-container">
    <h1>Reset Password</h1>
    <!-- Removed @submit and disabled attribute from button -->
    <form novalidate>
      <!-- Password Input -->
      <div class="form-group">
        <label for="password">New Password</label>
        <input
          id="password"
          type="password"
          v-model.trim="password"
          placeholder="Enter new password"
          :disabled="isLoading"
        />
        <small v-if="passwordError" class="error">{{ passwordError }}</small>
      </div>

      <!-- Confirm Password Input -->
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          v-model.trim="confirmPassword"
          placeholder="Confirm new password"
          :disabled="isLoading"
        />
        <small v-if="confirmPasswordError" class="error">{{
          confirmPasswordError
        }}</small>
      </div>

      <!-- Reset Password Button -->
      <button type="button" @click="handleResetPassword">
        <span v-if="isLoading">Resetting...</span>
        <span v-else>Reset Password</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";
import { useAuth } from "../composible/auth";

// Get user ID from local storage
const userId = localStorage.getItem("verify_user_id");

// Reactive state
const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const serverError = ref("");

// Validation error messages
const passwordError = computed(() => {
  if (!password.value) return "Password is required.";
  if (password.value.length < 6)
    return "Password must be at least 6 characters.";
  return "";
});

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return "Please confirm your password.";
  if (confirmPassword.value !== password.value)
    return "Passwords do not match.";
  return "";
});

const hasErrors = computed(() => {
  return passwordError.value || confirmPasswordError.value;
});

// Use auth composable
const { resetPassword } = useAuth();
const router = useRouter();

// Handle reset password
const handleResetPassword = async () => {
  console.log("handleResetPassword called");

  if (hasErrors.value) {
    console.log("Validation errors present");
    return;
  }

  if (!userId) {
    showErrorNotification("User ID not found. Please restart the process.");
    return;
  }

  isLoading.value = true;
  serverError.value = "";

  try {
    console.log("Calling resetPassword with:", userId, password.value);
    const response = await resetPassword(
      userId,
      password.value,
      confirmPassword.value
    );
    console.log("Response from resetPassword:", response);

    showSuccessNotification(response.message || "Password reset successful!");

    if (response.status_code === 200 || response.status_code === 201) {
      router.push({ name: "login" });
    }
  } catch (err) {
    console.error("Reset password error:", err);
    showErrorNotification(err.message || "Failed to reset password.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.reset-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #0d334a;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

label {
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

input {
  padding: 12px;
  border: 1px solid #dcdde1;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  border-color: #0d334a;
  box-shadow: 0 0 4px rgba(13, 51, 74, 0.3);
}

.error {
  color: #e04b4b;
  font-size: 13px;
  margin-top: 6px;
  min-height: 18px;
}

button {
  width: 100%;
  padding: 14px;
  background-color: #084a64;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}

button:disabled {
  background-color: #a0b0b9;
  cursor: not-allowed;
}
</style>
