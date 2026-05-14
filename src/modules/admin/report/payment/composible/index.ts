import apiClient from "../../../../../common/configuration/axios.config";
import i18n from "../../../../../locales";
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
    const t = i18n.global.t;
    return [
      { value: "cash", label: t("modules.reportPayment.paymentTypes.cash") },
      { value: "transfer", label: t("modules.reportPayment.paymentTypes.transfer") },
    ];
  };

  const getMembers = async (): Promise<IMemberOption[]> => {
    const response = await apiClient.get("/customers", {
      params: { page: 1, limit: 1000, type: "member" },
    });
    return response.data.data || response.data;
  };

  const exportToExcel = async (filters: {
    search?: string;
    status?: string;
    payment_type?: string;
    member_id?: number;
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await apiClient.get("/payments/export", {
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
    exportToExcel,
  };
}
