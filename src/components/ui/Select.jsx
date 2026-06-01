import { ui } from "../../styles/ui/uiClasses";

export default function Select({
  children,
  className = "",
  error = false,
  disabled = false,
  ...props
}) {
  return (
    <select
      {...props}
      disabled={disabled}
      className={`
        ${ui.input.base}
        ${error ? "border-rose-300 ring-2 ring-rose-100" : ""}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </select>
  );
}