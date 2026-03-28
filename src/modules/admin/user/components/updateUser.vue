<template>
  <div class="update-user-page">
    <div class="page-header">
      <a-button type="link" @click="goBack" class="back-button">
        <arrow-left-outlined />
        {{ t('actions.back') }}
      </a-button>
      <h1>{{ t('modules.user.editForm.title') }}</h1>
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
            <a-form-item :label="t('modules.user.editForm.profileImage')" name="image">
              <a-upload
                name="image"
                list-type="picture-card"
                :show-upload-list="false"
                :before-upload="beforeUploadAdd"
              >
                <div v-if="!previewImage">
                  <plus-outlined />
                  <div style="margin-top: 8px">{{ t('modules.user.editForm.actions.upload') }}</div>
                </div>
                <img
                  v-else
                  :src="previewImage"
                  alt="profile"
                  style="width: 100%"
                />
              </a-upload>
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="6">
            <a-form-item :label="t('modules.user.editForm.email')" name="email">
              <a-input
                v-model:value="formState.email"
                :placeholder="t('modules.user.editForm.placeholder.email')"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="6">
            <a-form-item :label="t('modules.user.editForm.name')" name="name">
              <a-input
                v-model:value="formState.name"
                :placeholder="t('modules.user.editForm.placeholder.name')"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="6">
            <a-form-item :label="t('modules.user.editForm.surname')" name="surname">
              <a-input
                v-model:value="formState.surname"
                :placeholder="t('modules.user.editForm.placeholder.surname')"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="6">
            <a-form-item :label="t('modules.user.editForm.telephone')" name="tel">
              <a-input
                v-model:value="formState.tel"
                :placeholder="t('modules.user.editForm.placeholder.telephone')"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-form-item :label="t('modules.user.editForm.roles')" name="roles">
              <a-select
                v-model:value="formState.roles"
                mode="multiple"
                :placeholder="t('modules.user.editForm.placeholder.roles')"
                :options="roleOptions"
                :loading="loadingRolePermissions"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :md="6"></a-col>

          <a-divider />

          <a-col :span="24">
            <a-form-item name="permissions" required>
              <template #label>
                <span class="permissions-label">
                  <span class="required-mark">*</span> {{ t('modules.user.editForm.permissions') }}
                </span>
              </template>

              <a-form-item-rest>
                <div class="permissions-container" v-if="!loadingPermissions">
                  <div class="select-all-section">
                    <a-checkbox
                      :checked="isAllSelected"
                      :indeterminate="isSomeSelected"
                      @change="toggleAll"
                    >
                      {{ t('modules.user.editForm.permissions') }}
                    </a-checkbox>
                  </div>

                  <a-divider style="margin: 16px 0" />

                  <div
                    v-for="module in permissionModules"
                    :key="module.id"
                    class="permission-module"
                  >
                    <div class="module-header">
                      <a-checkbox
                        :checked="isModuleChecked(module)"
                        :indeterminate="isModuleIndeterminate(module)"
                        @change="toggleModule(module)"
                      >
                        <span class="module-name">{{
                          module.display_name
                        }}</span>
                      </a-checkbox>
                    </div>

                    <div class="permission-grid">
                      <div
                        v-for="permission in module.permissions"
                        :key="permission.id"
                        class="permission-item"
                      >
                        <a-checkbox
                          :checked="
                            formState.permissions.includes(permission.id)
                          "
                          @change="togglePermission(permission.id)"
                        >
                          {{ permission.display_name }}
                        </a-checkbox>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="loading-container">
                  <a-spin />
                  <span style="margin-left: 12px">{{ t('common.loading') }}</span>
                </div>

                <div
                  class="selected-count"
                  v-if="formState.permissions.length > 0"
                >
                  {{ t('modules.user.editForm.selectedCount', { count: formState.permissions.length }) }}
                </div>
              </a-form-item-rest>
            </a-form-item>
          </a-col>

          <a-divider />

          <a-col :xs="24">
            <a-form-item>
              <div style="display: flex; justify-content: flex-end">
                <a-space>
                  <a-button class="custom-reset-btn" @click="goBack">
                    <RollbackOutlined />
                    {{ t('modules.user.editForm.actions.goBack') }}
                  </a-button>
                  <a-button
                    type="primary"
                    class="submit-btn"
                    html-type="submit"
                    :loading="submitting"
                  >
                    <SaveOutlined />
                    {{ t('modules.user.editForm.actions.updateUser') }}
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
      <p>{{ t('modules.user.editForm.loadingUserData') }}</p>
    </div>

    <a-modal :open="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="preview" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  SaveOutlined,
  RollbackOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import { useUsers } from "../composible";
import type { IUserForm } from "../interface/user.interface";
import { useRoles } from "../../role/composible";
import type { IRoleEntity } from "../../role/entity/role.entity";
import type { IPermissionEntity } from "../../permission/entity/permission.entity";
import { usePermission } from "../../permission/composible";
import { showSuccessNotification } from "../../../../common/utils/notification";
import { useRouter, useRoute } from "vue-router";

