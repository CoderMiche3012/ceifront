import { HiOutlineCalendar } from "react-icons/hi";
import { ui } from "../../../../styles/uiClasses";
import AlertaError from "../../../../components/ui/AlertaError";
import Field from "../../../../components/ui/Field";
import InputG from "../../../../components/ui/InputG";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";
import { usePeriodoCrearForm } from "../../hooks/usePeriodoCrearForm";
import Boton from "../../../../components/ui/Boton";

export default function PeriodoCrearModal({ open, onClose, onSuccess }) {
  const {
    form,
    setForm,
    error,
    loading,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  } = usePeriodoCrearForm(onSuccess, onClose);

  if (!open) return null;

  return (
    <>
      <div className={ui.modal.formOverlay}>
        <div className={ui.modal.formContainer}>

          {/* Header */}
          <div className={ui.modal.formHeader}>
            <div
              className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}
            >
              <HiOutlineCalendar size={24} />
            </div>

            <div className="flex-1">
              <h2 className={ui.modal.title}>Nuevo Periodo</h2>
              <p className={ui.modal.description}>
                Configura el periodo y fechas escolares
              </p>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className={ui.modal.result.closeButton}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handlePreSubmit} className={ui.modal.formBody}>
            <AlertaError mensaje={error} />

            <Field label="Periodo Escolar" required>
              <InputG
                placeholder="Ej: 2026-A"
                value={form?.ciclo_escolar || ""}
                disabled={loading}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ciclo_escolar: e.target.value,
                  })
                }
              />
            </Field>

            <div className={ui.modal.twoCols}>
              <Field label="Fecha de Inicio" required>
                <InputG
                  type="date"
                  value={form?.fecha_inicio || ""}
                  disabled={loading}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fecha_inicio: e.target.value,
                    })
                  }
                />
              </Field>

              <Field label="Fecha de Fin" required>
                <InputG
                  type="date"
                  value={form?.fecha_fin || ""}
                  disabled={loading}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fecha_fin: e.target.value,
                    })
                  }
                />
              </Field>
            </div>

            {/* Actions */}
            <div className={ui.modal.formActions}>
              <Boton
                size="sm"
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Boton>

              <Boton size="sm" type="submit" disabled={loading}>
                {loading ? "Procesando..." : "Registrar Periodo"}
              </Boton>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="¿Confirmar registro?"
        description={`Se registrará el periodo "${form?.ciclo_escolar || ""
          }". Los anteriores quedarán inactivos.`}
        onConfirm={handleConfirmSave}
        onClose={() => setShowConfirm(false)}
      />

      <ModalResultado
        open={resultModal?.open || false}
        type={resultModal?.type || "success"}
        title={resultModal?.title || ""}
        message={resultModal?.message || ""}
        onClose={handleFinalClose}
      />
    </>
  );
}