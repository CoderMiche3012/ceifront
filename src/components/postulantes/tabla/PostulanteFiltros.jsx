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
      searchPlaceholder="Buscar por nombre del postulante o tutor"
      filters={filters}
      onClearFilters={onClearFilters}
    />
  );
}