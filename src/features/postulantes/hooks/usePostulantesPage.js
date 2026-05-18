import { useState, useEffect, useCallback, useMemo } from "react";
import { postulantesService } from "../services/postulantesService";
import { obtenerVisita } from "../services/visitasService";
import { obtenerExpediente } from "../../expedientes/services/expedientesService";
import { obtenerEstudios } from "../services/estudiosService";

export const usePostulantesPage = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    visita: "todos",
    estudio: "todos",
    decision: "todos"
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  const fetchPostulantes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [resPostulantes, resVisitas, resExpedientes, resEstudios] = await Promise.all([
        postulantesService.obtenerPostulantes(),
        obtenerVisita(),
        obtenerExpediente(),
        obtenerEstudios()
      ]);

      const listaEstudios = Array.isArray(resEstudios)
        ? resEstudios
        : resEstudios.results || [];

      const listaPostulantes = Array.isArray(resPostulantes)
        ? resPostulantes
        : resPostulantes.results || [];

      const listaVisitas = Array.isArray(resVisitas)
        ? resVisitas
        : [];

      const listaExpedientes = Array.isArray(resExpedientes)
        ? resExpedientes
        : resExpedientes.results || [];

      const datosCombinados = listaPostulantes.map((postulante) => {
        const expedienteId =
          typeof postulante.id_expediente === "object"
            ? postulante.id_expediente?.id_expediente
            : postulante.id_expediente;

        const expediente = listaExpedientes.find(
          (e) => String(e.id_expediente) === String(expedienteId)
        );

        const visita = listaVisitas.find(
          (v) => v.id_postulante === postulante.id_postulante
        );

        const estudio = listaEstudios.find(
          (est) => String(est.id_expediente) === String(expedienteId)
        );

        const familia =
          expediente?.familia ||
          postulante.id_expediente?.familia ||
          [];

        const tutor = familia.find(
          (f) => f.es_tutor_principal === true
        );

        return {
          ...postulante,
          expediente: expediente || postulante.id_expediente,
          // visita
          id_visita: visita?.id_visita || null,
          fecha_visita: visita?.fecha_visita || null,
          estado_visita: visita?.estado_visita || "No agendada",
          nota_visita: visita?.nota_visita || "",
          estatus_estudio: estudio?.estatus_estudio || "Pendiente",
          // tutor
          tutor_nombre: tutor
            ? `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ""}`
            : "--",
          tutor_telefono: tutor?.telefono || "--",
          nivel_escolar_inicial: estudio?.nivel_escolar_inicial || "--",
          grado_escolar_inicial: estudio?.grado_escolar_inicial || "--"
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
    fetchPostulantes();
  }, [fetchPostulantes]);

  const filteredPostulantes = useMemo(() => {
    const searchLower = search.toLowerCase();
    return allData.filter((p) => {
      //filtro de busqueda
      const nombrePostulante = `${p.expediente?.nombre || ""} ${p.expediente?.apellido_p || ""}`.toLowerCase();
      const matchSearch = nombrePostulante.includes(searchLower) || (p.tutor_nombre || "").toLowerCase().includes(searchLower);
      //filtro de Visita 
      const matchVisita = filters.visita === "todos" || p.estado_visita?.toLowerCase() === filters.visita.toLowerCase();
      //filtro de Estudio 
      const matchEstudio = filters.estudio === "todos" || p.estatus_estudio?.toLowerCase() === filters.estudio.toLowerCase();
      //filtro de Decision
      const matchDecision = filters.decision === "todos" || p.estatus_postulante?.toLowerCase() === filters.decision.toLowerCase();
      return matchSearch && matchVisita && matchEstudio && matchDecision;
    });
  }, [allData, search, filters]);

  const totalPages = Math.ceil(filteredPostulantes.length / PAGE_SIZE);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedPostulantes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPostulantes.slice(start, start + PAGE_SIZE);
  }, [filteredPostulantes, currentPage]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters({ visita: "todos", estudio: "todos", decision: "todos" });
    setCurrentPage(1);
  };

  return {
    postulantes: paginatedPostulantes,
    totalCount: filteredPostulantes.length,
    loading,
    error,
    fetchPostulantes,
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