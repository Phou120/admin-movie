import apiClient from "../../../../../common/configuration/axios.config";
import type {
  ICategoryOption,
  ICustomerOption,
} from "../interface/report-video.interface";

export function ReportVideoComposible() {
  const fetchReportData = async (
    page: number,
    limit: number,
    search: string = "",
    category_id: string = "",
    customer_id: string = "",
    status: string = "",
    start_date: string = "",
    end_date: string = ""
  ) => {
    const response = await apiClient.get("/videos/report", {
      params: {
        page,
        limit,
        search,
        category_id,
        customer_id,
        status,
        start_date,
        end_date,
      },
    });
    return response.data.data || response.data;
  };

  const fetchSummary = async () => {
    const response = await apiClient.get("/videos/report/summary");
    return response.data.data || response.data;
  };

  const getCategories = async (): Promise<ICategoryOption[]> => {
    const response = await apiClient.get("/categories");
    return response.data.data || [];
  };

  const getCustomers = async (): Promise<ICustomerOption[]> => {
    const response = await apiClient.get("/customers", {
      params: { page: 1, limit: 1000, type: "creator" },
    });
    return response.data.data || [];
  };

  const exportToCSV = async (filters: {
    search?: string;
    category_id?: number;
    customer_id?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await apiClient.get("/videos/report/export", {
      params: filters,
      responseType: "blob",
    });
    return response;
  };

  return {
    fetchReportData,
    fetchSummary,
    getCategories,
    getCustomers,
    exportToCSV,
  };
}
