import { ChevronLeft, ChevronRight } from "lucide-react"

export default function PaginacionTabla({currentPage, totalPages, totalItems, pageSize, onPageChange,}) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex flex-col gap-4 border-t border-[#edf2f7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">
        Mostrando {start}-{end} de {totalItems} registros
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d9e1ea] text-slate-400 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold ${
              currentPage === page
                ? "bg-[#1f8a8a] text-white"
                : "text-slate-500"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d9e1ea] text-slate-400 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}