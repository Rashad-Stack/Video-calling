import { AxiosError } from "axios";
import { redirect } from "react-router";
import api from "./axiosInstance";

export const register = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    await api.post("users", formData);
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("API Error:", error.response?.data);
      return error.response?.data;
    }
    console.error("Unknown error:", error);
    return { message: "An unexpected error occurred" };
  }
};

export const login = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    await api.post("auth/login", formData);
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("API Error:", error.response?.data);
      return error.response?.data;
    }
    console.error("Unknown error:", error);
    return { message: "An unexpected error occurred" };
  }
};

export async function logout() {
  try {
    await api.post("auth/logout");
    return redirect("/sign-in");
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("API Error:", error.response?.data);
      return error.response?.data;
    }
    console.error("Unknown error:", error);
    return { message: "An unexpected error occurred" };
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get("auth/me");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("API Error:", error.response?.data);
      return error.response?.data;
    }
    console.error("Unknown error:", error);
    return { message: "An unexpected error occurred" };
  }
}
