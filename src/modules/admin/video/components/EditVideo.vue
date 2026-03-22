<template>
  <div class="edit-video-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" />
      <p>{{ t('common.loading') }}...</p>
    </div>

    <!-- Form Content -->
    <div v-else>
      <div class="page-header">
        <div class="header-content">
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item>
              <router-link to="/video">{{ t('sidebar.video') }}</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>{{ t('modules.video.editVideo') }}</a-breadcrumb-item>
          </a-breadcrumb>
          <h1 class="page-title">{{ t('modules.video.editVideo') }}</h1>
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
            <a-card :title="t('modules.video.form.sections.basicInformation')" class="form-card">
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item :label="t('modules.video.form.title')" name="title">
                    <a-input
                      v-model:value="formData.title"
                      :placeholder="t('modules.video.form.placeholder.title')"
                      size="large"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item :label="t('modules.video.form.content')" name="content">
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

          <!-- Customer Selection - Only show for admin/super-admin -->
          <a-col :span="24">
            <a-card :title="t('modules.video.form.sections.customerInformation')" class="form-card">
              <a-form-item :label="t('modules.customer.columns.customer')" name="customer_id">
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
            </a-card>
          </a-col>

          <!-- Media Files -->
          <a-col :span="24">
            <a-card :title="t('modules.video.form.sections.mediaFiles')" class="form-card">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item :label="t('modules.video.form.image')" name="image">
                    <div
                      class="current-media"
                      v-if="videoData?.image_url && !imageRemoved"
                    >
                      <p class="current-label">Current Image:</p>
                      <a-image
                        :width="100"
                        :height="80"
                        :src="videoData.image_url"
                        class="current-image"
                        :alt="videoData.title"
                        :preview="{
                          mask: 'View Current',
                          maskClosable: true,
                        }"
                      />
                      <a-button
                        type="link"
                        danger
                        size="small"
                        @click="removeImage"
                        class="remove-btn"
                      >
                        Remove Current Image
                      </a-button>
                    </div>
                    <div v-if="imageRemoved" class="removed-media">
                      <p class="removed-label">Image will be removed</p>
                      <a-button type="link" @click="restoreImage" size="small">
                        Restore Image
                      </a-button>
                    </div>
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
                          {{
                            videoData?.image_url && !imageRemoved
                              ? t('actions.change') + ' ' + t('modules.video.form.image')
                              : t('actions.upload') + ' ' + t('modules.video.form.image')
                          }}
                        </div>
                      </div>
                    </a-upload>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="t('modules.video.form.videoFile')" name="video_name">
                    <div
                      class="current-media"
                      v-if="videoData?.video_url && !videoRemoved"
                    >
                      <p class="current-label">Current Video:</p>
                      <a-button
                        type="link"
                        size="small"
                        @click="openVideo(videoData.video_url)"
                        class="current-link"
                      >
                        <PlayCircleOutlined /> View Current
                      </a-button>
                      <a-button
                        type="link"
                        danger
                        size="small"
                        @click="removeVideo"
                        class="remove-btn"
                      >
                        Remove Current Video
                      </a-button>
                    </div>
                    <div v-if="videoRemoved" class="removed-media">
                      <p class="removed-label">Video will be removed</p>
                      <a-button type="link" @click="restoreVideo" size="small">
                        Restore Video
                      </a-button>
                    </div>
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
                        {{
                          videoData?.video_url && !videoRemoved
                            ? t('actions.change') + ' ' + t('modules.video.form.videoFile')
                            : t('modules.video.actions.selectVideo')
                        }}
                      </a-button>
                    </a-upload>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item :label="t('modules.video.form.trailerFile')" name="trailer">
                    <div
                      class="current-media"
                      v-if="videoData?.trailer_url && !trailerRemoved"
                    >
                      <p class="current-label">Current Trailer:</p>
                      <a-button
                        type="link"
                        size="small"
                        @click="openVideo(videoData.trailer_url)"
                        class="current-link"
                      >
                        <PlayCircleOutlined /> View Current
                      </a-button>
                      <a-button
                        type="link"
                        danger
                        size="small"
                        @click="removeTrailer"
                        class="remove-btn"
                      >
                        Remove Current Trailer
                      </a-button>
                    </div>
                    <div v-if="trailerRemoved" class="removed-media">
                      <p class="removed-label">Trailer will be removed</p>
                      <a-button
                        type="link"
                        @click="restoreTrailer"
                        size="small"
                      >
                        Restore Trailer
                      </a-button>
                    </div>
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
                        {{
                          videoData?.trailer_url && !trailerRemoved
                            ? t('actions.change') + ' ' + t('modules.video.form.trailerFile')
                            : t('modules.video.actions.selectTrailer')
                        }}
                      </a-button>
                    </a-upload>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>
          </a-col>

          <!-- Categories and Tags -->
          <a-col :span="24">
            <a-card :title="t('modules.video.form.sections.categoriesAndTags')" class="form-card">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item :label="t('modules.video.form.categories')" name="category_id">
                    <a-select
                      v-model:value="formData.category_id"
                      mode="multiple"
                      :placeholder="t('modules.video.form.placeholder.categories')"
                      size="large"
                      :loading="categoriesLoading"
                      :options="categories"
                      :field-names="{ label: 'name', value: 'id' }"
                    />
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
                  {{ t('actions.back') }}
                </a-button>
                <a-button
                  class="submit-btn"
                  type="primary"
                  :loading="submitting"
                  @click="handleSubmit"
                >
                  {{ t('actions.update') }}
                </a-button>
              </a-space>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { message, type UploadProps } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { VideoComposible } from "../composible/index";
