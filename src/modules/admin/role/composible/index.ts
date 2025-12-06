// composible.ts (replace your existing file)
import apiClient from "../../../../common/configuration/axios.config";
import type { IRoleForm } from "../interface/role.interface";

export function useRoles() {
  const fetchAll = async (page: number, limit: number, search: string = "") => {
    // Build params object and only include search if not empty
    const params: Record<string, unknown> = {
      page,
      limit,
      sort_order: "DESC",
    };

    if (search && search.toString().trim() !== "") {
      params.search = search.toString().trim(); // attach non-empty search
    }

    const response = await apiClient.get("/roles", {
      params,
    });

    return response.data;
  };

  const fetchById = async (id: number) => {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data;
  };

  const createRole = async (formAdd: IRoleForm) => {
    const payload = {
      name: formAdd.name,
      display_name: formAdd.display_name,
      permission_ids: formAdd.permission_ids,
    };
    const response = await apiClient.post("/roles", payload);
    return response.data;
  };

  const updateRole = async (id: number, formUpdate: IRoleForm) => {
    const payload = {
      name: formUpdate.name,
      display_name: formUpdate.display_name,
      permission_ids: formUpdate.permission_ids,
    };
    const response = await apiClient.put(`/roles/${id}`, payload);
    return response.data;
  };

  const deleteRole = async (id: number) => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    fetchById,
    createRole,
    updateRole,
    deleteRole,
  };
}
