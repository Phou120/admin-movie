import apiClient from "../../../../common/configuration/axios.config";
import type { IBankForm } from "../interface/bank.interface";

export function BankComposible() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("/banks", {
      params: {
        page,
        limit,
        search: "",
      },
    });
    return response.data;
  };

  /**
   * Upload single image and return logo identifier
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
      }
    );

    return response.data.data.imageUrl; // <-- return only the URL/identifier
  };

  const createBank = async (formAdd: IBankForm) => {
    const payload = {
      name: formAdd.name,
      logo: formAdd.logo, // Pass logo directly like banner does with file_banner
    };

    const response = await apiClient.post("/banks", payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  const updateBank = async (formUpdate: IBankForm) => {
    const payload: any = {
      id: formUpdate.id,
      name: formUpdate.name,
    };

    // Only include logo if it's not null
    if (formUpdate.logo !== null) {
      payload.logo = formUpdate.logo; // Pass logo directly like banner does with file_banner
    }

    const response = await apiClient.put(`/banks/${formUpdate.id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  const deleteBankById = async (id: number) => {
    const response = await apiClient.delete(`/banks/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    deleteBankById,
    updateBank,
    createBank,
    upload, // <-- expose upload function like banner
  };
}
