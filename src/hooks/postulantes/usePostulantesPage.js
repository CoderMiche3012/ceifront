import { useState, useEffect, useCallback, useMemo } from "react";
import { postulantesService } from "../../services/postulantesService";
import { obtenerVisita } from "../../services/visitasService";

export const usePostulantesPage = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;

  const fetchPostulantes = useCallback(async () => {
    // Solo ponemos loading true la primera vez o si es necesario
    // Si quieres un refresco silencioso tras agendar, podrías quitar el setLoading(true)
    setLoading(true); 
    setError(null);
    try {
      const [resPostulantes, resVisitas] = await Promise.all([
        postulantesService.obtenerPostulantes(),
        obtenerVisita()
      ]);

      const listaPostulantes = Array.isArray(resPostulantes) ? resPostulantes : resPostulantes.results || [];
      const listaVisitas = Array.isArray(resVisitas) ? resVisitas : [];

      const datosCombinados = listaPostulantes.map(postulante => {
        // Buscamos la visita vinculada a este postulante específico
        const visita = listaVisitas.find(v => v.id_postulante === postulante.id_postulante);
        
        return {
          ...postulante,
          // Mantenemos la lógica de prioridad: si no hay visita en la BD, es "No agendada"
          fecha_visita: visita ? visita.fecha_visita : null,
          estado_visita: visita ? visita.estado_visita : "No agendada",
          nota_visita: visita ? visita.nota_visita : ""
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

  // Filtrado
  const filteredPostulantes = useMemo(() => {
    return allData.filter((p) => {
      const nombreCompleto = `${p.id_expediente?.nombre} ${p.id_expediente?.apellido_p} ${p.id_expediente?.apellido_m || ""}`.toLowerCase();
      return nombreCompleto.includes(search.toLowerCase());
    });
  }, [allData, search]);

  const totalPages = Math.ceil(filteredPostulantes.length / PAGE_SIZE);

  // Asegurar que si los datos cambian y la página actual queda fuera de rango, vuelva a la 1
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
    fetchPostulantes, // Esta es la función que pasas al prop 'onRefresh' de la tabla
    search,
    handleSearchChange,
    handleClearFilters,
    currentPage,
    totalPages,
    setCurrentPage,
    PAGE_SIZE
  };
};