const { upload, updateUser, fetchById } = useUsers();
const { fetchAll, fetchById: fetchRolesById } = useRoles();
const { fetchAll: fetchAllPermissions } = usePermission();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

interface SelectOption {
  value: number | string;
  label: string;
}

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

// Refs
const loading = ref<boolean>(true);
const previewVisible = ref<boolean>(false);
const previewImage = ref<string>("");
const loadingPermissions = ref(false);
const loadingRolePermissions = ref(false);
const submitting = ref(false);
const originalImage = ref<string>("");
const isInitialLoad = ref(true);

// Role data storage
const roleModules = ref<IRoleEntity[]>([]);
const roleOptions = ref<SelectOption[]>([]);
// Permission data storage, grouped by modules
const permissionModules = ref<IPermissionEntity[]>([]);

// Validation rules - password is optional for update
const rules = computed(() => ({
  email: [
    { required: true, message: t('modules.user.editForm.validation.emailRequired'), trigger: "blur" },
    {
      type: "email",
      message: t('modules.user.editForm.validation.emailInvalid'),
      trigger: "blur",
    },
  ],
  password: [
    {
      min: 6,
      message: t('modules.user.editForm.validation.passwordMinLength'),
      trigger: "blur",
    },
  ],
  confirm_password: [
    {
      validator: async (_rule: Rule, value: string) => {
        if (formState.password && value !== formState.password) {
          return Promise.reject(t('modules.user.editForm.validation.passwordMismatch'));
        }
        return Promise.resolve();
      },
      trigger: "blur",
    },
  ],
  name: [{ required: true, message: t('modules.user.editForm.validation.nameRequired'), trigger: "blur" }],
  surname: [
    { required: true, message: t('modules.user.editForm.validation.surnameRequired'), trigger: "blur" },
  ],
  tel: [
    { required: true, message: t('modules.user.editForm.validation.telephoneRequired'), trigger: "blur" },
  ],
  roles: [
    {
      required: true,
      message: t('modules.user.editForm.validation.rolesRequired'),
      trigger: "change",
      type: "array",
    },
  ],
  permissions: [
    {
      validator: (_rule: Rule, value: number[]) => {
        if (value.length === 0) {
          return Promise.reject(t('modules.user.editForm.validation.permissionsRequired'));
        }
        return Promise.resolve();
      },
      trigger: "change",
    },
  ],
}));

// --- Fetch User Data ---
const loadUserData = async () => {
  loading.value = true;
  try {
    const response = await fetchById(userId.value);
    const userData = response.data;

    // Populate form with existing user data
    formState.email = userData.email || "";
    formState.name = userData.name || "";
    formState.surname = userData.surname || "";
    formState.tel = userData.tel || "";
    if (userData.profile) {
      formState.image = userData.profile.image || "";
      formState.image_url = userData.profile.image_url || "";
    }
    formState.roles = userData.roles?.map((role: any) => role.id) || [];
    formState.permissions =
      userData.permissions?.map((perm: any) => perm.id) || [];

    // Set preview image if exists
    if (userData.profile && userData.profile.image_url) {
      originalImage.value = userData.profile.image_url;
      previewImage.value = userData.profile.image_url;
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    message.error(t('modules.user.editForm.validation.loadUserError'));
    router.push({ name: "user" });
  } finally {
    loading.value = false;
    // After initial load is complete, enable role watcher
    setTimeout(() => {
      isInitialLoad.value = false;
    }, 500);
  }
};

// --- Role Functions ---
const mapRolesToOptions = (roles: IRoleEntity[]) => {
  roleOptions.value = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));
};

const fetchRoles = async () => {
  try {
    const response = await fetchAll(1, 100);
    roleModules.value = response.data || [];
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    message.error(t('modules.user.editForm.validation.loadRolesError'));
  }
};

// Watch for changes in roleModules to populate roleOptions
watch(
  roleModules,
  (newRoles) => {
    if (newRoles && newRoles.length > 0) {
      mapRolesToOptions(newRoles);
    }
  },
  { immediate: true }
);

// Watch for role selection changes and auto-select permissions (only after initial load)
watch(
  () => formState.roles,
  async (newRoles, oldRoles) => {
    // Skip during initial data load
    if (isInitialLoad.value) {
      return;
    }

    if (!newRoles || newRoles.length === 0) {
      return;
    }

    // Find newly added roles
    const addedRoles = oldRoles
      ? newRoles.filter((roleId: number) => !oldRoles.includes(roleId))
      : newRoles;

    if (addedRoles.length === 0) {
      return;
    }

    loadingRolePermissions.value = true;

    try {
      // Fetch permissions for newly added roles
      const permissionIds = new Set<number>(formState.permissions);

      for (const roleId of addedRoles) {
        try {
          const response = await fetchRolesById(roleId);
          if (response.data?.role_permissions) {
            response.data.role_permissions.forEach((perm: any) => {
              if (perm.id) {
                permissionIds.add(perm.id);
              }
            });
          }
        } catch (error) {
          console.error(`Failed to fetch role ${roleId} permissions:`, error);
          message.warning(t('modules.user.editForm.validation.loadRolePermissionsError', { roleId }));
        }
      }

      formState.permissions = Array.from(permissionIds);
    } finally {
      loadingRolePermissions.value = false;
    }
  },
  { deep: true }
);

