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
        { value: "todos", label: "Todas las visitas" },
        { value: "Activo", label: "Activo" },
        { value: "Anactivo", label: "Anactivo" },
        { value: "Pausa", label: "En Pausa" },
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