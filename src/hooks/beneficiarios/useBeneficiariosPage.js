import { useState, useEffect, useCallback, useMemo } from "react";
import { obtenerExpediente } from "../../services/expedientesService";
import { obtenerBeneficiario } from "../../services/beneficiariosService";

export const useBeneficiariosPage = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    estatus: "todos",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const fetchBeneficiarios = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [resBeneficiarios, resExpedientes] = await Promise.all([
        obtenerBeneficiario(),
        obtenerExpediente(),
      ]);

      const listaBeneficiarios = Array.isArray(resBeneficiarios)
        ? resBeneficiarios
        : resBeneficiarios.results || [];

      const listaExpedientes = Array.isArray(resExpedientes)
        ? resExpedientes
        : resExpedientes.results || [];

      const datosCombinados = listaBeneficiarios.map((beneficiario) => {
        const expedienteId =
          typeof beneficiario.id_expediente === "object"
            ? beneficiario.id_expediente?.id_expediente
            : beneficiario.id_expediente;

        const expediente = listaExpedientes.find(
          (e) => String(e.id_expediente) === String(expedienteId)
        );

        return {
          ...beneficiario,
          expediente: expediente || beneficiario.id_expediente,
        };
      });

      setAllData(datosCombinados);
    } catch (err) {
      console.error("Error en la carga de datos:", err);
      setError(err.message || "Error al obtener la lista");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchBeneficiarios();
  }, [fetchBeneficiarios]);

  const filteredBeneficiarios = useMemo(() => {
    const searchLower = search.toLowerCase();
    return allData.filter((p) => {
      // Filtro de Búsqueda
      const nombreBeneficiario = `${p.expediente?.nombre || ""} ${p.expediente?.apellido_p || ""}`.toLowerCase();
      const matchSearch = nombreBeneficiario.includes(searchLower);

      // Filtro de estatus
      const matchStatus = filters.estatus === "todos" || p.estatus?.toLowerCase() === filters.estatus.toLowerCase();
      return matchStatus && matchSearch;
    });
  }, [allData, search, filters]);

  const totalPages = Math.ceil(filteredBeneficiarios.length / PAGE_SIZE);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedBeneficiarios = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBeneficiarios.slice(start, start + PAGE_SIZE);
  }, [filteredBeneficiarios, currentPage]);

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
    beneficiarios: paginatedBeneficiarios,
    totalCount: filteredBeneficiarios.length,
    loading,
    error,
    fetchBeneficiarios,
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