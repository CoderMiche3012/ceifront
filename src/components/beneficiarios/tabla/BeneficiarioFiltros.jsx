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
  key: "donador",
  label: "Donador",
  options: [
    { value: "todos", label: "Todos" },
    { value: "con", label: "Con donador" },
    { value: "sin", label: "Sin donador" },
  ],
},
    {
  key: "nivel",
  label: "Nivel",
  options: [
    { value: "todos", label: "Todos  los Niveles" },
    { value: "preescolar", label: "Preescolar" },
    { value: "primaria", label: "Primaria" },
    { value: "secundaria", label: "Secundaria" },
    { value: "preparatoria", label: "Preparatoria" },
    { value: "universidad", label: "Universidad" },
  ],
},
{
  key: "rendimiento",
  label: "Rendimiento",
  options: [
    { value: "todos", label: "Todos los Rendimientos" },
    { value: "bueno", label: "Bueno" },
    { value: "bajo", label: "Bajo" },
    { value: "regularizacion", label: "Regularizacion" },
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
        value: filters[f.key] ?? "todos",
        onChange: (val) => onFilterChange(f.key, val)
      }))}
    />
  );
}