// src/features/postulantes/components/PostulanteReporteFiltros.jsx
import { useState } from "react";
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
        { value: "en revisión", label: "En revisión" },
      ],
    },
  ];

  const filtrosBasicos = opcionesFiltros.filter((f) =>
    ["decision", "prioridad"].includes(f.key)
  );

  const filtrosAvanzados = opcionesFiltros.filter((f) =>
    ["visita", "estudio"].includes(f.key)
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
      showClearButton={false} // 🧹 Oculta el botón original de limpiar filtros
      filters={mapFilters(filtrosBasicos)}
      extraAction={
        <div className="flex items-center gap-2">
          {/* BOTÓN MÁS FILTROS */}
          <div className="relative">
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
              <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl p-4 z-50">
                <h3 className="text-sm font-semibold text-slate-800">Filtros avanzados</h3>
                <p className="mt-1 text-xs text-slate-500">Refina los criterios del reporte.</p>

                <div className="mt-4 space-y-4">
                  {mapFilters(filtrosAvanzados).map((filter) => (
                    <div key={filter.key}>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        {filter.label}
                      </label>
                      <select
                        value={filter.value}
                        onChange={(e) => filter.onChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/20"
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
            )}
          </div>

          {/* BOTONES DE DESCARGA EN FILA */}
          {/* 📄 Cambia los botones al final de tu archivo PostulanteReporteFiltros.jsx */}

{/* BOTÓN EXCEL */}
<Boton
  variant="secondary"
  icon={<FileSpreadsheet className="h-4 w-4" />} // Añadí un tamaño estándar al icono
  onClick={onDescargarExcel}
>
  Excel
</Boton>

{/* BOTÓN PDF */}
<Boton
  icon={<FileText className="h-4 w-4" />} // Añadí un tamaño estándar al icono
  onClick={onDescargarPDF}
>
  PDF
</Boton>
        </div>
      }
    />
  );
}