import api from "./index";
import { ENDPOINTS } from "./endpoints";

export const createExperience = async (data) => {
  return api.post(ENDPOINTS.PORTFOLIO_EXPERIENCES.BASE, data);
};

export const getAllExperiences = async () => {
  return api.get(ENDPOINTS.PORTFOLIO_EXPERIENCES.BASE);
};

export const getExperienceById = async (id) => {
  return api.get(ENDPOINTS.PORTFOLIO_EXPERIENCES.BY_ID(id));
};

export const updateExperience = async (id, data) => {
  return api.put(ENDPOINTS.PORTFOLIO_EXPERIENCES.BY_ID(id), data);
};

export const deleteExperience = async (id) => {
  return api.delete(ENDPOINTS.PORTFOLIO_EXPERIENCES.BY_ID(id));
};

export const searchExperiences = async (params) => {
  return api.post(ENDPOINTS.PORTFOLIO_EXPERIENCES.SEARCH, params);
};

export default {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  searchExperiences,
};
