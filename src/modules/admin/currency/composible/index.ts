import apiClient from "../../../../common/configuration/axios.config";
import type { ICurrencyForm } from "../interface/currency.interface";

export function CurrencyComposible() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("/currencies", {
      params: {
        page,
        limit,
        search: "",
      },
    });
    return response.data;
  };

  const createCurrency = async (formAdd: ICurrencyForm) => {
    const payload = {
      name: formAdd.name,
      short_name: formAdd.short_name,
    };

    const response = await apiClient.post("/currencies", payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  const updateCurrency = async (formUpdate: ICurrencyForm) => {
    const payload = {
      id: formUpdate.id,
      name: formUpdate.name,
      short_name: formUpdate.short_name,
    };

    const response = await apiClient.put(`/currencies/${formUpdate.id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  const deleteCurrencyById = async (id: number) => {
    const response = await apiClient.delete(`/currencies/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    deleteCurrencyById,
    updateCurrency,
    createCurrency,
  };
}