import type { IVideoForm } from "../interface/video.interface";
import {
  PlusOutlined,
  UploadOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons-vue";
import TextEditor from "../../../../components/TextEditor.vue";
import { showSuccessNotification } from "../../../../common/utils/notification";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { updateVideo, getVideoById, getCustomers, getCategories } =
  VideoComposible();

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

const loading = ref(false);
const submitting = ref(false);
const customersLoading = ref(false);
const categoriesLoading = ref(false);
const formRef = ref();

// Video data from API
const videoData = ref<any>(null);

// File lists
const imageFileList = ref<any[]>([]);
const videoFileList = ref<any[]>([]);
const trailerFileList = ref<any[]>([]);

// Media removal state
const imageRemoved = ref(false);
const videoRemoved = ref(false);
const trailerRemoved = ref(false);

// Options for dropdowns
const customers = ref<any[]>([]);
const categories = ref<any[]>([]);

// Form data
const formData = reactive<IVideoForm>({
  id: null,
  customer_id: null,
  title: "",
  content: "",
  image: undefined,
  video_name: undefined,
  trailer: undefined,
  category_id: [],
});

// Form validation rules
const rules = computed(() => ({
  title: [
    { required: true, message: t('modules.video.form.validation.titleRequired'), trigger: "blur" },
  ],
  customer_id: canSelectCustomer.value
    ? [
        {
          required: true,
          message: t('modules.video.form.validation.customerRequired'),
          trigger: "change",
        },
      ]
    : [], // No validation for customer_id if user can't select customers
}));

// Fetch video data and populate form
const fetchVideoData = async (id: number) => {
  loading.value = true;
  try {
    const response = await getVideoById(id);
    videoData.value = response;

    // Populate form data
    formData.id = videoData.value.id;
    formData.customer_id = videoData.value.customer_id;
    formData.title = videoData.value.title;
    formData.content = videoData.value.content || "";

    // Populate categories
    if (
      videoData.value.movie_categories &&
      videoData.value.movie_categories.length > 0
    ) {
      formData.category_id = videoData.value.movie_categories.map(
        (cat: any) => cat.id
      );
    }


    console.log("Form data populated:", formData);
  } catch (error) {
    console.error("Failed to fetch video data:", error);
    message.error(t('modules.video.form.validation.updateError'));
    router.push("/video");
  } finally {
    loading.value = false;
  }
};

// File upload handlers
const beforeUploadImage = (file: File) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error(t('modules.video.form.validation.invalidImage'));
    return false;
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error(t('modules.video.form.validation.imageTooLarge'));
    return false;
  }
  return true;
};

const beforeUploadVideo = (file: File) => {
  const isVideo = file.type.startsWith("video/");
  if (!isVideo) {
    message.error(t('modules.video.form.validation.invalidVideo'));
    return false;
  }
  const isLt100M = file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    message.error(t('modules.video.form.validation.videoTooLarge'));
    return false;
  }
  return true;
};

const beforeUploadTrailer = (file: File) => {
  const isVideo = file.type.startsWith("video/");
  if (!isVideo) {
    message.error(t('modules.video.form.validation.invalidVideo'));
    return false;
  }
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message.error(t('modules.video.form.validation.trailerTooLarge'));
    return false;
  }
  return true;
};

