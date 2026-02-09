<template>
  <div class="member-tab">
    <div class="search-container">
      <a-input-search
        v-model:value="memberSearchText"
        :placeholder="t('modules.member.searchPlaceholder')"
        style="max-width: 400px; width: 100%"
        @search="handleMemberSearch"
        @change="handleMemberSearchChange"
        allow-clear
        enter-button
      />
    </div>
    <div class="table-container">
      <a-table
        :data-source="members.members"
        :columns="columns"
        :pagination="members.pagination"
        :loading="loading"
        row-key="id"
        :scroll="{ x: 800 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            {{ pageOffset + index + 1 }}
          </template>

          <template v-else-if="column.key === 'profile'">
            <a-avatar
              :src="record.user?.profile?.image_url"
              :size="50"
              shape="circle"
              class="member-avatar"
            >
              <template #icon>
                <user-outlined v-if="!record.user?.profile?.image_url" />
              </template>
            </a-avatar>
          </template>

          <template v-else-if="column.key === 'name'">
            {{ record.name }}
          </template>

          <template v-else-if="column.key === 'surname'">
            {{ record.surname }}
          </template>

          <template v-else-if="column.key === 'email'">
            <a :href="`mailto:${record.email}`">{{ record.email }}</a>
          </template>

          <template v-else-if="column.key === 'tel'">
            <a :href="`tel:${record.tel}`">{{ record.tel }}</a>
          </template>

          <template v-else-if="column.key === 'address'">
            <span v-if="record.address">{{ record.address }}</span>
            <span v-else class="text-muted">-</span>
          </template>

          <template v-else-if="column.key === 'status'">
            <template v-if="record.status?.toLowerCase() === 'approved'">
              <a-tag
                :color="getStatusColor(record.status)"
                class="status-badge"
              >
                {{ getStatusLabel(record.status) }}
              </a-tag>
            </template>
            <template v-else>
              <a-dropdown :trigger="['click']" placement="bottomLeft">
                <a-tag
                  :color="getStatusColor(record.status)"
                  class="status-badge clickable"
                  style="cursor: pointer"
                >
                  {{ getStatusLabel(record.status) }}
                  <down-outlined style="margin-left: 4px; font-size: 10px" />
                </a-tag>
                <template #overlay>
                  <a-menu>
                    <a-menu-item
                      v-for="status in getAvailableStatuses(record.status)"
                      :key="status.value"
                      @click="updateMemberStatus(record.id, status.value)"
                    >
                      <a-tag
                        :color="getStatusColor(status.value)"
                        size="small"
                        style="margin-right: 8px"
                      >
                        {{ status.label }}
                      </a-tag>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </template>

          <template v-else-if="column.key === 'created_at'">
            {{ formatDate(record.created_at) }}
          </template>
          <template v-else-if="column.key === 'updated_at'">
            {{ formatDate(record.updated_at) }}
          </template>

          <template v-else-if="column.key === 'action'">
            <span class="action-icons">
              <a-tooltip :title="t('modules.payment.viewPayments')">
                <credit-card-outlined
                  class="icon payment"
                  @click="viewPayments(record.id)"
                />
              </a-tooltip>
              <a-tooltip :title="t('actions.view')">
                <eye-outlined class="icon view" @click="viewMember(record)" />
              </a-tooltip>
              <a-popconfirm
                :title="t('message.deleteConfirm')"
                @confirm="deleteMember(record.id)"
              >
                <a-tooltip :title="t('actions.delete')">
                  <delete-outlined class="icon delete" />
                </a-tooltip>
              </a-popconfirm>
            </span>
          </template>

          <template v-else>
            {{ record[column.dataIndex] }}
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  EyeOutlined,
  DeleteOutlined,
  UserOutlined,
  DownOutlined,
  CreditCardOutlined,
} from "@ant-design/icons-vue";
import { type TablePaginationConfig } from "ant-design-vue";
import type { IMemberMembers } from "../interface/member.interface";
import { useMember } from "../composible/index";
import formatDate from "../../../../common/utils/format-date.util";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../../common/utils/notification";

// Props
interface Props {
  members: IMemberMembers;
  loading: boolean;
}

const props = defineProps<Props>();

// Emits
interface Emits {
  (e: "load-members", page: number, limit: number, search: string): void;
  (e: "delete-member", id: number): void;
}

const emit = defineEmits<Emits>();

const router = useRouter();
const { updateStatus } = useMember();
const { t } = useI18n();

