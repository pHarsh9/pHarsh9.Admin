import api from "./index";
import { ENDPOINTS } from "./endpoints";

export const getAllInquiries = async () => {
  return api.get(ENDPOINTS.PORTFOLIO_INQUIRIES.BASE);
};

export const deleteInquiry = async (id) => {
  return api.delete(ENDPOINTS.PORTFOLIO_INQUIRIES.BY_ID(id));
};

export const searchInquiries = async (params) => {
  return api.post(ENDPOINTS.PORTFOLIO_INQUIRIES.SEARCH, params);
};

export default {
  getAllInquiries,
  deleteInquiry,
  searchInquiries,
};
