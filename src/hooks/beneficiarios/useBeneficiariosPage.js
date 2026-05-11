import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { obtenerExpediente } from "../../services/expedientesService";
import { obtenerBeneficiario } from "../../services/beneficiariosService";
const INITIAL_FILTERS = {
  estatus: "todos",
  nivel: "todos",
  rendimiento: "todos",
};

export const useBeneficiariosPage = (pageSize = 4) => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = pageSize;

  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ["beneficiarios"],
    queryFn: async () => {
      const [beneficiariosRes, expedientesRes] = await Promise.all([
        obtenerBeneficiario(),
        obtenerExpediente(),
      ]);

      const beneficiarios = beneficiariosRes?.results || beneficiariosRes || [];
      const expedientes = expedientesRes?.results || expedientesRes || [];

      const expedientesMap = new Map(
        expedientes.map((e) => [String(e.id_expediente), e])
      );

      return beneficiarios.map((b) => {
        const id =
          typeof b.id_expediente === "object"
            ? b.id_expediente?.id_expediente
            : b.id_expediente;

        const expediente = expedientesMap.get(String(id)) || b.id_expediente;

        //ordenar seguimientos por id_periodo (o id_seguimiento)
        const seguimientos = b.historial_seguimientos || [];

        const ultimoSeguimiento = [...seguimientos].sort(
          (a, b) => b.id_periodo - a.id_periodo
        )[0];
        const estatus = ultimoSeguimiento?.estatus || "Sin seguimiento";
        let promedio = null;
        const boletas =
          ultimoSeguimiento?.datos_escolares?.boletas || [];

        if (boletas.length > 0) {
          const suma = boletas.reduce(
            (acc, b) => acc + Number(b.promedio_boleta || 0),
            0
          );
          promedio = (suma / boletas.length).toFixed(1);
        }
        const escolaridad =
          ultimoSeguimiento?.datos_escolares?.id_escolaridad;

        const nivelGrado = escolaridad
          ? `${escolaridad.nivel_escolar} ${escolaridad.grado_escolar}`
          : "Sin datos";

        return {
          ...b,
          expediente,
          estatus,
          promedio,
          nivelGrado,
        };
      });
    },

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const filtered = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    const statusFilter = filters.estatus?.toLowerCase();

    return data.filter((item) => {
      const nombre = `${item.expediente?.nombre || ""} ${item.expediente?.apellido_p || ""}`.toLowerCase();
      const matchSearch =
        !searchLower || nombre.includes(searchLower);
      const status = String(item.estatus || "").toLowerCase();
      const matchStatus =
        statusFilter === "todos" || status === statusFilter;
      const nivel = item.nivelGrado?.toLowerCase() || "";
      const matchNivel =
        filters.nivel === "todos" ||
        nivel.includes(filters.nivel.toLowerCase());
      const promedio = Number(item.promedio);
      let rendimiento = "sin_datos";
      if (!isNaN(promedio)) {
        if (promedio < 6) rendimiento = "bajo";
        else if (promedio < 8) rendimiento = "medio";
        else rendimiento = "alto";
      }

      const matchRendimiento =
        filters.rendimiento === "todos" ||
        rendimiento === filters.rendimiento;

      return matchSearch && matchStatus && matchNivel && matchRendimiento;
    });
  }, [data, search, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage, PAGE_SIZE]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  return {
    beneficiarios: paginated,
    totalCount: filtered.length,
    loading: isLoading,
    error: error?.message || null,
    search,
    filters,
    currentPage: safePage,
    totalPages,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    setCurrentPage,
    PAGE_SIZE,
    refetch,
  };
};
