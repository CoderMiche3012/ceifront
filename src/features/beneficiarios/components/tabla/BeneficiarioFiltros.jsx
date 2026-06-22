import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import FiltrosTabla from "../../../../components/tablas/FiltrosAvanzados";
import { ui } from "../../../../styles/ui/index";

export default function BeneficiarioFiltros({
  search,
  filters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  periodos = [],
  periodo,
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const opcionesFiltros = [
    {
      key: "periodo",
      label: "Periodo",
      options: periodos.map((p) => ({
        value: String(p.id_periodo),
        label: String(p.ciclo_escolar),
      })),
    },
    {
      key: "donador",
      label: "Donador",
      options: [
        { value: "con", label: "Con donador" },
        { value: "sin", label: "Sin donador" },
      ],
    },
    {
      key: "nivel",
      label: "Nivel",
      options: [
        { value: "preescolar", label: "Preescolar" },
        { value: "primaria", label: "Primaria" },
        { value: "secundaria", label: "Secundaria" },
        { value: "media superior", label: "Media Superior" },
        { value: "superior", label: "Superior" },
      ],
    },
    {
      key: "rendimiento",
      label: "Rendimiento",
      options: [
        { value: "bueno", label: "Bueno" },
        { value: "bajo", label: "Bajo" },
        { value: "regularizacion", label: "Regularización" },
      ],
    },
    {
      key: "estatus",
      label: "Estatus",
      options: [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
        { value: "graduado", label: "Graduado" },
      ],
    },
  ];

  const filtrosBasicos = [
    {
      key: "periodo",
      label: "Periodo",
      options: opcionesFiltros.find((f) => f.key === "periodo").options,
    },
    {
      key: "estatus",
      label: "Estatus",
      options: opcionesFiltros.find((f) => f.key === "estatus").options,
    },
  ];

  const filtrosAvanzados = opcionesFiltros.filter((f) =>
    ["donador", "nivel", "rendimiento"].includes(f.key)
  );

  const mapFilters = (list) =>
    list.map((f) => ({
      key: f.key,
      label: f.label,
      value:
        f.key === "periodo"
          ? periodo ?? ""
          : filters[f.key] === "todos"
          ? ""
          : filters[f.key] ?? "",
      options: f.options,
      onChange: (val) => {
        const finalVal =
          val === ""
            ? f.key === "periodo"
              ? ""
              : "todos"
            : val;

        onFilterChange(f.key, finalVal);
      },
    }));

  return (
    <FiltrosTabla
      searchValue={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nombre"
      onClearFilters={onClearFilters}
      filters={mapFilters(filtrosBasicos)}
      extraAction={
        <div className="relative" ref={advancedRef}>

          {/* BOTÓN PRINCIPAL (igual Postulante) */}
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className={`
              ${ui.filters.select}
              min-w-[180px]
              flex items-center justify-center gap-2
              transition
            `}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showAdvanced ? "Menos filtros" : "Más filtros"}
          </button>

          {/* OVERLAY */}
          {showAdvanced && (
            <>
              <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setShowAdvanced(false)}
              />

              {/* PANEL (estilo Postulante) */}
              <div
                className="
                  fixed left-4 right-4 top-1/2 -translate-y-1/2
                  sm:absolute sm:top-full sm:right-0 sm:left-auto sm:translate-y-0
                  sm:w-80
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
                  {mapFilters(filtrosAvanzados).map((f) => (
                    <div key={f.key}>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        {f.label}
                      </label>

                      <select
                        value={f.value}
                        onChange={(e) => f.onChange(e.target.value)}
                        className="
                          w-full
                          rounded-xl
                          border border-slate-200
                          bg-white
                          px-4 py-2
                          text-sm
                          focus:outline-none
                          focus:ring-2
                          focus:ring-teal-200
                        "
                      >
                        <option value="">Todos</option>
                        {f.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowAdvanced(false)}
                  className="mt-4 w-full text-sm text-slate-500 hover:text-slate-700"
                >
                  Cerrar
                </button>
              </div>
            </>
          )}
        </div>
      }
    />
  );
}