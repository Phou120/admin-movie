<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PaymentComposible } from "../composible/index";
import { useI18n } from "vue-i18n";
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  BankOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  FileImageOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import type { PaymentEntity } from "../entity/payment.entity";
import formatDate from "../../../../common/utils/format-date.util";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";

const { fetchById, updatePaymentStatus } = PaymentComposible();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const paymentId = computed(() => Number(route.params.id));
const loading = ref(false);
const payment = ref<PaymentEntity | null>(null);

// Load payment details
async function loadPaymentDetail() {
  loading.value = true;
  try {
    const response = await fetchById(paymentId.value);
    payment.value = response.data;
  } catch (error) {
    showErrorNotification(
      "Failed to load payment details:",
      (error as Error).message
    );
  } finally {
    loading.value = false;
  }
}

// Go back to previous page
function goBack() {
  router.back();
}

// View slip in new tab
function viewSlip(slipUrl: string) {
  window.open(slipUrl, "_blank");
}

// Get status color
function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case "approved":
    case "success":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
    case "failed":
      return "error";
    default:
      return "default";
  }
}

// Get available statuses based on current status
function getAvailableStatuses(currentStatus: string) {
  switch (currentStatus?.toLowerCase()) {
    case "pending":
      return [
        { label: t("status.success"), value: "success" },
        { label: t("status.failed"), value: "failed" },
      ];
    case "success":
      return [{ label: t("status.failed"), value: "failed" }];
    case "failed":
      return [{ label: t("status.success"), value: "success" }];
    default:
      return [
        { label: t("status.success"), value: "success" },
        { label: t("status.failed"), value: "failed" },
      ];
  }
}

// Update payment status
async function updateStatus(newStatus: string) {
  if (!payment.value) return;

  try {
    const response = await updatePaymentStatus(payment.value.id, newStatus);
    showSuccessNotification(response.message || "Status updated successfully");

    // Update local payment status
    payment.value.status = newStatus;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    showErrorNotification(errorMessage);
  }
}

// Load data on mount
onMounted(() => {
  loadPaymentDetail();
});
</script>

