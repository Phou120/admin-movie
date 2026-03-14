<template>
  <div class="auth-background">
    <transition name="fade" appear>
      <a-card class="auth-card">
        <!-- Logo/Branding Section -->
        <div class="auth-logo">
          <img src="../../../../assets/images/logo.png" alt="Logo" />
        </div>

        <!-- Title -->
        <h1 class="auth-heading">ລືມລະຫັດຜ່ານ?</h1>
        <p class="auth-subtitle">ປ້ອນອີເມວລຂອງທ່ານ ແພາເນີສົ່ງລະຫັດ OTP ໄັດ</p>

        <!-- Forgot Password Form -->
        <a-form
          :model="formState"
          name="forgot-password"
          autocomplete="off"
          @finish="handleOtpRequest"
          @finishFailed="onFinishFailed"
        >
          <!-- Email Input -->
          <a-form-item label="ທີ່ຢອີເມວລ" name="email" :rules="emailRules">
            <a-input
              v-model:value="formState.email"
              size="large"
              class="auth-input"
              placeholder="ປ້ອນອີເມວລຂອງທ່ານ"
              :disabled="isLoading"
              aria-label="Email address"
            >
              <template #prefix>
                <MailOutlined />
              </template>
            </a-input>
          </a-form-item>

          <!-- Submit Button -->
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              class="auth-button"
              :loading="isLoading"
            >
              {{ isLoading ? "ກຳລັງດຳເນີນ..." : "ສົ່ງ OTP" }}
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

        <!-- Back to Login Link -->
        <div class="text-center mt-md">
          <router-link :to="{ name: 'login' }" class="auth-link">
            ← ກັບໄປໂນໜານເຂົ້າສູ່ລະບົບ
          </router-link>
        </div>
      </a-card>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { MailOutlined } from "@ant-design/icons-vue";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";
import { useAuth } from "../composible/auth";
import "../styles/auth.scss";

const { forgotPassword } = useAuth();
const router = useRouter();

const isLoading = ref(false);
const errorMessage = ref("");

interface FormState {
  email: string;
}

const formState = reactive<FormState>({
  email: "",
});

const emailRules = computed(() => [
  { required: true, message: "ອີເມວລບໍ່ຄວນໄວ່" },
  { type: "email", message: "ຮູບແບບອີເມວລບໍ່ຖືກຕ້ອງ" },
]);

// Handle OTP request
const handleOtpRequest = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await forgotPassword(formState.email);
    console.log("forgotPassword response:", response);

    if (response?.status_code === 200 || response?.status_code === 201) {
      // Store email for resend functionality
      localStorage.setItem("forgot_password_email", formState.email);

      showSuccessNotification("OTP ໄັສົ່ງສຳເລັດແລັວ! ກວດອີເມວລຂອງທ່ານ.");
      router.push({ name: "verifyOTP" });
    }
  } catch (err: any) {
    console.error("forgotPassword error:", err);
    errorMessage.value =
      err?.response?.data?.message || "ເກີດຂຶ້ນໃຫຍກຳລັງກວນສື່ກັນໃຫ້ລູກອີກ.";
    showErrorNotification(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Validation failed:", errorInfo);
};
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

.auth-input {
  @extend .auth-input;
}

.auth-button {
  @extend .auth-button;
}

.auth-link {
  @extend .auth-link;
}

// Override Ant Design styles
:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #333;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
}
</style>
