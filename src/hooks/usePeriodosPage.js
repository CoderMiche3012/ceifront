import { useEffect, useState, useMemo } from "react"; 
import { obtenerPeriodos } from "../services/periodoService";

export default function usePeriodosPage() {
  //inicial para la tabla
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //para paginacion y filtros
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 3;
  // para los modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState(null);
  const handleOpenCreate = () => setIsCreateModalOpen(true);
  const handleCloseCreate = () => setIsCreateModalOpen(false);

  //logica para la tabla
  const fetchPeriodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerPeriodos();
      setPeriodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPeriodos();
  }, []);
  //logica de filtrado por ciclo escolar
  const filteredPeriodos = useMemo(() => {
    return periodos
      .filter((periodo) => {
        // 1. Solo incluimos los que tienen estado false
        const esInactivo = periodo.estado === false || Number(periodo.estado) === 0;

        // 2. Aplicamos la búsqueda por ciclo escolar
        const coincideBusqueda = periodo.ciclo_escolar
          ?.toLowerCase()
          .includes(search.toLowerCase());

        return esInactivo && coincideBusqueda;
      })
      // 3. Ordenamos por id_periodo (1, 2, 3...)
      .sort((a, b) => a.id_periodo - b.id_periodo);
  }, [periodos, search]);
  const periodoActivo = useMemo(() => {
    return periodos.find((p) =>
      p.estado === true ||
      p.estado === 1 ||
      p.estado === "1" ||
      p.estado === "true"
    );
  }, [periodos]);
  //para la paginacion
  const totalPages = Math.ceil(filteredPeriodos.length / PAGE_SIZE);
  const periodosPaginados = filteredPeriodos.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  // Resetear a la primera página al buscar
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleClearFilters = () => {
    setSearch("");
    setCurrentPage(1);
  };
  //para los modales
  const handleOpenEdit = (periodo) => {
    setSelectedPeriodo(periodo);
    setIsEditModalOpen(true);
  };
  const handleCloseEdit = () => {
    setSelectedPeriodo(null);
    setIsEditModalOpen(false);
  };
  return {
    periodoActivo,periodos: periodosPaginados, filteredPeriodos, search, handleSearchChange, handleClearFilters, filteredPeriodos,//para el filtro y busqueda
    currentPage, totalPages, PAGE_SIZE, setCurrentPage, //para la paginacion
    loading, error,
    //para los modales
    isCreateModalOpen, isEditModalOpen, selectedPeriodo,
    handleOpenCreate, handleCloseCreate, handleOpenEdit, handleCloseEdit,
    fetchPeriodos,
  };

}