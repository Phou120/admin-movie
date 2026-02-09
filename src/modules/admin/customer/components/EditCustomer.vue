<template>
  <div class="customer-edit-header">
    <h1>{{ t("modules.customer.edit") }}</h1>
    <div>
      <a-button @click="goBack">
        <arrow-left-outlined />
        {{ t("actions.back") }}
      </a-button>
    </div>
  </div>

  <div class="form-container">
    <!-- Debug Display - Temporary -->

    <a-card
      :title="t('modules.customer.form.sections.personalInformation')"
      class="customer-form-card"
      v-if="!loading"
    >
      <a-form
        layout="vertical"
        :model="formEdit"
        @finish="handleSubmit"
        :rules="formRules"
      >
        <a-row :gutter="24">
          <a-col :span="5">
            <a-form-item
              :label="t('modules.customer.form.avatar')"
              class="image-upload-item"
            >
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
                  v-if="profileChanged && profilePreview"
                  :src="profilePreview"
                  alt="avatar"
                  style="width: 100%; height: 100%; object-fit: cover"
                />
                <img
                  v-else-if="!profileChanged && profilePreview"
                  :src="profilePreview"
                  alt="avatar"
                  style="width: 100%; height: 100%; object-fit: cover"
                />
                <div v-else class="upload-icon">
                  <plus-outlined />
                  <div style="margin-top: 8px">
                    {{ t("actions.upload") }} {{ t("actions.new") }}
                  </div>
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
                  :rules="[
                    {
                      required: true,
                      message: t(
                        'modules.customer.form.validation.nameRequired'
                      ),
                    },
                  ]"
                >
                  <a-input
                    v-model:value="formEdit.name"
                    :placeholder="t('modules.customer.form.placeholder.name')"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item
                  :label="t('modules.customer.form.surname')"
                  name="surname"
                  :rules="[
                    {
                      required: true,
                      message: t(
                        'modules.customer.form.validation.surnameRequired'
                      ),
                    },
                  ]"
                >
                  <a-input
                    v-model:value="formEdit.surname"
                    :placeholder="
                      t('modules.customer.form.placeholder.surname')
                    "
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
                    {
                      required: true,
                      message: t(
                        'modules.customer.form.validation.emailRequired'
                      ),
                    },
                    {
                      type: 'email',
                      message: t(
                        'modules.customer.form.validation.emailInvalid'
                      ),
                    },
                  ]"
                >
                  <a-input
                    v-model:value="formEdit.email"
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
                    {
                      required: true,
                      message: t(
                        'modules.customer.form.validation.phoneRequired'
                      ),
                    },
                  ]"
                >
                  <a-input
                    v-model:value="formEdit.tel"
                    :placeholder="t('modules.customer.form.placeholder.phone')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-form-item :label="t('modules.customer.form.address')" name="address">
          <a-textarea
            v-model:value="formEdit.address"
            :placeholder="t('modules.customer.form.placeholder.address')"
            :rows="3"
          />
        </a-form-item>

        <a-form-item class="form-actions">
          <a-button @click="goBack" class="cancel-btn">
            <arrow-left-outlined />
            {{ t("actions.cancel") }}
          </a-button>
          <a-button
            type="primary"
            html-type="submit"
            :loading="submitting"
            class="submit-btn"
          >
            <save-outlined />
            {{ t("actions.update") }} {{ t("modules.customer.title") }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Loading skeleton -->
    <a-card class="customer-form-card" v-else>
      <a-skeleton active :paragraph="{ rows: 6 }" />
    </a-card>
  </div>

  <!-- Preview Modal -->
  <a-modal v-model:open="previewVisible" :title="previewTitle" :footer="null">
    <img alt="profile preview" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useCustomer } from "../composible/index";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";

const router = useRouter();
const route = useRoute();
const { updateCustomer, upload, getById } = useCustomer();
const { t } = useI18n();

const loading = ref(false);
const submitting = ref(false);
const fileList = ref<any[]>([]);
const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const profilePreview = ref(""); // For showing existing profile image
const profileChanged = ref(false); // Track if user changed the profile

const formEdit = reactive({
  id: 0,
  name: "",
  surname: "",
  email: "",
  tel: "",
  address: "",
  status: "",
  type: "",
  user_id: 0,
  profile: "",
});

