import { HiOutlineUser, HiCheck, HiPencilAlt } from "react-icons/hi";
import AlertaError from "../../ui/AlertaError";
import Field from "../../ui/Field";
import InputG from "../../ui/InputG";
import ModalConfirmacion from "../../shared/ModalConfirmacion";
import ModalResultado from "../../shared/ModalResultado";
import { useDonadorEditarForm } from "../../../hooks/donadores/useDonadorEditarForm";

export default function EditarDatosGenerales({open,onClose,onSuccess,donador,}) {
  const {
    form,
    setForm,
    loading,
    error,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  } = useDonadorEditarForm(donador, onSuccess, onClose);

  if (!open) return null;

  const inputClass =
    "h-10 text-sm rounded-xl border-slate-200 focus:ring-[#0E5F63]";

  const selectClass =
    "w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-1 focus:ring-[#0E5F63]";

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          
          {/* Header */}
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0E5F63]">
                <HiPencilAlt size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Editar Donador
                </h2>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">
                  Actualizar información
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="px-8 py-6 space-y-8 max-h-[78vh] overflow-y-auto">
            <AlertaError mensaje={error} />
            {/* Información General */}
            <div>
              <h3 className="text-[10px] font-black text-[#0E5F63]/70 uppercase tracking-[0.2em] mb-4">
                Información General
              </h3>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-4">
                  <Field label="Nombre" required>
                    <InputG
                      className={inputClass}
                      value={form.nombre}
                      onChange={(e) =>
                        updateField("nombre", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Apellido Paterno" required>
                    <InputG
                      className={inputClass}
                      value={form.apellido_p}
                      onChange={(e) =>
                        updateField("apellido_p", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Apellido Materno" required>
                    <InputG
                      className={inputClass}
                      value={form.apellido_m}
                      onChange={(e) =>
                        updateField("apellido_m", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Correo Electrónico">
                    <InputG
                      type="email"
                      className={inputClass}
                      value={form.correo}
                      onChange={(e) =>
                        updateField("correo", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Teléfono">
                    <InputG
                      className={inputClass}
                      value={form.telefono}
                      onChange={(e) =>
                        updateField("telefono", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Tipo Donador" required>
                    <select
                      className={selectClass}
                      value={form.tipo}
                      onChange={(e) =>
                        updateField("tipo", e.target.value)
                      }
                    >
                      <option value="">Seleccionar...</option>
                      <option value="CEI">CEI</option>
                      <option value="OYE">OYE</option>
                      <option value="Individual">CANFRO</option>
                    </select>
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Fecha Ingreso">
                    <InputG
                      type="date"
                      className={inputClass}
                      value={form.fecha_ingreso}
                      onChange={(e) =>
                        updateField("fecha_ingreso", e.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div>
              <h3 className="text-[10px] font-black text-[#0E5F63]/70 uppercase tracking-[0.2em] mb-4">
                Domicilio
              </h3>

              <div className="grid grid-cols-12 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="col-span-12 md:col-span-4">
                  <Field label="Calle">
                    <InputG
                      className={inputClass}
                      value={form.calle}
                      onChange={(e) =>
                        updateField("calle", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Número">
                    <InputG
                      className={inputClass}
                      value={form.numero}
                      onChange={(e) =>
                        updateField("numero", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Colonia">
                    <InputG
                      className={inputClass}
                      value={form.colonia}
                      onChange={(e) =>
                        updateField("colonia", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Código Postal">
                    <InputG
                      className={inputClass}
                      value={form.cp}
                      onChange={(e) =>
                        updateField("cp", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Localidad">
                    <InputG
                      className={inputClass}
                      value={form.localidad}
                      onChange={(e) =>
                        updateField("localidad", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="País">
                    <InputG
                      className={inputClass}
                      value={form.pais}
                      onChange={(e) =>
                        updateField("pais", e.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>
          <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
            >
              Cancelar
            </button>

            <button
              disabled={loading}
              onClick={handlePreSubmit}
              className="px-7 py-2 rounded-xl bg-[#0E5F63] text-white text-sm font-bold hover:bg-[#0c5357] transition-all shadow-lg shadow-[#0E5F63]/20 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
              <HiCheck />
            </button>
          </div>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="¿Guardar cambios?"
        description="Se actualizará la información del donador."
        onConfirm={handleConfirmSave}
        onClose={() => setShowConfirm(false)}
      />

      <ModalResultado
        open={resultModal.open}
        type={resultModal.type}
        title={resultModal.title}
        message={resultModal.message}
        onClose={handleFinalClose}
      />
    </>
  );
}