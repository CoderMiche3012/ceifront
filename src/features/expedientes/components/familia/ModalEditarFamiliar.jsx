import { X } from "lucide-react";
import Field from "../../../../components/ui/Field";
import InputG from "../../../../components/ui/InputG";
import AlertaError from "../../../../components/ui/AlertaError";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import { useEditarFamiliar } from "../../hooks/useEditarFamiliar";
import ModalResultado from "../../../../components/shared/ModalResultado";

export default function ModalEditarFamiliar({ open, onClose, onSave, editando, setEditando }) {
  const {
    handleChange,
    handleConfirm,
    validate,
    confirmOpen,
    setConfirmOpen,
    loading,
    fieldErrors,
    generalError,
    fieldRefs,
    resultOpen,
    resultType,
    resultTitle,
    resultMessage,
    handleCloseResult
  } = useEditarFamiliar(editando, setEditando, onSave, onClose);
  if (!open || !editando) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setConfirmOpen(true);
  };

  const selectStyle = (error) => `
    w-full rounded-xl border px-4 py-3 text-sm transition-all
    ${error ? "border-rose-400 bg-rose-50" : "border-slate-300 focus:border-[#0E5F63] focus:ring-2 focus:ring-[#0E5F63]/20 bg-white"}
  `;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Editar Ingreso</h2>
            <p className="text-sm text-slate-500">Modifica los datos del familiar seleccionado.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Formulario con Scroll */}
        <div className="p-6 overflow-y-auto">
          <AlertaError mensaje={generalError} />
          <form id="edit-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Field label="Nombre *" error={fieldErrors.nombre}>
              <InputG name="nombre" value={editando.nombre || ""} onChange={handleChange} ref={el => fieldRefs.current.nombre = el} />
            </Field>

            <Field label="Apellido Paterno *" error={fieldErrors.apellido_p}>
              <InputG name="apellido_p" value={editando.apellido_p || ""} onChange={handleChange} ref={el => fieldRefs.current.apellido_p = el} />
            </Field>

            <Field label="Apellido Materno" error={fieldErrors.apellido_m}>
              <InputG name="apellido_m" value={editando.apellido_m || ""} onChange={handleChange} />
            </Field>

            <Field label="Parentesco *" error={fieldErrors.parentesco}>
              <select name="parentesco" value={editando.parentesco || ""} onChange={handleChange} className={selectStyle(fieldErrors.parentesco)}>
                <option value="">Elegir...</option>
                <option>Madre</option><option>Padre</option><option>Hermano/a</option>
                <option>Abuelo/a</option><option>Tutor</option><option>Otro</option>
              </select>
            </Field>

            <Field label="Fecha de nacimiento *" error={fieldErrors.edad}>
              <InputG
                type="date"
                value={
                  editando.edad
                    ? `${new Date().getFullYear() - editando.edad}-01-01`
                    : ""
                }
                onChange={(e) => {
                  const fecha = new Date(e.target.value);
                  const hoy = new Date();

                  let edad = hoy.getFullYear() - fecha.getFullYear();
                  const mes = hoy.getMonth() - fecha.getMonth();

                  if (
                    mes < 0 ||
                    (mes === 0 && hoy.getDate() < fecha.getDate())
                  ) {
                    edad--;
                  }

                  handleChange({
                    target: {
                      name: "edad",
                      value: edad
                    }
                  });
                }}
              />
            </Field>

            <Field label="Teléfono *" error={fieldErrors.telefono}>
              <InputG name="telefono" value={editando.telefono || ""} onChange={handleChange} />
            </Field>

            <Field label="Ocupación *" error={fieldErrors.actividad_principal}>
              <InputG name="actividad_principal" value={editando.actividad_principal || ""} onChange={handleChange} />
            </Field>

            <Field label="Lugar de Trabajo/Escuela" error={fieldErrors.area_laboral_escuela}>
              <InputG name="area_laboral_escuela" value={editando.area_laboral_escuela || ""} onChange={handleChange} />
            </Field>

            <Field label="Salario / Beca *" error={fieldErrors.salario}>
              <InputG name="salario" value={editando.salario || ""} onChange={handleChange} />
            </Field>

            <Field label="¿Vive en casa? *" error={fieldErrors.vive_en_casa}>
              <select name="vive_en_casa" value={String(editando.vive_en_casa)} onChange={handleChange} className={selectStyle(fieldErrors.vive_en_casa)}>
                <option value="">Elegir...</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </Field>
          </form>
        </div>

        {/* Footer Fijo */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-white transition-all">
            Cancelar
          </button>
          <button form="edit-form" type="submit" className="bg-[#0E5F63] hover:bg-[#0c4e52] text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg transition-all">
            Guardar Cambios
          </button>
        </div>

        <ModalConfirmacion
          open={confirmOpen}
          title="Confirmar cambios"
          description={`¿Guardar los cambios realizados a ${editando.nombre}?`}
          onConfirm={handleConfirm}
          onClose={() => setConfirmOpen(false)}
          loading={loading}
        />
        <ModalResultado
          open={resultOpen}
          type={resultType}
          title={resultTitle}
          message={resultMessage}
          buttonText="Entendido"
          onClose={handleCloseResult}
        />
      </div>
    </div>
  );
}