const handleImageUpload: UploadProps["customRequest"] = ({
  file,
  onSuccess,
}) => {
  const fileObj = file as File;
  formData.image = fileObj;
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
  const fileObj = file as File;
  formData.video_name = fileObj;
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
  const fileObj = file as File;
  formData.trailer = fileObj;
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
  if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
    const file = info.fileList[0].originFileObj;
    formData.image = file;
  }
};

const handleVideoChange = (info: any) => {
  if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
    const file = info.fileList[0].originFileObj;
    formData.video_name = file;
  }
};

const handleTrailerChange = (info: any) => {
  if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
    const file = info.fileList[0].originFileObj;
    formData.trailer = file;
  }
};

// Open video in new tab
const openVideo = (url: string) => {
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

// Media removal and restoration functions
const removeImage = () => {
  imageRemoved.value = true;
  imageFileList.value = []; // Clear any new image that might be selected
  formData.image = undefined;
};

const restoreImage = () => {
  imageRemoved.value = false;
};

const removeVideo = () => {
  videoRemoved.value = true;
  videoFileList.value = []; // Clear any new video that might be selected
  formData.video_name = undefined;
};

const restoreVideo = () => {
  videoRemoved.value = false;
};

const removeTrailer = () => {
  trailerRemoved.value = true;
  trailerFileList.value = []; // Clear any new trailer that might be selected
  formData.trailer = undefined;
};

const restoreTrailer = () => {
  trailerRemoved.value = false;
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
    submitting.value = true;

    // Prepare form data based on file selection and removal states
    const submitData: IVideoForm = {
      ...formData,
      // Handle image: new file selected, or explicitly removed, or keep existing
      image:
        imageFileList.value.length > 0
          ? formData.image
          : imageRemoved.value
          ? null
          : undefined,
      // Handle video: new file selected, or explicitly removed, or keep existing
      video_name:
        videoFileList.value.length > 0
          ? formData.video_name
          : videoRemoved.value
          ? null
          : undefined,
      // Handle trailer: new file selected, or explicitly removed, or keep existing
      trailer:
        trailerFileList.value.length > 0
          ? formData.trailer
          : trailerRemoved.value
          ? null
          : undefined,
    };

    console.log("Submitting data:", {
      id: submitData.id,
      title: submitData.title,
      image:
        imageFileList.value.length > 0
          ? "New file selected"
          : imageRemoved.value
          ? "Explicitly removed (null)"
          : "Keep existing",
      video_name:
        videoFileList.value.length > 0
          ? "New file selected"
          : videoRemoved.value
          ? "Explicitly removed (null)"
          : "Keep existing",
      trailer:
        trailerFileList.value.length > 0
          ? "New file selected"
          : trailerRemoved.value
          ? "Explicitly removed (null)"
          : "Keep existing",
    });

    const response = await updateVideo(submitData);
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
      message.error(error.response?.data?.message || t('modules.video.form.validation.updateError'));
    }
  } finally {
    submitting.value = false;
  }
};

const handleCancel = () => {
  router.push("/video");
};

onMounted(async () => {
  const videoId = parseInt(route.params.id as string);
  if (isNaN(videoId)) {
    message.error(t('modules.video.form.validation.updateError'));
    router.push("/video");
    return;
  }

  // Fetch all data in parallel
  await Promise.all([
    fetchVideoData(videoId),
    fetchCustomers(),
    fetchCategories(),
  ]);
});
</script>

<style lang="scss" scoped>
.edit-video-container {
  min-height: 400px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;

  p {
    margin: 0;
    color: #666;
    font-size: 16px;
  }
}

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

.current-media {
  margin-bottom: 12px;

  .current-label {
    margin: 0 0 8px 0;
    font-size: 12px;
    color: #666;
    font-weight: 500;
  }

  .current-image {
    border-radius: 4px;
    border: 1px solid #f0f0f0;
    margin-bottom: 8px;
  }

  .current-link {
    color: #1890ff;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-right: 8px;

    &:hover {
      color: #40a9ff;
    }
  }

  .remove-btn {
    color: #ff4d4f;
    padding: 0;
    height: auto;
    font-size: 12px;

    &:hover {
      color: #ff7875;
    }
  }
}

.removed-media {
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 4px;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;

  .removed-label {
    margin: 0 0 4px 0;
    font-size: 12px;
    color: #ff4d4f;
    font-weight: 500;
  }

  .ant-btn-link {
    padding: 0;
    height: auto;
    font-size: 12px;
    color: #1890ff;

    &:hover {
      color: #40a9ff;
    }
  }
}

@media (max-width: 768px) {
  .edit-video-container {
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
