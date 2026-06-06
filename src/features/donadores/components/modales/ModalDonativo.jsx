import { X, DollarSign, Calendar, Tag, Save, } from "lucide-react";
import { ui } from "../../../../styles/ui/index";

import Field from "../../../../components/ui/Field";
import Input from "../../../../components/ui/InputG";
import Select from "../../../../components/ui/Select";
import Boton from "../../../../components/ui/Boton";
import AlertaError from "../../../../components/ui/AlertaError";

export default function ModalDonativo({
  open,
  onClose,
  form,
  setForm,
  onSubmit,
  saving,
  error,
  fieldErrors = {},
  modo = "crear",
}) {
  if (!open) return null;

  const isEdit = modo === "editar";

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBackdropClick = (e) => {
    if (saving) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={ui.modal.formOverlay}
      onClick={handleBackdropClick}
    >
      <div className={`${ui.modal.formContainer} max-w-2xl`}>

        <div className={ui.modal.formHeader}>
          <div
            className={`${ui.modal.iconWrapper} bg-teal-100 text-teal-700`}
          >
            <DollarSign size={22} />
          </div>

          <div className="flex-1">
            <h2 className={ui.modal.title}>
              {isEdit ? "Editar Donativo" : "Agregar Donativo"}
            </h2>

            <p className={ui.modal.description}>
              {isEdit ? "Actualiza la información del donativo" : "Registra un nuevo donativo"}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className={ui.modal.formBody}>
          {error && (
            <div className="mb-4">
              <AlertaError mensaje={error} />
            </div>
          )}

          <div className={ui.modal.formScroll}>

            <h3 className="text-xs font-bold text-teal-700 mb-4 uppercase">
              Información del Donativo
            </h3>

            <div className={ui.modal.twoCols}>

              <Field
                label="Concepto"
                required
                error={fieldErrors.concepto}
                icon={<Tag className="w-4 h-4" />}
              >
                <Input
                  placeholder="Ej. Colecta anual"
                  value={form.concepto}
                  onChange={(e) => updateField("concepto", e.target.value)}
                  error={!!fieldErrors.concepto}
                />
              </Field>

              <Field
                label="Monto"
                required
                error={fieldErrors.monto}
                icon={<DollarSign className="w-4 h-4" />}
              >
                <Input
                  type="number"
                  min="0"
                  step="0.001"
                  placeholder="0.00"
                  value={form.monto}
                  onChange={(e) => updateField("monto", e.target.value)}
                  error={!!fieldErrors.monto}
                />
              </Field>

              <Field
                label="Moneda"
                required
                error={fieldErrors.moneda}
              >
                <Select
                  value={form.moneda}
                  onChange={(e) => updateField("moneda", e.target.value)}
                  error={!!fieldErrors.moneda}
                >
                  <option value="MXN">MXN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </Select>
              </Field>

              <Field
                label="Fecha"
                required
                error={fieldErrors.fecha}
                icon={<Calendar className="w-4 h-4" />}
              >
                <Input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => updateField("fecha", e.target.value)}
                  error={!!fieldErrors.fecha}
                />
              </Field>
            </div>
          </div>

          <div className={ui.modal.formActions}>
            <Boton
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </Boton>

            <Boton
              onClick={onSubmit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isEdit ? "Actualizando..." : "Guardando..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? "Actualizar" : "Guardar Donativo"}
                </>
              )}
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
}