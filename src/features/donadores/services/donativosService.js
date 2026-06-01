import API from "../../../config/apiClient";
const BASE_URL = "/api/donadores/donativos";

// obtener todos
export const obtenerDonativos = async () => {
  const { data } = await API.get(`${BASE_URL}/`);
  return Array.isArray(data) ? data : data?.data ?? [];
};

// obtener por id
export const obtenerDonativoPorId = async (id) => {
  const { data } = await API.get(`${BASE_URL}/${id}/`);
  return data;
};

// crear donativo
export const crearDonativo = async (payload) => {
  const { data } = await API.post(`${BASE_URL}/`, payload);
  return data;
};

// actualizar donativo
export const actualizarDonativo = async (id, payload) => {
  const { data } = await API.patch( `${BASE_URL}/${id}/`, payload);
  return data;
};

// obtener donativos con ciclo escolar
export const obtenerDonativosConPeriodo =
  async () => {
    const [ resDonativos, resPeriodos, ] = await Promise.all([ API.get(`${BASE_URL}/`), API.get("/api/periodos/"), ]);
    const donativos = Array.isArray( resDonativos.data ) ? resDonativos.data : [];
    const periodosRaw = resPeriodos.data;
    const periodos = Array.isArray(periodosRaw) ? periodosRaw : periodosRaw?.results ?? periodosRaw?.data ?? [];

    return donativos.map(
      (item) => {

        const periodo = periodos.find( (p) => Number( p.id_periodo ) === Number( item.id_periodo ) );
        return {
          ...item,
          ciclo_escolar: periodo?.ciclo_escolar || "Sin ciclo",
        };
      }
    );
  };