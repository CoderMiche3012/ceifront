import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, FileSpreadsheet, FileText } from "lucide-react";
import { ui } from "../../../styles/ui/index";
import Boton from "../../../components/ui/Boton";
import FiltrosReporte from "../../../components/tablas/FiltrosAvanzados";

export default function PostulanteReporteFiltros({
  search,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onDescargarExcel,
  onDescargarPDF,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const advancedRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        advancedRef.current &&
        !advancedRef.current.contains(event.target)
      ) {
        setShowAdvanced(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const opcionesFiltros = [
    {
      key: "decision",
      label: "Estatus",
      options: [
        { value: "todos", label: "Todos los estatus" },
        { value: "Pendiente", label: "Pendiente" },
        { value: "Aceptado", label: "Aceptado" },
        { value: "Rechazado", label: "Rechazado" },
      ],
    },
    {
      key: "prioridad",
      label: "Prioridad",
      options: [
        { value: "todos", label: "Todas las prioridades" },
        { value: "alta", label: "Alta" },
        { value: "media", label: "Media" },
        { value: "baja", label: "Baja" },
        { value: "pendiente", label: "Pendiente" },
      ],
    },
    {
      key: "visita",
      label: "Estatus Visita",
      options: [
        { value: "todos", label: "Todas las visitas" },
        { value: "programada", label: "Programada" },
        { value: "cancelada", label: "Cancelada" },
        { value: "no programada", label: "No programada" },
      ],
    },
    {
      key: "estudio",
      label: "Estudio S.E",
      options: [
        { value: "todos", label: "Todos los estudios" },
        { value: "completo", label: "Completo" },
        { value: "Pendiente", label: "Pendiente" },
      ],
    },
    {
      key: "nivelEducativo",
      label: "Nivel educativo",
      options: [
        { value: "todos", label: "Todos" },
        { value: "preescolar", label: "Preescolar" },
        { value: "primaria", label: "Primaria" },
        { value: "secundaria", label: "Secundaria" },
        { value: "media superior", label: "Media superior" },
        { value: "superior", label: "Superior" },
      ],
    },
  ];

  const filtrosBasicos = opcionesFiltros.filter((f) =>
    ["decision", "prioridad"].includes(f.key)
  );

  const filtrosAvanzados = opcionesFiltros.filter((f) =>
    ["visita", "estudio", "nivelEducativo"].includes(f.key)
  );

  const mapFilters = (list) =>
    list.map((f) => ({
      key: f.key,
      label: f.label,
      value: filters[f.key] ?? "todos",
      options: f.options,
      onChange: (val) => onFilterChange(f.key, val),
    }));

  return (
    <FiltrosReporte
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nombre o tutor..."
      onClearFilters={onClearFilters}
      showClearButton={false}
      filters={mapFilters(filtrosBasicos)}
      extraAction={
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative" ref={advancedRef}>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className={`
                ${ui.filters.select}
                min-w-[140px]
                flex items-center justify-center gap-2
              `}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showAdvanced ? "Menos filtros" : "Más filtros"}
            </button>

            {showAdvanced && (
              <>
                <div
                  className="fixed inset-0 bg-black/30 z-40"
                  onClick={() => setShowAdvanced(false)}
                />
                <div
                  className="
                   fixed left-4 right-4 top-1/2 -translate-y-1/2 sm:absolute sm:top-full sm:right-0 sm:left-auto sm:translate-y-0
                   sm:w-80 rounded-2xl border border-slate-200 bg-white shadow-xl p-4 z-50"
                >
                  <h3 className="text-sm font-semibold text-slate-800">
                    Filtros avanzados
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Refina los criterios del reporte.
                  </p>

                  <div className="mt-4 space-y-4">
                    {mapFilters(filtrosAvanzados).map((filter) => (
                      <div key={filter.key}>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          {filter.label}
                        </label>

                        <select
                          value={filter.value}
                          onChange={(e) => filter.onChange(e.target.value)}
                          className=" w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm "
                        >
                          {filter.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <Boton
            type="button"
            variant="secondary"
            icon={<FileSpreadsheet className="h-4 w-4" />}
            onClick={onDescargarExcel}
          >
            Excel
          </Boton>

          <Boton
            type="button"
            icon={<FileText className="h-4 w-4" />}
            onClick={onDescargarPDF}
          >
            PDF
          </Boton>
        </div>
      }
    />
  );
}