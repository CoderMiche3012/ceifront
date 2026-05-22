import { ChevronLeft, ChevronRight } from "lucide-react";
import { ui } from "../../styles/uiClasses";

export default function PaginacionTabla({currentPage,totalPages,totalItems,pageSize,onPageChange,}) {
  const start =
    totalItems === 0
      ? 0
      : (currentPage - 1) * pageSize + 1;

  const end = Math.min(
    currentPage * pageSize,
    totalItems
  );

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  return (
    <div className={ui.pagination.container}>
      <p className={ui.pagination.text}>
        Mostrando {start}-{end} de {totalItems} registros
      </p>

      <div className={ui.pagination.controls}>
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          className={ui.pagination.arrow}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`
              ${ui.pagination.page}
              ${
                currentPage === page
                  ? ui.pagination.pageActive
                  : ui.pagination.pageInactive
              }
            `}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          disabled={ currentPage === totalPages || totalPages === 0 }
          onClick={() => onPageChange(currentPage + 1)}
          className={ui.pagination.arrow}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}