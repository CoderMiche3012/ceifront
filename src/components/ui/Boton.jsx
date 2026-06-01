import { ui } from "../../styles/ui/uiClasses";

// boton general para crear, guardar o cancelar cambios
export default function Boton({
  children,
  type = "button",
  onClick,
  className = "",
  icon = null,
  variant = "primary",
  size = "md",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${ui.button.base} ${ui.button[size]} ${ui.button[variant]} ${className}`}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
}