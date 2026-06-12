import { Search } from "lucide-react";
import { ui } from "../../styles/ui/uiClasses";

export default function FiltrosReporte({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filtros = [],
  acciones = [],
}) {
  return (
    <div className="border-b border-[#edf2f7] px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        {onSearchChange && (
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />

            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className={ui.filters.input}
            />
          </div>
        )}

        {filtros.map((filtro) => (
          <select
            key={filtro.key}
            value={filtro.value}
            onChange={(e) => filtro.onChange(e.target.value)}
            className={ui.filters.select}
          >
            {filtro.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        ))}

        {acciones.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {acciones.map((accion, index) => {
              const Icon = accion.icon;

              return (
                <accion.component
                  key={index}
                  variant={accion.variant}
                  onClick={accion.onClick}
                  className="whitespace-nowrap"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {accion.label}
                </accion.component>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}