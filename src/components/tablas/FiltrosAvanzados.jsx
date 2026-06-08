import { Search, X } from "lucide-react";
import { ui } from "../../styles/ui/index";

export default function FiltrosTabla({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters = [],
  onClearFilters,
  showClearButton = true,
  extraAction,
}) {
  return (
    <div className={ui.filters.container}>
      <div className={ui.filters.layout}>

        {/* 🔍 SEARCH */}
        <div className={ui.filters.searchWrapper}>
          <Search className={ui.filters.searchIcon} />

          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className={ui.filters.input}
          />
        </div>

        {/* 🎛 CONTROLES */}
        <div className={ui.filters.controls}>

          {filters.map((filter) => (
            <select
              key={filter.key}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className={ui.filters.select}
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          {/* ➕ BOTÓN EXTRA (avanzados) */}
          {extraAction}

          {/* 🧹 LIMPIAR */}
          {showClearButton && (
            <button
              type="button"
              onClick={onClearFilters}
              className={ui.filters.clearButton}
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </button>
          )}
        </div>

      </div>
    </div>
  );
}