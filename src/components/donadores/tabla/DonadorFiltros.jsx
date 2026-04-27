import FiltrosTabla from "../../tablas/FiltrosTabla";


export default function DonadorFiltros({
  search,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}) {
  const opcionesFiltros = [
    {
      key: "estatus",
      label: "Estatus",
      options: [
        { value: "todos", label: "Todos los estatus" },
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
        { value: "Pausa", label: "En Pausa" },
      ],
    },
    {
      key: "tipo",
      label: "Tipo",
      options: [
        { value: "todos", label: "Todos los tipos" },
        { value: "CEI", label: "CEI" },
        { value: "CANFRO", label: "CANFRO" },
        { value: "OYE", label: "OYE" },
      ],
    },
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