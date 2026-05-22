import axios from "axios";
import { QueryClient } from "@tanstack/react-query";
import { obtenerAccessToken, obtenerRefreshToken, limpiarSesionLocal, } from "../storage/userStorage";

//configuracion de React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

//creación de la instancia de Axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

//sincronización del Logout entre Pestañas
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "logout" && event.newValue) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  });
}

//funcion de cierre de sesion Global
const logoutGlobal = () => {
  limpiarSesionLocal();
  queryClient.clear();
  localStorage.removeItem("logout");
  localStorage.setItem("logout", Date.now().toString());
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

//interceptor de peticiones
API.interceptors.request.use(
  (config) => {
    const token = obtenerAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//cola de peticiones
let isRefreshing = false;
let queue = [];
const processQueue = (error, token = null) => {
  queue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  queue = [];
};

//manejo de errores y refresh token
API.interceptors.response.use(
  //si todo sale bien o no hay conexión
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    // sin respuesta del servidor
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: "No se pudo conectar con el servidor",
        errors: null,
      });
    }
    const { status, data } = error.response;

    //si el token de acceso ya no sirve.
    if (status === 401 && !originalRequest._retry) {

      if (originalRequest.url?.includes("refresh")) {
        logoutGlobal();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers ||= {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refresh = obtenerRefreshToken();

      if (!refresh) {
        logoutGlobal();
        return Promise.reject(error);
      }

      //solicitud del nuevo token y reintento
      try {

        const { data } = await API.post("/api/cuentas/login/refresh/", {
          refresh,
        });

        const newAccess = data.access;
        localStorage.setItem("access", newAccess);
        processQueue(null, newAccess);
        originalRequest.headers ||= {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return API(originalRequest);

      } catch (err) {
        processQueue(err, null);
        logoutGlobal();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    //formateador de errores normales
    return Promise.reject({
      
      status,
      message: data?.detail || data?.message || "Error del servidor",
      errors: data || null,
      original: error,

    });
  }
);

export default API;

