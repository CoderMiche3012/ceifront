import { ui } from "../../styles/ui/uiClasses";

// para las tarjetas en detalle de donadores, postulantes y beneficiarios
export default function Card({
  children,
  className = "",
}) {
  return (
    <div className={`${ui.card} ${className}`}>
      {children}
    </div>
  );
}