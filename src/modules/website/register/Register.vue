<template>
  <div class="register-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-background"></div>
      <div class="hero-content">
        <h1 class="hero-title">{{ t('website.register.hero.title') }}</h1>
        <p class="hero-subtitle">{{ t('website.register.hero.subtitle') }}</p>
      </div>
    </div>

    <!-- Register Form Section -->
    <div class="register-section">
      <div class="container">
        <a-row :gutter="[32, 32]" justify="center">
          <!-- Register Form Card -->
          <a-col :xs="24" :md="16" :lg="12">
            <a-card class="register-card" :bordered="false">
              <template #title>
                <div class="card-title">
                  <UserAddOutlined class="title-icon" />
                  <span>{{ t('website.register.form.title') }}</span>
                </div>
              </template>

              <a-form
                ref="formRef"
                :model="formData"
                :rules="rules"
                layout="vertical"
                @finish="handleSubmit"
              >
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item :label="t('website.register.form.firstName')" name="firstName">
                      <a-input
                        v-model:value="formData.firstName"
                        :placeholder="t('website.register.placeholder.firstName')"
                        size="large"
                      >
                        <template #prefix>
                          <UserOutlined />
                        </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item :label="t('website.register.form.lastName')" name="lastName">
                      <a-input
                        v-model:value="formData.lastName"
                        :placeholder="t('website.register.placeholder.lastName')"
                        size="large"
                      >
                        <template #prefix>
                          <UserOutlined />
                        </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  </a-row>

                <a-row :gutter="16" align="top">
                  <a-col :span="8">
                    <a-form-item :label="t('website.register.form.profileImage')" name="profile">
                      <a-upload
                        v-model:file-list="profileFileList"
                        name="profile"
                        list-type="picture-card"
                        class="profile-uploader"
                        :before-upload="beforeUploadProfile"
                        :max-count="1"
                        :custom-request="handleProfileUpload"
                        @change="handleProfileChange"
                      >
                        <div v-if="profileFileList.length < 1">
                          <PlusOutlined />
                          <div style="margin-top: 8px">{{ t('website.register.form.uploadPhoto') }}</div>
                        </div>
                      </a-upload>
                    </a-form-item>
                  </a-col>
                  <a-col :span="16">
                    <a-form-item :label="t('website.register.form.email')" name="email">
                      <a-input
                        v-model:value="formData.email"
                        :placeholder="t('website.register.placeholder.email')"
                        size="large"
                      >
                        <template #prefix>
                          <MailOutlined />
                        </template>
                      </a-input>
                    </a-form-item>

                    <a-form-item :label="t('website.register.form.phone')" name="phone">
                      <a-input
                        v-model:value="formData.phone"
                        :placeholder="t('website.register.placeholder.phone')"
                        size="large"
                      >
                        <template #prefix>
                          <PhoneOutlined />
                        </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item :label="t('website.register.form.address')" name="address">
                  <a-textarea
                    v-model:value="formData.address"
                    :placeholder="t('website.register.placeholder.address')"
                    size="large"
                    :rows="3"
                  />
                </a-form-item>

                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item :label="t('website.register.form.password')" name="password">
                      <a-input-password
                        v-model:value="formData.password"
                        :placeholder="t('website.register.placeholder.password')"
                        size="large"
                      >
                        <template #prefix>
                          <LockOutlined />
                        </template>
                      </a-input-password>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item
                      :label="t('website.register.form.confirmPassword')"
                      name="confirmPassword"
                    >
                      <a-input-password
                        v-model:value="formData.confirmPassword"
                        :placeholder="t('website.register.placeholder.confirmPassword')"
                        size="large"
                      >
                        <template #prefix>
                          <LockOutlined />
                        </template>
                      </a-input-password>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item name="agreeToTerms">
                  <a-checkbox v-model:checked="formData.agreeToTerms">
                    {{ t('website.register.form.agreeToTerms') }}
                    <a href="/terms" class="link">{{ t('website.register.form.termsOfService') }}</a>
                    {{ t('website.register.form.and') }}
                    <a href="/privacy" class="link">{{ t('website.register.form.privacyPolicy') }}</a>
                  </a-checkbox>
                </a-form-item>

                <a-form-item>
                  <a-button
                    type="primary"
                    html-type="submit"
                    size="large"
                    class="submit-btn"
                    :loading="loading"
                    block
                  >
                    <UserAddOutlined />
                    {{ t('website.register.form.createAccount') }}
                  </a-button>
                </a-form-item>

                <div class="login-link">
                  {{ t('website.register.form.alreadyHaveAccount') }}
                  <router-link to="/login" class="link">{{ t('website.register.form.signIn') }}</router-link>
                </div>
              </a-form>
            </a-card>
          </a-col>

          <!-- Benefits Card -->
          <a-col :xs="24" :md="16" :lg="8">
            <div class="benefits-card">
              <h3 class="benefits-title">{{ t('website.register.benefits.title') }}</h3>

              <div class="benefit-item">
                <div class="benefit-icon">
                  <VideoCameraOutlined />
                </div>
                <div class="benefit-content">
                  <h4>{{ t('website.register.benefits.unlimitedStreaming.title') }}</h4>
                  <p>{{ t('website.register.benefits.unlimitedStreaming.description') }}</p>
                </div>
              </div>

              <div class="benefit-item">
                <div class="benefit-icon">
                  <MobileOutlined />
                </div>
                <div class="benefit-content">
                  <h4>{{ t('website.register.benefits.watchAnywhere.title') }}</h4>
                  <p>{{ t('website.register.benefits.watchAnywhere.description') }}</p>
                </div>
              </div>

              <div class="benefit-item">
                <div class="benefit-icon">
                  <SafetyOutlined />
                </div>
                <div class="benefit-content">
                  <h4>{{ t('website.register.benefits.secureSafe.title') }}</h4>
                  <p>{{ t('website.register.benefits.secureSafe.description') }}</p>
                </div>
              </div>

              <div class="benefit-item">
                <div class="benefit-icon">
                  <TeamOutlined />
                </div>
                <div class="benefit-content">
                  <h4>{{ t('website.register.benefits.support.title') }}</h4>
                  <p>{{ t('website.register.benefits.support.description') }}</p>
                </div>
              </div>

              <div class="benefit-item">
                <div class="benefit-icon">
                  <DollarOutlined />
                </div>
                <div class="benefit-content">
                  <h4>{{ t('website.register.benefits.affordable.title') }}</h4>
                  <p>{{ t('website.register.benefits.affordable.description') }}</p>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import type { UploadProps } from "ant-design-vue";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UserAddOutlined,
  VideoCameraOutlined,
  MobileOutlined,
  SafetyOutlined,
  TeamOutlined,
  DollarOutlined,
  PlusOutlined,
} from "@ant-design/icons-vue";
import { useCustomer } from "../../admin/customer/composible";
import type { ICustomerForm } from "../../admin/customer/interface/customer.interface";
import { showSuccessNotification } from "../../../common/utils/notification";

