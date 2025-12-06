import apiClient from "../../../../common/configuration/axios.config";
import type { IBankCurrencyForm } from "../interface/bank-currency.interface";

export function BankCurrencyComposible() {
  const fetchAll = async (bankId: number, page: number, limit: number) => {
    const response = await apiClient.get("/bank-currencies", {
      params: {
        bank_id: bankId,
        page,
        limit,
        search: "",
      },
    });
    return response.data;
  };

  const createBankCurrency = async (formAdd: IBankCurrencyForm) => {
    const payload = {
      bank_id: formAdd.bank_id,
      currency_id: formAdd.currency_id,
    };

    const response = await apiClient.post("/bank-currencies", payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  const updateBankCurrency = async (formUpdate: IBankCurrencyForm) => {
    const payload = {
      id: formUpdate.id,
      bank_id: formUpdate.bank_id,
      currency_id: formUpdate.currency_id,
    };

    const response = await apiClient.put(`/bank-currencies/${formUpdate.id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  const deleteBankCurrencyById = async (id: number) => {
    const response = await apiClient.delete(`/bank-currencies/${id}`);
    return response.data;
  };

  // Function to fetch available currencies for dropdown
  const fetchCurrencies = async () => {
    const response = await apiClient.get("/currencies/dropdown");
    return response.data;
  };

  return {
    fetchAll,
    deleteBankCurrencyById,
    updateBankCurrency,
    createBankCurrency,
    fetchCurrencies, // for dropdown options
  };
}