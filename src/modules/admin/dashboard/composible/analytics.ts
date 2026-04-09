import { ref } from "vue";
import apiClient from "../../../../common/configuration/axios.config";

// Cache configuration
const CACHE_KEYS = {
  PACKAGES: "dashboard_packages",
  MEMBERS: "dashboard_members",
  FINANCIAL: "dashboard_financial",
};

const CACHE_TTL = {
  PACKAGES: 10 * 60 * 1000, // 10 minutes
  MEMBERS: 5 * 60 * 1000, // 5 minutes
  FINANCIAL: 2 * 60 * 1000, // 2 minutes
};

// Cache utilities
const getCached = (key: string) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  const age = Date.now() - timestamp;

  if (age < CACHE_TTL[key.toUpperCase() as keyof typeof CACHE_TTL]) {
    return data;
  }
  return null;
};

const setCached = (key: string, data: any) => {
  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
};

const clearCache = (key?: string) => {
  if (key) {
    localStorage.removeItem(key);
  } else {
    Object.values(CACHE_KEYS).forEach((k) => localStorage.removeItem(k));
  }
};

// Types
interface PackageMetrics {
  total_packages: number;
  active_packages: number;
  total_revenue: number;
  total_subscriptions: number;
}

interface MemberMetrics {
  total_members: number;
  active_members: number;
  inactive_members: number;
  pending_members: number;
  new_registrations: number;
  growth_percentage: number;
}

interface FinancialMetrics {
  total_revenue: number;
  pending_payments: number;
  approved_payments: number;
  rejected_payments: number;
  net_income: number;
  average_transaction_value: number;
  payment_success_rate: number;
  revenue_per_member: number;
}

export function useDashboardAnalytics() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const packageMetrics = ref<PackageMetrics | null>(null);
  const memberMetrics = ref<MemberMetrics | null>(null);
  const financialMetrics = ref<FinancialMetrics | null>(null);

  // Aggregate member metrics from list endpoint if summary doesn't exist
  const aggregateMemberMetrics = async () => {
    try {
      // Try summary endpoint first
      const response = await apiClient.get("/members/report/summary");
      return response.data.data;
    } catch (err) {
      // Fallback: aggregate from list endpoint
      try {
        const members = await apiClient.get("/customers", {
          params: { type: "member", limit: 1000 },
        });

        const data = members.data.data;

        return {
          total_members: data.length,
          active_members: data.filter((m: any) => m.status === "active").length,
          inactive_members: data.filter((m: any) => m.status === "inactive").length,
          pending_members: data.filter((m: any) => m.status === "pending").length,
          new_registrations: 0, // Would need date filtering
          growth_percentage: 0, // Would need historical data
        };
      } catch (listErr) {
        console.error("Failed to aggregate member metrics:", listErr);
        throw listErr;
      }
    }
  };

  // Calculate additional financial metrics
  const calculateFinancialKPIs = (
    baseMetrics: any
  ): FinancialMetrics => {
    const total = parseFloat(baseMetrics.total_revenue || 0);
    const approved = parseFloat(baseMetrics.approved_payments || 0);
    const rejected = parseFloat(baseMetrics.rejected_payments || 0);
    const pending = parseFloat(baseMetrics.pending_payments || 0);

    const netIncome = approved - rejected;
    const totalTransactions = approved + rejected;
    const successRate = totalTransactions > 0 ? (approved / totalTransactions) * 100 : 0;
    const avgTransaction = totalTransactions > 0 ? total / totalTransactions : 0;

    return {
      total_revenue: total,
      pending_payments: pending,
      approved_payments: approved,
      rejected_payments: rejected,
      net_income: netIncome,
      average_transaction_value: avgTransaction,
      payment_success_rate: successRate,
      revenue_per_member: 0, // Calculated when member metrics available
    };
  };

  // Fetch all analytics data in parallel
  const fetchAllAnalytics = async (_timeRange?: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Check cache first
      const cachedPackages = getCached(CACHE_KEYS.PACKAGES);
      const cachedMembers = getCached(CACHE_KEYS.MEMBERS);
      const cachedFinancial = getCached(CACHE_KEYS.FINANCIAL);

      // Fetch data in parallel, using cache where available
      const [packages, payments, members] = await Promise.all([
        cachedPackages
          ? Promise.resolve(cachedPackages)
          : apiClient.get("/packages/report/summary").then((res: any) => {
              const data = res.data.data || res.data;
              setCached(CACHE_KEYS.PACKAGES, data);
              return data;
            }),
        cachedFinancial
          ? Promise.resolve(cachedFinancial)
          : apiClient.get("/payments/report/summary").then((res: any) => {
              const data = res.data.data || res.data;
              setCached(CACHE_KEYS.FINANCIAL, data);
              return data;
            }),
        cachedMembers
          ? Promise.resolve(cachedMembers)
          : aggregateMemberMetrics().then((data) => {
              setCached(CACHE_KEYS.MEMBERS, data);
              return data;
            }),
      ]);

      packageMetrics.value = packages;
      memberMetrics.value = members;
      financialMetrics.value = calculateFinancialKPIs(payments);

      // Calculate revenue per member if both metrics available
      if (members?.total_members && financialMetrics.value) {
        financialMetrics.value.revenue_per_member =
          financialMetrics.value.total_revenue / members.total_members;
      }
    } catch (err: any) {
      console.error("Error fetching dashboard analytics:", err);
      error.value = err.response?.data?.message || err.message || "Failed to fetch dashboard data";

      // Set default values on error
      packageMetrics.value = {
        total_packages: 0,
        active_packages: 0,
        total_revenue: 0,
        total_subscriptions: 0,
      };

      memberMetrics.value = {
        total_members: 0,
        active_members: 0,
        inactive_members: 0,
        pending_members: 0,
        new_registrations: 0,
        growth_percentage: 0,
      };

      financialMetrics.value = {
        total_revenue: 0,
        pending_payments: 0,
        approved_payments: 0,
        rejected_payments: 0,
        net_income: 0,
        average_transaction_value: 0,
        payment_success_rate: 0,
        revenue_per_member: 0,
      };
    } finally {
      loading.value = false;
    }
  };

  // Clear all caches
  const clearAllCaches = () => {
    clearCache();
  };

  // Refresh analytics (bypass cache)
  const refreshAnalytics = (_timeRange?: string) => {
    clearAllCaches();
    return fetchAllAnalytics();
  };

  return {
    loading,
    error,
    packageMetrics,
    memberMetrics,
    financialMetrics,
    fetchAllAnalytics,
    refreshAnalytics,
    clearAllCaches,
  };
}
