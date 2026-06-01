// boton interno para crear
export default function Boton({
  children,
  type = "button",
  onClick,
  className = "",
  icon = null,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 
        rounded-lg 
        bg-[#D1E7E5] 
        px-3 py-1.5 
        text-sm font-medium 
        text-[#0E5F63] 
        shadow-[0_2px_6px_rgba(14,95,99,0.12)] 
        transition 
        hover:bg-[#BFE0DD]
        ${className}
      `}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
}