const router = useRouter();
const { t } = useI18n();
const { createCustomer, upload } = useCustomer();
const loading = ref(false);
const formRef = ref();

// Profile image upload
const profileFileList = ref<any[]>([]);
const profilePreview = ref("");

const formData = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
});

const validatePassword = (_rule: any, value: string) => {
  if (!value) {
    return Promise.reject(t('website.register.validation.passwordRequired'));
  }
  if (value.length < 6) {
    return Promise.reject(t('website.register.validation.passwordTooShort'));
  }
  return Promise.resolve();
};

const validateConfirmPassword = (_rule: any, value: string) => {
  if (!value) {
    return Promise.reject(t('website.register.validation.confirmPasswordRequired'));
  }
  if (value !== formData.password) {
    return Promise.reject(t('website.register.validation.passwordMismatch'));
  }
  return Promise.resolve();
};

const rules = {
  firstName: [
    { required: true, message: t('website.register.validation.firstNameRequired'), trigger: "blur" },
  ],
  lastName: [
    { required: true, message: t('website.register.validation.lastNameRequired'), trigger: "blur" },
  ],
  email: [
    { required: true, message: t('website.register.validation.emailRequired'), trigger: "blur" },
    { type: "email", message: t('website.register.validation.emailInvalid'), trigger: "blur" },
  ],
  phone: [
    { required: true, message: t('website.register.validation.phoneRequired'), trigger: "blur" },
  ],
  address: [
    { required: true, message: t('website.register.validation.addressRequired'), trigger: "blur" },
  ],
  password: [
    { required: true, validator: validatePassword, trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: "blur" },
  ],
  agreeToTerms: [
    {
      type: "enum",
      enum: [true],
      message: t('website.register.validation.agreeRequired'),
      trigger: "change",
    },
  ],
};

// Profile image upload handlers
const beforeUploadProfile = (file: File) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("You can only upload image files!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must be smaller than 2MB!");
    return false;
  }
  return true;
};

const handleProfileUpload: UploadProps["customRequest"] = async ({
  file,
  onSuccess,
  onError,
}) => {
  try {
    const fileObj = file as File;
    const imageUrl = await upload(fileObj);
    profilePreview.value = imageUrl;
    profileFileList.value = [
      {
        uid: "-1",
        name: fileObj.name,
        status: "done",
        url: imageUrl,
      },
    ];
    if (onSuccess) onSuccess(imageUrl);
    message.success("Profile image uploaded successfully");
  } catch (error) {
    message.error("Image upload failed");
    if (onError) onError(error as Error);
  }
};

