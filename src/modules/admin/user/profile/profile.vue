<template>
  <div class="update-user-page">
    <div>
      <h1>{{ t('modules.profile.title') }}</h1>
    </div>

    <div class="form-container" v-if="!loading">
      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-row :gutter="24">
          <a-col :xs="24">
            <a-form-item :label="t('modules.profile.form.profileImage')" name="image">
              <a-upload
                name="image"
                list-type="picture-card"
                :show-upload-list="false"
                :before-upload="beforeUploadAdd"
              >
                <div v-if="!hasValidImage" class="upload-placeholder">
                  <user-outlined
                    :style="{ fontSize: '32px', color: '#8c8c8c' }"
                  />
                  <div style="margin-top: 8px; color: #8c8c8c">{{ t('modules.profile.form.actions.upload') }}</div>
                </div>
                <img
                  v-else
                  :src="previewImage"
                  alt="profile"
                  style="width: 100%"
                  @error="handleImageError"
                />
              </a-upload>
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="6">
            <a-form-item :label="t('modules.profile.form.email')" name="email">
              <a-input
                v-model:value="formState.email"
                :placeholder="t('modules.profile.form.placeholder.email')"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="6">
            <a-form-item :label="t('modules.profile.form.name')" name="name">
              <a-input
                v-model:value="formState.name"
                :placeholder="t('modules.profile.form.placeholder.name')"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="6">
            <a-form-item :label="t('modules.profile.form.surname')" name="surname">
              <a-input
                v-model:value="formState.surname"
                :placeholder="t('modules.profile.form.placeholder.surname')"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="6">
            <a-form-item :label="t('modules.profile.form.telephone')" name="tel">
              <a-input
                v-model:value="formState.tel"
                :placeholder="t('modules.profile.form.placeholder.telephone')"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="6"></a-col>

          <a-divider />

          <a-col :xs="24">
            <a-form-item>
              <div style="display: flex; justify-content: flex-end">
                <a-space>
                  <a-button class="submit-btn" @click="openPasswordModal">
                    <LockOutlined />
                    {{ t('modules.profile.form.actions.changePassword') }}
                  </a-button>
                  <a-button
                    type="primary"
                    class="submit-btn"
                    html-type="submit"
                    :loading="submitting"
                  >
                    <SaveOutlined />
                    {{ t('modules.profile.form.actions.updateProfile') }}
                  </a-button>
                </a-space>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div v-else class="loading-page">
      <a-spin size="large" />
      <p>{{ t('modules.profile.loadingUserData') }}</p>
    </div>

    <a-modal :open="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="preview" style="width: 100%" :src="previewImage" />
    </a-modal>

    <!-- Change Password Modal -->
    <a-modal
      :open="passwordModalVisible"
      :title="t('modules.profile.passwordModal.title')"
      :confirm-loading="changingPassword"
      @cancel="closePasswordModal"
      :footer="null"
    >
      <a-form
        :model="passwordForm"
        :rules="passwordRules"
        layout="vertical"
        ref="passwordFormRef"
      >
        <a-form-item :label="t('modules.profile.passwordModal.newPassword')" name="new_password">
          <a-input-password
            v-model:value="passwordForm.new_password"
            :placeholder="t('modules.profile.passwordModal.placeholder.newPassword')"
          />
        </a-form-item>

        <a-form-item :label="t('modules.profile.passwordModal.confirmPassword')" name="confirm_password">
          <a-input-password
            v-model:value="passwordForm.confirm_password"
            :placeholder="t('modules.profile.passwordModal.placeholder.confirmPassword')"
          />
        </a-form-item>

        <a-form-item>
          <div style="display: flex; justify-content: flex-end; gap: 8px">
            <a-button class="custom-cancel-btn" @click="closePasswordModal">
              <CloseOutlined />
              {{ t('modules.profile.passwordModal.actions.close') }}
            </a-button>
            <a-button
              type="primary"
              class="submit-btn"
              :loading="changingPassword"
              @click="handlePasswordChange"
            >
              <SaveOutlined />
              {{ t('modules.profile.passwordModal.actions.changePassword') }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  UserOutlined,
  LockOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import type { FormInstance } from "ant-design-vue";
import { useUsers } from "../composible";
import type { IUserForm } from "../interface/user.interface";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";
import { useRoute } from "vue-router";

const { upload, updateProfile, profile, changePassword } = useUsers();
const route = useRoute();
const { t } = useI18n();

// Get user ID from route params
const userId = ref<number>(Number(route.params.id));

// Form state
const formState = reactive<IUserForm>({
  id: userId.value,
  email: "",
  password: "",
  confirm_password: "",
  name: "",
  surname: "",
  tel: "",
  image: "",
  image_url: "",
  roles: [],
  permissions: [],
});

// Password change form state
const passwordForm = reactive({
  new_password: "",
  confirm_password: "",
});

// Refs
const loading = ref<boolean>(true);
const previewVisible = ref<boolean>(false);
const previewImage = ref<string>("");
const submitting = ref(false);
const originalImage = ref<string>("");
const imageLoadError = ref<boolean>(false);
const passwordModalVisible = ref<boolean>(false);
const changingPassword = ref<boolean>(false);
const passwordFormRef = ref<FormInstance>();

// Computed property to check if there's a valid image
const hasValidImage = computed(() => {
  return previewImage.value && !imageLoadError.value;
});

// Validation rules - password is optional for update
const rules = computed(() => ({
  email: [
    { required: true, message: t('modules.profile.validation.emailRequired'), trigger: "blur" },
    {
      type: "email",
      message: t('modules.profile.validation.emailInvalid'),
      trigger: "blur",
    },
  ],
  name: [{ required: true, message: t('modules.profile.validation.nameRequired'), trigger: "blur" }],
  surname: [
    { required: true, message: t('modules.profile.validation.surnameRequired'), trigger: "blur" },
  ],
  tel: [
    { required: true, message: t('modules.profile.validation.telephoneRequired'), trigger: "blur" },
  ],
}));

// Password form validation rules
const passwordRules = computed(() => ({
  new_password: [
    { required: true, message: t('modules.profile.passwordModal.validation.newPasswordRequired'), trigger: "blur" },
    {
      min: 6,
      message: t('modules.profile.passwordModal.validation.passwordMinLength'),
      trigger: "blur",
    },
  ],
  confirm_password: [
    {
      required: true,
      message: t('modules.profile.passwordModal.validation.confirmPasswordRequired'),
      trigger: "blur",
    },
    {
      validator: async (_rule: Rule, value: string) => {
        if (value && value !== passwordForm.new_password) {
          return Promise.reject(t('modules.profile.passwordModal.validation.passwordMismatch'));
        }
        return Promise.resolve();
      },
      trigger: "blur",
    },
  ],
}));

// --- Fetch User Data ---
const loadUserData = async () => {
  loading.value = true;
  try {
    const response = await profile();
    const userData = response.data;

    // Populate form with existing user data
    formState.email = userData.email || "";
    formState.name = userData.name || "";
    formState.surname = userData.surname || "";
    formState.tel = userData.tel || "";
    formState.image = userData.profile?.image || "";
    formState.image_url = userData.profile?.image_url || "";

    // Set preview image
    const userImage = userData.profile?.image_url || userData.profile?.image;
    if (userImage) {
      originalImage.value = userImage;
      previewImage.value = userImage;
      imageLoadError.value = false;
    } else {
      // No image available
      previewImage.value = "";
      imageLoadError.value = false;
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    message.error(t('modules.profile.validation.loadUserError'));
  } finally {
    loading.value = false;
  }
};

// Handle image loading errors
const handleImageError = () => {
  imageLoadError.value = true;
};

const beforeUploadAdd = async (file: File): Promise<boolean> => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error(t('modules.profile.validation.imageFileType'));
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error(t('modules.profile.validation.imageFileSize'));
    return false;
  }

  try {
    const url = await upload(file);
    formState.image = url;
    previewImage.value = URL.createObjectURL(file);
    imageLoadError.value = false;
  } catch (error) {
    console.error("Upload error:", error);
  }

  return false;
};

