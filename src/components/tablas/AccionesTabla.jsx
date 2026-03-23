// acciones dinámicas por fila (tabla)
export default function AccionesTabla({ row, actions = [] }) {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      {actions.map((action, index) => {
        const isDisabled =
          typeof action.disabled === "function"
            ? action.disabled(row)
            : action.disabled;

        return (
          <button
            key={`${action.label}-${index}`}
            type="button"
            // Ejecuta la acción pasando la fila actual
            onClick={() => action.onClick?.(row)}
            disabled={isDisabled}
            className={
              isDisabled
                ? "cursor-not-allowed text-slate-300"
                : action.className || "hover:text-slate-600"
            }
            title={action.label}
          >
            {action.icon}
          </button>
        );
      })}
    </div>
  );
}