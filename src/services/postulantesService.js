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
    }
};