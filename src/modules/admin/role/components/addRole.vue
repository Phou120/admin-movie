<template>
  <div class="add-role-container">
    <div class="page-header">
      <a-button type="link" @click="goBack" class="back-button">
        <arrow-left-outlined />
        Back
      </a-button>
      <h1>Add New Role</h1>
    </div>

    <div class="form-wrapper">
      <a-card :bordered="false">
        <a-form
          :model="formData"
          layout="vertical"
          :rules="rules"
          ref="formRef"
          @finish="handleSubmit"
        >
          <a-row :gutter="16">
            <a-col :xs="24" :sm="24" :md="12">
              <a-form-item label="Name" name="name" required>
                <a-input
                  v-model:value="formData.name"
                  placeholder="Enter role name (e.g., manager)"
                  size="large"
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12">
              <a-form-item label="Display Name" name="display_name" required>
                <a-input
                  v-model:value="formData.display_name"
                  placeholder="Enter display name (e.g., Manager)"
                  size="large"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-divider />

          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item name="permission_ids" required>
                <template #label>
                  <span class="permissions-label">
                    <span class="required-mark">*</span> Permissions
                  </span>
                </template>

                <div class="permissions-container" v-if="!loadingPermissions">
                  <!-- Select All Checkbox -->
                  <div class="select-all-section">
                    <a-checkbox
                      :checked="isAllSelected"
                      :indeterminate="isSomeSelected"
                      @change="toggleAll"
                    >
                      Permissions
                    </a-checkbox>
                  </div>

                  <a-divider style="margin: 16px 0" />

                  <!-- Group permissions by module -->
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
                            formData.permission_ids.includes(permission.id)
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
                  <span style="margin-left: 12px">Loading permissions...</span>
                </div>

                <div
                  class="selected-count"
                  v-if="formData.permission_ids.length > 0"
                >
                  {{ formData.permission_ids.length }} permission(s) selected
                </div>
              </a-form-item>
            </a-col>
          </a-row>

          <a-divider />

          <div class="form-actions">
            <a-button size="large" class="custom-cancel" @click="goBack">
              <RollbackOutlined />
              Go Back
            </a-button>
            <a-button
              type="primary"
              size="large"
              html-type="submit"
              :loading="submitting"
              class="submit-btn"
            >
              <SaveOutlined />
              Create Role
            </a-button>
          </div>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  RollbackOutlined,
} from "@ant-design/icons-vue";
import type { FormInstance } from "ant-design-vue";
import { useRoles } from "../composible";
import type { IRoleForm, PermissionModule } from "../interface/role.interface";
import { usePermission } from "../../permission/composible";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";

const router = useRouter();
const { createRole } = useRoles();
const { fetchAll: fetchAllPermissions } = usePermission();

const formRef = ref<FormInstance>();
const loadingPermissions = ref(false);
const submitting = ref(false);
const permissionModules = ref<PermissionModule[]>([]);

const formData = reactive<IRoleForm>({
  name: "",
  display_name: "",
  permission_ids: [],
});

const rules = {
  name: [
    { required: true, message: "Please enter role name", trigger: "blur" },
    { min: 2, message: "Name must be at least 2 characters", trigger: "blur" },
  ],
  display_name: [
    { required: true, message: "Please enter display name", trigger: "blur" },
  ],
  permission_ids: [
    {
      required: true,
      type: "array",
      min: 1,
      message: "Please select at least one permission",
      trigger: "change",
    },
  ],
};

// Computed: Check if all permissions are selected
const isAllSelected = computed(() => {
  const allPermissionIds = permissionModules.value.flatMap((module) =>
    module.permissions.map((p) => p.id)
  );
  return (
    allPermissionIds.length > 0 &&
    allPermissionIds.every((id) => formData.permission_ids.includes(id))
  );
});

// Computed: Check if some permissions are selected
const isSomeSelected = computed(() => {
  const allPermissionIds = permissionModules.value.flatMap((module) =>
    module.permissions.map((p) => p.id)
  );
  const selectedCount = allPermissionIds.filter((id) =>
    formData.permission_ids.includes(id)
  ).length;
  return selectedCount > 0 && selectedCount < allPermissionIds.length;
});

// Toggle all permissions
function toggleAll() {
  if (isAllSelected.value) {
    // Deselect all
    formData.permission_ids = [];
  } else {
    // Select all
    const allPermissionIds = permissionModules.value.flatMap((module) =>
      module.permissions.map((p) => p.id)
    );
    formData.permission_ids = [...allPermissionIds];
  }
}

// Check if all permissions in a module are selected
function isModuleChecked(module: PermissionModule): boolean {
  if (!module.permissions || module.permissions.length === 0) return false;
  return module.permissions.every((p) =>
    formData.permission_ids.includes(p.id)
  );
}

