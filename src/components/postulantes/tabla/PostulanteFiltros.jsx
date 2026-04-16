import FiltrosTabla from "../../tablas/FiltrosTabla";


export default function PostulanteFiltros({
  search,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}) {
  const opcionesFiltros = [
    {
      key: "visita",
      label: "Estatus Visita",
      options: [
        { value: "todos", label: "Todas las visitas" },
        { value: "No agendada", label: "No agendada" },
        { value: "Programada", label: "Programada" },
        { value: "Realizada", label: "Realizada" },
      ],
    },
    {
      key: "estudio",
      label: "Estudio S.E",
      options: [
        { value: "todos", label: "Todos los estudios" },
        { value: "Completado", label: "Completado" },
        { value: "Pendiente", label: "Pendiente" },
        { value: "En revisión", label: "En revisión" },
      ],
    },
    {
      key: "decision",
      label: "Decisión Final",
      options: [
        { value: "todos", label: "Todas las decisiones" },
        { value: "Aceptado", label: "Aceptado" },
        { value: "Rechazado", label: "Rechazado" },
        { value: "Pendiente", label: "Pendiente" },
      ],
    },
  ];

  return (
    <FiltrosTabla
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nombre o tutor"
      onClearFilters={onClearFilters}
      filters={opcionesFiltros.map(f => ({
        ...f,
        value: filters[f.key],
        onChange: (val) => onFilterChange(f.key, val)
      }))}
    />
  );
}