const formRules = computed(() => ({
  name: [
    {
      required: true,
      message: t("modules.customer.form.validation.nameRequired"),
      trigger: "blur",
    },
    { min: 2, message: t("validation.minLength", { min: 2 }), trigger: "blur" },
  ],
  surname: [
    {
      required: true,
      message: t("modules.customer.form.validation.surnameRequired"),
      trigger: "blur",
    },
    {
      min: 2,
      message: t("validation.minLength", { min: 2 }),
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: t("modules.customer.form.validation.emailRequired"),
      trigger: "blur",
    },
    {
      type: "email",
      message: t("modules.customer.form.validation.emailInvalid"),
      trigger: "blur",
    },
  ],
  tel: [
    {
      required: true,
      message: t("modules.customer.form.validation.phoneRequired"),
      trigger: "blur",
    },
    { min: 6, message: t("validation.minLength", { min: 6 }), trigger: "blur" },
  ],
}));

// Load customer data - following role update pattern
const loadCustomerData = async () => {
  loading.value = true;
  try {
    const customerId = Number(route.params.id);
    console.log("Loading customer with ID:", customerId);

    const res = await getById(customerId);
    const customer = res.data;

    console.log("Customer data from API:", customer);

    // Populate form with existing data - direct assignment like role update
    formEdit.id = customer.id;
    formEdit.name = customer.name || "";
    formEdit.surname = customer.surname || "";
    formEdit.email = customer.email || "";
    formEdit.tel = customer.tel || "";
    formEdit.address = customer.address || "";
    formEdit.status = customer.status || "";
    formEdit.type = customer.type || "";
    formEdit.user_id = customer.user_id || 0;

    // Handle profile image from nested user.profile structure
    if (customer.user?.profile?.image_url) {
      profilePreview.value = customer.user.profile.image_url;
      (formEdit as any).profile = customer.user.profile.image_url;
      console.log("Profile image URL:", customer.user.profile.image_url);
    } else {
      profilePreview.value = "";
      (formEdit as any).profile = "";
      console.log("No profile image found");
    }

    // Reset tracking variables
    profileChanged.value = false;
  } catch (error) {
    console.error("Failed to load customer:", error);
    message.error("Failed to load customer data");
    router.push("/customer");
  } finally {
    loading.value = false;
  }
};

// Handle image change
const handleImageChange = async (info: any) => {
  fileList.value = info.fileList.slice(-1); // Keep only the last file

  const file = info.file.originFileObj;
  if (file) {
    try {
      // Mark that profile was changed
      profileChanged.value = true;

      // Upload image immediately when selected (like AddCustomer)
      const imageUrl = await upload(file);
      formEdit.profile = imageUrl; // Set imageUrl to profile field for API

      // Create preview for upload box using FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePreview.value = e.target?.result as string; // Set preview for display
      };
      reader.readAsDataURL(file);

      message.success("Profile image updated successfully");
    } catch (error) {
      message.error("Image upload failed");
      fileList.value = []; // Clear file list on error
      profileChanged.value = false; // Reset change flag on error
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

// Custom upload function
const customRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;

  try {
    // Simulate upload - in real implementation, this would call the upload API
    // For now, we'll just return the file as a base64 string for preview
    const reader = new FileReader();
    reader.onload = () => {
      onSuccess(reader.result);
    };
    reader.readAsDataURL(file);
  } catch (error) {
    onError(error);
  }
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
  submitting.value = true;
  try {
    let profileValue: string | File | null = null;

    // If user changed the profile, use the uploaded imageUrl
    if (profileChanged.value) {
      profileValue = formEdit.profile as string; // This is the new imageUrl
    }
    // If user did NOT change profile, send null to API

    const response = await updateCustomer({
      ...formEdit,
      profile: profileValue,
    });

    showSuccessNotification(response.message);

    router.push("/customer");
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    showErrorNotification(message);
  } finally {
    submitting.value = false;
  }
};

// Go back to customer list
const goBack = () => {
  router.push("/customer");
};

onMounted(() => {
  loadCustomerData();
});
</script>

<style lang="scss" scoped>
.customer-edit-header {
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

  .image-help-text {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
    text-align: center;
  }
}

:deep(.ant-upload) {
  border: none !important;
  background: none !important;
}

// Responsive styles
@media screen and (max-width: 768px) {
  .customer-edit-header {
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
  .customer-edit-header h1 {
    font-size: 18px;
  }

  .image-upload-item .avatar-uploader {
    width: 100px;
    height: 100px;
  }
}
</style>
