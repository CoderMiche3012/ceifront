import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { obtenerExpediente } from "../../services/expedientesService";
import { obtenerBeneficiario } from "../../services/beneficiariosService";
import { obtenerDonador } from "../../services/donadoresService";
import { obtenerPeriodos } from "../../services/periodoService";

const INITIAL_FILTERS = {
  estatus: "todos",
  nivel: "todos",
  rendimiento: "todos",
  donador: "todos",
  periodo: "actual", // 🔥 AGREGAR ESTO
};

export const useBeneficiariosPage = (pageSize = 4) => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [periodo, setPeriodo] = useState("actual");

  const PAGE_SIZE = pageSize;

  // 🔥 BENEFICIARIOS + EXPEDIENTES + DONADORES
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["beneficiarios"],
    queryFn: async () => {
      const [beneficiariosRes, expedientesRes, donadoresRes] =
        await Promise.all([
          obtenerBeneficiario(),
          obtenerExpediente(),
          obtenerDonador(),
        ]);

      const beneficiarios =
        beneficiariosRes?.results || beneficiariosRes || [];
      const expedientes =
        expedientesRes?.results || expedientesRes || [];
      const donadores = donadoresRes?.results || donadoresRes || [];

      const expedientesMap = new Map(
        expedientes.map((e) => [String(e.id_expediente), e])
      );

      return beneficiarios.map((b) => {
        const id =
          typeof b.id_expediente === "object"
            ? b.id_expediente?.id_expediente
            : b.id_expediente;

        const tieneDonador = donadores.some((d) =>
          (d.beneficiarios_apoyados || []).some(
            (ben) =>
              String(
                typeof ben === "object"
                  ? ben.id_beneficiario
                  : ben
              ) === String(b.id_beneficiario)
          )
        );

        const expediente =
          expedientesMap.get(String(id)) || b.id_expediente;

        const seguimientos = b.historial_seguimientos || [];

        // 🔥 SEGUIMIENTO POR PERIODO
        const seguimientoSeleccionado = (() => {
          if (!seguimientos.length) return null;

          if (periodo === "actual") {
            return [...seguimientos].sort(
              (a, b) => b.id_periodo - a.id_periodo
            )[0];
          }

          const encontrado = seguimientos.find(
            (s) => String(s.id_periodo) === String(periodo)
          );

          return (
            encontrado ||
            [...seguimientos].sort(
              (a, b) => b.id_periodo - a.id_periodo
            )[0]
          );
        })();

        const estatus =
          seguimientoSeleccionado?.estatus || "Sin seguimiento";

        const boletas =
          seguimientoSeleccionado?.datos_escolares?.boletas || [];

        const escolaridad =
          seguimientoSeleccionado?.datos_escolares?.id_escolaridad;

        let promedio = null;

        if (boletas.length > 0) {
          const suma = boletas.reduce(
            (acc, b) => acc + Number(b.promedio_boleta || 0),
            0
          );
          promedio = (suma / boletas.length).toFixed(1);
        }

        const nivelGrado = escolaridad
          ? `${escolaridad.nivel_escolar} ${escolaridad.grado_escolar}`
          : "Sin datos";

        return {
          ...b,
          expediente: {
            ...expediente,
            direccion: {
              cp: expediente?.id_direccion?.cp ?? "--",
              municipio:
                expediente?.id_direccion?.municipio ?? "--",
              calle: expediente?.id_direccion?.calle ?? "--",
              numero: expediente?.id_direccion?.numero ?? "--",
              colonia:
                expediente?.id_direccion?.colonia ?? "--",
            },
          },
          estatus,
          promedio,
          nivelGrado,
          tieneDonador,
        };
      });
    },

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // 🔥 PERIODOS DESDE BACKEND (CORRECTO)
  const { data: periodosRes = [] } = useQuery({
    queryKey: ["periodos"],
    queryFn: obtenerPeriodos,
  });

 const periodosDisponibles = useMemo(() => {
  // Asegúrate de que periodos sea un array válido
  const periodos = Array.isArray(periodosRes?.results) 
    ? periodosRes.results 
    : Array.isArray(periodosRes) ? periodosRes : [];

  const base = [{ value: "actual", label: "Periodo actual" }];

  // Filtramos cualquier periodo que no tenga ID o nombre válido antes de mapear
  const mapeados = periodos
    .filter(p => p && (p.id_periodo || p.id)) 
    .map((p) => ({
      value: String(p.id_periodo || p.id),
      label: p.ciclo_escolar || p.nombre || "Periodo Desconocido",
    }));

  return [...base, ...mapeados];
}, [periodosRes]);

  // 🔥 FILTROS
  const filtered = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    const statusFilter = filters.estatus?.toLowerCase();

    return data.filter((item) => {
      const nombre =
        `${item.expediente?.nombre || ""} ${
          item.expediente?.apellido_p || ""
        }`.toLowerCase();

      const matchSearch =
        !searchLower || nombre.includes(searchLower);

      const status = String(item.estatus || "").toLowerCase();
      const matchStatus =
        statusFilter === "todos" || status === statusFilter;

      const nivel = item.nivelGrado?.toLowerCase() || "";
      const matchNivel =
        filters.nivel === "todos" ||
        nivel.includes(filters.nivel.toLowerCase());

      const promedio = Number(item.promedio);

      let rendimiento = "sin_datos";
      if (!isNaN(promedio)) {
        if (promedio < 7.5) rendimiento = "regularizacion";
        else if (promedio < 8) rendimiento = "bajo";
        else rendimiento = "bueno";
      }

      const matchRendimiento =
        filters.rendimiento === "todos" ||
        rendimiento === filters.rendimiento;

      const matchDonador =
        filters.donador === "todos" ||
        (filters.donador === "con" && item.tieneDonador) ||
        (filters.donador === "sin" && !item.tieneDonador);

      const matchPeriodo =
        periodo === "actual" ||
        item.historial_seguimientos?.some(
          (s) =>
            String(s.id_periodo) === String(periodo)
        );

      return (
        matchSearch &&
        matchStatus &&
        matchNivel &&
        matchRendimiento &&
        matchDonador &&
        matchPeriodo
      );
    });
  }, [data, search, filters, periodo]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage, PAGE_SIZE]);

  // 🔥 HANDLERS
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
  setFilters((prev) => ({ ...prev, [key]: value }));
  setCurrentPage(1);

  if (key === "periodo") {
    setPeriodo(value);
  }
};

  const handleClearFilters = () => {
  setSearch("");
  setFilters(INITIAL_FILTERS);
  setPeriodo("actual"); // ✔
  setCurrentPage(1);
};

  return {
    beneficiarios: paginated,
    totalCount: filtered.length,
    loading: isLoading,
    error: error?.message || null,
    search,
    filters,
    currentPage: safePage,
    totalPages,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    setCurrentPage,
    PAGE_SIZE,
    refetch,

    // 🔥 NUEVO
    periodosDisponibles,
    periodo,
    setPeriodo,
  };
};