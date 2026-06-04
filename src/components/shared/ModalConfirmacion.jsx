import { TriangleAlert } from "lucide-react";
import { ui } from "../../styles/ui/index";

export default function ModalConfirmacion({
  open, title, description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm, onClose,
  loading = false,
  color = "teal",
}) {
  if (!open) return null;
  const styles = ui.modal.colors[color] || ui.modal.colors.teal;

  return (
    <div className={ui.modal.overlay}>
      <div className={ui.modal.container}>

        <div className={ui.modal.header}>
          <div className={`${ui.modal.iconWrapper} ${styles.icon}`}>
            <TriangleAlert size={22} />
          </div>

          <div className="flex-1">
            <h3 className={ui.modal.title}>
              {title}
            </h3>

            <div className={ui.text.body}>
              {description}
            </div>
          </div>
        </div>

        <div className={ui.modal.actions}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={ui.modal.cancelButton}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`${ui.modal.confirmButton} ${styles.button}`}
          >
            {loading
              ? "Procesando..."
              : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}