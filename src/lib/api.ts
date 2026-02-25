import axios from "axios";
export const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            const message = data?.message || "An error occurred";
            return Promise.reject({ status, message });
        }
        return Promise.reject({ status: null, message: "Network error" });
    }
);