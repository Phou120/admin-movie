import apiClient from "../../../../common/configuration/axios.config";

export function useMember() {
  // Get all members (customers with type = 'member')
  const fetchAllMembers = async (
    page: number,
    limit: number,
    search: string = ""
  ) => {
    const params: Record<string, unknown> = {
      page,
      limit,
      type: "member", // Filter for members only
    };

    if (search && search.toString().trim() !== "") {
      params.search = search.toString().trim();
    }

    const response = await apiClient.get("customers", { params });

    // Return in the expected format for members
    return {
      data: response.data.data || [],
      pagination: response.data.pagination || {},
    };
  };

  // Get by ID (reusing customer API)
  const getById = async (id: number) => {
    const response = await apiClient.get(`customers/${id}`);
    return response.data;
  };

  // Delete by ID (reusing customer API)
  const deleteById = async (id: number) => {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  };

  // Update customer status
  const updateStatus = async (id: number, status: string) => {
    const response = await apiClient.put(`/customers/status/${id}`, {
      status
    });
    return response.data;
  };

  return {
    fetchAllMembers,
    getById,
    deleteById,
    updateStatus,
  };
}
