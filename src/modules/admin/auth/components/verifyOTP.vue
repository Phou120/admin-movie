<template>
  <div class="auth-background">
    <transition name="fade" appear>
      <a-card class="auth-card">
        <!-- Logo/Branding Section -->
        <div class="auth-logo">
          <img src="../../../../assets/images/logo.png" alt="Logo" />
        </div>

        <!-- Title -->
        <h1 class="auth-heading">ຢັ້ງ OTP</h1>
        <p class="auth-subtitle">
          ປ້ອນລະຫັດ OTP 6 ຕົວອັກສອນທີ່ສົ່ງໄປໃຫ້ອີເມວລຂອງທ່ານ
        </p>

        <!-- OTP Verification Form -->
        <a-form
          name="verify-otp"
          autocomplete="off"
          @finish="handleOtpRequest"
          @finishFailed="onFinishFailed"
        >
          <!-- OTP Input -->
          <a-form-item>
            <OtpInput
              :model-value="otp"
              @update:model-value="
                (value: string) => {
                  otp = value;
                  console.log('OTP updated:', value);
                }
              "
              :digit-count="6"
              :disabled="isLoading"
              @complete="onOtpComplete"
            />
          </a-form-item>

          <!-- Resend OTP -->
          <div class="text-center mb-md">
            <span v-if="countdown > 0" class="text-muted">
              ບໍ່ໄດ້ຮັບ OTP? ສົ່ງໃຫ້ {{ countdown }} ວິນາທີ
            </span>
            <a-button
              v-else
              type="link"
              @click="resendOtp"
              :disabled="isLoading"
              class="resend-link"
            >
              ສົ່ງ OTP ອີກ
            </a-button>
          </div>

          <!-- Submit Button -->
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              class="auth-button"
              :loading="isLoading"
              :disabled="!isOtpComplete"
              @click="handleOtpRequest"
            >
              {{ isLoading ? "ກຳລັງກວນສື່..." : "ຢັ້ງ OTP" }}
            </a-button>
          </a-form-item>

          <!-- Error Alert -->
          <a-alert
            v-if="errorMessage"
            type="error"
            :message="errorMessage"
            show-icon
            closable
            @close="errorMessage = ''"
            class="mt-md"
          />
        </a-form>

        <!-- Back to Forgot Password Link -->
        <div class="text-center mt-md">
          <router-link :to="{ name: 'forgot-password' }" class="auth-link">
            ← ກັບໄປໜ້າລືມລະຫັດຜ່ານ
          </router-link>
        </div>
      </a-card>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";
import { useAuth } from "../composible/auth";
import OtpInput from "./OtpInput.vue";
import "../styles/auth.scss";

const { verifyOtp, forgotPassword } = useAuth();
const router = useRouter();

const otp = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const countdown = ref(60);
let countdownInterval: number | null = null;

// Check if OTP is complete (6 digits)
const isOtpComplete = computed(() => {
  console.log(
    "isOtpComplete check - otp.value:",
    otp.value,
    "length:",
    otp.value.length,
    "result:",
    otp.value.length === 6,
  );
  return otp.value.length === 6;
});

// Handle OTP input complete
const onOtpComplete = (value: string) => {
  console.log("OTP complete:", value);
};

// Start countdown timer
const startCountdown = () => {
  countdown.value = 60;
  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      if (countdownInterval) clearInterval(countdownInterval);
    }
  }, 1000);
};

// Resend OTP
const resendOtp = async () => {
  const email = localStorage.getItem("forgot_password_email");

  if (!email) {
    showErrorNotification("ບໍ່ພົບອີເມວລ. ກະລຸນາຂັ້ນຈາກເລີກ.");
    router.push({ name: "forgot-password" });
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await forgotPassword(email);
    console.log("Resend OTP response:", response);

    if (response?.status_code === 200 || response?.status_code === 201) {
      showSuccessNotification("OTP ໄັສົ່ງສຳເລັດໃຫ້ອີກ!");
      startCountdown();
    }
  } catch (err: any) {
    console.error("Resend OTP error:", err);
    errorMessage.value =
      err?.response?.data?.message || "ບໍ່ສາມາສົ່ງ OTP. ກະລຸນາລອງບ່ງຂັ້ນ.";
    showErrorNotification(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
};

// Handle OTP verification
const handleOtpRequest = async () => {
  console.log("handleOtpRequest called");
  console.log("OTP value:", otp.value);
  console.log("isOtpComplete:", isOtpComplete.value);

  if (!isOtpComplete.value) {
    errorMessage.value = "ກະລຸນາປ້ອນ OTP ໃຫ້ 6 ຕົວອັກສອນ.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    console.log("Calling verifyOtp with:", otp.value);
    const response = await verifyOtp(otp.value);
    console.log("verifyOtp response:", response);

    if (response?.status_code === 200 || response?.status_code === 201) {
      showSuccessNotification("OTP ຢັ້ງສຳເລັດ!");
      router.push({ name: "reset-password" });
    }
  } catch (err: any) {
    console.error("verifyOtp error:", err);
    errorMessage.value = err?.response?.data?.message || "OTP ບໍ່ຖືກຕ້ອງ.";
    showErrorNotification(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Validation failed:", errorInfo);
};

// Cleanup on unmount
onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});

// Start countdown on mount
onMounted(() => {
  const email = localStorage.getItem("forgot_password_email");
  if (email) {
    startCountdown();
  }
});
</script>

<style scoped lang="scss">
.auth-background {
  @extend .auth-background;
}

.auth-card {
  @extend .auth-card;
}

.auth-heading {
  @extend .auth-heading;
}

.auth-subtitle {
  @extend .auth-subtitle;
}

.auth-logo {
  @extend .auth-logo;
}

.auth-button {
  @extend .auth-button;
}

.auth-link {
  @extend .auth-link;
}

.text-muted {
  color: #666;
  font-size: 14px;
}

.resend-link {
  padding: 0;
  color: var(--auth-primary);
  font-weight: 500;
}

.resend-link:hover {
  color: var(--auth-primary-light);
}
</style>
