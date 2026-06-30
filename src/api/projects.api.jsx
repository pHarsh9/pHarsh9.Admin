import api from "./index";
import { ENDPOINTS } from "./endpoints";

export const createProject = async (data) => {
  return api.post(ENDPOINTS.PORTFOLIO_PROJECTS.BASE, data);
};

export const getAllProjects = async () => {
  return api.get(ENDPOINTS.PORTFOLIO_PROJECTS.BASE);
};

export const getProjectById = async (id) => {
  return api.get(ENDPOINTS.PORTFOLIO_PROJECTS.BY_ID(id));
};

export const updateProject = async (id, data) => {
  return api.put(ENDPOINTS.PORTFOLIO_PROJECTS.BY_ID(id), data);
};

export const deleteProject = async (id) => {
  return api.delete(ENDPOINTS.PORTFOLIO_PROJECTS.BY_ID(id));
};

export const searchProjects = async (params) => {
  return api.post(ENDPOINTS.PORTFOLIO_PROJECTS.SEARCH, params);
};

export const uploadProjectImage = async (formData) => {
  return api.post(`${ENDPOINTS.PORTFOLIO_PROJECTS.BASE}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  searchProjects,
  uploadProjectImage,
};
