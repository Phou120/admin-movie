<template>
  <div class="reset-container">
    <!-- Box container at the top -->
    <div class="box-container"></div>

    <div class="card">
      <h2 class="title">Forgot Password</h2>
      <p class="subtitle">
        Enter your email and we'll send you a One-Time Password (OTP).
      </p>

      <form @submit.prevent="handleOtpRequest" novalidate>
        <!-- EMAIL INPUT -->
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model.trim="email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            :disabled="isLoading"
            aria-invalid="!!emailError"
            aria-describedby="email-error"
          />
          <!-- VALIDATION ERROR -->
          <small
            v-if="emailError"
            id="email-error"
            class="error message-role"
            >{{ emailError }}</small
          >
          <!-- BACKEND ERROR -->
          <small v-if="serverError" class="error">{{ serverError }}</small>
        </div>

        <!-- SUBMIT BUTTON -->
        <button
          class="submit-btn"
          type="submit"
          :disabled="isLoading || !!emailError"
        >
          <span v-if="isLoading">Checking...</span>
          <span v-else>Send OTP</span>
        </button>
      </form>

      <router-link class="back-link" to="/login">← Back to Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { showErrorNotification } from "../../../../common/utils/notification";
import { useAuth } from "../composible/auth";

const { forgotPassword } = useAuth();
const router = useRouter();

const email = ref("");
const isLoading = ref(false);
const serverError = ref("");

// Email validation
const emailError = computed(() => {
  if (!email.value) return "Email is required.";
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.value) ? "" : "Invalid email format.";
});

// Handle OTP request
const handleOtpRequest = async () => {
  if (emailError.value) return;

  isLoading.value = true;
  serverError.value = "";

  try {
    // Replace with your API call
    const response = await forgotPassword(email.value);
    console.log("forgotPassword response:", response);
    if (response?.status_code === 200 || response?.status_code === 201) {
      router.push({ name: "verifyOTP" });
    }
  } catch (err) {
    console.error("forgotPassword error:", err);
    showErrorNotification(err?.response?.data?.message || "Error occurred");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
/* Define color variables for easy theme adjustments */
:root {
  --primary-color: #0d334a;
  --error-color: #e04b4b;
  --background-color: #f6f8fa;
  --card-background: #fff;
  --border-color: #dcdde1;
  --font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.reset-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column; /* stack vertically */
  justify-content: start; /* align to top */
  align-items: center;
  padding: 20px;
  // background-color: var(--background-color);
  font-family: var(--font-family);
}

/* Box container at the top, used for spacing or additional content */
.box-container {
  width: 100%;
  max-width: 1200px; /* optional for larger screens */
  height: 50px; /* adjust height as needed */
  background-color: transparent; /* or any color if needed */
  margin-bottom: 20px; /* space between box and card */
}

/* Styling for the card */
.card {
  width: 100%;
  max-width: 420px;
  background: var(--card-background);
  padding: 30px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: 700;
  text-align: center;
  color: var(--primary-color);
}

.subtitle {
  font-size: 14px;
  margin-bottom: 20px;
  color: #555;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
}

label {
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

input {
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 4px rgba(13, 51, 74, 0.3);
}

.error {
  color: var(--error-color);
  font-size: 13px;
  margin-top: 6px;
  line-height: 1.2;
  min-height: 18px;
}

.message-role {
  color: red;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #084a64;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  text-align: center;
  color: var(--primary-color);
  font-size: 14px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #084a64;
}
</style>
