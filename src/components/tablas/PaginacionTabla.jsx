import { ChevronLeft, ChevronRight } from "lucide-react";
import { ui } from "../../styles/ui/index";

export default function PaginacionTabla({
  currentPage,
  totalPages,
  totalItems,
  pageSize=5,
  onPageChange,
  onPageSizeChange,
}) {
  const start =
    totalItems === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const end = Math.min(
    currentPage * pageSize,
    totalItems
  );

  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, i) => i + 1
      );
    }

    const pages = [];

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const startPage = Math.max(
      2,
      currentPage - 1
    );

    const endPage = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <div className={ui.pagination.container}>
      <p className={ui.pagination.text}>
        Mostrando {start}-{end} de {totalItems} registros
      </p>

      <div className="flex items-center gap-4">
        {/* Selector */}

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">
              Mostrar
            </span>

            <select
              value={pageSize}
              onChange={(e) =>
                onPageSizeChange(Number(e.target.value))
              }
              className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <span className="text-sm text-slate-500">
              registros
            </span>
          </div>
        )}
        {/* Paginación */}
        <div className={ui.pagination.controls}>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={ui.pagination.arrow}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pages.map((page, index) =>
            page === "..." ? (
              <span
                key={`dots-${index}`}
                className="px-2 text-slate-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`
                  ${ui.pagination.page}
                  ${currentPage === page
                    ? ui.pagination.pageActive
                    : ui.pagination.pageInactive
                  }
                `}
              >
                {page}
              </button>
            )
          )}

          <button
            type="button"
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            onClick={() => onPageChange(currentPage + 1)}
            className={ui.pagination.arrow}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}