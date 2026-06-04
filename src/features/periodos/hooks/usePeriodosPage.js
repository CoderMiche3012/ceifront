import { useState, useMemo } from "react";
import { usePeriodos, usePeriodoActivo } from "../hooks/usePeriodos";

export default function usePeriodosPage() {
  // consultas
  const { data: periodos = [], isLoading: loadingPeriodos, error: errorPeriodos } = usePeriodos();
  const { data: periodoActivo = null, isLoading: loadingActivo, error: errorActivo } = usePeriodoActivo();
  // estados
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  //paginacion
  const PAGE_SIZE = 3;
  // modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const handleOpenCreate = () => setIsCreateModalOpen(true);
  const handleCloseCreate = () => setIsCreateModalOpen(false);

  const filteredPeriodos = useMemo(() => {
    return periodos
      .filter((periodo) => {
        const noEsActivo = periodo.id_periodo !== periodoActivo?.id_periodo;
        const coincideBusqueda = periodo.ciclo_escolar?.toLowerCase().includes(search.toLowerCase());
        return noEsActivo && coincideBusqueda;
      })
      .sort((a, b) => a.id_periodo - b.id_periodo);
  }, [periodos, periodoActivo, search]);

  const totalPages = Math.ceil( filteredPeriodos.length / PAGE_SIZE );

  const periodosPaginados = filteredPeriodos.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const handleOpenEdit = (periodo) => {
    setSelectedPeriodo(periodo);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setSelectedPeriodo(null);
    setIsEditModalOpen(false);
  };

  return {
    // manda el periodo activo
    periodoActivo,
    // todos los periodos
    periodos: periodosPaginados,
    filteredPeriodos,
    // filtros
    search,
    handleSearchChange,
    handleClearFilters,
    // paginacion
    currentPage,
    totalPages,
    PAGE_SIZE,
    setCurrentPage,
    // error y carga
    loading: loadingPeriodos || loadingActivo,
    error: errorPeriodos || errorActivo,
    // modales
    isCreateModalOpen,
    isEditModalOpen,
    selectedPeriodo,
    handleOpenCreate,
    handleCloseCreate,
    handleOpenEdit,
    handleCloseEdit,
  };
}