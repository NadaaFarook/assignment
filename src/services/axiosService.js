import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("x-auth-token");
    const email = localStorage.getItem("x-auth-email");
    if (token) {
      config.headers["x-auth-token"] = token;
      config.headers["x-auth-email"] = email;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const register = async (data) => {
  const response = await apiClient.post("/users", {
    ...data,
  });
  return response;
};

export const login = async (data) => {
  const response = await apiClient.post("/users/login", {
    ...data,
  });
  return response;
};

export const getUser = async () => {
  const response = await apiClient.get(`/users`);
  return response;
};

export const updateUser = async (body) => {
  const response = await apiClient.put(`/users`, { ...body });
  return response;
};
