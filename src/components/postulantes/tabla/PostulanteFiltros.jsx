import FiltrosTabla from "../../tablas/FiltrosTabla";

export default function UsuarioFiltros({
  search,
  filters,
  onSearchChange,
  onClearFilters,
}) {
  return (
    <FiltrosTabla
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nombre"
      filters={filters}
      onClearFilters={onClearFilters}
    />
  );
}