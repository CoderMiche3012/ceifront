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
      key: "estatus",
      label: "Estatus",
      options: [
        { value: "todos", label: "Todas las visitas" },
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
        { value: "Graduado", label: "Graduado" },
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