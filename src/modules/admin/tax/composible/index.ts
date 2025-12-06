import apiClient from "../../../../common/configuration/axios.config";
import type { ITaxForm } from "../interface/tax.interface";

export function useTax() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("taxes", {
      params: {
        page,
        limit,
        search: "",
      },
    });
    return response.data;
  };

  const updateTax = async (FormUpdate: ITaxForm) => {
    const payload = {
      id: FormUpdate.id,
      name: FormUpdate.name,
      percentage: FormUpdate.percentage,
    };

    const response = await apiClient.put(`/taxes/${FormUpdate.id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  return {
    fetchAll,
    updateTax,
  };
}
