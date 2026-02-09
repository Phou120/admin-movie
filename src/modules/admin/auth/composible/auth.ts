import apiClient from "../../../../common/configuration/axios.config";

export function useAuth() {
  const login = async (email: string, password: string) => {
    const response = await apiClient.post("auth/login", {
      email: email,
      password: password,
    });
    if (response.status === 201 || response.status === 200) {
      localStorage.setItem("token", response.data.data.access_token);
      localStorage.setItem("user_id", response.data.data.user.id);
      localStorage.setItem("user_roles", response.data.data.roles);

      // Only set customer_id if customer object exists
      if (response.data.data.customer && response.data.data.customer.id) {
        localStorage.setItem("customer_id", response.data.data.customer.id);
      } else {
        // Remove any existing customer_id for admin/super-admin users
        localStorage.removeItem("customer_id");
      }
    } else {
      console.error("Login failed:", response.data.data.message);
    }
  };

  const forgotPassword = async (email: string) => {
    console.log("email", email);
    const response = await apiClient.post("/users/send-mail/otp", {
      email: email,
    });
    return response.data;
  };

  const verifyOtp = async (otp: string) => {
    const response = await apiClient.post("/users/verify-otp", {
      otp: otp,
    });
    if (response.status === 201 || response.status === 200) {
      localStorage.setItem("verify_user_id", response.data.data.id);
    }
    return response.data;
  };

  const resetPassword = async (
    id: number,
    password: string,
    confirmPassword: string
  ) => {
    console.log("password", password);
    const payload = {
      password: password,
      confirm_password: confirmPassword,
    };
    const response = await apiClient.put(
      `/users/reset-password/${id}`,
      payload
    );

    return response.data;
  };

  return {
    login,
    resetPassword,
    verifyOtp,
    forgotPassword,
  };
}
