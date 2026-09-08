import api from "./api";

export const createLead = (data) => api.post("/leads", data);

export const getLeads = (params) => api.get("/admin/leads", { params });

export const updateLeadStatus = (id, status) =>
  api.put(`/admin/leads/${id}`, { status });

export const deleteLead = (id) => api.delete(`/admin/leads/${id}`);