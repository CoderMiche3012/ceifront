import { useState, useMemo } from "react";
import { usePeriodos } from "../hooks/usePeriodos";

export default function usePeriodosPage() {
  // estados iniciales 
  const { data: periodos = [], isLoading: loading, error } = usePeriodos();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 3;
  //para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const handleOpenCreate = () => setIsCreateModalOpen(true);
  const handleCloseCreate = () => setIsCreateModalOpen(false);

  const filteredPeriodos = useMemo(() => {
    return periodos
      .filter((periodo) => {
        const esInactivo = periodo.estado === false || Number(periodo.estado) === 0;

        const coincideBusqueda = periodo.ciclo_escolar
          ?.toLowerCase()
          .includes(search.toLowerCase());

        return esInactivo && coincideBusqueda;
      })
      .sort((a, b) => a.id_periodo - b.id_periodo);
  }, [periodos, search]);

  const periodoActivo = useMemo(() => {
    return periodos.find(
      (p) =>
        p.estado === true ||
        p.estado === 1 ||
        p.estado === "1" ||
        p.estado === "true"
    );
  }, [periodos]);

  const totalPages = Math.ceil(filteredPeriodos.length / PAGE_SIZE);

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
    periodoActivo,
    periodos: periodosPaginados,
    filteredPeriodos,
    search,
    handleSearchChange,
    handleClearFilters,

    currentPage,
    totalPages,
    PAGE_SIZE,
    setCurrentPage,

    loading,
    error,

    isCreateModalOpen,
    isEditModalOpen,
    selectedPeriodo,
    handleOpenCreate,
    handleCloseCreate,
    handleOpenEdit,
    handleCloseEdit,
  };
}
 