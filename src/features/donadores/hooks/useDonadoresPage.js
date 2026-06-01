import { useState, useEffect, useCallback, useMemo, } from "react";

import { useDonadores } from "./useDonadores";
import { useDonativos } from "./useDonativos";
import { usePeriodoActivo } from "../../periodos/hooks/usePeriodoActivo";

export const useDonadoresPage = () => {
  const {
    data: donadores = [],
    isLoading: loadingDonadores,
    error: errorDonadores,
  } = useDonadores();

  const {
    data: donativos = [],
    isLoading: loadingDonativos,
    error: errorDonativos,
  } = useDonativos();

  const {
    periodoActivo,
    isLoading: loadingPeriodo,
    error: errorPeriodo,
  } = usePeriodoActivo();

  const [filters, setFilters] = useState({
    estatus: "todos",
    tipo: "todos",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 3;
  const loading = loadingDonadores || loadingDonativos || loadingPeriodo;
  const error = errorDonadores || errorDonativos || errorPeriodo;

  // filtros
  const handleFilterChange =
    useCallback((key, value) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
      setCurrentPage(1);
    }, []);

  // calcular totales
  const calcularTotales =
    useCallback(
      (donadorId, periodoId) => {
        const filtrados =
          donativos.filter(
            (d) => Number( d.id_donador ) === Number( donadorId ) && Number( d.id_periodo ) === Number( periodoId )
          );

        return filtrados.reduce(
          (acc, item) => {
            const moneda = item.moneda || "MXN";
            acc[moneda] = (acc[ moneda ] || 0) + Number( item.monto || 0 );
            return acc;
          },
          {}
        );
      },
      [donativos]
    );

  // agregar totales al periodo activo
  const donadoresConTotales =
    useMemo(() => {
      return donadores.map(
        (donador) => ({
          ...donador,
          totalesPeriodoActivo: periodoActivo ? calcularTotales( donador.id_donador, periodoActivo.id_periodo ) : {},
        })
      );
    }, [ donadores, periodoActivo, calcularTotales, ]);

  // filtros y busqueda
  const filteredDonadores =
    useMemo(() => {

      const searchLower = search.toLowerCase();

      return donadoresConTotales.filter(
        (p) => {
          const matchSearch = ( p.nombre || "" ) .toLowerCase() .includes( searchLower );
          const matchStatus = filters.estatus === "todos" || p.estatus?.toLowerCase() === filters.estatus.toLowerCase();
          const matchTipo = filters.tipo === "todos" || p.tipo?.toLowerCase() ===  filters.tipo.toLowerCase();
          return ( matchSearch && matchStatus && matchTipo );
        }
      );
    }, [ donadoresConTotales, search, filters, ]);

  // paginación
  const totalPages = Math.ceil(  filteredDonadores.length / PAGE_SIZE );

  useEffect(() => {
    if ( currentPage > totalPages && totalPages > 0 ) {
      setCurrentPage( totalPages );
    }
  }, [ currentPage, totalPages, ]);

  const paginatedDonadores =
    useMemo(() => {
      const start = (currentPage - 1) * PAGE_SIZE;
      return filteredDonadores.slice( start, start + PAGE_SIZE );
    }, [ filteredDonadores, currentPage, ]);

  // busqueda
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