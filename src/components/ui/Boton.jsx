import { ui } from "../../styles/ui/index";

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
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
  ${ui.button.base}
  ${ui.button[size]}
  ${ui.button[variant]}
  ${className}
  ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
`}
      {...props}
    >
      {icon && (
        <span className="flex items-center">
          {icon}
        </span>
      )}

      {children}
    </button>
  );
}