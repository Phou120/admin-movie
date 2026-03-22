import apiClient from "../../../../../common/configuration/axios.config";
import type { IMemberOption } from "../interface/report-payment.interface";

export function ReportPaymentComposible() {
  const fetchReportData = async (
    page: number,
    limit: number,
    search: string = "",
    status: string = "",
    payment_type: string = "",
    member_id: string = "",
    start_date: string = "",
    end_date: string = "",
  ) => {
    const response = await apiClient.get("/payments/report", {
      params: {
        page,
        limit,
        search,
        status,
        payment_type,
        member_id,
        start_date,
        end_date,
      },
    });
    return response.data;
  };

  const fetchSummary = async () => {
    const response = await apiClient.get("/payments/report/summary");
    return response.data.data || response.data;
  };

  const getPaymentTypes = () => {
    return [
      { value: "bank_transfer", label: "Bank Transfer" },
      { value: "credit_card", label: "Credit Card" },
      { value: "mobile_payment", label: "Mobile Payment" },
      { value: "cash", label: "Cash" },
    ];
  };

  const getMembers = async (): Promise<IMemberOption[]> => {
    const response = await apiClient.get("/customers", {
      params: { page: 1, limit: 1000, type: "member" },
    });
    return response.data.data || response.data;
  };

  const exportToCSV = async (filters: {
    search?: string;
    status?: string;
    payment_type?: string;
    member_id?: number;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await apiClient.get("/payments/report/export", {
      params: filters,
      responseType: "blob",
    });
    return response;
  };

  return {
    fetchReportData,
    fetchSummary,
    getPaymentTypes,
    getMembers,
    exportToCSV,
  };
}
