import FiltrosTabla from "../../../../components/tablas/FiltrosTabla";

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
      placeholder: "Último Periodo (Por defecto)",
      options: periodos.map((p) => ({
        value: String(p.id_periodo),
        label: String(p.ciclo_escolar),
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
        // valor actual del filtro:
        value:
          f.key === "periodo"
            ? (periodo ?? "") // Si periodo es null, le pasamos "" al select para que muestre el placeholder
            : (filters[f.key] === "todos" ? "" : (filters[f.key] ?? "")),
        
        onChange: (val) => {
          // Si el usuario selecciona la opción por defecto (vacía), se manda el reset correspondiente
          const finalVal = val === "" 
            ? (f.key === "periodo" ? "" : "todos") 
            : val;
          
          onFilterChange(f.key, finalVal);
        },
      }))}
    />
  );
}