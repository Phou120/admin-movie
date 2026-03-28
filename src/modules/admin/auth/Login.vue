<template>
  <div class="auth-background">
    <transition name="fade" appear>
      <a-card class="auth-card">
        <!-- Logo/Branding Section -->
        <div class="auth-logo">
          <img src="../../../../src/assets/images/logo.png" alt="Logo" />
        </div>

        <!-- Title -->
        <h1 class="auth-heading">ຍີນດີຕ້ອນຮັບ ເຂົ້າສູ່ລະບົບ</h1>
        <br />
        <br />

        <!-- Login Form -->
        <a-form
          :model="formState"
          name="login"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <!-- Email Input -->
          <a-form-item
            label="ອີເມວ"
            class="auth-email"
            name="email"
            :rules="emailRules"
          >
            <a-input
              v-model:value="formState.email"
              size="large"
              class="auth-input"
              placeholder="ປ້ອນອີເມວລຂອງທ່ານ"
              aria-label="Email address"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <!-- Password Input -->
          <a-form-item label="ລະຫັດຜ່ານ" name="password" :rules="passwordRules">
            <a-input-password
              v-model:value="formState.password"
              size="large"
              class="auth-input"
              placeholder="ປ້ອນລະຫັດຜ່ານ"
              aria-label="Password"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <!-- Remember Me & Forgot Password -->
          <div class="form-actions">
            <a-checkbox v-model:checked="formState.rememberMe">
              ຈຳໄວ້
            </a-checkbox>
            <router-link :to="{ name: 'forgot-password' }" class="auth-link">
              ລືມລະຫັດຜ່ານ?
            </router-link>
          </div>

          <!-- Submit Button -->
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              class="auth-button"
              :loading="loading"
            >
              {{ loading ? "ກຳລັງດຳເນີນ..." : "ເຂົ້າສູ່ລະບົບ" }}
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

        <!-- Sign Up Link -->
        <div class="text-center mt-md">
          <span class="text-muted">ບໍ່ມີບັນຊີບ? </span>
          <router-link to="/register" class="auth-link"> ລົງທະບຽນ </router-link>
        </div>
      </a-card>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { notification } from "ant-design-vue";
import { useAuth } from "./composible/auth";
import "./styles/auth.scss";

const router = useRouter();
const { login } = useAuth();

const loading = ref(false);
const errorMessage = ref("");

interface FormState {
  email: string;
  password: string;
  offer: string;
  rememberMe: boolean;
}

const formState = reactive<FormState>({
  email: "",
  password: "",
  offer: "",
  rememberMe: false,
});

const emailRules = [
  { required: true, message: "ອີເມວລບໍ່ຄວນຫວ່າງ" },
  { type: "email", message: "ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ" },
];

const passwordRules = [
  { required: true, message: "ລະຫັດຜ່ານບໍ່ຄວນຫວ່າງ" },
  { min: 6, message: "ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 6 ຕົວອັກສອນ" },
];

const onFinish = async (values: any) => {
  loading.value = true;
  errorMessage.value = "";

  try {
    await login(values.email, values.password);

    notification.success({
      message: "ເຂົ້າສູ່ລະບົບສຳເລັດ",
      description: "ຍີນດີຕ້ອນຮັບກັບມາ!",
      duration: 2,
    });

    // Redirect based on role
    const userRolesString = localStorage.getItem("user_roles");
    let userRoles: string[] = [];

    if (userRolesString) {
      try {
        // Parse if it's a JSON string
        if (
          userRolesString.startsWith("[") ||
          userRolesString.startsWith("{")
        ) {
          userRoles = JSON.parse(userRolesString);
        } else {
          // Handle comma-separated string
          userRoles = userRolesString.split(",").map((role) => role.trim());
        }
      } catch (error) {
        console.error("Error parsing user_roles:", error);
      }
    }

    console.log("User roles:", userRoles);

    // Check roles and redirect accordingly
    if (userRoles.includes("creator") || userRoles.includes("customer")) {
      // Creator/Customer role → redirect to profile
      router.push({ name: "profile" });
    } else if (
      userRoles.includes("admin") ||
      userRoles.includes("super-admin")
    ) {
      // Admin/Super-admin → redirect to dashboard
      router.push({ name: "profile" });
    } else {
      // Default → dashboard
      router.push({ name: "profile" });
    }
  } catch (error: any) {
    console.error("Login failed:", error);
    errorMessage.value =
      error.response?.data?.message || "ອີເມວລຫຼືລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ";

    notification.error({
      message: "ເຂົ້າສູ່ລະບົບບໍ່ສໍາເລັດ",
      description: "ກວດອີເມວລແລະຫັດຜ່ານຂອງທ່ານອີກ",
      duration: 3,
    });
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Validation failed:", errorInfo);
};
</script>

<style scoped lang="scss">
.auth-email {
  margin-left: 28px;
}
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

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.text-muted {
  color: #666;
  font-size: 14px;
}

// Override Ant Design styles
:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #333;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
}

:deep(.ant-checkbox-wrapper) {
  color: #666;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: var(--auth-primary);
  border-color: var(--auth-primary);
}
</style>
