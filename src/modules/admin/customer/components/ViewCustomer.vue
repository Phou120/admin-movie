<template>
  <div class="customer-view-header">
    <h1>{{ t('modules.customer.viewDetails') }}</h1>
    <div>
      <a-button @click="goBack">
        <arrow-left-outlined />
        {{ t('modules.customer.backToCustomers') }}
      </a-button>
    </div>
  </div>

  <div class="form-container">
    <a-card
      :title="t('modules.customer.form.customerInformation')"
      class="customer-view-card"
      v-if="!loading"
    >
      <a-descriptions :column="2" bordered>
        <!-- Profile Image -->
        <a-descriptions-item :label="t('modules.customer.form.profileImage')" :span="2">
          <a-avatar
            :src="customer.user?.profile?.image_url"
            :size="100"
            shape="circle"
            class="profile-avatar"
          >
            <template #icon>
              <user-outlined v-if="!customer.user?.profile?.image_url" />
            </template>
          </a-avatar>
        </a-descriptions-item>

        <!-- Basic Information -->
        <a-descriptions-item :label="t('modules.customer.columns.name')">
          {{ customer.name || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('modules.customer.columns.surname')">
          {{ customer.surname || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('modules.customer.columns.email')">
          <a :href="`mailto:${customer.email}`">{{ customer.email || "-" }}</a>
        </a-descriptions-item>
        <a-descriptions-item :label="t('modules.customer.form.telephone')">
          <a :href="`tel:${customer.tel}`">{{ customer.tel || "-" }}</a>
        </a-descriptions-item>
        <a-descriptions-item :label="t('modules.customer.form.type')" :span="2">
          <a-tag :color="getTypeColor(customer.type)" class="type-badge">
            {{ customer.type?.toUpperCase() || "-" }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item :label="t('modules.customer.columns.status')" :span="2">
          <a-tag :color="getStatusColor(customer.status)" class="status-badge">
            {{ customer.status?.toUpperCase() || "-" }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item :label="t('modules.customer.columns.address')" :span="2">
          {{ customer.address || "-" }}
        </a-descriptions-item>

        <!-- System Information -->
        <a-descriptions-item :label="t('modules.customer.form.bankAccountName')">
          {{ customer.bank_account_name || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('modules.customer.form.bankAccountNumber')">
          {{ customer.bank_account_number || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('modules.customer.columns.createdAt')">
          {{ formatDate(customer.created_at) }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('modules.customer.columns.updatedAt')">
          {{ formatDate(customer.updated_at) }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- Loading skeleton -->
    <a-card class="customer-view-card" v-else>
      <a-skeleton active :paragraph="{ rows: 8 }" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useCustomer } from "../composible/index";
import { useI18n } from "vue-i18n";
import formatDate from "../../../../common/utils/format-date.util";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { getById } = useCustomer();

const loading = ref(false);
const customer = ref<any>({});

// Load customer data
const loadCustomerData = async () => {
  loading.value = true;
  try {
    const customerId = Number(route.params.id);
    console.log("Loading customer with ID:", customerId);

    const response = await getById(customerId);
    customer.value = response.data || response;

    console.log("Customer data loaded:", customer.value);
  } catch (error) {
    console.error("Error loading customer data:", error);
    message.error(t('modules.customer.error.loadFailed'));
    router.push("/customer");
  } finally {
    loading.value = false;
  }
};

// Get status color for badges
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "success"; // Green
    case "pending":
      return "warning"; // Orange/Yellow
    case "rejected":
      return "error"; // Red
    case "active":
      return "processing"; // Blue
    case "inactive":
      return "default"; // Gray
    default:
      return "blue"; // Default blue
  }
};

// Get type color for badges
const getTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case "user":
      return "blue"; // Blue for users
    case "member":
      return "green"; // Green for members
    case "admin":
      return "purple"; // Purple for admin
    default:
      return "default"; // Gray default
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
.customer-view-header {
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

.customer-view-card {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-avatar {
  border: 3px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-badge,
.type-badge {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  letter-spacing: 0.5px;
}

:deep(.ant-descriptions-item-label) {
  font-weight: 600;
  color: #666;
}

:deep(.ant-descriptions-item-content) {
  color: #333;
}

:deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
  background-color: #fafafa;
}

:deep(.ant-descriptions-bordered .ant-descriptions-item-content) {
  background-color: #fff;
}

// Responsive styles
@media screen and (max-width: 768px) {
  .customer-view-header {
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

  .customer-view-card {
    margin: 0;
  }

  :deep(.ant-descriptions) {
    .ant-descriptions-item {
      padding: 8px 12px;
    }
  }
}

@media screen and (max-width: 576px) {
  .customer-view-header h1 {
    font-size: 18px;
  }

  :deep(.ant-descriptions) {
    .ant-descriptions-item-label,
    .ant-descriptions-item-content {
      padding: 6px 8px;
    }
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
  }
}
</style>
