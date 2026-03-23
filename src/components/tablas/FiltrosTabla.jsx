import { Search, X } from "lucide-react"

export default function FiltrosTabla({searchValue,onSearchChange,searchPlaceholder = "Buscar...",filters = [],onClearFilters,
}) {
  return (
    <div className="border-b border-[#edf2f7] px-5 py-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-xl border border-[#d9e1ea] bg-[#fcfdff] pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-[#94a3b8]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter, index) => (
            <select
              key={index}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="h-11 min-w-[150px] rounded-xl border border-[#d9e1ea] bg-white px-4 text-sm text-slate-500 outline-none"
            >
              <option value="">{filter.placeholder}</option>

              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ))}
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex h-11 items-center gap-2 rounded-xl px-2 text-sm text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  )
}