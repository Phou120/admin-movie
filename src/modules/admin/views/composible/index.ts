import apiClient from "../../../../common/configuration/axios.config";
import type { IViewsForm } from "../interface/views.interface";

export function ViewsComposible() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("/views", {
      params: {
        page,
        limit,
        search: "",
      },
    });
    return response.data;
  };

  const createView = async (formAdd: IViewsForm) => {
    const payload = {
      qty: formAdd.qty,
      price: formAdd.price,
    };
    const response = await apiClient.post("/views", payload);
    return response.data;
  };

  const updateView = async (FormUpdate: IViewsForm) => {
    const payload = {
      qty: FormUpdate.qty,
      price: Number(FormUpdate.price),
    };

    const response = await apiClient.put(`/views/${FormUpdate.id}`, payload);
    return response.data;
  };

  const deleteViewById = async (id: number) => {
    const response = await apiClient.delete(`/views/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    deleteViewById,
    updateView,
    createView,
  };
}
