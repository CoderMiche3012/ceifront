import { X } from "lucide-react";
import Field from "../../ui/Field";
import InputG from "../../ui/InputG";
import AlertaError from "../../ui/AlertaError";
import ModalConfirmacion from "../../shared/ModalConfirmacion";
import { useFamiliarForm } from "../../../hooks/expedientes/useFamiliarForm";


export default function ModalCrearFamiliar({ open, onClose, onCreated, expedienteId }) {
  const {
    formData, handleChange, handleConfirm, validate,
    confirmOpen, setConfirmOpen, loading, fieldErrors,
    generalError, fieldRefs
  } = useFamiliarForm(expedienteId, onCreated, onClose);

  if (!open) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setConfirmOpen(true);
  };

  const selectStyle = (error) => `
    w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200
    ${error 
      ? "border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-200" 
      : "border-slate-300 focus:border-[#0E5F63] focus:ring-2 focus:ring-[#0E5F63]/20 bg-white"}
  `;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Agregar Familiar</h2>
            <p className="text-sm text-slate-500 mt-1">
              Complete los datos del integrante para el expediente actual.
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <AlertaError mensaje={generalError} />
          <form id="familiar-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Nombre(s) *" error={fieldErrors.nombre}>
              <InputG name="nombre" value={formData.nombre} onChange={handleChange} ref={el => fieldRefs.current.nombre = el} placeholder="Ej. Juan" />
            </Field>

            <Field label="Apellido Paterno *" error={fieldErrors.apellido_p}>
              <InputG name="apellido_p" value={formData.apellido_p} onChange={handleChange} ref={el => fieldRefs.current.apellido_p = el} />
            </Field>

            <Field label="Apellido Materno" error={fieldErrors.apellido_m}>
              <InputG name="apellido_m" value={formData.apellido_m} onChange={handleChange} />
            </Field>

            <Field label="Parentesco *" error={fieldErrors.parentesco}>
              <select name="parentesco" value={formData.parentesco} onChange={handleChange} className={selectStyle(fieldErrors.parentesco)}>
                <option value="">Seleccionar...</option>
                {["Madre", "Padre", "Hermano/a", "Abuelo/a", "Tío/a", "Tutor", "Otro"].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>

            <Field label="Edad *" error={fieldErrors.edad}>
              <InputG type="number" name="edad" value={formData.edad} onChange={handleChange} placeholder="0" />
            </Field>

            <Field label="Teléfono (10 dígitos) *" error={fieldErrors.telefono}>
              <InputG name="telefono" value={formData.telefono} onChange={handleChange} placeholder="5512345678" />
            </Field>

            <Field label="Ocupación / Actividad *" error={fieldErrors.actividad_principal}>
              <InputG name="actividad_principal" value={formData.actividad_principal} onChange={handleChange} placeholder="Ej. Empleado, Estudiante" />
            </Field>

            <Field label="Lugar de Trabajo / Escuela" error={fieldErrors.area_laboral_escuela}>
              <InputG name="area_laboral_escuela" value={formData.area_laboral_escuela} onChange={handleChange} />
            </Field>

            <Field label="Ingreso Mensual o Beca *" error={fieldErrors.salario}>
              <InputG name="salario" value={formData.salario} onChange={handleChange} placeholder="0.00" />
            </Field>

            <Field label="¿Habita en el mismo domicilio? *" error={fieldErrors.vive_en_casa}>
              <select name="vive_en_casa" value={formData.vive_en_casa} onChange={handleChange} className={selectStyle(fieldErrors.vive_en_casa)}>
                <option value="">Seleccionar...</option>
                <option value="true">Sí, vive en casa</option>
                <option value="false">No vive en casa</option>
              </select>
            </Field>
          </form>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-white transition-all">
            Cancelar
          </button>
          <button form="familiar-form" type="submit" className="bg-[#0E5F63] hover:bg-[#0c4e52] text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-900/20 transition-all">
            Guardar Familiar
          </button>
        </div>

        <ModalConfirmacion
          open={confirmOpen}
          title="Confirmar Registro"
          description={`¿Estás seguro de agregar a ${formData.nombre} como familiar?`}
          onConfirm={handleConfirm}
          onClose={() => setConfirmOpen(false)}
          loading={loading}
        />
      </div>
    </div>
  );
}