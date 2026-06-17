import { useState, useMemo } from "react";
import { usePostulantes } from "../hooks/usePostulantes";

export const usePostulantesPage = () => {
  const [filters, setFilters] = useState({
    visita: "todos",
    estudio: "todos",
    decision: "todos",
    prioridad: "todos",
    nivelEducativo: "todos",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;
  const { data: postulantes = [], isLoading, error } = usePostulantes();
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const allData = useMemo(() => {
    const listaPostulantes = Array.isArray(postulantes) ? postulantes : postulantes?.results || [];

    return listaPostulantes.map((postulante) => {
      const expediente = postulante.expediente || {};
      const visita = postulante.visita || {};
      const estudio = postulante.estudio || {};

      const familia = expediente.familia || [];
      const tutor = familia.find((f) => f.es_tutor_principal);

      return {
        ...postulante,
        expediente,
        // visita
        id_visita: visita.id_visita || null,
        fecha_visita: visita.fecha_visita || null,
        estado_visita: visita.estado_visita || "No agendada",
        nota_visita: visita.nota_visita || "",
        // estudio
        estatus_estudio: estudio.estatus_estudio || "Pendiente",
        nivel_escolar_inicial: estudio.nivel_escolar_inicial || "--",
        grado_escolar_inicial: estudio.grado_escolar_inicial || "--",
        // tutor
        tutor_nombre: tutor ? `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ""}`.trim() : "--",
        tutor_telefono: tutor?.telefono || "--",
        prioridad_servicio: estudio.prioridad_servicio || null
      };
    });
  }, [postulantes]);

  const filteredPostulantes = useMemo(() => {
    const searchLower = search.toLowerCase();
    const hoy = new Date();
    return allData.filter((p) => {
      const nombrePostulante =
        `${p.expediente?.nombre || ""} ${p.expediente?.apellido_p || ""
          } ${p.expediente?.apellido_m || ""}`.toLowerCase();

      const matchSearch =
        nombrePostulante.includes(searchLower) ||
        (p.tutor_nombre || "")
          .toLowerCase()
          .includes(searchLower);

      const visitaVencida =
        p.estado_visita === "Programada" &&
        p.fecha_visita &&
        new Date(p.fecha_visita) < hoy;

      const estadoVisualVisita = visitaVencida
        ? "No realizada"
        : p.estado_visita;

      const matchVisita =
        filters.visita === "todos" ||
        estadoVisualVisita.toLowerCase() ===
        filters.visita.toLowerCase();

      const matchEstudio =
        filters.estudio === "todos" ||
        p.estatus_estudio?.toLowerCase() ===
        filters.estudio.toLowerCase();

      const matchDecision =
        filters.decision === "todos" ||
        p.estatus?.toLowerCase() ===
        filters.decision.toLowerCase();

      const matchPrioridad =
        filters.prioridad === "todos" ||
        (p.prioridad_servicio || "").toLowerCase() ===
        filters.prioridad.toLowerCase();

      const matchNivelEducativo =
        filters.nivelEducativo === "todos" ||
        (p.nivel_escolar_inicial || "").toLowerCase() ===
        filters.nivelEducativo.toLowerCase();

      return (
        matchSearch &&
        matchVisita &&
        matchEstudio &&
        matchDecision &&
        matchPrioridad &&
        matchNivelEducativo
      );
    });
  }, [allData, search, filters]);

  const totalPages = Math.ceil(
    filteredPostulantes.length / PAGE_SIZE
  );

  const paginatedPostulantes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredPostulantes.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filteredPostulantes, currentPage]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");

    setFilters({
      visita: "todos",
      estudio: "todos",
      decision: "todos",
      prioridad: "todos",
      nivelEducativo: "todos",
    });

    setCurrentPage(1);
  };

  return {
    postulantes: paginatedPostulantes,
    totalCount: filteredPostulantes.length,

    loading: isLoading,
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
  };
};