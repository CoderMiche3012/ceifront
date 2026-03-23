export default function InsigniaEstatus({ status }) {
  // Normalizar cualquier tipo de valor a string
  const rawStatus =
    typeof status === "string"
      ? status
      : status?.nombre || status?.estatus || String(status ?? "")

  const normalized = rawStatus.toLowerCase()

  const styles = {
    activo: "bg-emerald-100 text-emerald-700",
    inactivo: "bg-rose-100 text-rose-700",
    pendiente: "bg-amber-100 text-amber-700",
  }

  const label = rawStatus || "Sin estatus"
  const className =
    styles[normalized] || "bg-slate-100 text-slate-700"

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  )
}