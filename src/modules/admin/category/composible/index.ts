import apiClient from "../../../../common/configuration/axios.config";
import type { ICustomerForm } from "../interface/category.interface";

export function CourseCategoryComposible() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("/categories", {
      params: {
        page,
        limit,
        search: "",
      },
    });
    return response.data;
  };

  const createCategory = async (formAdd: ICustomerForm) => {
    const payload = {
      name: formAdd.name,
      description: formAdd.description,
    };
    const response = await apiClient.post("/categories", payload);
    return response.data;
  };

  const updateCategory = async (FormUpdate: ICustomerForm) => {
    const payload = {
      name: FormUpdate.name,
      description: FormUpdate.description,
    };

    const response = await apiClient.put(
      `/categories/${FormUpdate.id}`,
      payload
    );
    return response.data;
  };

  const deleteCategoryById = async (id: number) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    deleteCategoryById,
    updateCategory,
    createCategory,
  };
}
