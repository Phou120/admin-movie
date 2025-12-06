<template>
  <div class="reset-container">
    <!-- Top box container -->
    <div class="box-container"></div>

    <div class="card">
      <h2 class="title">Verify OTP</h2>

      <form @submit.prevent="handleOtpRequest" novalidate>
        <!-- otp INPUT -->
        <div class="form-group">
          <label for="otp">OTP</label>
          <input
            id="otp"
            v-model.trim="otp"
            type="text"
            placeholder="Enter your otp"
            autocomplete="off"
            :disabled="isLoading"
            aria-invalid="!!otpError"
            aria-describedby="otp-error"
          />
          <!-- VALIDATION ERROR -->
          <small v-if="otpError" id="otp-error" class="error message-role">{{
            otpError
          }}</small>
          <!-- BACKEND ERROR -->
          <small v-if="serverError" class="error">{{ serverError }}</small>
        </div>

        <!-- SUBMIT BUTTON -->
        <button
          class="submit-btn"
          type="submit"
          :disabled="isLoading || !!otpError"
        >
          <span v-if="isLoading">Checking...</span>
          <span v-else>Verify OTP</span>
        </button>
      </form>

      <router-link class="back-link" to="/forgot-password"
        >← Back to Forgot Password</router-link
      >
    </div>
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
import { message } from "ant-design-vue";

const { verifyOtp } = useAuth();
const router = useRouter();

const otp = ref("");
const isLoading = ref(false);
const serverError = ref("");

// otp validation
const otpError = computed(() => {
  if (!otp.value) return "otp is required.";
});

const handleOtpRequest = async () => {
  if (otpError.value) return;

  isLoading.value = true;
  serverError.value = "";

  try {
    const response = await verifyOtp(otp.value);
    console.log("verifyOtp response:", response);
    if (response?.status_code === 200 || response?.status_code === 201) {
      router.push({
        name: "reset-password",
      });
    }
    showSuccessNotification(response.message);
  } catch (err) {
    console.error("verifyOtp error:", err);
    showErrorNotification("OTP ບໍ່ຖືກຕ້ອງ.");
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
  justify-content: start; /* align at the top */
  align-items: center;
  padding: 20px;
  //   background-color: var(--background-color);
  font-family: var(--font-family);
}

/* Top box container style */
.box-container {
  width: 100%;
  max-width: 1200px; /* optional for large screens */
  height: 60px; /* height of the top container, can be anything */
  background-color: transparent; /* or any background color */
  margin-bottom: 20px; /* space below the top container */
  display: flex;
  align-items: center;
  justify-content: center;
  /* Add any content or styling you want inside this box container */
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
