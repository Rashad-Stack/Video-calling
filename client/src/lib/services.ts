import { redirect } from "react-router";
import api from "./axiosInstance";

export const register = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    await api.post("users", formData);
    return redirect("/");
  } catch (error: any) {
    console.error(error);
    return error.data;
  }
};
export const login = async ({ request }: { request: Request }) => {
  try {
    const formData = await request.formData();
    await api.post("auth/login", formData);
    return redirect("/");
  } catch (error: any) {
    console.error(error);
    return error.data;
  }
};
