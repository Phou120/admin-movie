<template>
  <div class="add-video-container">
    <div class="page-header">
      <div class="header-content">
        <a-breadcrumb class="breadcrumb">
          <a-breadcrumb-item>
            <router-link to="/video">{{ t("sidebar.video") }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ t("modules.video.addNew") }}</a-breadcrumb-item>
        </a-breadcrumb>
        <h1 class="page-title">{{ t("modules.video.addNew") }}</h1>
      </div>
    </div>

    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
      class="video-form"
      @finish="handleSubmit"
    >
      <a-row :gutter="24">
        <!-- Basic Information -->
        <a-col :span="24">
          <a-card
            :title="t('modules.video.form.sections.basicInformation')"
            class="form-card"
          >
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item
                  :label="t('modules.video.form.title')"
                  name="title"
                >
                  <a-input
                    v-model:value="formData.title"
                    :placeholder="t('modules.video.form.placeholder.title')"
                    size="large"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  :label="t('modules.customer.columns.customer')"
                  name="customer_id"
                >
                  <a-select
                    v-model:value="formData.customer_id"
                    :placeholder="t('modules.video.form.placeholder.customer')"
                    size="large"
                    :loading="customersLoading"
                    :options="customers"
                    :disabled="!canSelectCustomer"
                    :field-names="{ label: 'displayName', value: 'id' }"
                  >
                    <template #option="{ displayName }">
                      {{ displayName }}
                    </template>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  :label="t('modules.video.form.categories')"
                  name="category_id"
                >
                  <a-select
                    v-model:value="formData.category_id"
                    mode="multiple"
                    :placeholder="
                      t('modules.video.form.placeholder.categories')
                    "
                    size="large"
                    :loading="categoriesLoading"
                    :options="categories"
                    :field-names="{ label: 'name', value: 'id' }"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item
                  :label="t('modules.video.form.content')"
                  name="content"
                >
                  <TextEditor
                    v-model="formData.content"
                    :placeholder="t('modules.video.form.placeholder.content')"
                    height="200px"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </a-col>

        <!-- Media Files -->
        <a-col :span="24">
          <a-card
            :title="t('modules.video.form.sections.mediaFiles')"
            class="form-card"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  :label="t('modules.video.form.image')"
                  name="image"
                >
                  <a-upload
                    v-model:file-list="imageFileList"
                    name="image"
                    list-type="picture-card"
                    class="upload-area"
                    :before-upload="beforeUploadImage"
                    :max-count="1"
                    :custom-request="handleImageUpload"
                    @change="handleImageChange"
                  >
                    <div v-if="imageFileList.length < 1">
                      <PlusOutlined />
                      <div style="margin-top: 8px">
                        {{ t("modules.video.actions.upload") }}
                        {{ t("modules.video.form.image") }}
                      </div>
                    </div>
                  </a-upload>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :label="t('modules.video.form.videoFile')"
                  name="video_name"
                >
                  <a-upload
                    v-model:file-list="videoFileList"
                    name="video_name"
                    :before-upload="beforeUploadVideo"
                    :max-count="1"
                    :custom-request="handleVideoUpload"
                    @change="handleVideoChange"
                  >
                    <a-button>
                      <UploadOutlined />
                      {{ t("modules.video.actions.selectVideo") }}
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  :label="t('modules.video.form.trailerFile')"
                  name="trailer"
                >
                  <a-upload
                    v-model:file-list="trailerFileList"
                    name="trailer"
                    :before-upload="beforeUploadTrailer"
                    :max-count="1"
                    :custom-request="handleTrailerUpload"
                    @change="handleTrailerChange"
                  >
                    <a-button>
                      <UploadOutlined />
                      {{ t("modules.video.actions.selectTrailer") }}
                    </a-button>
                  </a-upload>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>

      <!-- Form Footer Actions -->
      <a-row :gutter="24">
        <a-col :span="24">
          <div class="form-footer">
            <a-space>
              <a-button class="cancel-btn" @click="handleCancel">
                {{ t("actions.back") }}
              </a-button>
              <a-button
                class="submit-btn"
                type="primary"
                :loading="loading"
                @click="handleSubmit"
              >
                {{ t("actions.save") }}
              </a-button>
            </a-space>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { message, type UploadProps } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { VideoComposible } from "../composible/index";
import type { IVideoForm } from "../interface/video.interface";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons-vue";
import TextEditor from "../../../../components/TextEditor.vue";
import { showSuccessNotification } from "../../../../common/utils/notification";

const router = useRouter();
const { createVideo, getCustomers, getCategories } = VideoComposible();
const { t } = useI18n();

// User role check
const userRoles = computed(() => {
  const rolesString = localStorage.getItem("user_roles");
  if (!rolesString) return [];

  try {
    // Parse if it's a JSON string, otherwise handle as comma-separated
    if (rolesString.startsWith("[") || rolesString.startsWith("{")) {
      return JSON.parse(rolesString);
    }
    // Handle comma-separated string
    return rolesString.split(",").map((role) => role.trim());
  } catch (error) {
    console.error("Error parsing user_roles from localStorage:", error);
    return [];
  }
});

