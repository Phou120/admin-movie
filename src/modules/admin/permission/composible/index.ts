import apiClient from "../../../../common/configuration/axios.config";

export function usePermission() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("/permissions", {
      params: {
        page,
        limit,
        search: "",
        sort_order: "DESC",
      },
    });
    return response.data;
  };

  return {
    fetchAll,
  };
}
