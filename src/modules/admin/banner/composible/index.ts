import apiClient from "../../../../common/configuration/axios.config";
import type { IBannerForm } from "../interface/banner.interface";

export function useBanner() {
  const fetchAll = async (page: number, limit: number) => {
    const response = await apiClient.get("banners", {
      params: {
        page,
        limit,
        search: "",
      },
    });
    return response.data;
  };

  const createBanner = async (formAdd: IBannerForm) => {
    const payload = {
      file_banner: formAdd.file_banner,
      link: formAdd.link,
      order_by: Number(formAdd.order_by),
    };
    const response = await apiClient.post("/banners", payload);
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

    return response.data.data.imageUrl; // <-- return only the URL
  };

  const updateBanner = async (FormUpdate: IBannerForm) => {
    const payload: any = {
      id: FormUpdate.id,
      link: FormUpdate.link,
      order_by: FormUpdate.order_by,
    };

    // Only include logo if it's not null
    if (FormUpdate.file_banner !== null) {
      payload.file_banner = FormUpdate.file_banner; // Pass logo directly like banner does with file_banner
    }

    const response = await apiClient.put(`/banners/${FormUpdate.id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  const deleteBannerById = async (id: number) => {
    const response = await apiClient.delete(`/banners/${id}`);
    return response.data;
  };

  return {
    fetchAll,
    createBanner,
    upload, // <-- expose upload function
    updateBanner,
    deleteBannerById,
  };
}
