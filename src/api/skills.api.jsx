import api from "./index";
import { ENDPOINTS } from "./endpoints";

export const createSkill = async (data) => {
  return api.post(ENDPOINTS.PORTFOLIO_SKILLS.BASE, data);
};

export const getAllSkills = async () => {
  return api.get(ENDPOINTS.PORTFOLIO_SKILLS.BASE);
};

export const getSkillById = async (id) => {
  return api.get(ENDPOINTS.PORTFOLIO_SKILLS.BY_ID(id));
};

export const updateSkill = async (id, data) => {
  return api.put(ENDPOINTS.PORTFOLIO_SKILLS.BY_ID(id), data);
};

export const deleteSkill = async (id) => {
  return api.delete(ENDPOINTS.PORTFOLIO_SKILLS.BY_ID(id));
};

export const searchSkills = async (params) => {
  return api.post(ENDPOINTS.PORTFOLIO_SKILLS.SEARCH, params);
};

export default {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  searchSkills,
};
