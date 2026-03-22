import apiClient from "../../../../../common/configuration/axios.config";
// import type removed - no types used

export function ReportPackageComposible() {
  const fetchReportData = async (
    page: number,
    limit: number,
    search: string = "",
    package_type: string = "",
    status: string = "",
    start_date: string = "",
    end_date: string = "",
  ) => {
    const response = await apiClient.get("/packages/report", {
      params: {
        page,
        limit,
        search,
        package_type,
        status,
        start_date,
        end_date,
      },
    });
    return response.data;
  };

  const fetchSummary = async () => {
    const response = await apiClient.get("/packages/report/summary");
    return response.data.data || response.data;
  };

  const getPackageTypes = () => {
    return [
      { value: "1month", label: "1 Month" },
      { value: "3months", label: "3 Months" },
      { value: "6months", label: "6 Months" },
      { value: "1year", label: "1 Year" },
    ];
  };

  const exportToCSV = async (filters: {
    search?: string;
    package_type?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await apiClient.get("/packages/report/export", {
      params: filters,
      responseType: "blob",
    });
    return response;
  };

  return {
    fetchReportData,
    fetchSummary,
    getPackageTypes,
    exportToCSV,
  };
}
