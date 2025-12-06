import apiClient from "../../../../common/configuration/axios.config";
import type { IPackagesForm } from "../interface/packages.interface";

export function PackagesComposible() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("/packages", {
      params: {
        page,
        limit,
        search: "",
      },
    });
    return response.data;
  };

  const createPackage = async (formAdd: IPackagesForm) => {
    const payload = {
      type: formAdd.type,
      price: formAdd.price,
      content: formAdd.content,
    };
    const response = await apiClient.post("/packages", payload);
    return response.data;
  };

  const updatePackage = async (FormUpdate: IPackagesForm) => {
    const payload = {
      type: FormUpdate.type,
      price: Number(FormUpdate.price),
      content: FormUpdate.content,
    };

    const response = await apiClient.put(`/packages/${FormUpdate.id}`, payload);
    return response.data;
  };

  const deletePackageById = async (id: number) => {
    const response = await apiClient.delete(`/packages/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    deletePackageById,
    updatePackage,
    createPackage,
  };
}
