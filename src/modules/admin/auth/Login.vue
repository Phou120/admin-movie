<template>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 24 }"
    :wrapper-col="{ span: 24 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
    class="login-form"
  >
    <h2 class="title">ຍີນດີຕ້ອນຮັບ ເຂົ້າສູ່ລະບົບ</h2>

    <a-form-item
      label="email"
      name="email"
      :rules="[{ required: true, message: 'Please input your email!' }]"
    >
      <a-input
        v-model:value="formState.email"
        size="large"
        placeholder="Enter your email"
      >
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password
        v-model:value="formState.password"
        size="large"
        placeholder="Enter your password"
      >
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item>
      <div class="forgot-password-wrapper">
        <router-link to="/forgot-password" class="forgot-password-link">
          ລືມລະຫັດຜ່ານ?
        </router-link>
      </div>
    </a-form-item>

    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        block
        size="large"
        class="apply-now-button"
        style="margin-top: 10px"
      >
        ເຂົ້າສູ່ລະບົບ
      </a-button>
    </a-form-item>

    <p v-if="formState.error" style="color: red">{{ formState.error }}</p>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { notification } from "ant-design-vue";
import { useAuth } from "./composible/auth";

const router = useRouter();
const { login } = useAuth();

interface FormState {
  email: string;
  password: string;
  error: string;
}

const formState = reactive<FormState>({
  email: "",
  password: "",
  error: "",
});

const onFinish = async (values: any) => {
  await login(values.email, values.password)
    .then(() => {
      notification.success({
        message: "Login Successful",
        description: "Welcome back!",
        duration: 2,
      });
      router.push({ name: "profile" });
    })
    .catch((error) => {
      notification.error({
        message: "Login Failed",
        description: "Incorrect email or password!",
        duration: 3,
      });
      console.error("Login failed:", error);
    });
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #e7e4e4;
  border-radius: 8px;
}

.forgot-password-wrapper {
  text-align: right;
  margin-top: -10px;
  margin-bottom: 0;
}

.forgot-password-link {
  color: #0d334aff;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password-link:hover {
  color: #2d6991ff;
  text-decoration: underline;
}

.apply-now-button {
  background-color: #0d334aff;
  color: #fff;
  border: none;
  font-weight: bold;
  text-transform: uppercase;
  padding: 12px 24px;
  font-size: 16px;
  transition: all 0.3s ease;
  border-radius: 4px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.apply-now-button:hover {
  background-color: #2d6991ff;
  color: #ffd700;
  cursor: pointer;
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  justify-content: center;
}
</style>