const handleCancel = (): void => {
  previewVisible.value = false;
};

// Password Modal Functions
const openPasswordModal = (): void => {
  passwordModalVisible.value = true;
  // Reset form
  passwordForm.new_password = "";
  passwordForm.confirm_password = "";
};

const closePasswordModal = (): void => {
  passwordModalVisible.value = false;
  passwordForm.new_password = "";
  passwordForm.confirm_password = "";
  passwordFormRef.value?.clearValidate();
};

const handlePasswordChange = async (): Promise<void> => {
  try {
    // Validate form
    await passwordFormRef.value?.validate();

    changingPassword.value = true;

    // Call change password API
    const response = await changePassword({
      new_password: passwordForm.new_password,
      confirm_password: passwordForm.confirm_password,
    });

    showSuccessNotification(
      response.message || t('modules.profile.passwordModal.passwordChangeSuccess')
    );
    closePasswordModal();
  } catch (error: any) {
    if (error.errorFields) {
      // Form validation error
      return;
    }
    console.error("Failed to change password:", error);
    const errorMessage =
      error?.response?.data?.message || t('modules.profile.passwordModal.passwordChangeError');
    showErrorNotification(errorMessage);
  } finally {
    changingPassword.value = false;
  }
};

async function onFinish() {
  submitting.value = true;
  try {
    // Create update data object
    const updateData: any = {
      id: userId.value,
      email: formState.email,
      name: formState.name,
      surname: formState.surname,
      tel: formState.tel,
      image: formState.image,
    };

    const response = await updateProfile(updateData);
    showSuccessNotification(response.message || t('modules.profile.updateSuccess'));
    console.log("User updated:", response);
  } catch (error: any) {
    console.error("Failed to update user:", error);
    const errorMessage =
      error?.response?.data?.message || t('modules.profile.updateError');
    showErrorNotification(errorMessage);
  } finally {
    submitting.value = false;
  }
}

