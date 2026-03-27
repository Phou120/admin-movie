import apiClient from "../../../../common/configuration/axios.config";
import type { ICustomerForm } from "../interface/customer.interface";

export function useCustomer() {
  const fetchAll = async (page: number, limit: number, search: string = "") => {
    const params: Record<string, unknown> = {
      page,
      limit,
      type: "creator",
    };

    if (search && search.toString().trim() !== "") {
      params.search = search.toString().trim();
    }

    const response = await apiClient.get("customers", { params });
    return response.data;
  };

  const getById = async (id: number) => {
    const response = await apiClient.get(`customers/${id}`);
    return response.data;
  };

  const createCustomer = async (formAdd: ICustomerForm) => {
    const payload = {
      name: formAdd.name,
      surname: formAdd.surname,
      email: formAdd.email,
      tel: formAdd.tel,
      address: formAdd.address,
      profile: formAdd.profile, // Profile should already be imageUrl from upload
      password: formAdd.password,
      confirm_password: formAdd.confirm_password,
    };
    const response = await apiClient.post("/customers", payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  /**
   * Upload single image and return imageUrl
   */
  const upload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post(
      "/image/upload-single-file",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data.imageUrl;
  };

  const updateCustomer = async (FormUpdate: ICustomerForm) => {
    const payload: any = {
      id: FormUpdate.id,
      name: FormUpdate.name,
      surname: FormUpdate.surname,
      email: FormUpdate.email,
      tel: FormUpdate.tel,
      address: FormUpdate.address,
    };

    // Only include profile if it's not null
    if (FormUpdate.profile !== null) {
      payload.profile = FormUpdate.profile;
    }

    const response = await apiClient.put(
      `/customers/${FormUpdate.id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          lang: "lo",
        },
      },
    );
    return response.data;
  };

  const deleteCustomerById = async (id: number) => {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  };

  // Update customer status
  const updateStatus = async (id: number, status: string) => {
    const response = await apiClient.put(`/customers/status/${id}`, {
      status,
    });
    return response.data;
  };

  // Fetch payment creator
  const fetchPaymentCreator = async (customerId: number) => {
    const response = await apiClient.put("/view-movies/payment/creator", {
      customer_id: customerId,
    });
    return response.data;
  };

  return {
    fetchAll,
    getById,
    createCustomer,
    upload,
    updateCustomer,
    deleteCustomerById,
    updateStatus,
    fetchPaymentCreator,
  };
}
