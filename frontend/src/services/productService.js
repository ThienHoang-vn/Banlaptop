import api from "./api";

export const getProducts = (params) => api.get("/products", { params });

export const getProductBySlug = (slug) => api.get(`/products/${slug}`);

export const createProduct = (data) => api.post("/admin/products", data);

export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data);

export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);