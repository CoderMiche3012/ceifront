import { ui } from "../../styles/ui/uiClasses";

// para mostrar los estatus, tipos, o condiciones de donadores
export default function Insignia({
  label,
  status,
  variant = "default",
}) {
  const rawValue =
    status !== undefined
      ? typeof status === "string"
        ? status
        : status?.nombre ||
          status?.estatus ||
          String(status ?? "")
      : label;

  const text = rawValue || "Sin dato";

  const normalized = String(rawValue)
    .toLowerCase()
    .trim();

  const badgeStyle =
    status !== undefined
      ? ui.badge[normalized] || ui.badge.default
      : ui.badge[variant] || ui.badge.default;

  return (
    <span className={`${ui.badge.base} ${badgeStyle}`}>
      {text}
    </span>
  );
}