<template>
  <div>
    <div class="member-header">
      <h1>{{ t("modules.member.title") }}</h1>
    </div>

    <div class="member-container">
      <MemberTab
        :members="members"
        :loading="loading"
        @load-members="loadMembers"
        @delete-member="handleDeleteMember"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import type { IMemberMembers } from "./interface/member.interface";
import { useMember } from "./composible/index";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../../../common/utils/notification";

// Import tab component
import MemberTab from "./components/MemberTab.vue";

const { t } = useI18n();

const { fetchAllMembers, deleteById } = useMember();

// State
const loading = ref(false);

// Members Data
const members = reactive<IMemberMembers>({
  members: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  },
});

// Load members
async function loadMembers(
  page = members.pagination.current,
  limit = members.pagination.pageSize,
  search = "",
) {
  loading.value = true;
  try {
    const res = await fetchAllMembers(page, limit, search);
    members.members = res.data || [];

    const paginate = res.pagination || {};

    members.pagination = {
      current: paginate.currentPage,
      pageSize: paginate.limit,
      total: paginate.total,
      showSizeChanger: true,
    };
  } finally {
    loading.value = false;
  }
}

// Delete member handler
async function handleDeleteMember(id: number) {
  try {
    const response = await deleteById(id);
    showSuccessNotification(response.message);
    // Reload members data
    loadMembers();
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    showErrorNotification(errorMessage);
  }
}

onMounted(() => {
  // Load members data on mount
  loadMembers();
});
</script>

<style lang="scss" scoped>
.member-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 12px;

  h1 {
    font-size: 24px;
    margin: 0;
  }
}

.member-container {
  padding: 0 12px;
}

// Responsive styles
@media screen and (max-width: 768px) {
  .member-header {
    padding: 8px;

    h1 {
      font-size: 20px;
    }
  }

  .member-container {
    padding: 0 8px;
  }
}

@media screen and (max-width: 576px) {
  .member-header {
    flex-direction: column;
    align-items: stretch;

    h1 {
      font-size: 18px;
      text-align: center;
    }
  }
}
</style>