// Check if some (but not all) permissions in a module are selected
function isModuleIndeterminate(module: PermissionModule): boolean {
  if (!module.permissions || module.permissions.length === 0) return false;
  const selectedCount = module.permissions.filter((p) =>
    formData.permission_ids.includes(p.id)
  ).length;
  return selectedCount > 0 && selectedCount < module.permissions.length;
}

// Toggle all permissions in a module
function toggleModule(module: PermissionModule) {
  const allChecked = isModuleChecked(module);

  if (allChecked) {
    // Remove all permissions from this module
    formData.permission_ids = formData.permission_ids.filter(
      (id) => !module.permissions.some((p) => p.id === id)
    );
  } else {
    // Add all permissions from this module
    module.permissions.forEach((permission) => {
      if (!formData.permission_ids.includes(permission.id)) {
        formData.permission_ids.push(permission.id);
      }
    });
  }
}

// Toggle individual permission
function togglePermission(permissionId: number) {
  const index = formData.permission_ids.indexOf(permissionId);
  if (index > -1) {
    formData.permission_ids.splice(index, 1);
  } else {
    formData.permission_ids.push(permissionId);
  }
}

// Load all permissions grouped by modules
async function loadAllPermissions() {
  loadingPermissions.value = true;
  try {
    // Your API returns data in the format:
    // { data: [ { id, name, display_name, permissions: [...] }, ... ] }
    const res = await fetchAllPermissions(1, 1000);

    // Store the modules with their permissions
    permissionModules.value = res.data || [];
  } catch (error) {
    console.error("Failed to load permissions:", error);
    message.error("Failed to load permissions");
  } finally {
    loadingPermissions.value = false;
  }
}

// Handle form submission
async function handleSubmit() {
  try {
    submitting.value = true;

    // Create the role - sends: { name, display_name, permission_ids: [1,2,3] }
    const response = await createRole(formData);

    showSuccessNotification(response.message);

    // Navigate back to roles list
    router.push({ name: "roles" });
  } catch (error: any) {
    console.error("Failed to create role:", error);
    showErrorNotification("Failed to create role: ", error);
  } finally {
    submitting.value = false;
  }
}

// Go back to roles list
function goBack() {
  router.back();
}

onMounted(() => {
  loadAllPermissions();
});
</script>

<style scoped lang="scss">
.add-role-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 12px;

  .back-button {
    padding: 0;
    font-size: 18px;
    color: #0d334aff;

    &:hover {
      color: #0d334acc;
    }
  }

  h1 {
    font-size: 18px;
    font-weight: 600;
    margin-left: 50px;
    color: #0d334aff;
  }
}

.form-wrapper {
  :deep(.ant-card) {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  :deep(.ant-card-body) {
    padding: 32px;
  }
}

.permissions-label {
  font-size: 15px;
  font-weight: 500;
  color: #000;

  .required-mark {
    color: #ff4d4f;
    margin-right: 4px;
  }
}

.permissions-container {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
}

.select-all-section {
  :deep(.ant-checkbox-wrapper) {
    font-size: 15px;
    font-weight: 500;
  }
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.permission-module {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
}

.module-header {
  margin-bottom: 16px;

  .module-name {
    font-size: 16px;
    font-weight: 600;
    color: #000;
  }

  :deep(.ant-checkbox-wrapper) {
    font-size: 16px;
  }
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding-left: 24px;
}

.permission-item {
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 12px 16px;
  transition: all 0.2s;

  &:hover {
    background-color: #e8e8e8;
  }

  :deep(.ant-checkbox-wrapper) {
    width: 100%;
    margin: 0;
    font-size: 14px;
    color: #333;
  }

  :deep(.ant-checkbox-wrapper-checked) {
    font-weight: 500;
  }
}

.selected-count {
  margin-top: 12px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.custom-cancel {
  &:hover {
    border-color: #ff4d4f;
    color: #ff4d4f;
  }
}

.submit-btn {
  background-color: #0d334aff;
  border-color: #0d334aff;

  &:hover {
    background-color: #0d334acc;
    border-color: #0d334acc;
  }
}

// Responsive styles
@media screen and (max-width: 1200px) {
  .permission-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 992px) {
  .permission-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .add-role-container {
    padding: 12px;
  }

  .page-header {
    h1 {
      font-size: 24px;
    }
  }

  .form-wrapper {
    :deep(.ant-card-body) {
      padding: 20px;
    }
  }

  .permission-grid {
    grid-template-columns: 1fr 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
}

@media screen and (max-width: 576px) {
  .page-header {
    h1 {
      font-size: 20px;
    }
  }

  .form-wrapper {
    :deep(.ant-card-body) {
      padding: 16px;
    }
  }

  .permissions-container {
    padding: 16px;
  }

  .permission-grid {
    padding-left: 16px;
    grid-template-columns: 1fr;
  }

  .permission-item {
    padding: 10px 12px;
  }
}
</style>
