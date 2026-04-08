import { useState, useEffect, useCallback, useMemo } from "react";
import { postulantesService } from "../../services/postulantesService";
import { obtenerVisita } from "../../services/visitasService";
import { obtenerExpediente } from "../../services/expedientesService";

export const usePostulantesPage = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;

  const fetchPostulantes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [resPostulantes, resVisitas, resExpedientes] = await Promise.all([
        postulantesService.obtenerPostulantes(),
        obtenerVisita(),
        obtenerExpediente()
      ]);

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
        // ✅ ID seguro (objeto o número)
        const expedienteId =
          typeof postulante.id_expediente === "object"
            ? postulante.id_expediente?.id_expediente
            : postulante.id_expediente;

        // ✅ Buscar expediente correcto
        const expediente = listaExpedientes.find(
          (e) => String(e.id_expediente) === String(expedienteId)
        );

        // ✅ Buscar visita
        const visita = listaVisitas.find(
          (v) => v.id_postulante === postulante.id_postulante
        );

        // ✅ Fallback inteligente de familia
        const familia =
          expediente?.familia ||
          postulante.id_expediente?.familia ||
          [];

        // ✅ Obtener tutor
        const tutor = familia.find(
          (f) => f.es_tutor_principal === true
        );

        return {
          ...postulante,

          // ✅ usar siempre "expediente"
          expediente: expediente || postulante.id_expediente,

          // visita
          id_visita: visita?.id_visita || null,
          fecha_visita: visita?.fecha_visita || null,
          estado_visita: visita?.estado_visita || "No agendada",
          nota_visita: visita?.nota_visita || "",

          // tutor
          tutor_nombre: tutor
            ? `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ""}`
            : "--",

          tutor_telefono: tutor?.telefono || "--"
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

  // 🔍 FILTRO (ya corregido)
  const filteredPostulantes = useMemo(() => {
    const searchLower = search.toLowerCase();

    return allData.filter((p) => {
      const nombrePostulante = `${p.expediente?.nombre || ""
        } ${p.expediente?.apellido_p || ""} ${p.expediente?.apellido_m || ""
        }`.toLowerCase();

      const nombreTutor = (p.tutor_nombre || "").toLowerCase();

      return (
        nombrePostulante.includes(searchLower) ||
        nombreTutor.includes(searchLower)
      );
    });
  }, [allData, search]);

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
    PAGE_SIZE
  };
};