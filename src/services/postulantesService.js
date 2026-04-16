import API from "./api"; // Tu instancia de axios configurada
import { formatErrorAnidado } from "../utils/errorHandlers";

export const postulantesService = {
    // Obtener lista
    obtenerPostulantes: async () => {
        try {
            const res = await API.get("/api/beneficiarios/postulantes/");
            return res.data;
        } catch (error) {
            console.log(error)
            const errorData = error.response?.data || error;
            if (errorData) {
                throw new Error(formatErrorAnidado(errorData));
            }
            throw new Error(formatErrorAnidado(error.message));
        }
    },

    crearPostulante: async (payload) => {
        try {
            const res = await API.post("/api/beneficiarios/postulantes/", payload);
            return res.data;
        } catch (error) {
            console.log(error)
            const errorData = error.response?.data || error;
            if (errorData) {
                throw new Error(formatErrorAnidado(errorData));
            }
            throw new Error(formatErrorAnidado(error.message));
        }
    },

    actualizarPostulante: async (id, payload) => {
        try {
            const res = await API.patch(`/api/beneficiarios/postulantes/${id}/`, payload);
            return res.data;
        } catch (error) {
            console.log(error)
            const errorData = error.response?.data || error;
            if (errorData) {
                throw new Error(formatErrorAnidado(errorData));
            }
            throw new Error(formatErrorAnidado(error.message));
        }
    },

    eliminarPostulante: async (id) => {
        try {
            const res = await API.delete(`/api/beneficiarios/postulantes/${id}/`);
            return res.data;
        } catch (error) {
            console.error("Error al eliminar postulante:", error);
            const errorData = error.response?.data || error;
            if (errorData) {
                throw new Error(formatErrorAnidado(errorData));
            }
            throw new Error(formatErrorAnidado(error.message));
        }
    },

    obtenerPostulantePorId: async (id) => {
        const res = await API.get(`/api/beneficiarios/postulantes/${id}`);
        return res.data;
    }
};