<template>
  <div class="payment-detail-container">
    <!-- Header -->
    <div class="detail-header">
      <div class="header-left">
        <a-button type="text" @click="goBack" class="back-btn">
          <template #icon>
            <arrow-left-outlined />
          </template>
          {{ t("actions.back") }}
        </a-button>
        <h1>{{ t("modules.payment.paymentDetails") }}</h1>
      </div>

      <!-- Header Actions -->
      <div class="header-actions" v-if="payment">
        <a-dropdown :trigger="['click']" placement="bottomRight">
          <a-button type="primary" class="update-status-btn">
            <template #icon> </template>
            {{ t("modules.payment.updateStatus") }}
            <down-outlined style="margin-left: 4px; font-size: 12px" />
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item
                v-for="status in getAvailableStatuses(payment.status)"
                :key="status.value"
                @click="updateStatus(status.value)"
              >
                <a-tag
                  :color="getStatusColor(status.value)"
                  size="small"
                  style="margin-right: 12px"
                >
                  {{ status.label }}
                </a-tag>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" />
    </div>

    <!-- Payment Details -->
    <div v-else-if="payment" class="detail-content">
      <a-row :gutter="24">
        <!-- Payment Information -->
        <a-col :xs="24" :lg="12">
          <a-card
            class="detail-card"
            :title="t('modules.payment.paymentInformation')"
          >
            <template #extra>
              <credit-card-outlined />
            </template>

            <div class="detail-item">
              <div class="item-label">
                <user-outlined />
                {{ t("modules.payment.columns.paymentType") }}
              </div>
              <div class="item-value">
                <a-tag color="blue">{{
                  payment.payment_type?.toUpperCase()
                }}</a-tag>
              </div>
            </div>

            <div class="detail-item">
              <div class="item-label">
                <dollar-outlined />
                {{ t("modules.payment.columns.status") }}
              </div>
              <div class="item-value">
                <a-tag :color="getStatusColor(payment.status)">
                  {{
                    t(
                      `status.${payment.status?.toLowerCase()}`,
                      payment.status?.toUpperCase()
                    )
                  }}
                </a-tag>
              </div>
            </div>

            <div class="detail-item">
              <div class="item-label">
                <calendar-outlined />
                {{ t("modules.payment.columns.createdAt") }}
              </div>
              <div class="item-value">{{ formatDate(payment.created_at) }}</div>
            </div>

            <div class="detail-item">
              <div class="item-label">
                <calendar-outlined />
                {{ t("modules.payment.columns.updatedAt") }}
              </div>
              <div class="item-value">{{ formatDate(payment.updated_at) }}</div>
            </div>
          </a-card>
        </a-col>

        <!-- Member Information -->
        <a-col :xs="24" :lg="12">
          <a-card
            class="detail-card"
            :title="t('modules.payment.memberInformation')"
          >
            <template #extra>
              <user-outlined />
            </template>

            <div class="detail-item">
              <div class="item-label">
                {{ t("modules.payment.form.member") }}
              </div>
              <div class="item-value">
                <strong
                  >{{ payment.user?.name }} {{ payment.user?.surname }}</strong
                >
              </div>
            </div>

            <div class="detail-item">
              <div class="item-label">
                {{ t("modules.member.columns.email") }}
              </div>
              <div class="item-value">
                <a :href="`mailto:${payment.user?.email}`">{{
                  payment.user?.email
                }}</a>
              </div>
            </div>

            <div class="detail-item">
              <div class="item-label">
                {{ t("modules.member.columns.phone") }}
              </div>
              <div class="item-value">
                <a :href="`tel:${payment.user?.tel}`">{{
                  payment.user?.tel
                }}</a>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="24" style="margin-top: 24px">
        <!-- Package Information -->
        <a-col :xs="24" :lg="12">
          <a-card
            class="detail-card"
            :title="t('modules.payment.packageInformation')"
          >
            <template #extra>
              <dollar-outlined />
            </template>

            <div class="detail-item">
              <div class="item-label">
                {{ t("modules.payment.columns.package") }}
              </div>
              <div class="item-value">
                <strong>{{ payment.usePackage?.package?.type }}</strong>
              </div>
            </div>

            <div class="detail-item">
              <div class="item-label">
                {{ t("modules.payment.columns.amount") }}
              </div>
              <div class="item-value amount-text">
                {{ payment.usePackage?.package?.price }}
              </div>
            </div>

            <div class="detail-item">
              <div class="item-label">{{ t("modules.payment.startDate") }}</div>
              <div class="item-value">
                {{ formatDate(payment.usePackage?.start_date) }}
              </div>
            </div>

            <div class="detail-item">
              <div class="item-label">{{ t("modules.payment.endDate") }}</div>
              <div class="item-value">
                {{ formatDate(payment.usePackage?.end_date) }}
              </div>
            </div>
          </a-card>
        </a-col>

        <!-- Bank Information -->
        <a-col :xs="24" :lg="12">
          <a-card
            class="detail-card"
            :title="t('modules.payment.bankInformation')"
          >
            <template #extra>
              <bank-outlined />
            </template>

            <div class="detail-item">
              <div class="item-label">
                {{ t("modules.payment.columns.bank") }}
              </div>
              <div class="item-value bank-info">
                <img
                  v-if="payment.bank?.logo"
                  :src="payment.bank.logo"
                  :alt="payment.bank.name"
                  class="bank-logo"
                />
                <strong>{{ payment.bank?.name }}</strong>
              </div>
            </div>

            <div class="detail-item">
              <div class="item-label">
                {{ t("modules.payment.columns.currency") }}
              </div>
              <div class="item-value">
                {{ payment.currency?.short_name }} -
                {{ payment.currency?.name }}
              </div>
            </div>

            <div class="detail-item">
              <div class="item-label">{{ t("modules.payment.form.slip") }}</div>
              <div class="item-value">
                <a-button
                  v-if="payment.slip"
                  type="link"
                  @click="viewSlip(payment.slip)"
                  class="slip-btn"
                >
                  <template #icon>
                    <file-image-outlined />
                  </template>
                  {{ t("modules.payment.viewSlip") }}
                </a-button>
                <span v-else class="text-muted">-</span>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- Error State -->
    <div v-else class="error-container">
      <a-result
        status="error"
        :title="t('modules.payment.paymentNotFound')"
        :sub-title="t('modules.payment.paymentNotFoundMessage')"
      >
        <template #extra>
          <a-button type="primary" @click="goBack">
            {{ t("actions.back") }}
          </a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #262626;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;

    .update-status-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #0d334acc;
    }
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-content {
  .detail-card {
    margin-bottom: 24px;
    border-radius: 8px;

    .bank-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;

      .bank-logo {
        width: 80px;
        height: 80px;
        object-fit: contain;
      }
    }

    :deep(.ant-card-head) {
      border-bottom: 2px solid #f0f0f0;

      .ant-card-head-title {
        font-weight: 600;
        color: #262626;
      }

      .ant-card-extra {
        color: #1890ff;
        font-size: 18px;
      }
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .item-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        color: #595959;
        min-width: 120px;

        .anticon {
          color: #8c8c8c;
        }
      }

      .item-value {
        text-align: right;
        color: #262626;
        flex: 1;

        &.amount-text {
          font-weight: 600;
          color: #52c41a;
          font-size: 16px;
        }

        .bank-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          justify-content: center;

          .bank-logo {
            width: 40px;
            height: 40px;
            object-fit: contain;
          }
        }

        .slip-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: flex-end;
          width: 100%;
        }
      }
    }
  }

  .error-container {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 48px 24px;
  }

  .text-muted {
    color: #999;
  }

  // Responsive styles
  @media screen and (max-width: 768px) {
    .payment-detail-container {
      padding: 16px;
    }

    .detail-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;

      .header-left {
        justify-content: center;

        h1 {
          font-size: 20px;
          text-align: center;
        }
      }

      .header-actions {
        justify-content: center;
      }
    }

    .detail-content {
      .detail-card {
        .detail-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;

          .item-label {
            min-width: auto;
          }

          .item-value {
            text-align: left;

            .bank-info {
              justify-content: flex-start;
            }

            .slip-btn {
              justify-content: flex-start;
            }
          }
        }
      }
    }
  }
}
</style>
