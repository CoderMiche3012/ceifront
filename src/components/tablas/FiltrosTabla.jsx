import { Search, X } from "lucide-react";
import { ui } from "../../styles/uiClasses";

export default function FiltrosTabla({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters = [],
  onClearFilters,
}) {
  return (
    <div className={ui.filters.container}>
      <div className={ui.filters.layout}>

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

        <div className={ui.filters.controls}>
          {filters.map((filter, index) => (
            <select
              key={index}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className={ui.filters.select}
            >
              <option value="">
                {filter.placeholder}
              </option>

              {filter.options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          ))}

          <button
            type="button"
            onClick={onClearFilters}
            className={ui.filters.clearButton}
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </button>
        </div>

      </div>
    </div>
  );
}