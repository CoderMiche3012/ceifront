import { ui } from "../../styles/ui/index";

// para los modales
export default function Input({
  className = "",
  error = false,
  disabled = false,
  ...props
}) {
  return (
    <input
      {...props}
      disabled={disabled}
      className={`
        ${ui.input.base}
        ${className}
        ${error ? "border-rose-300" : ""}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
    />
  );
}