const handleProfileChange = (info: any) => {
  if (info.file.status === "removed") {
    profilePreview.value = "";
    profileFileList.value = [];
  }
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;

    // Prepare customer data matching API structure
    const customerData: ICustomerForm = {
      name: formData.firstName,
      surname: formData.lastName,
      email: formData.email,
      tel: formData.phone,
      address: formData.address,
      profile: profilePreview.value || null,
      password: formData.password,
      confirm_password: formData.confirmPassword,
    };

    const response = await createCustomer(customerData);
    showSuccessNotification(response.message || t('website.register.validation.registrationSuccess'));
    router.push("/login");
  } catch (error: any) {
    if (error.errorFields) {
      // Form validation error
      console.log("Form validation errors:", error.errorFields);
    } else {
      // API error
      console.error("Registration error:", error);
      message.error(
        error.response?.data?.message || t('website.register.validation.registrationFailed')
      );
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.hero-section {
  position: relative;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0d334aff 0%, #1a4d6b 100%);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  animation: backgroundMove 20s linear infinite;
}

@keyframes backgroundMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 60px 60px;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  padding: 0 20px;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  opacity: 0.95;
  margin: 0;
  font-weight: 300;
}

.register-section {
  padding: 60px 20px;
  position: relative;
  margin-top: -60px;
  z-index: 2;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.register-card {
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: #fff;

  :deep(.ant-card-head) {
    background: linear-gradient(135deg, #0d334aff 0%, #1a4d6b 100%);
    border-bottom: none;
    padding: 24px 32px;
  }

  :deep(.ant-card-head-title) {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
  }

  :deep(.ant-card-body) {
    padding: 32px;
  }
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;

  .title-icon {
    font-size: 1.8rem;
  }
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #262626;
  font-size: 0.95rem;
}

:deep(.ant-input),
:deep(.ant-input-password) {
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  padding: 8px 12px;

  &:hover {
    border-color: #0d334aff;
  }

  &:focus,
  &:focus-within {
    border-color: #0d334aff;
    box-shadow: 0 0 0 3px rgba(13, 51, 74, 0.1),
      0 4px 12px rgba(13, 51, 74, 0.15);
  }
}

:deep(.ant-input-prefix) {
  color: #0d334aff;
  font-size: 16px;
  margin-right: 8px;
}

:deep(.ant-checkbox-wrapper) {
  font-size: 0.95rem;
}

.link {
  color: #0d334aff;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: #1a4d6b;
    text-decoration: underline;
  }
}

.submit-btn {
  height: 52px;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(135deg, #0d334aff 0%, #1a4d6b 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(13, 51, 74, 0.3);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(13, 51, 74, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

.login-link {
  text-align: center;
  margin-top: 16px;
  color: #595959;
  font-size: 0.95rem;
}

.profile-uploader {
  :deep(.ant-upload-list) {
    .ant-upload-list-picture-card-container {
      width: 128px;
      height: 128px;
    }
  }

  :deep(.ant-upload) {
    width: 128px;
    height: 128px;
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    background: #fafafa;
    transition: all 0.3s ease;

    &:hover {
      border-color: #0d334aff;
    }
  }

  :deep(.ant-upload-list-item) {
    border-radius: 8px;
    overflow: hidden;

    img {
      object-fit: cover;
    }
  }
}

.benefits-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.benefits-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0d334aff;
  margin-bottom: 28px;
  text-align: center;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    background: linear-gradient(135deg, #e8f4f8 0%, #f8f9fa 100%);
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.benefit-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0d334aff 0%, #1a4d6b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(13, 51, 74, 0.2);
}

.benefit-content {
  flex: 1;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #262626;
    margin-bottom: 4px;
  }

  p {
    font-size: 0.9rem;
    color: #8c8c8c;
    margin: 0;
    line-height: 1.5;
  }
}

/* Responsive Design */
@media (max-width: 991px) {
  .hero-section {
    height: 280px;
  }

  .register-section {
    margin-top: -40px;
    padding: 40px 20px;
  }

  .benefits-card {
    position: static;
  }
}

@media (max-width: 767px) {
  .hero-section {
    height: 240px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .register-section {
    margin-top: -30px;
    padding: 30px 16px;
  }

  .register-card {
    :deep(.ant-card-head) {
      padding: 20px 24px;
    }

    :deep(.ant-card-body) {
      padding: 24px;
    }
  }

  .card-title {
    font-size: 1.25rem;

    .title-icon {
      font-size: 1.5rem;
    }
  }

  .benefits-card {
    padding: 24px;
  }

  .benefits-title {
    font-size: 1.25rem;
  }

  .benefit-item {
    padding: 12px;
    margin-bottom: 16px;
  }

  .benefit-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  // Stack profile and email/phone vertically on mobile
  .register-card {
    :deep(.ant-col) {
      &:first-child {
        flex: 0 0 100%;
        max-width: 100%;
      }

      &:last-child {
        flex: 0 0 100%;
        max-width: 100%;
      }
    }
  }

  .profile-uploader {
    :deep(.ant-upload-list) {
      .ant-upload-list-picture-card-container {
        width: 120px;
        height: 120px;
      }
    }

    :deep(.ant-upload) {
      width: 120px;
      height: 120px;
    }
  }
}

@media (max-width: 479px) {
  .hero-section {
    height: 200px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .register-card {
    :deep(.ant-card-body) {
      padding: 20px 16px;
    }
  }

  :deep(.ant-col) {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .submit-btn {
    height: 48px;
    font-size: 1rem;
  }
}
</style>
