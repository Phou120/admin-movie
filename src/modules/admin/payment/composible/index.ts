import apiClient from "../../../../common/configuration/axios.config";
import type { IPaymentForm } from "../interface/payment.interface";

export function PaymentComposible() {
  const fetchAll = async (page: number, limit: number, search: string = "", status?: string | null) => {
    const response = await apiClient.get("/payments", {
      params: {
        page,
        limit,
        search,
        status,
      },
    });
    return response.data;
  };

  const fetchByMemberId = async (
    memberId: number,
    page: number,
    limit: number,
    search: string = "",
    status?: string | null
  ) => {
    const response = await apiClient.get(`/payments/member/${memberId}`, {
      params: {
        page,
        limit,
        search,
        status,
      },
    });
    return response.data;
  };

  const fetchById = async (id: number) => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  };

  const createPayment = async (formAdd: IPaymentForm) => {
    const payload = {
      bank_currency_id: formAdd.bank_currency_id,
      user_id: formAdd.user_id,
      use_package_id: formAdd.use_package_id,
      payment_type: formAdd.payment_type,
      slip: formAdd.slip,
      status: formAdd.status,
    };
    const response = await apiClient.post("/payments", payload);
    return response.data;
  };

  const updatePayment = async (formUpdate: IPaymentForm) => {
    const payload = {
      bank_currency_id: formUpdate.bank_currency_id,
      user_id: formUpdate.user_id,
      use_package_id: formUpdate.use_package_id,
      payment_type: formUpdate.payment_type,
      slip: formUpdate.slip,
      status: formUpdate.status,
    };

    const response = await apiClient.put(`/payments/${formUpdate.id}`, payload);
    return response.data;
  };

  const deletePaymentById = async (id: number) => {
    const response = await apiClient.delete(`/payments/${id}`);
    return response.data;
  };

  const updatePaymentStatus = async (id: number, status: string) => {
    const payload = {
      status: status,
    };
    const response = await apiClient.put(`payments/status/${id}`, payload);
    return response.data;
  };

  return {
    fetchAll,
    fetchByMemberId,
    fetchById,
    deletePaymentById,
    updatePayment,
    createPayment,
    updatePaymentStatus,
  };
}
