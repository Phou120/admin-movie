import apiClient from "../../../common/configuration/axios.config";

export function useAuth() {
  const login = async (email: string, password: string) => {
    const response = await apiClient.post("/login", {
      email: email,
      password: password,
    });
    if (response.status === 201) {
      localStorage.setItem("token", response.data.data.access_token);
    } else {
      console.error("Login failed:", response.data.data.message);
    }
  };

  return {
    login,
  };
}
