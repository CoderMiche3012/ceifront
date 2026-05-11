import FiltrosTabla from "../../tablas/FiltrosTabla";


export default function beneficiarioFiltros({
  search,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}) {
  const opcionesFiltros = [
    {
  key: "nivel",
  label: "Nivel",
  options: [
    { value: "todos", label: "Todos  los Niveles" },
    { value: "preescolar", label: "Preescolar" },
    { value: "primaria", label: "Primaria" },
    { value: "secundaria", label: "Secundaria" },
  ],
},
{
  key: "rendimiento",
  label: "Rendimiento",
  options: [
    { value: "todos", label: "Todos los Rendimientos" },
    { value: "bajo", label: "Bajo" },
    { value: "medio", label: "Medio" },
    { value: "alto", label: "Alto" },
  ],
}
  ];

  return (
    <FiltrosTabla
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nombre"
      onClearFilters={onClearFilters}
      filters={opcionesFiltros.map(f => ({
        ...f,
        value: filters[f.key],
        onChange: (val) => onFilterChange(f.key, val)
      }))}
    />
  );
}