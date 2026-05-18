import { useState } from "react";
import { HiOutlineUser, HiUserGroup, HiPlus, HiTrash, HiArrowRight, HiCheck } from "react-icons/hi";
import AlertaError from "../../../../components/ui/AlertaError";
import Field from "../../../../components/ui/Field";
import InputG from "../../../../components/ui/InputG";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";
import { useBeneficiarioCrearForm } from "../../hooks/useBeneficiarioCrearForm";
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function BeneficiarioCrearModal({ open, onClose, onSuccess }) {
  const [step, setStep] = useState(1);

  const {
    form, setForm, error, loading, showConfirm, setShowConfirm,
    resultModal, handlePreSubmit, handleConfirmSave, handleFinalClose
  } = useBeneficiarioCrearForm(onSuccess, onClose);

  if (!open) return null;

  const updateExpediente = (field, value) => {
    setForm(p => ({
      ...p,
      id_expediente: { ...p.id_expediente, [field]: value }
    }));
  };

  const updateDireccion = (field, value) => {
    setForm(p => ({
      ...p,
      id_expediente: {
        ...p.id_expediente,
        id_direccion: { ...p.id_expediente.id_direccion, [field]: value }
      }
    }));
  };

  const updateFamiliar = (index, field, value) => {
    const nuevaFamilia = [...form.id_expediente.familia];
    nuevaFamilia[index] = { ...nuevaFamilia[index], [field]: value };
    updateExpediente("familia", nuevaFamilia);
  };

  // --- Clases de Estilo Reutilizables ---
  const inputClass = "h-9 text-sm rounded-lg border-slate-200 focus:ring-[#0E5F63] transition-all";
  const selectClass = "w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-1 focus:ring-[#0E5F63] transition-all";
  const hoy = new Date().toISOString().split("T")[0];
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] border border-slate-100 overflow-hidden">

          {/* Header */}
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0E5F63] border border-slate-100 shadow-sm">
                {step === 1 ? <HiOutlineUser size={20} /> : <HiUserGroup size={20} />}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 leading-none">Nuevo Beneficiario</h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                  Paso {step} de 2: {step === 1 ? 'Datos Personales' : 'Estructura Familiar'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className={`h-1.5 w-6 rounded-full transition-all ${step === 1 ? 'bg-[#0E5F63]' : 'bg-slate-200'}`} />
                <div className={`h-1.5 w-6 rounded-full transition-all ${step === 2 ? 'bg-[#0E5F63]' : 'bg-slate-200'}`} />
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors text-2xl font-light">×</button>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handlePreSubmit} className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar bg-white">
            <AlertaError mensaje={error} />
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <HiOutlineExclamationCircle className="text-[#0E5F63]" size={18} />
              <span>
                Los campos con <span className="font-semibold text-red-500">*</span> son obligatorios
              </span>
            </div>
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                {/* Información Personal */}
                <section>
                  <h3 className="text-[10px] font-black text-[#0E5F63] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-[#0E5F63]/30"></span> Información Personal
                  </h3>
                  <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                    <div className="col-span-12 md:col-span-6"><Field label="Nombre(s)" required><InputG className={inputClass} placeholder="Ej: Juan Antonio" value={form.id_expediente.nombre} onChange={(e) => updateExpediente("nombre", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-3"><Field label="Ap. Paterno" required><InputG className={inputClass} placeholder="Ej: Pérez" value={form.id_expediente.apellido_p} onChange={(e) => updateExpediente("apellido_p", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-3"><Field label="Ap. Materno"><InputG className={inputClass} placeholder="Ej: García" value={form.id_expediente.apellido_m} onChange={(e) => updateExpediente("apellido_m", e.target.value)} /></Field></div>

                    <div className="col-span-6 md:col-span-3"><Field label="Género" required><select className={selectClass} value={form.id_expediente.genero} onChange={(e) => updateExpediente("genero", e.target.value)}><option value="">Elegir...</option><option value="Femenino">Femenino</option><option value="Masculino">Masculino</option></select></Field></div>
                    <div className="col-span-6 md:col-span-3"><Field label="Fecha Nac." required><InputG
                      className={inputClass}
                      type="date"
                      max={hoy}
                      value={form.id_expediente.fecha_nacimiento}
                      onChange={(e) =>
                        updateExpediente("fecha_nacimiento", e.target.value)
                      }
                    /></Field></div>
                    <div className="col-span-6 md:col-span-3"><Field label="Teléfono"><InputG className={inputClass} value={form.id_expediente.telefono} onChange={(e) => updateExpediente("telefono", e.target.value)} placeholder="Ej: 9511234567" /></Field></div>
                    <div className="col-span-6 md:col-span-3"><Field label="Correo Electrónico" required><InputG className={inputClass} type="email" placeholder="ejemplo@correo.com" value={form.id_expediente.correo} onChange={(e) => updateExpediente("correo", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-3"><Field label="Fecha Ingreso" required><InputG
                      className={inputClass}
                      type="date"
                      max={hoy}
                      value={form.fecha_ingreso}
                      onChange={(e) =>
                        setForm(prev => ({
                          ...prev,
                          fecha_ingreso: e.target.value
                        }))
                      }
                    /></Field></div>
                  </div>
                </section>

                {/* Dirección */}
                <section className="pt-6 border-t border-slate-50">
                  <h3 className="text-[10px] font-black text-[#0E5F63] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-[#0E5F63]/30"></span> Ubicación de Domicilio
                  </h3>
                  <div className="grid grid-cols-12 gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <div className="col-span-6 md:col-span-4"><Field label="Municipio" required><InputG className={inputClass} placeholder="Ej: Oaxaca de Juárez" value={form.id_expediente.id_direccion.municipio} onChange={(e) => updateDireccion("municipio", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-4"><Field label="Colonia" required><InputG className={inputClass} placeholder="Ej: Centro" value={form.id_expediente.id_direccion.colonia} onChange={(e) => updateDireccion("colonia", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-2"><Field label="CP" required><InputG className={inputClass} placeholder="68000" value={form.id_expediente.id_direccion.cp} onChange={(e) => updateDireccion("cp", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-2"><Field label="Núm." required><InputG className={inputClass} placeholder="101-A" value={form.id_expediente.id_direccion.numero} onChange={(e) => updateDireccion("numero", e.target.value)} /></Field></div>
                    <div className="col-span-12"><Field label="Calle" required><InputG className={inputClass} placeholder="Ej: Av. Independencia" value={form.id_expediente.id_direccion.calle} onChange={(e) => updateDireccion("calle", e.target.value)} /></Field></div>
                  </div>
                </section>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black text-[#0E5F63] uppercase tracking-[0.2em]">Estructura Familiar</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const nuevo = { nombre: "", apellido_p: "", apellido_m: "", parentesco: "", edad: "", actividad_principal: "", area_laboral_escuela: "", salario: 0, vive_en_casa: true, telefono: "", es_tutor_principal: false };
                        updateExpediente("familia", [...form.id_expediente.familia, nuevo]);
                      }}
                      className="text-[10px] font-bold bg-[#0E5F63] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#0c5357] shadow-md transition-all active:scale-95"
                    >
                      <HiPlus /> Agregar Familiar
                    </button>
                  </div>

                  <div className="space-y-5">
                    {form.id_expediente.familia.map((fam, idx) => (
                      <div key={idx} className={`p-6 rounded-2xl border-2 transition-all duration-300 ${idx === 0 ? 'border-[#0E5F63]/20 bg-white shadow-sm' : 'border-slate-50 bg-slate-50/30'}`}>
                        <div className="flex justify-between items-center mb-5">
                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${idx === 0 ? 'bg-[#0E5F63] text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                              {idx === 0 ? 'Tutor Principal' : `Familiar ${idx + 1}`}
                            </span>
                          </div>
                          {idx > 0 && (
                            <button type="button" onClick={() => updateExpediente("familia", form.id_expediente.familia.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                              <HiTrash size={18} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-4">
                          <Field label="Nombre"><InputG className={inputClass} value={fam.nombre} onChange={(e) => updateFamiliar(idx, "nombre", e.target.value)} /></Field>
                          <Field label="Ap. Paterno"><InputG className={inputClass} value={fam.apellido_p} onChange={(e) => updateFamiliar(idx, "apellido_p", e.target.value)} /></Field>
                          <Field label="Ap. Materno"><InputG className={inputClass} value={fam.apellido_m} onChange={(e) => updateFamiliar(idx, "apellido_m", e.target.value)} /></Field>
                          <Field label="Parentesco">
                            <select className={selectClass} value={fam.parentesco} onChange={(e) => updateFamiliar(idx, "parentesco", e.target.value)}>
                              <option value="">Elegir...</option>
                              <option value="Padre">Padre</option>
                              <option value="Madre">Madre</option>
                              <option value="Abuelo/a">Abuelo/a</option>
                              <option value="Tío/a">Tío/a</option>
                              <option value="Hermano/a">Hermano/a</option>
                            </select>
                          </Field>
                          <Field label="Fecha Nacimiento">
                            <InputG
                              className={inputClass}
                              type="date"
                              max={new Date().toISOString().split("T")[0]}
                              value={fam.fecha_nacimiento || ""}
                              onChange={(e) => {
                                const fecha = e.target.value;

                                const hoy = new Date();
                                const nacimiento = new Date(fecha);

                                let edad = hoy.getFullYear() - nacimiento.getFullYear();
                                const mes = hoy.getMonth() - nacimiento.getMonth();

                                if (
                                  mes < 0 ||
                                  (mes === 0 && hoy.getDate() < nacimiento.getDate())
                                ) {
                                  edad--;
                                }

                                setForm(prev => {
                                  const nuevaFamilia = [...prev.id_expediente.familia];
                                  nuevaFamilia[idx] = {
                                    ...nuevaFamilia[idx],
                                    fecha_nacimiento: fecha,
                                    edad
                                  };

                                  return {
                                    ...prev,
                                    id_expediente: {
                                      ...prev.id_expediente,
                                      familia: nuevaFamilia
                                    }
                                  };
                                });
                              }}
                            />
                          </Field>
                          <Field label="Teléfono"><InputG className={inputClass} value={fam.telefono} onChange={(e) => updateFamiliar(idx, "telefono", e.target.value)} /></Field>
                          <Field label="Actividad"><InputG className={inputClass} value={fam.actividad_principal} onChange={(e) => updateFamiliar(idx, "actividad_principal", e.target.value)} /></Field>
                          <Field label="Salario Mensual"><InputG className={inputClass} type="number" value={fam.salario} onChange={(e) => updateFamiliar(idx, "salario", e.target.value)} /></Field>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/20">
            <button type="button" onClick={step === 1 ? onClose : () => setStep(1)} className="px-6 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
              {step === 1 ? 'Cancelar' : 'Anterior'}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={step === 1 ? () => setStep(2) : handlePreSubmit}
              className="px-8 py-2.5 bg-[#0E5F63] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#0E5F63]/20 hover:bg-[#0c5357] transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {step === 1 ? (
                <>Siguiente <HiArrowRight /></>
              ) : (
                <>{loading ? 'Procesando...' : 'Guardar Registro'} <HiCheck /></>
              )}
            </button>
          </div>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="¿Confirmar registro?"
        description="Se creará el expediente médico/social y el grupo familiar vinculado. Asegúrate de que los datos del tutor sean correctos."
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