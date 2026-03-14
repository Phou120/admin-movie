import { ref } from "vue";
import apiClient from "../../../../common/configuration/axios.config";

// API response interface
interface DashboardStats {
  totalUsers: number;
  totalRoles: number;
  totalCourses: number;
  totalStudents: number;
  totalTeachers: number;
}

interface MetricTrend {
  value: number;
  direction: "up" | "down" | "neutral";
}

interface DashboardResponse {
  data: DashboardStats;
  periodStats: {
    users: MetricTrend;
    roles: MetricTrend;
    courses: MetricTrend;
    students: MetricTrend;
    teachers: MetricTrend;
  };
}

// Cache with 5-minute TTL
const CACHE_KEY = "dashboard_stats";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in ms

// Save to cache
const saveToCache = (cacheKey: string, data: DashboardStats) => {
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now(),
  }));
};

// Calculate trend from cached data
const calculateTrend = (current: number, previous: number | undefined): MetricTrend => {
  if (previous === undefined) return { value: 0, direction: "neutral" };

  const diff = current - previous;
  if (diff > 0) {
    const percent = Math.round((diff / previous) * 100);
    return { value: percent, direction: "up" };
  } else if (diff < 0) {
    const percent = Math.round((Math.abs(diff) / previous) * 100);
    return { value: percent, direction: "down" };
  }

  return { value: 0, direction: "neutral" };
};

export function useDashboard() {
  
  const loading = ref(false);
  const error = ref("");
  const stats = ref<DashboardStats | null>(null);
  const periodStats = ref<DashboardResponse["periodStats"] | null>(null);
  const previousStats = ref<DashboardStats | null>(null);

  // Debounce timer for filter changes
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const fetchStats = async (timeRange?: string, category?: string) => {
    loading.value = true;
    error.value = "";

    try {
      // Check cache first
      const cacheKey = `${CACHE_KEY}_${timeRange || "today"}_${category || "all"}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        if (parsed.timestamp && now - parsed.timestamp < CACHE_TTL) {
          const data = parsed.data as DashboardStats;
          stats.value = data;
          loading.value = false;

          // Calculate trends by comparing with previous stats
          if (previousStats.value) {
            periodStats.value = {
              users: calculateTrend(data.totalUsers, previousStats.value.totalUsers),
              roles: calculateTrend(data.totalRoles, previousStats.value.totalRoles),
              courses: calculateTrend(data.totalCourses, previousStats.value.totalCourses),
              students: calculateTrend(data.totalStudents, previousStats.value.totalStudents),
              teachers: calculateTrend(data.totalTeachers, previousStats.value.totalTeachers),
            };

            // Store current stats for next comparison
            previousStats.value = data;

            return;
          }
        }

        return;
      }

      // Make API call
      const params: any = {};
      if (timeRange && timeRange !== "today") {
        params.timeRange = timeRange;
      }
      if (category && category !== "all") {
        params.category = category;
      }

      const response = await apiClient.get<DashboardResponse>("/dashboard/stats", { params });

      stats.value = response.data.data;
      loading.value = false;

      // Save to cache
      saveToCache(cacheKey, response.data.data);

      // Update trends
      if (previousStats.value) {
        periodStats.value = {
          users: calculateTrend(response.data.data.totalUsers, previousStats.value.totalUsers),
          roles: calculateTrend(response.data.data.totalRoles, previousStats.value.totalRoles),
          courses: calculateTrend(response.data.data.totalCourses, previousStats.value.totalCourses),
          students: calculateTrend(response.data.data.totalStudents, previousStats.value.totalStudents),
          teachers: calculateTrend(response.data.data.totalTeachers, previousStats.value.totalTeachers),
        };
      } else {
        previousStats.value = response.data.data;
      }

      return;
    } catch (err: any) {
      console.error("Dashboard stats fetch error:", err);
      error.value = err.response?.data?.message || "Failed to fetch dashboard data";
      loading.value = false;
    }
  };

  // Debounced fetch for filter changes
  const fetchStatsDebounced = (timeRange?: string, category?: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      fetchStats(timeRange, category);
    }, 300); // 300ms debounce
  };

  // Clear cache and previous stats
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    previousStats.value = null;
    periodStats.value = null;
    return null;
  };

  // Refresh stats
  const refreshStats = () => {
    clearCache();
    fetchStats("today", "all");
  };

  return {
    loading,
    error,
    stats,
    periodStats,
    previousStats,
    fetchStats: fetchStatsDebounced,
    refreshStats,
    clearCache,
  };
}
