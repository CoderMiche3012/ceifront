import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import FiltrosTabla from "../../../../components/tablas/FiltrosAvanzados";
import { ui } from "../../../../styles/ui/index";

export default function PostulanteFiltros({
  search,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const opcionesFiltros = [
    {
      key: "visita",
      label: "Estatus Visita",
      options: [
        { value: "todos", label: "Todas las visitas" },
        { value: "No agendada", label: "No agendada" },
        { value: "Programada", label: "Programada" },
        { value: "Realizada", label: "Realizada" },
      ],
    },
    {
      key: "estudio",
      label: "Estudio S.E",
      options: [
        { value: "todos", label: "Todos los estudios" },
        { value: "completo", label: "Completo" },
        { value: "Pendiente", label: "Pendiente" },
        { value: "En revisión", label: "En revisión" },
      ],
    },
    {
      key: "decision",
      label: "Estatus",
      options: [
        { value: "todos", label: "Todos los estatus" },
        { value: "Aceptado", label: "Aceptado" },
        { value: "Rechazado", label: "Rechazado" },
        { value: "Pendiente", label: "Pendiente" },
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
      ],
    },
    {
      key: "nivelEducativo",
      label: "Nivel Educativo",
      options: [
        { value: "todos", label: "Todos los niveles" },
        { value: "Preescolar", label: "Preescolar" },
        { value: "Primaria", label: "Primaria" },
        { value: "Secundaria", label: "Secundaria" },
        { value: "Media Superior", label: "Media Superior" },
        { value: "Superior", label: "Superior" },
      ],
    },
  ];

  // PRINCIPALES
  const filtrosBasicos = opcionesFiltros.filter((f) =>
    ["decision", "prioridad"].includes(f.key)
  );

  // DROPDOWN
  const filtrosAvanzados = opcionesFiltros.filter((f) =>
    ["visita", "estudio","nivelEducativo"].includes(f.key)
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
    <FiltrosTabla
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nombre o tutor"
      onClearFilters={onClearFilters}
      filters={mapFilters(filtrosBasicos)}
      extraAction={
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className={`
              ${ui.filters.select}
              min-w-[180px]
              flex items-center justify-center gap-2
            `}
          >
            <SlidersHorizontal className="h-4 w-4" />

            {showAdvanced
              ? "Menos filtros"
              : "Más filtros"}
          </button>

          {showAdvanced && (
            <div
              className="
                absolute
                top-full
                right-0
                mt-2
                w-80
                rounded-2xl
                border border-slate-200
                bg-white
                shadow-xl
                p-4
                z-50
              "
            >
              <h3 className="text-sm font-semibold text-slate-800">
                Filtros avanzados
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Refina la búsqueda con criterios adicionales.
              </p>

              <div className="mt-4 space-y-4">
                {mapFilters(filtrosAvanzados).map((filter) => (
                  <div key={filter.key}>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      {filter.label}
                    </label>

                    <select
                      value={filter.value}
                      onChange={(e) =>
                        filter.onChange(e.target.value)
                      }
                      className="
                        w-full
                        rounded-xl
                        border border-slate-200
                        bg-white
                        px-4 py-2
                        text-sm
                        outline-none
                        focus:ring-2
                        focus:ring-teal-500/20
                      "
                    >
                      {filter.options.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}