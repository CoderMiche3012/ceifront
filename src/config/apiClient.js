import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================
// Interceptor de petición
// ========================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// Interceptor de respuesta
// ========================
API.interceptors.response.use(
  (response) => response,

  (error) => {
    // Si el backend respondió
    if (error.response) {
      const { status, data } = error.response;

      return Promise.reject({
        status,
        message:
          data?.detail ||
          data?.message ||
          "Error del servidor",
        errors: data || null, // aquí vienen los errores reales
      });
    }

    // Si no hubo respuesta del servidor
    if (error.request) {
      return Promise.reject({
        status: 0,
        message: "No se pudo conectar con el servidor",
        errors: null,
      });
    }

    // Error inesperado
    return Promise.reject({
      status: 500,
      message: error.message || "Error inesperado",
      errors: null,
    });
  }
);

export default API;