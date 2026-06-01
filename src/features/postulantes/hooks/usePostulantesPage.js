import { useState, useMemo } from "react";
import { usePostulantes } from "../hooks/usePostulantes";
import { useVisitas } from "../hooks/useVisitas";
import { useEstudios } from "../hooks/useEstudios";

export const usePostulantesPage = () => {
  const [filters, setFilters] = useState({
    visita: "todos",
    estudio: "todos",
    decision: "todos",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 4;

  // ========================
  // DATA
  // ========================
  const { data: postulantes = [], isLoading, error } = usePostulantes();
  const { data: visitas = [] } = useVisitas();
  const { data: estudios = [] } = useEstudios();

  // ========================
  // FILTERS
  // ========================
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // ========================
  // NORMALIZACIÓN + JOIN
  // ========================
  const allData = useMemo(() => {
    const listaPostulantes = Array.isArray(postulantes)
      ? postulantes
      : postulantes?.results || [];

    const listaVisitas = Array.isArray(visitas)
      ? visitas
      : [];

    const listaEstudios = Array.isArray(estudios)
      ? estudios
      : estudios?.results || [];

    return listaPostulantes.map((postulante) => {
      const expediente = postulante.id_expediente || null;

      const visita = listaVisitas.find(
        (v) => v.id_postulante === postulante.id_postulante
      );

      const estudio = listaEstudios.find(
        (e) =>
          String(e.id_expediente) ===
          String(expediente?.id_expediente || expediente)
      );

      const familia = expediente?.familia || [];
      const tutor = familia.find((f) => f.es_tutor_principal);

      return {
        ...postulante,

        expediente,

        // visita
        id_visita: visita?.id_visita || null,
        fecha_visita: visita?.fecha_visita || null,
        estado_visita: visita?.estado_visita || "No agendada",
        nota_visita: visita?.nota_visita || "",

        // estudio
        estatus_estudio: estudio?.estatus_estudio || "Pendiente",
        nivel_escolar_inicial: estudio?.nivel_escolar_inicial || "--",
        grado_escolar_inicial: estudio?.grado_escolar_inicial || "--",

        // tutor
        tutor_nombre: tutor
          ? `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ""}`
          : "--",
        tutor_telefono: tutor?.telefono || "--",
      };
    });
  }, [postulantes, visitas, estudios]);

  // ========================
  // SEARCH + FILTERS
  // ========================
  const filteredPostulantes = useMemo(() => {
    const searchLower = search.toLowerCase();

    return allData.filter((p) => {
      const nombrePostulante =
        `${p.expediente?.nombre || ""} ${p.expediente?.apellido_p || ""}`
          .toLowerCase();

      const matchSearch =
        nombrePostulante.includes(searchLower) ||
        (p.tutor_nombre || "").toLowerCase().includes(searchLower);

      const matchVisita =
        filters.visita === "todos" ||
        p.estado_visita?.toLowerCase() === filters.visita.toLowerCase();

      const matchEstudio =
        filters.estudio === "todos" ||
        p.estatus_estudio?.toLowerCase() === filters.estudio.toLowerCase();

      const matchDecision =
        filters.decision === "todos" ||
        p.estatus_postulante?.toLowerCase() === filters.decision.toLowerCase();

      return matchSearch && matchVisita && matchEstudio && matchDecision;
    });
  }, [allData, search, filters]);

  // ========================
  // PAGINACIÓN
  // ========================
  const totalPages = Math.ceil(filteredPostulantes.length / PAGE_SIZE);

  const paginatedPostulantes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPostulantes.slice(start, start + PAGE_SIZE);
  }, [filteredPostulantes, currentPage]);

  // ajuste de página
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  // ========================
  // ACTIONS
  // ========================
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