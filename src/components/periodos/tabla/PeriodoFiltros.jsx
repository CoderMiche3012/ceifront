import FiltrosTabla from "../../tablas/FiltrosTabla";

export default function PeriodoFiltros({
  search,
  onSearchChange,
  onClearFilters,
}) {
  return (
    <FiltrosTabla
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por periodo escolar (ej. 2024-2025)..."
      filters={[]} // Enviamos array vacío para que no falle el .map() interno
      onClearFilters={onClearFilters}
    />
  );
}