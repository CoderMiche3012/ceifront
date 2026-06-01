import {CheckCircle2, AlertCircle, XCircle, Info, X, } from "lucide-react";
import Boton from "../ui/Boton";
import { ui } from "../../styles/ui/uiClasses";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

export default function ModalResultado({
  open,
  type = "success",
  title = "Operación completada",
  message = "",
  buttonText = "Entendido",
  onClose,
}) {
  if (!open) return null;

  const Icon = icons[type] || icons.success;
  const styles = ui.modal.result.colors[type] || ui.modal.result.colors.success;

  return (
    <div className={ui.modal.overlay}>
      <div className={ui.modal.container}>

        <div className="mb-4 flex items-start justify-between gap-4">

          <div className="flex items-center gap-4">
            <div
              className={`
                ${ui.modal.iconWrapper}
                ${styles.icon}
              `}
            >
              <Icon size={24} />
            </div>

            <div>
              <h3 className={ui.modal.title}>
                {title}
              </h3>

              {message && (
                <p className={ui.text.body}>
                  {message}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={ui.modal.result.closeButton}
          >
            <X size={18} />
          </button>

        </div>

        <div className="mt-6 flex justify-end">
          <Boton
            onClick={onClose}
            className={styles.button}
          >
            {buttonText}
          </Boton>
        </div>

      </div>
    </div>
  );
}
