import FiltrosTabla from "../../../components/tablas/FiltrosTablaFecha";

export default function AsistenciasFiltros({
  search,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  fechaSeleccionada,
  onFechaChange,
  min,
  max
}) {
  const filtrosNormales = [
    {
      key: "servicio",
      label: "Servicio",
      options: [
        { value: "comedor", label: "Comedor" },
        { value: "psicologia", label: "Psicología" },
      ],
    },
  ];

  const filtroFecha = {
    key: "fecha",
    label: "Fecha",
    type: "date",
    value: fechaSeleccionada,
    onChange: onFechaChange,
    min,
    max,
  };

  return (
    <FiltrosTabla
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar beneficiario..."
      onClearFilters={onClearFilters}

      filters={[
        ...filtrosNormales.map((f) => ({
          ...f,
          value: filters[f.key],
          onChange: (val) => onFilterChange(f.key, val),
        })),
        filtroFecha,
      ]}
    />
  );
}