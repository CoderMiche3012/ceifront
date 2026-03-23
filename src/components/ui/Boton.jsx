export default function Boton({ children, type = "button", onClick, className = "", icon = null, }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl bg-[#0E5F63] px-4 py-3 text-base font-bold text-white shadow-[0_8px_20px_rgba(15,127,122,0.18)] transition hover:bg-[#0d6f6b] ${className}`}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  )
}
