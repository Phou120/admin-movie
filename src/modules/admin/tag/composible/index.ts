import apiClient from "../../../../common/configuration/axios.config";
import type { ITagForm } from "../interface/tag.interface";

export function TagComposible() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("/tags", {
      params: {
        page,
        limit,
        search: "",
      },
    });
    return response.data;
  };

  const createTag = async (formAdd: ITagForm) => {
    const payload = {
      name: formAdd.name,
    };
    const response = await apiClient.post("/tags", payload);
    return response.data;
  };

  const updateTag = async (formUpdate: ITagForm) => {
    const payload = {
      name: formUpdate.name,
    };

    const response = await apiClient.put(
      `/tags/${formUpdate.id}`,
      payload
    );
    return response.data;
  };

  const deleteTagById = async (id: number) => {
    const response = await apiClient.delete(`/tags/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    deleteTagById,
    updateTag,
    createTag,
  };
}