const onFinishFailed = (errorInfo: any): void => {
  console.log(errorInfo);
};

// Load all data on mount
onMounted(async () => {
  await loadUserData();
});
</script>

<style lang="scss" scoped>
.update-user-page {
  padding: 24px;
  min-height: 100vh;
}

.form-container {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  max-width: 1400px;
}

.loading-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #fff;
  border-radius: 8px;

  p {
    margin-top: 16px;
    color: rgba(0, 0, 0, 0.65);
  }
}

/* Custom styles for permissions section */
.permissions-label {
  display: inline-block;
}

.required-mark {
  color: #ff4d4f;
  margin-right: 4px;
}

.permissions-container {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 16px;
}

.select-all-section {
  padding-bottom: 8px;
  font-weight: bold;
}

.permission-module {
  margin-bottom: 20px;
  padding: 8px;
  border-radius: 4px;
}

.module-header {
  font-weight: 600;
  margin-bottom: 12px;
}

.module-name {
  font-size: 16px;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding-left: 20px;
}

.permission-item {
  padding: 8px 12px;
  background-color: #f7f7f7;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }

  :deep(.ant-checkbox-wrapper) {
    width: 100%;
  }
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: rgba(0, 0, 0, 0.65);
}

.selected-count {
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.submit-btn {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #fff;

  &:hover {
    background-color: #0d334acc;
    border-color: #0d334acc;
    color: #fff;
  }
}

.custom-cancel-btn {
  color: #ff4d4f;
  border-color: #d9d9d9;

  &:hover {
    border-color: #ff4d4f;
    color: #ff4d4f;
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
