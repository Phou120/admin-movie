import apiClient from "../../../../common/configuration/axios.config";
import type { IChangePassword, IUserForm } from "../interface/user.interface";

export function useUsers() {
  const fetchAll = async (page: number, limit: number, search: string) => {
    const response = await apiClient.get("users", {
      params: {
        page,
        limit,
        search: search,
      },
    });
    return response.data;
  };

  const fetchById = async (id: number) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  };

  const createUser = async (formAdd: IUserForm) => {
    const payload = {
      name: formAdd.name,
      surname: formAdd.surname,
      email: formAdd.email,
      password: formAdd.password,
      confirm_password: formAdd.confirm_password,
      tel: formAdd.tel,
      image: formAdd.image,
      roles: formAdd.roles,
      permissions: formAdd.permissions,
    };
    const response = await apiClient.post("/users", payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  const updateUser = async (id: number, formAdd: IUserForm) => {
    const payload = {
      name: formAdd.name,
      surname: formAdd.surname,
      email: formAdd.email,
      tel: formAdd.tel,
      image: formAdd.image,
      roles: formAdd.roles,
      permissions: formAdd.permissions,
    };
    const response = await apiClient.put(`/users/${id}`, payload, {
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
      }
    );

    return response.data.data.imageUrl; // <-- return only the URL
  };

  const deleteUser = async (id: number) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  };

  // Get user profile
  const profile = async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  };

  // Update user profile
  const updateProfile = async (formAdd: IUserForm) => {
    const payload = {
      name: formAdd.name,
      surname: formAdd.surname,
      email: formAdd.email,
      tel: formAdd.tel,
      image: formAdd.image,
    };
    const response = await apiClient.put("/users/update-profile", payload, {
      headers: {
        "Content-Type": "application/json",
        lang: "lo",
      },
    });
    return response.data;
  };

  const changePassword = async (formAdd: IChangePassword) => {
    const id = Number(localStorage.getItem("user_id"));
    console.log("id", id);
    const payload = {
      password: formAdd.new_password,
      confirm_password: formAdd.confirm_password,
    };
    const response = await apiClient.put(
      `/users/change-password/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          lang: "lo",
        },
      }
    );
    return response.data;
  };

  return {
    fetchAll,
    deleteUser,
    upload,
    createUser,
    updateUser,
    fetchById,
    profile,
    updateProfile,
    changePassword,
  };
}
