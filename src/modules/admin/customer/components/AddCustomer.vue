<template>
  <div class="customer-add-header">
    <h1>{{ t('modules.customer.addNew') }}</h1>
    <div>
      <a-button @click="goBack">
        <arrow-left-outlined />
        {{ t('actions.back') }}
      </a-button>
    </div>
  </div>

  <div class="form-container">
    <a-card :title="t('modules.customer.form.sections.personalInformation')" class="customer-form-card">
      <a-form
        layout="vertical"
        :model="formAdd"
        @finish="handleSubmit"
        :rules="formRules"
      >
        <a-row :gutter="24">
          <a-col :span="5">
            <a-form-item :label="t('modules.customer.form.avatar')" class="image-upload-item">
              <a-upload
                v-model:file-list="fileList"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :before-upload="beforeUpload"
                :custom-request="customRequest"
                @change="handleImageChange"
                @preview="handlePreview"
              >
                <img
                  v-if="profilePreview"
                  :src="profilePreview"
                  alt="avatar"
                  style="width: 100%; height: 100%; object-fit: cover"
                />
                <div v-else class="upload-icon">
                  <plus-outlined />
                  <div style="margin-top: 8px">{{ t('actions.upload') }}</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>

          <a-col :span="19">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  :label="t('modules.customer.form.name')"
                  name="name"
                  :rules="[{ required: true, message: t('modules.customer.form.validation.nameRequired') }]"
                >
                  <a-input
                    v-model:value="formAdd.name"
                    :placeholder="t('modules.customer.form.placeholder.name')"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  :label="t('modules.customer.form.surname')"
                  name="surname"
                  :rules="[{ required: true, message: t('modules.customer.form.validation.surnameRequired') }]"
                >
                  <a-input
                    v-model:value="formAdd.surname"
                    :placeholder="t('modules.customer.form.placeholder.surname')"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  :label="t('modules.customer.form.email')"
                  name="email"
                  :rules="[
                    { required: true, message: t('modules.customer.form.validation.emailRequired') },
                    { type: 'email', message: t('modules.customer.form.validation.emailInvalid') },
                  ]"
                >
                  <a-input
                    v-model:value="formAdd.email"
                    type="email"
                    :placeholder="t('modules.customer.form.placeholder.email')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  :label="t('modules.customer.form.phone')"
                  name="tel"
                  :rules="[
                    { required: true, message: t('modules.customer.form.validation.phoneRequired') },
                  ]"
                >
                  <a-input
                    v-model:value="formAdd.tel"
                    :placeholder="t('modules.customer.form.placeholder.phone')"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  :label="t('modules.customer.form.password')"
                  name="password"
                  :rules="[
                    { required: true, message: t('modules.customer.form.validation.passwordRequired') },
                    {
                      min: 6,
                      message: t('validation.minLength', { min: 6 }),
                    },
                  ]"
                >
                  <a-input-password
                    v-model:value="formAdd.password"
                    :placeholder="t('modules.customer.form.placeholder.password')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  :label="t('modules.customer.form.confirmPassword')"
                  name="confirm_password"
                  :rules="[
                    { required: true, message: t('modules.customer.form.validation.confirmPasswordRequired') },
                    {
                      min: 6,
                      message: t('validation.minLength', { min: 6 }),
                    },
                  ]"
                >
                  <a-input-password
                    v-model:value="formAdd.confirm_password"
                    :placeholder="t('modules.customer.form.placeholder.confirmPassword')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-form-item :label="t('modules.customer.form.address')" name="address">
          <a-textarea
            v-model:value="formAdd.address"
            :placeholder="t('modules.customer.form.placeholder.address')"
            :rows="3"
          />
        </a-form-item>

        <a-form-item class="form-actions">
          <a-button @click="goBack" class="cancel-btn">
            <arrow-left-outlined />{{ t('actions.back') }}
          </a-button>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            class="submit-btn"
          >
            <save-outlined />
            {{ t('actions.save') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>

  <!-- Preview Modal -->
  <a-modal v-model:open="previewVisible" :title="previewTitle" :footer="null">
    <img alt="profile preview" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { ICustomerForm } from "../interface/customer.interface";
import { useCustomer } from "../composible/index";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";

const router = useRouter();
const { createCustomer, upload } = useCustomer();
const { t } = useI18n();

const loading = ref(false);
const fileList = ref<any[]>([]);
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const profilePreview = ref(""); // Separate variable for upload box preview

const formAdd = reactive<ICustomerForm>({
  name: "",
  surname: "",
  email: "",
  tel: "",
  address: "",
  profile: "",
  password: "",
  confirm_password: "",
});

const formRules = computed(() => ({
  name: [
    { required: true, message: t('modules.customer.form.validation.nameRequired'), trigger: "blur" },
    { min: 2, message: t('validation.minLength', { min: 2 }), trigger: "blur" },
  ],
  surname: [
    { required: true, message: t('modules.customer.form.validation.surnameRequired'), trigger: "blur" },
    {
      min: 2,
      message: t('validation.minLength', { min: 2 }),
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: t('modules.customer.form.validation.emailRequired'), trigger: "blur" },
    { type: "email", message: t('modules.customer.form.validation.emailInvalid'), trigger: "blur" },
  ],
  tel: [
    { required: true, message: t('modules.customer.form.validation.phoneRequired'), trigger: "blur" },
    { min: 6, message: t('validation.minLength', { min: 6 }), trigger: "blur" },
  ],
  password: [
    { required: true, message: t('modules.customer.form.validation.passwordRequired'), trigger: "blur" },
    {
      min: 6,
      message: t('validation.minLength', { min: 6 }),
      trigger: "blur",
    },
  ],
  confirm_password: [
    {
      required: true,
      message: t('modules.customer.form.validation.confirmPasswordRequired'),
      trigger: "blur",
    },
    {
      min: 6,
      message: t('validation.minLength', { min: 6 }),
      trigger: "blur",
    },
  ],
}));

// Handle image change
const handleImageChange = async (info: any) => {
  fileList.value = info.fileList.slice(-1); // Keep only the last file

  const file = info.file.originFileObj;
  if (file) {
    try {
      // Upload image immediately when selected
      const imageUrl = await upload(file);
      formAdd.profile = imageUrl; // Set imageUrl to profile field for API

      // Create preview for upload box using FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePreview.value = e.target?.result as string; // Set preview for display
      };
      reader.readAsDataURL(file);

      message.success("Profile image uploaded successfully");
    } catch (error) {
      message.error("Image upload failed");
      fileList.value = []; // Clear file list on error
      formAdd.profile = ""; // Clear profile on error
      profilePreview.value = ""; // Clear preview on error
    }
  }
};

// Before upload validation
const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

// Custom upload function - just for preview, actual upload handled in composible
const customRequest = async (options: any) => {
  const { file, onSuccess } = options;

  // Just for preview - actual upload happens during form submission
  const reader = new FileReader();
  reader.onload = () => {
    onSuccess(reader.result);
  };
  reader.readAsDataURL(file);
};

// Preview image
const handlePreview = (file: any) => {
  previewImage.value = file.url || file.thumbUrl;
  previewVisible.value = true;
  previewTitle.value =
    file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
};

// Submit form
const handleSubmit = async () => {
  loading.value = true;
  try {
    // Validate password matching
    if (formAdd.password !== formAdd.confirm_password) {
      message.error(t('modules.customer.form.validation.passwordMismatch'));
      loading.value = false;
      return;
    }

    const response = await createCustomer(formAdd);

    showSuccessNotification(response.message);
    router.push("/customer");
  } catch (error: any) {
    const message = error.response?.data?.message;
    showErrorNotification(message);
  } finally {
    loading.value = false;
  }
};

// Go back to customer list
const goBack = () => {
  router.push("/customer");
};
</script>

<style lang="scss" scoped>
.customer-add-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;

  h1 {
    font-size: 24px;
    margin: 0;
  }
}

