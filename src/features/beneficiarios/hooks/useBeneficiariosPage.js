import { useState, useMemo } from "react";
import { useBeneficiarios } from "./useBeneficiarios";
import { usePeriodos } from "../../periodos/hooks/usePeriodos";

const INITIAL_FILTERS = {
  estatus: "todos",
  nivel: "todos",
  rendimiento: "todos",
  donador: "todos",
};

export const useBeneficiariosPage = (pageSize = 4) => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [periodo, setPeriodo] = useState(null);

  const obtenerNivelEducativo = (nivel) => {
    if (!nivel) return "";

    const valor = nivel.toLowerCase().trim();

    if (
      valor.includes("bachillerato") ||
      valor.includes("preparatoria")
    ) {
      return "Media Superior";
    }

    if (
      valor.includes("universidad") ||
      valor.includes("licenciatura") ||
      valor.includes("ingeniería") ||
      valor.includes("ingenieria")
    ) {
      return "Superior";
    }

    return nivel;
  };

  const PAGE_SIZE = pageSize;

  const { data: periodosRes = [] } = usePeriodos();
  // obtener los datos del beneficiario segun el periodo
  const { data: beneficiariosData = [], isLoading, error, } = useBeneficiarios(periodo);
  // para unificar tanto el general como el de por periodo
  const data = useMemo(() => {
    const beneficiarios = beneficiariosData?.results || beneficiariosData || [];
    return beneficiarios.map((b) => {
      const seguimiento = b.seguimiento || b.ultimo_seguimiento || null;
      const datosEscolares = seguimiento?.datos_escolares || null;
      let promedioFinal = null;
      // obtener el promedio ya sea el que ya manda backend o el calculado
      if (datosEscolares) {
        if (datosEscolares.boletas?.length) {
          // Formato para periodo específico 
          const suma = datosEscolares.boletas.reduce(
            (acc, x) => acc + Number(x.promedio_boleta || 0),
            0
          );
          promedioFinal = (suma / datosEscolares.boletas.length).toFixed(1);
        } else if (datosEscolares.Promedio && datosEscolares.Promedio !== "Sin calificaciones") {
          promedioFinal = Number(datosEscolares.Promedio).toFixed(1);
        }
      }
      // para el nivel y grado
      let nivelGradoFinal = "Sin datos";
      let nivelEducativo = "";

      if (datosEscolares) {
        if (datosEscolares.id_escolaridad?.nivel_escolar) {
          nivelEducativo = obtenerNivelEducativo(datosEscolares.id_escolaridad.nivel_escolar);
          nivelGradoFinal = `${nivelEducativo} ${datosEscolares.id_escolaridad.grado_escolar || ""
            }`;
        } else if (datosEscolares.nivel) {
          nivelEducativo = obtenerNivelEducativo(datosEscolares.nivel);
          nivelGradoFinal = `${nivelEducativo} ${datosEscolares.grado || ""}`;
        }
      }
      // obtener el ciclo escolar al que pertenece
      let cicloEscolarFinal = "--";
      if (seguimiento) {
        if (seguimiento.periodo?.ciclo_escolar) {
          cicloEscolarFinal = seguimiento.periodo.ciclo_escolar;
        } else if (seguimiento.id_periodo) {
          const periodoEncontrado = periodosRes.find(p => p.id_periodo === seguimiento.id_periodo);
          if (periodoEncontrado) {
            cicloEscolarFinal = periodoEncontrado.ciclo_escolar;
          }
        }
      }
      const estatusRaw = seguimiento?.estatus ?? "Sin seguimiento";

      const estatusNormalizado =
        estatusRaw?.toLowerCase() === "finalizado"
          ? "Graduado"
          : estatusRaw;
      return {
        ...b,
        expediente: {
          nombre_completo: b.expediente_resumen?.nombre_completo ?? "",
          telefono: b.expediente_resumen?.telefono ?? "",
          fecha_nacimiento: b.expediente_resumen?.fecha_nacimiento ?? "",
          municipio: b.expediente_resumen?.municipio ?? "--",
        },
        seguimientoActivo: seguimiento,
        estatusSeguimiento: estatusNormalizado,
        nivelEducativo,
        nivelGrado: nivelGradoFinal.trim(),
        promedio: promedioFinal,
        cicloEscolar: cicloEscolarFinal,
        tieneDonador: (b.donadores?.length || 0) > 0,
      };
    });
  }, [beneficiariosData, periodosRes]);

  // filtros
  const filtered = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    return data.filter((item) => {
      // si el usuario seleccionó un periodo específico y el alumno no pertenece a ese periodo (seguimiento null o inexistente).
      if (periodo !== null) {
        if (!item.seguimientoActivo || item.estatusSeguimiento === "Sin seguimiento") {
          return false;
        }
      }
      const nombre = item.expediente?.nombre_completo?.toLowerCase() || "";
      const matchSearch = !searchLower || nombre.includes(searchLower);
      const matchStatus =
        filters.estatus === "todos" ||
        item.estatusSeguimiento?.toLowerCase() === filters.estatus.toLowerCase();
      const matchNivel = filters.nivel === "todos" || item.nivelEducativo?.toLowerCase() === filters.nivel.toLowerCase();
      let rendimiento = "sin_datos";
      const promedio = Number(item.promedio);
      if (!isNaN(promedio) && item.promedio !== null) {
        if (promedio < 7.5) rendimiento = "regularizacion";
        else if (promedio < 8) rendimiento = "bajo";
        else rendimiento = "bueno";
      }
      const matchRendimiento = filters.rendimiento === "todos" || rendimiento === filters.rendimiento;
      const matchDonador = filters.donador === "todos" || (filters.donador === "con" && item.tieneDonador) || (filters.donador === "sin" && !item.tieneDonador);

      return (
        matchSearch &&
        matchStatus &&
        matchNivel &&
        matchRendimiento &&
        matchDonador
      );
    });
  }, [data, search, filters, periodo]);

  // paginacion
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage, PAGE_SIZE]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);

    if (key === "periodo") {
      setPeriodo(value === "" || value === "actual" ? null : value);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters(INITIAL_FILTERS);
    setPeriodo(null);
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

    periodosDisponibles: periodosRes,
    periodo,
    setPeriodo,
  };
};