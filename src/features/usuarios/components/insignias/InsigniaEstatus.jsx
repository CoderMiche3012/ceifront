import { ui } from "../../../../styles/uiClasses";

export default function InsigniaEstatus({ status }) {
  //normalizar
  const rawStatus = typeof status === "string" ? status : status?.nombre || status?.estatus || String(status ?? "")
  const normalized = rawStatus.toLowerCase()
  const label = rawStatus || "Sin estatus"
  const variant = ui.badge[normalized] || ui.badge.default;

  return (
    <span className={`${ui.badge.base} ${variant}`}>
      {label}
    </span>
  )
}