import { useState, useEffect, useCallback, useMemo } from "react";
import { obtenerDonador } from "../../services/donadoresService";
import { obtenerPeriodos } from "../../services/periodoService";
import { obtenerDonativos } from "../../services/donativosService";

export const useDonadoresPage = () => {
  const [allData, setAllData] = useState([]);
  const [donativos, setDonativos] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    estatus: "todos",
    tipo: "todos",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 4;
  //filtros
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  const fetchDonadores = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [resDonadores, resPeriodos, resDonativos] = await Promise.all([
        obtenerDonador(),
        obtenerPeriodos(),
        obtenerDonativos(),
      ]);

      setAllData(
        Array.isArray(resDonadores)
          ? resDonadores
          : resDonadores.results || []
      );

      setPeriodos(resPeriodos || []);

      setDonativos(
        Array.isArray(resDonativos)
          ? resDonativos
          : resDonativos.results || []
      );
    } catch (err) {
      console.error("Error en la carga de datos:", err);
      setError(err.message || "Error al obtener la lista");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonadores();
  }, [fetchDonadores]);

  //periodo activo
  const periodoActivo = useMemo(() => {
    return (
      periodos.find(
        (p) =>
          p.estado === true ||
          p.estado === "true" ||
          p.estado === 1 ||
          p.estado === "1"
      ) || null
    );
  }, [periodos]);
  const calcularTotales = useCallback(
    (donadorId, periodoId) => {
      const filtrados = donativos.filter(
        (d) =>
          Number(d.id_donador) === Number(donadorId) &&
          Number(d.id_periodo) === Number(periodoId)
      );

      return filtrados.reduce((acc, item) => {
        const moneda = item.moneda || "MXN";
        acc[moneda] = (acc[moneda] || 0) + Number(item.monto || 0);
        return acc;
      }, {});
    },
    [donativos]
  );
  const donadoresConTotales = useMemo(() => {
    return allData.map((donador) => ({
      ...donador,
      totalesPeriodoActivo: periodoActivo
        ? calcularTotales(donador.id_donador, periodoActivo.id_periodo)
        : {},
    }));
  }, [allData, periodoActivo, calcularTotales]);
  //filtros
  const filteredDonadores = useMemo(() => {
    const searchLower = search.toLowerCase();

    return donadoresConTotales.filter((p) => {
      const matchSearch = (p.nombre || "")
        .toLowerCase()
        .includes(searchLower);

      const matchStatus =
        filters.estatus === "todos" ||
        p.estatus?.toLowerCase() === filters.estatus.toLowerCase();

      const matchTipo =
        filters.tipo === "todos" ||
        p.tipo?.toLowerCase() === filters.tipo.toLowerCase();

      return matchSearch && matchStatus && matchTipo;
    });
  }, [donadoresConTotales, search, filters]);
  //paginacion
  const totalPages = Math.ceil(filteredDonadores.length / PAGE_SIZE);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);
  const paginatedDonadores = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDonadores.slice(start, start + PAGE_SIZE);
  }, [filteredDonadores, currentPage]);
  //busqueda
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters({ estatus: "todos", tipo: "todos" });
    setCurrentPage(1);
  };

  return {
    donadores: paginatedDonadores,
    totalCount: filteredDonadores.length,

    loading,
    error,

    fetchDonadores,

    search,
    handleSearchChange,

    handleClearFilters,

    currentPage,
    totalPages,
    setCurrentPage,

    PAGE_SIZE,

    filters,
    handleFilterChange,

    periodoActivo,
  };
};