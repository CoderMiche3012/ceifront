import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});
//interceptor de Peticion 
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//interceptor de Respuesta 
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      //para que formatError pueda leer los campos (nombre, correo, etc.)
      if (status === 400) {
        return Promise.reject(data); 
      }
      if (status === 401) {
        return Promise.reject({ message: "Sesión expirada o credenciales inválidas", status });
      }
      return Promise.reject({
        message: data?.detail || data?.message || "Error del servidor",
        status: status,
        data: data
      });
    }
    return Promise.reject({ message: "Failed to fetch" });
  }
);

export default API;