<template>
  <div class="customer-dashboard">
    <!-- Header -->
    <a-page-header
      :title="customerData?.name ? `${customerData.name} ${customerData.surname}` : t('modules.customer.title')"
      :sub-title="t('modules.customer.dashboardTitle')"
      @back="handleBack"
    >
      <template #extra>
        <a-space>
          <a-button @click="refreshData" :loading="loading">
            <template #icon>
              <ReloadOutlined />
            </template>
            {{ t("common.refresh") }}
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-wrapper">
      <a-spin size="large">
        <template #indicator>
          <LoadingOutlined style="font-size: 24px" spin />
        </template>
        {{ t("common.loading") }}
      </a-spin>
    </div>

    <!-- Error State -->
    <a-alert
      v-else-if="error"
      type="error"
      :message="error"
      show-icon
      closable
      @close="error = ''"
      class="error-alert"
    >
      <template #action>
        <a-button type="link" size="small" @click="refreshData">
          {{ t("common.retry") }}
        </a-button>
      </template>
    </a-alert>

    <!-- Dashboard Content -->
    <div v-else class="dashboard-content">
      <!-- Summary Cards -->
      <a-row :gutter="[16, 16]" class="metrics-row">
        <!-- Total Revenue Card -->
        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="metric-card revenue-card" :loading="loading">
            <a-statistic
              :title="t('modules.customer.form.total_revenue')"
              :value="customerData?.total_revenue || 0"
              :precision="2"
              suffix="LAK"
              :value-style="{ color: '#3f8600', fontSize: '24px', fontWeight: 'bold' }"
            >
              <template #prefix>
                <DollarOutlined style="color: #52c41a" />
              </template>
            </a-statistic>
          </a-card>
        </a-col>

        <!-- Paid Revenue Card -->
        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="metric-card paid-card" :loading="loading">
            <a-statistic
              :title="t('modules.customer.form.paid_revenue')"
              :value="customerData?.paid_revenue || 0"
              :precision="2"
              suffix="LAK"
              :value-style="{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }"
            >
              <template #prefix>
                <CheckCircleOutlined style="color: #1890ff" />
              </template>
            </a-statistic>
          </a-card>
        </a-col>

        <!-- Unpaid Revenue Card -->
        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="metric-card unpaid-card" :loading="loading">
            <a-statistic
              :title="t('modules.customer.form.unpaid_revenue')"
              :value="customerData?.unpaid_revenue || 0"
              :precision="2"
              suffix="LAK"
              :value-style="{ color: '#faad14', fontSize: '24px', fontWeight: 'bold' }"
            >
              <template #prefix>
                <ClockCircleOutlined style="color: #faad14" />
              </template>
            </a-statistic>
          </a-card>
        </a-col>

        <!-- Status Card -->
        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="metric-card status-card" :loading="loading">
            <a-statistic
              :title="t('modules.customer.columns.status')"
              :value="getStatusLabel(customerData?.status)"
              :value-style="{
                color: getStatusColor(customerData?.status),
                fontSize: '20px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }"
            >
              <template #prefix>
                <TrophyOutlined
                  :style="{ color: getStatusColor(customerData?.status) }"
                />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>

      <!-- Customer Details Section -->
      <a-row :gutter="[16, 16]" class="details-section">
        <!-- Profile Information -->
        <a-col :xs="24" :lg="12">
          <a-card
            :title="t('modules.customer.form.customerInformation')"
            class="info-card"
          >
            <template #extra>
              <UserOutlined />
            </template>
            <a-descriptions :column="1" bordered>
              <a-descriptions-item :label="t('modules.customer.columns.name')">
                {{ customerData?.name }} {{ customerData?.surname }}
              </a-descriptions-item>
              <a-descriptions-item :label="t('modules.customer.columns.email')">
                <a :href="`mailto:${customerData?.email}`">
                  {{ customerData?.email }}
                </a>
              </a-descriptions-item>
              <a-descriptions-item :label="t('modules.customer.columns.phone')">
                <a :href="`tel:${customerData?.tel}`">
                  {{ customerData?.tel }}
                </a>
              </a-descriptions-item>
              <a-descriptions-item :label="t('modules.customer.form.address')">
                {{ customerData?.address || "-" }}
              </a-descriptions-item>
              <a-descriptions-item :label="t('modules.customer.form.type')">
                <a-tag color="blue">{{ customerData?.type }}</a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>

        <!-- Financial Summary -->
        <a-col :xs="24" :lg="12">
          <a-card
            :title="t('modules.customer.financialSummary')"
            class="info-card"
          >
            <template #extra>
              <DollarOutlined />
            </template>
            <div class="financial-stats">
              <!-- <div class="financial-item">
                <div class="financial-label">
                  {{ t("modules.customer.paymentPercentage") }}
                </div>
                <a-progress
                  :percent="paymentPercentage"
                  :stroke-color="{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }"
                  :format="(percent: number) => `${percent}%`"
                />
              </div> -->
              <div class="financial-item">
                <div class="financial-label">
                  {{ t("modules.customer.totalVideos") }}
                </div>
                <div class="financial-value">
                  {{ customerData?.total_videos || 0 }}
                </div>
              </div>
              <div class="financial-item">
                <div class="financial-label">
                  {{ t("modules.customer.totalViews") }}
                </div>
                <div class="financial-value">
                  {{ formatNumber(customerData?.total_views || 0) }}
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- Timestamps -->
      <a-row :gutter="[16, 16]">
        <a-col :span="24">
          <a-card class="timestamps-card">
            <a-space :size="20">
              <span>
                <CalendarOutlined /> {{ t("modules.customer.columns.createdAt") }}:
                <strong>{{ formatDate(customerData?.created_at) }}</strong>
              </span>
              <span>
                <EditOutlined /> {{ t("modules.customer.columns.updatedAt") }}:
                <strong>{{ formatDate(customerData?.updated_at) }}</strong>
              </span>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  ReloadOutlined,
  LoadingOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  UserOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import { useCustomer } from "../customer/composible";
