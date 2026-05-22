import FiltrosTabla from "../../../../components/tablas/FiltrosTabla";

export default function PeriodoFiltros({search,onSearchChange,onClearFilters,}) {
  return (
    <FiltrosTabla
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por periodo escolar (ej. 2024-2025)..."
      filters={[]} 
      onClearFilters={onClearFilters}
    />
  );
}