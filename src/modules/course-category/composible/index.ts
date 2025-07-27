import apiClient from "../../../common/configuration/axios.config";
import type { ICustomerForm } from "../interface/course-category.interface";

export function CourseCategoryComposible() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("/course/categories", {
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
    };
    const response = await apiClient.post("/course/create-category", payload);
    return response.data;
  };

  const updateCategory = async (FormUpdate: ICustomerForm) => {
    const payload = {
      name: FormUpdate.name,
    };

    const response = await apiClient.put(
      `/course/update-category/${FormUpdate.id}`,
      payload
    );
    return response.data;
  };

  const deleteCategoryById = async (id: number) => {
    const response = await apiClient.delete(`/course/delete-category/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    deleteCategoryById,
    updateCategory,
    createCategory,
  };
}