// Check if user can select customers (admin or super-admin)
const canSelectCustomer = computed(() => {
  const roles = userRoles.value;
  // Check if any role in the array is 'admin' or 'super-admin'
  return roles.includes("admin") || roles.includes("super-admin");
});

// Get current customer ID for customer assignment
const getCurrentCustomerId = computed(() => {
  // For customer role, use customer_id from localStorage
  const customerId = localStorage.getItem("customer_id");
  if (customerId) {
    return parseInt(customerId);
  }
  return null;
});

const loading = ref(false);
const customersLoading = ref(false);
const categoriesLoading = ref(false);
const formRef = ref();

// File lists
const imageFileList = ref<any[]>([]);
const videoFileList = ref<any[]>([]);
const trailerFileList = ref<any[]>([]);

// Options for dropdowns
const customers = ref<any[]>([]);
const categories = ref<any[]>([]);

// Form data
const formData = reactive<IVideoForm>({
  customer_id: canSelectCustomer.value ? null : getCurrentCustomerId.value,
  title: "",
  content: "",
  image: undefined,
  video_name: undefined,
  trailer: undefined,
  category_id: [],
});

// Custom validator for content
// const validateContent = (_rule: any, value: string) => {
//   console.log('Validating content:', value);

//   if (!value) {
//     console.log('Content is empty or null');
//     return Promise.reject('Please enter video content');
//   }

//   // Remove HTML tags and check if there's actual content
//   const textContent = value.replace(/<[^>]*>/g, '').trim();
//   console.log('Text content after removing HTML:', textContent);

//   if (!textContent || textContent.length === 0) {
//     console.log('Text content is empty after removing HTML');
//     return Promise.reject('Please enter video content');
//   }

//   return Promise.resolve();
// };

// Form validation rules
const rules = computed(() => ({
  title: [
    {
      required: true,
      message: t("modules.video.form.validation.titleRequired"),
      trigger: "blur",
    },
  ],
  // Temporarily disable content validation to test if content is being saved
  // content: [
  //   {
  //     required: true,
  //     validator: validateContent,
  //     trigger: 'blur'
  //   },
  // ],
  customer_id: canSelectCustomer.value
    ? [
        {
          required: true,
          message: t("modules.video.form.validation.customerRequired"),
          trigger: "change",
        },
      ]
    : [], // No validation for customer_id if user can't select customers
}));

// Watch for content changes
watch(
  () => formData.content,
  (newContent) => {
    console.log("formData.content changed:", newContent);
  },
  { deep: true },
);

// File upload handlers
const beforeUploadImage = (file: File) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error(t("modules.video.form.validation.invalidImage"));
    return false;
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error(t("modules.video.form.validation.imageTooLarge"));
    return false;
  }
  return true; // Allow the custom request to handle it
};

const beforeUploadVideo = (file: File) => {
  const isVideo = file.type.startsWith("video/");
  if (!isVideo) {
    message.error(t("modules.video.form.validation.invalidVideo"));
    return false;
  }
  const isLt100M = file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    message.error(t("modules.video.form.validation.videoTooLarge"));
    return false;
  }
  return true; // Allow the custom request to handle it
};

const beforeUploadTrailer = (file: File) => {
  const isVideo = file.type.startsWith("video/");
  if (!isVideo) {
    message.error(t("modules.video.form.validation.invalidVideo"));
    return false;
  }
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message.error(t("modules.video.form.validation.trailerTooLarge"));
    return false;
  }
  return true; // Allow the custom request to handle it
};

const handleImageUpload: UploadProps["customRequest"] = ({
  file,
  onSuccess,
}) => {
  console.log("handleImageUpload called with:", file);
  const fileObj = file as File;
  formData.image = fileObj;
  console.log("formData.image set to:", formData.image);
  imageFileList.value = [
    {
      uid: "-1",
      name: fileObj.name,
      status: "done",
      url: URL.createObjectURL(fileObj),
    },
  ];
  if (onSuccess) onSuccess(fileObj);
};

const handleVideoUpload: UploadProps["customRequest"] = ({
  file,
  onSuccess,
}) => {
  console.log("handleVideoUpload called with:", file);
  const fileObj = file as File;
  formData.video_name = fileObj;
  console.log("formData.video_name set to:", formData.video_name);
  videoFileList.value = [
    {
      uid: "-1",
      name: fileObj.name,
      status: "done",
    },
  ];
  if (onSuccess) onSuccess(fileObj);
};

const handleTrailerUpload: UploadProps["customRequest"] = ({
  file,
  onSuccess,
}) => {
  console.log("handleTrailerUpload called with:", file);
  const fileObj = file as File;
  formData.trailer = fileObj;
  console.log("formData.trailer set to:", formData.trailer);
  trailerFileList.value = [
    {
      uid: "-1",
      name: fileObj.name,
      status: "done",
    },
  ];
  if (onSuccess) onSuccess(fileObj);
};

