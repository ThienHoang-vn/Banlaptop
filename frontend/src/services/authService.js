import api from "./api";

const TOKEN_KEY = "nexlap_admin_token";

export const loginAdmin = async (username, password) => {
  const { data } = await api.post("/admin/auth/login", { username, password });
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/admin/auth/me");
  return data;
};

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};