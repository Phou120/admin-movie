import { ref } from "vue";
import apiClient from "../../../../common/configuration/axios.config";

interface MonthlyData {
  month: number;
  amount: number;
}

export function DashboardChartComposible() {
  const loadingIncome = ref(false);
  const loadingExpenses = ref(false);

  const fetchMonthlyIncome = async (year?: number): Promise<MonthlyData[]> => {
    loadingIncome.value = true;
    try {
      const response = await apiClient.get("/dashboard/income", {
        params: { year },
      });
      return response.data.data || response.data;
    } catch (err) {
      console.error("Failed to fetch income data:", err);
      return [];
    } finally {
      loadingIncome.value = false;
    }
  };

  const fetchMonthlyExpenses = async (year?: number): Promise<MonthlyData[]> => {
    loadingExpenses.value = true;
    try {
      const response = await apiClient.get("/dashboard/expenses", {
        params: { year },
      });
      return response.data.data || response.data;
    } catch (err) {
      console.error("Failed to fetch expenses data:", err);
      return [];
    } finally {
      loadingExpenses.value = false;
    }
  };

  return {
    loadingIncome,
    loadingExpenses,
    fetchMonthlyIncome,
    fetchMonthlyExpenses,
  };
}
