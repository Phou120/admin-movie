import apiClient from "../../../../common/configuration/axios.config";
import type { IExchangeRateForm } from "../interface/exchange-rate.interface";

export function ExchangeRateComposible() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("/exchange-rates", {
      params: {
        page,
        limit,
        search: "",
      },
    });
    return response.data;
  };

  const createExchangeRate = async (formAdd: IExchangeRateForm) => {
    const payload = {
      from_currency_id: formAdd.from_currency_id,
      operator: formAdd.operate,
      to_currency_id: formAdd.to_currency_id,
    };
    const response = await apiClient.post("/exchange-rates", payload);
    return response.data;
  };

  const updateExchangeRate = async (formUpdate: IExchangeRateForm) => {
    const payload = {
      from_currency_id: formUpdate.from_currency_id,
      operator: formUpdate.operate,
      to_currency_id: formUpdate.to_currency_id,
    };

    const response = await apiClient.put(
      `/exchange-rates/${formUpdate.id}`,
      payload
    );
    return response.data;
  };

  const deleteExchangeRateById = async (id: number) => {
    const response = await apiClient.delete(`/exchange-rates/${id}`);
    return response.data;
  };

  // Fetch currencies for dropdown options
  const fetchCurrencies = async () => {
    const response = await apiClient.get("/currencies");
    return response.data;
  };

  return {
    fetchAll,
    deleteExchangeRateById,
    updateExchangeRate,
    createExchangeRate,
    fetchCurrencies,
  };
}
