import API from "../../../config/apiClient";

const BASE_URL = "/api/donadores/donativos";

// obtener todos
export const obtenerDonativos = async () => {
  const { data } = await API.get(
    `${BASE_URL}/`
  );

  return Array.isArray(data)
    ? data
    : data?.data ?? [];
};

// obtener por id
export const obtenerDonativoPorId = async (
  id
) => {
  const { data } = await API.get(
    `${BASE_URL}/${id}/`
  );

  return data;
};

// crear
export const crearDonativo = async (
  payload
) => {
  const { data } = await API.post(
    `${BASE_URL}/`,
    payload
  );

  return data;
};

// actualizar
export const actualizarDonativo = async (
  id,
  payload
) => {
  const { data } = await API.patch(
    `${BASE_URL}/${id}/`,
    payload
  );

  return data;
};

// donativos de un donador en un periodo
export const obtenerDonativosPorDonadorPeriodo =
  async (
    idDonador,
    idPeriodo
  ) => {
    const { data } = await API.get(
      `${BASE_URL}/`,
      {
        params: {
          id_donador: idDonador,
          id_periodo: idPeriodo,
        },
      }
    );

    return data;
  };

// todos los donativos de un donador
export const obtenerDonativosPorDonador =
  async (idDonador) => {
    const { data } = await API.get(
      `${BASE_URL}/por-donador/`,
      {
        params: {
          id_donador: idDonador,
        },
      }
    );

    return data;
  };

// resumen de donativos por periodo
export const obtenerResumenDonativos =
  async (idPeriodo) => {
    const { data } = await API.get(
      `${BASE_URL}/resumen/`,
      {
        params: {
          id_periodo: idPeriodo,
        },
      }
    );

    return data;
  };

// periodos donde el donador tiene donativos
export const obtenerPeriodosDonativosPorDonador =
  async (idDonador) => {
    const { data } = await API.get(
      `/api/donadores/donadores/${idDonador}/periodos-donativos/`
    );

    return data;
  };

// donativos del periodo activo
export const obtenerDonativosPeriodoActivo =
  async () => {
    const { data } = await API.get(
      `${BASE_URL}/periodo-activo/`
    );

    return data;
  };

  // resumen total por donador en un periodo
export const obtenerResumenPeriodo = async (
  idPeriodo
) => {
  const { data } = await API.get(
    "/api/donadores/donadores/resumen-periodo/",
    {
      params: {
        id_periodo: idPeriodo,
      },
    }
  );

  return data;
};