// Local state
const memberSearchText = ref("");

// Computed offset for numbering
const pageOffset = computed(() => {
  const current = props.members.pagination.current ?? 1;
  const pageSize = props.members.pagination.pageSize ?? 10;
  return (current - 1) * pageSize;
});

// Table columns (same as UserTab)
const columns = computed(() => [
  {
    title: t("modules.member.columns.no"),
    key: "no",
    align: "center",
    width: 70,
  },
  {
    title: t("modules.member.columns.profile"),
    dataIndex: "profile_url",
    key: "profile",
    width: 80,
    align: "center",
  },
  {
    title: t("modules.member.columns.name"),
    dataIndex: "name",
    key: "name",
    width: 120,
  },
  {
    title: t("modules.member.columns.surname"),
    dataIndex: "surname",
    key: "surname",
    width: 120,
  },
  {
    title: t("modules.member.columns.email"),
    dataIndex: "email",
    key: "email",
    width: 240,
  },
  {
    title: t("modules.member.columns.phone"),
    dataIndex: "tel",
    key: "tel",
    width: 180,
  },
  {
    title: t("modules.member.columns.address"),
    dataIndex: "address",
    key: "address",
    width: 250,
  },
  {
    title: t("modules.member.columns.status"),
    dataIndex: "status",
    key: "status",
    width: 120,
    align: "center",
  },
  {
    title: t("modules.member.columns.createdAt"),
    dataIndex: "created_at",
    key: "created_at",
    width: 180,
  },
  {
    title: t("modules.member.columns.updatedAt"),
    dataIndex: "updated_at",
    key: "updated_at",
    width: 180,
  },
  {
    title: t("modules.member.columns.action"),
    key: "action",
    width: 120,
    fixed: "right",
    align: "center",
  },
]);

// Table pagination handler
function handleTableChange(pagination: TablePaginationConfig) {
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  emit("load-members", current, pageSize, memberSearchText.value);
}

// Search handlers
function handleMemberSearch(value: string) {
  memberSearchText.value = value;
  emit("load-members", 1, props.members.pagination.pageSize, value);
}

function handleMemberSearchChange(e: any) {
  if (!e.target.value) {
    memberSearchText.value = "";
    emit("load-members", 1, props.members.pagination.pageSize, "");
  }
}

// Navigation
function viewMember(member: any) {
  router.push(`/member/view/${member.id}`);
}

function viewPayments(memberId: number) {
  router.push(`/member/${memberId}/payments`);
}

// Get translated status label
const getStatusLabel = (status: string) => {
  const statusKey = status?.toLowerCase();
  return t(`status.${statusKey}`, status?.toUpperCase() || "");
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

// Get available statuses based on current status
const getAvailableStatuses = (currentStatus: string) => {
  switch (currentStatus?.toLowerCase()) {
    case "approved":
      return [{ label: t("status.pending"), value: "pending" }];
    case "pending":
      return [{ label: t("status.approved"), value: "approved" }];
    default:
      return [];
  }
};

// Delete member
async function deleteMember(id: number) {
  emit("delete-member", id);
}

// Update status
async function updateMemberStatus(id: number, newStatus: string) {
  try {
    const response = await updateStatus(id, newStatus);
    showSuccessNotification(response.message || "Status updated successfully");

    // Reload members data to reflect the change
    emit(
      "load-members",
      props.members.pagination.current,
      props.members.pagination.pageSize,
      memberSearchText.value
    );
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    showErrorNotification(errorMessage);
  }
}
</script>

<style lang="scss" scoped>
.member-tab {
  width: 100%;
}

.search-container {
  padding: 0 12px;
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start;
}

.table-container {
  overflow-x: auto;
}

.member-avatar {
  border: 2px solid #f0f0f0;
}

.text-muted {
  color: #999;
  font-style: italic;
}

.status-badge {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  letter-spacing: 0.5px;

  &.clickable:hover {
    opacity: 0.8;
    transform: scale(1.05);
    transition: all 0.2s ease;
  }
}

// Responsive styles
@media screen and (max-width: 768px) {
  .search-container {
    padding: 0 8px;
  }

  .member-avatar {
    width: 40px;
    height: 40px;
  }

  .action-icons .icon {
    font-size: 14px;
  }
}

@media screen and (max-width: 576px) {
  .member-avatar {
    width: 35px;
    height: 35px;
  }
}
</style>
