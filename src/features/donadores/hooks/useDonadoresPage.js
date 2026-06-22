import { useState, useEffect, useCallback, useMemo } from "react";

import { useDonadores } from "./useDonadores";
import { useResumenPeriodoTotales } from "./useDonativos";

import { usePeriodoActivo } from "../../periodos/hooks/usePeriodos";

export const useDonadoresPage = () => {
  const { data: donadores = [], isLoading: loadingDonadores, error: errorDonadores, } = useDonadores();
  const { data: periodoActivo, isLoading: loadingPeriodo, error: errorPeriodo } = usePeriodoActivo();
  const { data: resumenPeriodo = [], isLoading: loadingResumen, error: errorResumen } = useResumenPeriodoTotales(periodoActivo?.id_periodo);
  console.log("periodoActivo",periodoActivo)
  console.log("resumen",resumenPeriodo)
  console.log("donadores",donadores)
  const [filters, setFilters] = useState({ estatus: "todos", tipo: "todos" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 3;

  const loading = loadingDonadores || loadingPeriodo || loadingResumen;
  const error = errorDonadores || errorPeriodo || errorResumen;

  // filtros
  const handleFilterChange =
    useCallback((key, value) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
      setCurrentPage(1);
    }, []);

  // mapa de resumenes por donador
  const resumenMap = useMemo(() => {
    return resumenPeriodo.reduce(
      (acc, item) => {
        acc[item.id_donador] = item;
        return acc;
      },
      {}
    );
  }, [resumenPeriodo]);

  // unir donadores + resumen del periodo activo
  const donadoresConTotales =
    useMemo(() => {
      return donadores.map((donador) => {
        const resumen =
          resumenMap[
          donador.id_donador
          ];
        return {
          ...donador,
          cantidadDonativos: resumen?.cantidad_donativos ?? 0,
          totalesPeriodoActivo: resumen?.totales ?? {},
        };
      });
    }, [donadores, resumenMap]);
  // filtros y búsqueda
  const filteredDonadores =
    useMemo(() => {
      const searchLower = search.toLowerCase();
      return donadoresConTotales.filter(
        (p) => {
          const matchSearch = (p.nombre || "").toLowerCase().includes(searchLower);
          const matchStatus = filters.estatus === "todos" || p.estatus?.toLowerCase() === filters.estatus.toLowerCase();
          const matchTipo = filters.tipo === "todos" || p.tipo_donador?.toLowerCase() === filters.tipo.toLowerCase();
          return (matchSearch && matchStatus && matchTipo);
        }
      );
    }, [donadoresConTotales, search, filters]);

  // paginación
  const totalPages = Math.ceil(filteredDonadores.length / PAGE_SIZE);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedDonadores =
    useMemo(() => {
      const start = (currentPage - 1) * PAGE_SIZE;

      return filteredDonadores.slice(
        start,
        start + PAGE_SIZE
      );
    }, [filteredDonadores, currentPage,]);

  // búsqueda
  const handleSearchChange =
    useCallback((value) => {
      setSearch(value);
      setCurrentPage(1);
    }, []);

  const handleClearFilters =
    useCallback(() => {
      setSearch("");
      setFilters({
        estatus: "todos",
        tipo: "todos",
      });
      setCurrentPage(1);
    }, []);

  return {
    donadores: paginatedDonadores,
    donadoresFiltrados: filteredDonadores,
    totalCount: filteredDonadores.length,
    loading,
    error,
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
