import { HiOutlineExclamationCircle } from "react-icons/hi";
export default function Alerta({ mensaje, tipo = "error",}) {
  if (!mensaje) return null;
  const estilos = {
    error: {
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-700",
      icon: "text-red-500",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-500",
      text: "text-green-700",
      icon: "text-green-500",
    },
  }
  const s = estilos[tipo]
  return (
    <div className={`p-4 ${s.bg} rounded-2xl border-l-4 ${s.border} flex gap-3 items-center animate-in fade-in slide-in-from-top-2 duration-300`}>
      <HiOutlineExclamationCircle className={`${s.icon} shrink-0`} size={20} />
      <p className={`${s.text} text-xs font-bold leading-snug`}>
        {mensaje}
      </p>
    </div>
  )
}