// Fallback file change handlers
const handleImageChange = (info: any) => {
  console.log("handleImageChange called with:", info);
  if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
    const file = info.fileList[0].originFileObj;
    formData.image = file;
    console.log("Fallback: formData.image set to:", formData.image);
  }
};

const handleVideoChange = (info: any) => {
  console.log("handleVideoChange called with:", info);
  if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
    const file = info.fileList[0].originFileObj;
    formData.video_name = file;
    console.log("Fallback: formData.video_name set to:", formData.video_name);
  }
};

const handleTrailerChange = (info: any) => {
  console.log("handleTrailerChange called with:", info);
  if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
    const file = info.fileList[0].originFileObj;
    formData.trailer = file;
    console.log("Fallback: formData.trailer set to:", formData.trailer);
  }
};

// Fetch options
const fetchCustomers = async () => {
  customersLoading.value = true;
  try {
    // For admin/super-admin: fetch all customers
    if (canSelectCustomer.value) {
      const data = await getCustomers();
      // Add displayName field to each customer
      customers.value = data.map((customer: any) => ({
        ...customer,
        displayName: `${customer.name} ${customer.surname || ""}`.trim(),
      }));
    } else {
      // For creator: load their own customer data from localStorage
      const customerDataString = localStorage.getItem("customer");
      if (customerDataString) {
        try {
          const customerData = JSON.parse(customerDataString);
          // Add displayName field
          const customerWithDisplayName = {
            ...customerData,
            displayName: `${customerData.name} ${customerData.surname || ""}`.trim(),
          };
          customers.value = [customerWithDisplayName];

          // Pre-select the customer_id
          formData.customer_id = customerData.id;

          console.log("Creator customer data loaded:", customerWithDisplayName);
        } catch (error) {
          console.error("Error parsing customer data from localStorage:", error);
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch customers:", error);
  } finally {
    customersLoading.value = false;
  }
};

const fetchCategories = async () => {
  categoriesLoading.value = true;
  try {
    const data = await getCategories();
    categories.value = data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  } finally {
    categoriesLoading.value = false;
  }
};

// Form actions
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;

    // Prepare form data with role-based customer_id handling
    let submissionData = { ...formData };

    // For customer role, don't send customer_id to API (set to null)
    if (!canSelectCustomer.value) {
      submissionData.customer_id = null;
    }

    console.log("Role-based submission data:", {
      userRole: userRoles.value,
      canSelectCustomer: canSelectCustomer.value,
      customerId: submissionData.customer_id,
    });

    // Check if files exist before sending
    if (submissionData.image) {
      console.log("Image file details:", {
        name: submissionData.image.name,
        size: submissionData.image.size,
        type: submissionData.image.type,
      });
    }
    if (submissionData.video_name) {
      console.log("Video file details:", {
        name: submissionData.video_name.name,
        size: submissionData.video_name.size,
        type: submissionData.video_name.type,
      });
    }
    if (submissionData.trailer) {
      console.log("Trailer file details:", {
        name: submissionData.trailer.name,
        size: submissionData.trailer.size,
        type: submissionData.trailer.type,
      });
    }

    const response = await createVideo(submissionData);
    showSuccessNotification(response.message);
    router.push("/video");
  } catch (error: any) {
    if (error.errorFields) {
      // Form validation error
      console.log("Form validation errors:", error.errorFields);
    } else {
      // API error
      console.error("=== API ERROR ===");
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      message.error(
        error.response?.data?.message ||
          t("modules.video.form.validation.createError"),
      );
    }
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.push("/video");
};

onMounted(() => {
  fetchCustomers();
  fetchCategories();
});
</script>

<style lang="scss" scoped>
.page-header {
  margin-bottom: 24px;
  background: #fff;
  padding: 24px;
  border-radius: 8px;

  .header-content {
    .breadcrumb {
      margin-bottom: 16px;
    }

    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #262626;
    }
  }
}

.video-form {
  .form-card {
    margin-bottom: 24px;
    border-radius: 8px;

    .ant-card-head {
      border-bottom: 1px solid #f0f0f0;
    }
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    margin-top: 24px;
    border-top: 1px solid #f0f0f0;

    .submit-btn {
      background-color: #0d334aff;
      border-color: #0d334aff;
      color: #ffffff;
    }

    .cancel-btn {
      color: #ff4d4f;
    }

    .cancel-btn:hover {
      border-color: #ff4d4f;
    }
  }
}

.upload-area {
  :deep(.ant-upload-list) {
    .ant-upload-list-picture-card-container {
      width: 100px;
      height: 100px;
    }
  }

  :deep(.ant-upload) {
    width: 100px;
    height: 100px;
  }
}

.customer-info {
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f8f9fa;

  .text-muted {
    color: #6c757d;
    font-size: 12px;
    line-height: 1.4;
  }

  .text-danger {
    color: #dc3545;
    font-size: 12px;
    line-height: 1.4;
  }
}

@media (max-width: 768px) {
  .add-video-container {
    padding: 16px;
  }

  .form-footer {
    flex-direction: column;
    gap: 12px;

    .ant-space {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .ant-space-item {
        flex: 1;
      }
    }
  }
}
</style>
