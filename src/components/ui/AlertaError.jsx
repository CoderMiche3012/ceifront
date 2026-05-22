import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ui } from "../../styles/uiClasses";

export default function Alerta({mensaje,tipo = "error",}) {
  if (!mensaje) return null;
  const s = ui.alert[tipo];
  return (
    <div
      className={`
        ${ui.alert.base}
        ${s.bg}
        ${s.border}
      `}
    >
      <HiOutlineExclamationCircle
        className={`${s.icon} shrink-0`}
        size={20}
      />

      <p
        className={`
          ${ui.alert.text}
          ${s.text}
        `}
      >
        {mensaje}
      </p>
    </div>
  );
}