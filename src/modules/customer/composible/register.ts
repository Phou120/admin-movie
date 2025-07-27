import apiClient from "../../../common/configuration/axios.config";

export function useRegister() {
  const register = async (values: any) => {
    console.log("object", values);
    const response = await apiClient.post("/register", {
      email: values.email,
      password: values.password,
      name: values.name,
    });
    return response.data;
  };

  const update = async (editForm: any) => {
    const payload = {
      ...editForm.value,
      birth_date: editForm.value.birth_date?.format("YYYY-MM-DD"),
      email: editForm.value.email,
    };
    const response = await apiClient.put(
      `/students/${editForm.value.id}`,
      payload
    );
    return response.data;
  };

  return {
    register,
    update,
  };
}
