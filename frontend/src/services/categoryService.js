import api from "./api";

export const getCategories = () => api.get("/categories");

export const createCategory = (data) => api.post("/admin/categories", data);

export const updateCategory = (id, data) => api.put(`/admin/categories/${id}`, data);

export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);