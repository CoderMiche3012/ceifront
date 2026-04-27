import { useState, useEffect, useCallback, useMemo } from "react";
import { obtenerDonador } from "../../services/donadoresService";

export const useDonadoresPage = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    estatus: "todos",
    tipo: "todos",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const fetchDonadores = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [resDonadores] = await Promise.all([
        obtenerDonador()
      ]);
      const listaDonadores = Array.isArray(resDonadores)
        ? resDonadores
        : resDonadores.results || [];
      setAllData(listaDonadores);
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

  const filteredDonadores = useMemo(() => {
    const searchLower = search.toLowerCase();
    return allData.filter((p) => {
      const nombreDonador = `${p.nombre || ""} `.toLowerCase();
      const matchSearch = nombreDonador.includes(searchLower);
      const matchStatus = filters.estatus === "todos" || p.estatus?.toLowerCase() === filters.estatus.toLowerCase();
      const matchTipo = filters.tipo === "todos" || p.tipo?.toLowerCase() === filters.tipo.toLowerCase();
      return matchStatus && matchSearch && matchTipo ;
    });
  }, [allData, search, filters]);

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

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters({ estatus: "todos" });
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
    PAGE_SIZE, filters,
    handleFilterChange,

  };
};