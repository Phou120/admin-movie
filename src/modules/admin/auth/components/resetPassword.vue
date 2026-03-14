<template>
  <div class="auth-background">
    <transition name="fade" appear>
      <a-card class="auth-card">
        <!-- Logo/Branding Section -->
        <div class="auth-logo">
          <img src="../../../../assets/images/logo.png" alt="Logo" />
        </div>

        <!-- Title -->
        <h1 class="auth-heading">ປ່ຽນລະຫັດຜ່ານໃໝ່</h1>
        <p class="auth-subtitle">ສ້າງລະຫັດຜ່ານໃໝ່</p>

        <!-- Reset Password Form -->
        <a-form
          :model="formState"
          name="reset-password"
          autocomplete="off"
          @finish="handleResetPassword"
          @finishFailed="onFinishFailed"
        >
          <!-- New Password Input -->
          <a-form-item
            label="ລະຫັດຜ່ານໃໝ່"
            name="password"
            :rules="passwordRules"
          >
            <a-input-password
              v-model:value="formState.password"
              size="large"
              class="auth-input"
              placeholder="ປ້ອນລະຫັດຜ່ານໃໝ່"
              :disabled="isLoading"
              aria-label="New password"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <!-- Confirm Password Input -->
          <a-form-item
            label="ຢັ້ງລະຫັດຜ່ານ"
            name="confirmPassword"
            :rules="confirmPasswordRules"
          >
            <a-input-password
              v-model:value="formState.confirmPassword"
              size="large"
              class="auth-input"
              placeholder="ປ້ອນລະຫັດຜ່ານອີກ"
              :disabled="isLoading"
              aria-label="Confirm password"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
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
              {{ isLoading ? "ກຳລັງດຳເນີນ..." : "ປ່ຽນລະຫັດຜ່ານ" }}
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
            ← ກັບໄປໜ້າເຂົ້າສູ່ລະບົບ
          </router-link>
        </div>
      </a-card>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { LockOutlined } from "@ant-design/icons-vue";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";
import { useAuth } from "../composible/auth";
import "../styles/auth.scss";

const { resetPassword } = useAuth();
const router = useRouter();

const isLoading = ref(false);
const errorMessage = ref("");

// Get user ID from local storage
const userId = localStorage.getItem("verify_user_id");

interface FormState {
  password: string;
  confirmPassword: string;
}

const formState = reactive<FormState>({
  password: "",
  confirmPassword: "",
});

const passwordRules = computed(() => [
  { required: true, message: "ລະຫັດຜ່ານບໍ່ຄວນໄວ່" },
  { min: 6, message: "ລະຫັດຜ່ານຕ້ອງມີຢ່າງຫຼື້ນ 6 ຕົວອັກສອນ" },
]);

const confirmPasswordRules = computed(() => [
  { required: true, message: "ກະລຸນາຢັ້ນລະຫັດຜ່ານອີກ" },
  {
    validator: (_rule: any, value: string) => {
      if (value !== formState.password) {
        return Promise.reject("ລະຫັດຜ່ານບໍ່ຕົງກັນ");
      }
      return Promise.resolve();
    },
  },
]);

// Handle reset password
const handleResetPassword = async () => {
  if (!userId) {
    showErrorNotification("ບໍ່ພົບ ID ຜູ່ຄົນ. ກະລຸນາເລີກກວນຈາກົງໃຫ້.");
    router.push({ name: "forgot-password" });
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await resetPassword(
      parseInt(userId),
      formState.password,
      formState.confirmPassword,
    );
    console.log("Response from resetPassword:", response);

    showSuccessNotification(response.message || "ຕັ້ງລຳລະຫັດຜ່ານສຳເລັດ!");

    // Clear verify_user_id from localStorage
    localStorage.removeItem("verify_user_id");

    if (response.status_code === 200 || response.status_code === 201) {
      setTimeout(() => {
        router.push({ name: "login" });
      }, 1500);
    }
  } catch (err: any) {
    console.error("Reset password error:", err);
    errorMessage.value = err.message || "ບໍ່ສາມາຕັ້ງລຳລະຫັດຜ່ານ.";
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
