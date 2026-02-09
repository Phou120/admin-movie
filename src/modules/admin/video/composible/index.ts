import apiClient from "../../../../common/configuration/axios.config";
import type { IVideoForm } from "../interface/video.interface";

export function VideoComposible() {
  const fetchAll = async (
    page: number,
    limit: number,
    search: string = "",
    category_id: string = "",
    customer_id: string = ""
  ) => {
    console.log("=== FETCH ALL VIDEOS ===", {
      page,
      limit,
      search,
      category_id,
      customer_id,
    });
    const response = await apiClient.get("/videos", {
      params: {
        page,
        limit,
        search,
        category_id,
        customer_id,
      },
    });
    console.log("API Response status:", response.status);
    console.log("Raw axios response.data:", response.data);
    console.log("response.data.data?", response.data?.data);
    console.log("Is response.data an array?", Array.isArray(response.data));

    return response.data;
  };

  const createVideo = async (formAdd: IVideoForm) => {
    console.log("=== CREATE VIDEO FUNCTION START ===");
    const formData = new FormData();

    // Ensure customer_id is not null before appending
    if (formAdd.customer_id !== null && formAdd.customer_id !== undefined) {
      formData.append("customer_id", formAdd.customer_id.toString());
    } else {
      console.warn("customer_id is null or undefined, skipping");
    }
    formData.append("title", formAdd.title);
    formData.append("content", formAdd.content);

    if (formAdd.image) {
      console.log("Appending image:", formAdd.image.name, formAdd.image.size);
      formData.append("image", formAdd.image);
    } else {
      console.log("No image file found");
    }

    if (formAdd.video_name) {
      console.log(
        "Appending video:",
        formAdd.video_name.name,
        formAdd.video_name.size
      );
      formData.append("video_name", formAdd.video_name);
    } else {
      console.log("No video file found");
    }

    if (formAdd.trailer) {
      console.log(
        "Appending trailer:",
        formAdd.trailer.name,
        formAdd.trailer.size
      );
      formData.append("trailer", formAdd.trailer);
    } else {
      console.log("No trailer file found");
    }

    if (formAdd.category_id && Array.isArray(formAdd.category_id)) {
      formAdd.category_id.forEach((categoryId: number, index: number) => {
        formData.append(`category_id[${index}]`, categoryId.toString());
      });
    }

    // Debug: Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value instanceof File ? `${value.name} (${value.size} bytes)` : value
      );
    }

    try {
      console.log("Making API call to POST /videos");
      const response = await apiClient.post("/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error response:", error.response);
      throw error;
    }
  };

  const updateVideo = async (formUpdate: IVideoForm) => {
    const formData = new FormData();

    formData.append("customer_id", formUpdate.customer_id?.toString() ?? "");
    formData.append("title", formUpdate.title);
    formData.append("content", formUpdate.content);
    formData.append("_method", "PUT");

    // Handle image - append new file if selected, send null if explicitly removed, skip if keeping existing
    if (formUpdate.image !== undefined) {
      if (formUpdate.image) {
        formData.append("image", formUpdate.image);
        console.log("Appending new image file:", formUpdate.image.name);
      } else {
        formData.append("image", "null");
        console.log("Image explicitly removed, sending null");
      }
    } else {
      console.log("Keeping existing image (not sending)");
    }

    // Handle video - append new file if selected, send null if explicitly removed, skip if keeping existing
    if (formUpdate.video_name !== undefined) {
      if (formUpdate.video_name) {
        formData.append("video_name", formUpdate.video_name);
        console.log("Appending new video file:", formUpdate.video_name.name);
      } else {
        formData.append("video_name", "null");
        console.log("Video explicitly removed, sending null");
      }
    } else {
      console.log("Keeping existing video (not sending)");
    }

    // Handle trailer - append new file if selected, send null if explicitly removed, skip if keeping existing
    if (formUpdate.trailer !== undefined) {
      if (formUpdate.trailer) {
        formData.append("trailer", formUpdate.trailer);
        console.log("Appending new trailer file:", formUpdate.trailer.name);
      } else {
        formData.append("trailer", "null");
        console.log("Trailer explicitly removed, sending null");
      }
    } else {
      console.log("Keeping existing trailer (not sending)");
    }

    if (formUpdate.category_id && Array.isArray(formUpdate.category_id)) {
      formUpdate.category_id.forEach((categoryId: number, index: number) => {
        formData.append(`category_id[${index}]`, categoryId.toString());
      });
    }

    // Debug: Log FormData contents
    console.log("FormData contents being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value instanceof File ? `${value.name} (${value.size} bytes)` : value
      );
    }

    const response = await apiClient.put(`/videos/${formUpdate.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  const deleteVideoById = async (id: number) => {
    const response = await apiClient.delete(`/videos/${id}`);
    return response.data;
  };

  const getVideoById = async (id: number) => {
    const response = await apiClient.get(`/videos/${id}`);
    return response.data;
  };

  const getCustomers = async () => {
    const response = await apiClient.get("/customers", {
      params: { page: 1, limit: 1000, type: "creator" },
    });
    return response.data.data || [];
  };

  const getCategories = async () => {
    const response = await apiClient.get("/categories");
    return response.data.data || [];
  };

  const updateStatus = async (id: number, status: string) => {
    const response = await apiClient.put(`/videos/status/${id}`, {
      status,
    });
    return response.data;
  };

  return {
    fetchAll,
    deleteVideoById,
    updateVideo,
    createVideo,
    getVideoById,
    getCustomers,
    getCategories,
    updateStatus,
  };
}
