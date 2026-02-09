import apiClient from "../../../../common/configuration/axios.config";
import type { IQrCodeForm } from "../interface/qr-code.interface";

export function QrCodeComposible() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("/qr-codes", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  };

  /**
   * Upload QR code image and return image URL
   */
  const upload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post("/image/upload-single-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.imageUrl;
  };

  const updateQrCode = async (formUpdate: IQrCodeForm) => {
    const payload: any = {
      id: formUpdate.id,
    };

    // Only include file if it's not null
    if (formUpdate.file !== null && formUpdate.file !== undefined) {
      payload.file = formUpdate.file;
    }

    const response = await apiClient.put(`/qr-codes/${formUpdate.id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  const getQrCodeById = async (id: number) => {
    const response = await apiClient.get(`/qr-codes/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    updateQrCode,
    getQrCodeById,
    upload,
  };
}