.form-container {
  padding: 0 12px;
}

.customer-form-card {
  width: 100%;
  margin: 0;
}

.form-actions {
  margin-top: 24px;
  text-align: right;

  .ant-btn {
    min-width: 120px;
    margin: 0 8px;
  }
}

.cancel-btn {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.cancel-btn:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.submit-btn {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}

.submit-btn:hover {
  background-color: #0d334aff;
  border-color: #0d334aff;
  color: #ffffff;
}

.image-upload-item {
  .avatar-uploader {
    width: 150px;
    height: 150px;
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
      border-color: #4096ff;
    }
  }

  .upload-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #999;
  }
}

:deep(.ant-upload) {
  border: none !important;
  background: none !important;
}

// Responsive styles
@media screen and (max-width: 768px) {
  .customer-add-header {
    padding: 8px;
    flex-direction: column;
    align-items: flex-start;

    h1 {
      font-size: 20px;
    }
  }

  .form-container {
    padding: 0 8px;
  }

  .form-actions {
    .ant-btn {
      width: 100%;
      margin: 4px 0;
    }
  }

  .image-upload-item .avatar-uploader {
    width: 120px;
    height: 120px;
  }
}

@media screen and (max-width: 576px) {
  .customer-add-header h1 {
    font-size: 18px;
  }

  .image-upload-item .avatar-uploader {
    width: 100px;
    height: 100px;
  }
}
</style>
