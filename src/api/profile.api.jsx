import api from "./index";

export const getProfile = () => {
    return api.get("/api/v1/portfolio/profile");
};

export const updateProfile = (data) => {
    return api.put("/api/v1/portfolio/profile", data);
};