import formatDate from "../../../common/utils/format-date.util";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";

const router = useRouter();
const { getById } = useCustomer();
const { t } = useI18n();

// State
const loading = ref(false);
const error = ref("");
const customerData = ref<any>(null);

// Computed properties
const paymentPercentage = computed(() => {
  if (!customerData.value || !customerData.value.total_revenue) return 0;
  const paid = customerData.value.paid_revenue || 0;
  const total = customerData.value.total_revenue;
  return Math.round((paid / total) * 100);
});

// Methods
const loadCustomerData = async () => {
  loading.value = true;
  error.value = "";

  try {
    // Get customer_id from localStorage
    const customerId = localStorage.getItem("customer_id");

    if (!customerId) {
      error.value = t("modules.customer.noCustomerId");
      showErrorNotification(t("modules.customer.noCustomerId"));
      return;
    }

    // Fetch customer data
    const response = await getById(parseInt(customerId));
    customerData.value = response.data;

    showSuccessNotification(t("modules.customer.dataLoaded"));
  } catch (err: any) {
    const message = err.response?.data?.message || err.message;
    error.value = message;
    showErrorNotification(message);
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  loadCustomerData();
};

const handleBack = () => {
  router.back();
};

const getStatusLabel = (status: string) => {
  const statusKey = status?.toLowerCase();
  return t(`status.${statusKey}`, status?.toUpperCase() || "");
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "#52c41a"; // Green
    case "pending":
      return "#faad14"; // Orange
    case "blacklisted":
      return "#ff4d4f"; // Red
    default:
      return "#999"; // Gray
  }
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};

// Lifecycle
onMounted(() => {
  loadCustomerData();
});
</script>

<style scoped lang="scss">
.customer-dashboard {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
}

.error-alert {
  margin-bottom: 24px;
}

.dashboard-content {
  .metrics-row {
    margin-bottom: 24px;
  }

  .details-section {
    margin-bottom: 24px;
  }
}

.metric-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  :deep(.ant-statistic-title) {
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin-bottom: 8px;
  }

  :deep(.ant-statistic-content) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.revenue-card {
  border-left: 4px solid #52c41a;
}

.paid-card {
  border-left: 4px solid #1890ff;
}

.unpaid-card {
  border-left: 4px solid #faad14;
}

.status-card {
  border-left: 4px solid #722ed1;
}

.info-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  :deep(.ant-card-head) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px 12px 0 0;

    .ant-card-head-title {
      color: white;
      font-weight: 600;
    }

    .ant-card-extra {
      color: white;
    }
  }
}

.financial-stats {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .financial-item {
    .financial-label {
      font-size: 14px;
      font-weight: 600;
      color: #666;
      margin-bottom: 8px;
    }

    .financial-value {
      font-size: 24px;
      font-weight: 700;
      color: #0d334a;
    }
  }
}

.timestamps-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  :deep(.ant-card-body) {
    display: flex;
    justify-content: center;
  }

  span {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;

    .anticon {
      color: #1890ff;
    }

    strong {
      color: #0d334a;
      margin-left: 4px;
    }
  }
}

// Responsive styles
@media (max-width: 768px) {
  .customer-dashboard {
    padding: 16px;
  }

  .metric-card {
    :deep(.ant-statistic-content) {
      font-size: 20px !important;
    }
  }

  .financial-stats {
    .financial-item {
      .financial-value {
        font-size: 20px;
      }
    }
  }

  .timestamps-card {
    :deep(.ant-card-body) {
      flex-direction: column;
      gap: 12px;
    }
  }
}
</style>