// --- Permission Functions & Computed Properties ---
const isAllSelected = computed(() => {
  const allPermissionIds = permissionModules.value.flatMap((module) =>
    module.permissions?.map((p) => p.id)
  );
  const definedIds = allPermissionIds.filter(
    (id) => id !== undefined
  ) as number[];

  return (
    definedIds.length > 0 &&
    definedIds.every((id) => formState.permissions.includes(id))
  );
});

const isSomeSelected = computed(() => {
  const allPermissionIds = permissionModules.value.flatMap((module) =>
    module.permissions?.map((p) => p.id)
  );
  const selectedCount = allPermissionIds.filter((id) =>
    formState.permissions.includes(id as number)
  ).length;
  return selectedCount > 0 && selectedCount < allPermissionIds.length;
});

function toggleAll() {
  if (isAllSelected.value) {
    formState.permissions = [];
  } else {
    const allPermissionIds = permissionModules.value.flatMap((module) =>
      module.permissions?.map((p) => p.id)
    );
    formState.permissions = allPermissionIds.filter(
      (id) => id !== undefined
    ) as number[];
  }
}

function isModuleChecked(module: IPermissionEntity): boolean {
  if (!module.permissions || module.permissions.length === 0) return false;
  return module.permissions.every((p) => formState.permissions?.includes(p.id));
}

function isModuleIndeterminate(module: IPermissionEntity): boolean {
  if (!module.permissions || module.permissions.length === 0) return false;
  const selectedCount = module.permissions.filter((p) =>
    formState.permissions?.includes(p.id)
  ).length;
  return selectedCount > 0 && selectedCount < module.permissions.length;
}

function toggleModule(module: IPermissionEntity) {
  const allChecked = isModuleChecked(module);

  if (allChecked) {
    formState.permissions = formState.permissions.filter(
      (id) => !module.permissions?.some((p) => p.id === id)
    );
  } else {
    module.permissions?.forEach((permission) => {
      if (!formState.permissions.includes(permission.id)) {
        formState.permissions.push(permission.id);
      }
    });
  }
}

function togglePermission(permissionId: number) {
  const index = formState.permissions.indexOf(permissionId);
  if (index > -1) {
    formState.permissions.splice(index, 1);
  } else {
    formState.permissions.push(permissionId);
  }
}

async function loadAllPermissions() {
  loadingPermissions.value = true;
  try {
    const res = await fetchAllPermissions(1, 1000);
    permissionModules.value = res.data || [];
  } catch (error) {
    console.error("Failed to load permissions:", error);
    message.error(t('modules.user.editForm.validation.loadPermissionsError'));
  } finally {
    loadingPermissions.value = false;
  }
}

// --- General Functions ---
const goBack = (): void => {
  router.push({ name: "user" });
};

const beforeUploadAdd = async (file: File): Promise<boolean> => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error(t('modules.user.editForm.validation.imageFileType'));
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error(t('modules.user.editForm.validation.imageFileSize'));
    return false;
  }

  try {
    const url = await upload(file);
    formState.image = url;
    previewImage.value = URL.createObjectURL(file);
  } catch (error) {
    console.error("Upload error:", error);
  }

  return false;
};

const handleCancel = (): void => {
  previewVisible.value = false;
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
      roles: formState.roles,
      permissions: formState.permissions,
    };

    // Only include password if it's been changed
    if (formState.password && formState.password.trim() !== "") {
      updateData.password = formState.password;
      updateData.confirm_password = formState.confirm_password;
    }

    const response = await updateUser(userId.value, updateData);
    showSuccessNotification(response.message || t('modules.user.editForm.updateSuccess'));
    console.log("User updated:", response);
    router.push({ name: "user" });
  } catch (error: any) {
    console.error("Failed to update user:", error);
    const errorMessage =
      error?.response?.data?.message || t('modules.user.editForm.updateError');
    message.error(errorMessage);
  } finally {
    submitting.value = false;
  }
}

const onFinishFailed = (errorInfo: any): void => {
  console.log("Failed:", errorInfo);
  if (formState.permissions.length === 0) {
    message.error(t('modules.user.editForm.validation.permissionsRequired'));
  } else {
    message.error(t('modules.user.editForm.validation.formError'));
  }
};

// Load all data on mount
onMounted(async () => {
  await Promise.all([fetchRoles(), loadAllPermissions()]);
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

  &:hover {
    background-color: #0d334acc;
    border-color: #0d334acc;
  }
}

.custom-reset-btn {
  color: #ff4d4f;
  &:hover {
    border-color: #ff4d4f;
    color: #ff4d4f;
  }
}
</style>
