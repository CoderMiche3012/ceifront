// boton interno para editar
export default function BotonEditar({
  icon: Icon,
  children,
  className = "",
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors group ${className}`}
    >
      {Icon && (
        <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
      )}
      {children}
    </button>
  );
}