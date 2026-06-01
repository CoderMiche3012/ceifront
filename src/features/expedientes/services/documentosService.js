  import API from "../../../config/apiClient";

const BASE_URL =
  "/api/beneficiarios/documentos-personales";

export const subirDocumentoEstudio =
  async (formData) => {
    const { data } =
      await API.post(
        `${BASE_URL}/`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return data;
  };


// =========================
// OBTENER
// =========================

export const obtenerDocumentos =
  async (id_expediente) => {

    const { data } =
      await API.get(
        `${BASE_URL}/?id_expediente=${id_expediente}`
      );

    return data;
  };

// =========================
// SUBIR
// =========================

export const subirDocumento =
  async (formData) => {
    const { data } =
      await API.post(
        `${BASE_URL}/`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return data;
  };
// =========================
// ELIMINAR
// =========================

export const eliminarDocumento =
  async (id_documento) => {

    const { data } =
      await API.delete(
        `${BASE_URL}/${id_documento}/`
      );

    return data;
  };
