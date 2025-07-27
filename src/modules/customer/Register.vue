<script setup lang="ts">
import { reactive, ref } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import { useRegister } from "./composible/register";
import { notification } from "ant-design-vue";

const router = useRouter();
const { register } = useRegister();
const isLoading = ref(false);

interface FormState {
  email: string;
  password: string;
  name: string;
}

const formState = reactive<FormState>({
  email: "",
  password: "",
  name: "",
});

const onFinish = async (values: any) => {
  try {
    isLoading.value = true;
    await register(values);

    notification.success({
      message: "ລົງທະບຽນສໍາເລັດ",
      description: "ຍິນດີຕ້ອນຮັບສ",
      duration: 2,
    });

    isLoading.value = false;
    router.push({ name: "login" });
  } catch (error) {
    notification.error({
      message: "ລົງທະບຽນບໍ່ສໍາເລັດ",
      // description: error.response.data.message,
      duration: 3,
    });
    console.error("Register failed:", error);
  } finally {
    isLoading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
</script>

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
    <h2 class="title">ລົງທະບຽນ ນັກສືກສາ</h2>

    <a-form-item
      label="ຊື່ ນັກສືກສາ"
      name="name"
      :rules="[{ required: true, message: 'Please input your name!' }]"
    >
      <a-input
        v-model:value="formState.name"
        size="large"
        placeholder="Enter your name"
      >
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      label="ອີເມວ"
      name="email"
      :rules="[
        { required: true, message: 'Please input your email!' },
        { type: 'email', message: 'The input is not a valid email!' },
      ]"
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
      label="ລະຫັດຜ່ານ"
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
      <a-button
        type="primary"
        html-type="submit"
        block
        size="large"
        class="apply-now-button"
        style="margin-top: 10px"
        :loading="isLoading"
      >
        ລົງທະບຽນ
      </a-button>
    </a-form-item>

    <!-- <p v-if="error" style="color: red">{{ error }}</p> -->
  </a-form>
</template>

<style lang="scss" scoped>
.login-form {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #e7e4e4;
  border-radius: 8px;
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
.apply-now-button {
  background-color: #000;
  color: #ffd700; /* Yellow */
  border: none;
  font-weight: bold;
  text-transform: uppercase;
  padding: 12px 24px; /* slightly wider padding for better look */
  font-size: 16px;
  transition: all 0.3s ease;
  border-radius: 4px;

  display: flex !important;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.apply-now-button:hover {
  background-color: #ffd700;
  color: #000;
  cursor: pointer;
}
</style>
