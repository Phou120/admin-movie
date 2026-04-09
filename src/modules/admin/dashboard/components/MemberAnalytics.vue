<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import MemberGrowthChart from "./MemberGrowthChart.vue";
import MemberStatusDistribution from "./MemberStatusDistribution.vue";
import MemberEngagementChart from "./MemberEngagementChart.vue";
import MemberRetentionMetrics from "./MemberRetentionMetrics.vue";
import { useMember } from "../../member/composible";

const router = useRouter();
const { t } = useI18n();

const { fetchAllMembers } = useMember();

const loading = ref(false);
const memberData = ref<any[]>([]);

// Growth trend data (would come from API with time series)
const growthData = computed(() => {
  return [
    { date: "Jan", current: 150, previous: 120 },
    { date: "Feb", current: 165, previous: 150 },
    { date: "Mar", current: 180, previous: 165 },
    { date: "Apr", current: 200, previous: 180 },
    { date: "May", current: 220, previous: 200 },
    { date: "Jun", current: 245, previous: 220 },
  ];
});

// Status distribution
const statusData = computed(() => {
  if (!memberData.value || memberData.value.length === 0) {
    return [
      { status: "active", count: 0 },
      { status: "inactive", count: 0 },
      { status: "pending", count: 0 },
      { status: "suspended", count: 0 },
    ];
  }

  // Aggregate by status
  const statusMap = new Map<string, number>();

  memberData.value.forEach((member) => {
    const status = member.status || "unknown";
    statusMap.set(status, (statusMap.get(status) || 0) + 1);
  });

  return Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
  }));
});

// Package tier distribution
const tierData = computed(() => {
  if (!memberData.value || memberData.value.length === 0) {
    return [];
  }

  // Aggregate by package tier
  const tierMap = new Map<string, number>();

  memberData.value.forEach((member) => {
    // This would need to come from the member data
    // For now, using mock distribution
    const tier = member.package_type || "Unknown";
    tierMap.set(tier, (tierMap.get(tier) || 0) + 1);
  });

  return Array.from(tierMap.entries()).map(([tier, members]) => ({
    tier,
    members,
  }));
});

// Retention metrics (would come from API)
const retentionData = computed(() => ({
  renewalRate: 78.5,
  churnRate: 8.2,
  period: "30d",
}));

// Load member data
const loadMemberData = async () => {
  loading.value = true;
  try {
    const response = await fetchAllMembers(1, 1000); // Get up to 1000
    memberData.value = response.data || [];
  } catch (error) {
    console.error("Failed to load member data:", error);
    message.error(t("dashboard.error.loadingFailed"));
  } finally {
    loading.value = false;
  }
};

// Navigate to member/customer page
const navigateToMembers = (filters?: any) => {
  router.push({
    path: "/member",
    query: filters,
  });
};

// Handle chart interactions
const handleStatusClick = (status: string) => {
  navigateToMembers({ status });
};

const handleTierClick = (tier: string) => {
  navigateToMembers({ tier });
};

onMounted(() => {
  loadMemberData();
});
</script>

<template>
  <div class="member-analytics">
    <a-row :gutter="[24, 24]">
      <!-- Growth Trend Chart -->
      <a-col :xs="24" :lg="12">
        <MemberGrowthChart :data="growthData" :loading="loading" />
      </a-col>

      <!-- Status Distribution -->
      <a-col :xs="24" :lg="12">
        <MemberStatusDistribution
          :data="statusData"
          :loading="loading"
          @segment-click="handleStatusClick"
        />
      </a-col>

      <!-- Package Tier Distribution -->
      <a-col :xs="24" :lg="12">
        <MemberEngagementChart
          :data="tierData"
          :loading="loading"
          @bar-click="handleTierClick"
        />
      </a-col>

      <!-- Retention Metrics -->
      <a-col :xs="24" :lg="12">
        <MemberRetentionMetrics :data="retentionData" :loading="loading" />
      </a-col>
    </a-row>

    <!-- Growth Spurt Indicator (mock for now) -->
    <div v-if="!loading && growthData.length > 0" class="growth-spurt">
      <a-alert
        :message="t('dashboard.growthSpurt')"
        :description="t('dashboard.growthSpurtDesc', {
          percentage: ((growthData[growthData.length - 1].current -
            growthData[growthData.length - 2].current) /
            growthData[growthData.length - 2].current * 100).toFixed(1)
        })"
        type="success"
        show-icon
        closable
      />
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <a-button type="primary" @click="navigateToMembers()">
        {{ t("dashboard.viewAllMembers") }}
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.member-analytics {
  padding: 16px;
}

.growth-spurt {
  margin-top: 24px;
}

.quick-actions {
  margin-top: 24px;
  text-align: center;
}
</style>
