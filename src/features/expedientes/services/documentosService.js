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

export const obtenerDocumentos = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return data;
};
// =========================
// OBTENER
// =========================

export const obtenerDocumentoPorId = async (id_documento) => {
  const { data } = await API.get(
    `${BASE_URL}/${id_documento}/`
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

export const actualizarDocumento = async (
  id_documento,
  formData
) => {
  const { data } = await API.patch(
    `${BASE_URL}/${id_documento}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};