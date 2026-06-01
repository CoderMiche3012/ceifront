import API from "../../../config/apiClient";

const BASE_URL = "/api/beneficiarios/fotografias";

// 🔹 obtener todas las fotos
export const obtenerFotografias = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};

// 🔹 obtener por expediente (RECOMENDADO agregar filtro backend si puedes)
export const obtenerFotografiasPorExpediente = async (id_expediente) => {
  const { data } = await API.get(
    `${BASE_URL}/?id_expediente=${id_expediente}`
  );

  return Array.isArray(data) ? data : data?.data ?? [];
};

// 🔹 subir foto (ESTO ES LO IMPORTANTE)
export const subirFotografia = async (formData) => {
  const { data } = await API.post(`${BASE_URL}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// 🔹 eliminar foto
export const eliminarFotografia = async (id) => {
  const { data } = await API.delete(`${BASE_URL}/${id}/`);
  return data;
};