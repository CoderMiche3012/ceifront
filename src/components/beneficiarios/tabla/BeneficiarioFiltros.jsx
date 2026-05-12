import FiltrosTabla from "../../tablas/FiltrosTabla";

export default function BeneficiarioFiltros({
  search,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  periodos = [],
  periodo,
}) {
  const opcionesFiltros = [
    {
      key: "periodo",
      label: "Periodo",
      placeholder: "Seleccionar Periodo", 
      options: periodos
        .filter((p) => p.value !== "actual" && p.value !== undefined && p.label) 
        .map((p) => ({
          value: String(p.value),
          label: String(p.label),
        })),
    },
    {
      key: "donador",
      label: "Donador",
      placeholder: "Todos los Donadores", 
      options: [
        { value: "con", label: "Con donador" },
        { value: "sin", label: "Sin donador" },
      ],
    },
    {
      key: "nivel",
      label: "Nivel",
      placeholder: "Todos los Niveles", 
      options: [
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
      placeholder: "Todos los Rendimientos", 
      options: [
        { value: "bueno", label: "Bueno" },
        { value: "bajo", label: "Bajo" },
        { value: "regularizacion", label: "Regularización" },
      ],
    },
  ];

  return (
    <FiltrosTabla
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nombre"
      onClearFilters={onClearFilters}
      filters={opcionesFiltros.map((f) => ({
        ...f,
        value: 
          f.key === "periodo" 
            ? (periodo === "actual" ? "" : periodo)
            : (filters[f.key] === "todos" ? "" : (filters[f.key] ?? "")),
        onChange: (val) => {
          const finalVal = val === "" 
            ? (f.key === "periodo" ? "actual" : "todos") 
            : val;
          onFilterChange(f.key, finalVal);
        },
      }))}
    />
  );
}