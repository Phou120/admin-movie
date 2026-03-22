import apiClient from "../../../../../common/configuration/axios.config";
import type { IRoleOption } from "../interface/report-user.interface";

export function ReportUserComposible() {
  const fetchReportData = async (
    page: number,
    limit: number,
    search: string = "",
    role: string = "",
    status: string = "",
    start_date: string = "",
    end_date: string = "",
  ) => {
    const response = await apiClient.get("/users/report", {
      params: {
        page,
        limit,
        search,
        role,
        status,
        start_date,
        end_date,
      },
    });
    return response.data;
  };

  const fetchSummary = async () => {
    const response = await apiClient.get("/users/report/summary");
    return response.data.data || response.data;
  };

  const getRoles = (): IRoleOption[] => {
    return [
      { value: "admin", label: "Admin" },
      { value: "super-admin", label: "Super Admin" },
      { value: "customer", label: "Customer" },
    ];
  };

  const exportToCSV = async (filters: {
    search?: string;
    role?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await apiClient.get("/users/report/export", {
      params: filters,
      responseType: "blob",
    });
    return response;
  };

  return {
    fetchReportData,
    fetchSummary,
    getRoles,
    exportToCSV,
  };
}
