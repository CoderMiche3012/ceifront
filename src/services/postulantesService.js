import API from "./api"; // Tu instancia de axios configurada
import { formatErrorAnidado } from "../utils/errorHandlers";

export const postulantesService = {
    // Obtener lista (GET)
    obtenerPostulantes: async () => {
        try {
            const res = await API.get("/api/beneficiarios/postulantes/");
            return res.data;
        } catch (error) {
            console.log(error)
            // Extraemos la data del error de Axios
            const errorData = error.response?.data || error;

            if (errorData) {
                throw new Error(formatErrorAnidado(errorData));
            }

            throw new Error(formatErrorAnidado(error.message));
        }
    },
    crearPostulante: async (payload) => {
        try {
            // La ruta maestra que mencionaste
            const res = await API.post("/api/beneficiarios/postulantes/", payload);
            return res.data;
        } catch (error) {
            console.log(error)
            // Extraemos la data del error de Axios
            const errorData = error.response?.data || error;

            if (errorData) {
                throw new Error(formatErrorAnidado(errorData));
            }
            throw new Error(formatErrorAnidado(error.message));
        }
    },
    eliminarPostulante: async (id) => {
        try {
            // Realizamos la petición DELETE al endpoint correspondiente
            // Nota: Asegúrate de que la URL coincida con tu API (ej: /api/beneficiarios/postulantes/ID/)
            const res = await API.delete(`/api/beneficiarios/postulantes/${id}/`);
            return res.data;
        } catch (error) {
            console.error("Error al eliminar postulante:", error);

            // Extraemos la data del error de Axios
            const errorData = error.response?.data || error;

            if (errorData) {
                // Usamos tu utilidad de formateo para que el error sea legible en el modal
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