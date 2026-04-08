import { useState } from "react";
import { HiOutlineUser, HiUserGroup, HiPlus, HiTrash, HiArrowRight, HiArrowLeft, HiCheck } from "react-icons/hi";
import AlertaError from "../../ui/AlertaError";
import Field from "../../ui/Field";
import InputG from "../../ui/InputG";
import ModalConfirmacion from "../../shared/ModalConfirmacion";
import ModalResultado from "../../shared/ModalResultado";
import { usePostulanteCrearForm } from "../../../hooks/postulantes/usePostulanteCrearForm";

export default function PostulanteCrearModal({ open, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const {
    form, setForm, error, loading, showConfirm, setShowConfirm,
    resultModal, handlePreSubmit, handleConfirmSave, handleFinalClose
  } = usePostulanteCrearForm(onSuccess, onClose);

  if (!open) return null;

  // Actualizadores
  const updateExpediente = (f, v) => setForm(p => ({ ...p, id_expediente: { ...p.id_expediente, [f]: v } }));
  const updateDireccion = (f, v) => setForm(p => ({ ...p, id_expediente: { ...p.id_expediente, id_direccion: { ...p.id_expediente.id_direccion, [f]: v } } }));
  
  const updateFamiliar = (i, f, v) => {
    const n = [...form.id_expediente.familia];
    n[i] = { ...n[i], [f]: v };
    updateExpediente("familia", n);
  };

  // Clases CSS reutilizables
  const inputClass = "h-9 text-sm rounded-lg border-slate-200 focus:ring-[#0E5F63]";
  const selectClass = "w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-1 focus:ring-[#0E5F63]";

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] border border-slate-100">
          
          {/* Header */}
          <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0E5F63] border border-slate-100">
                {step === 1 ? <HiOutlineUser size={20} /> : <HiUserGroup size={20} />}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 leading-none">Nuevo Postulante</h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Paso {step} de 2</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex gap-1">
                  <div className={`h-1 w-5 rounded-full ${step === 1 ? 'bg-[#0E5F63]' : 'bg-slate-200'}`} />
                  <div className={`h-1 w-5 rounded-full ${step === 2 ? 'bg-[#0E5F63]' : 'bg-slate-200'}`} />
               </div>
               <button onClick={onClose} className="ml-4 text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
          </div>

          <form onSubmit={handlePreSubmit} className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
            <AlertaError mensaje={error} />

            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Sección: Información Personal */}
                <div>
                  <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em] mb-4">Información Personal</h3>
                  <div className="grid grid-cols-12 gap-x-4 gap-y-3">
                    <div className="col-span-12 md:col-span-6"><Field label="Nombre(s)" required><InputG className={inputClass} placeholder="Ej: Juan Antonio" value={form.id_expediente.nombre} onChange={(e) => updateExpediente("nombre", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-3"><Field label="Ap. Paterno" required><InputG className={inputClass} placeholder="Ej: Pérez" value={form.id_expediente.apellido_p} onChange={(e) => updateExpediente("apellido_p", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-3"><Field label="Ap. Materno"><InputG className={inputClass} placeholder="Ej: García" value={form.id_expediente.apellido_m} onChange={(e) => updateExpediente("apellido_m", e.target.value)} /></Field></div>
                    
                    <div className="col-span-6 md:col-span-3"><Field label="Género" required><select className={selectClass} value={form.id_expediente.genero} onChange={(e) => updateExpediente("genero", e.target.value)}><option value="">Elegir...</option><option value="Femenino">Femenino</option><option value="Masculino">Masculino</option></select></Field></div>
                    <div className="col-span-6 md:col-span-3"><Field label="Fecha Nac." required><InputG className={inputClass} type="date" value={form.id_expediente.fecha_nacimiento} onChange={(e) => updateExpediente("fecha_nacimiento", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-3"><Field label="Teléfono" required><InputG className={inputClass} value={form.id_expediente.telefono} onChange={(e) => updateExpediente("telefono", e.target.value)} placeholder="Ej: 9511234567" /></Field></div>
                    <div className="col-span-6 md:col-span-3"><Field label="Correo Electrónico" required><InputG className={inputClass} type="email" placeholder="ejemplo@correo.com" value={form.id_expediente.correo} onChange={(e) => updateExpediente("correo", e.target.value)} /></Field></div>
                  </div>
                </div>

                {/* Sección: Dirección */}
                <div className="pt-4 border-t border-slate-50">
                  <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em] mb-4">Dirección</h3>
                  <div className="grid grid-cols-12 gap-x-4 gap-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                    <div className="col-span-6 md:col-span-4"><Field label="Municipio" required><InputG className={inputClass} placeholder="Ej: Oaxaca de Juárez" value={form.id_expediente.id_direccion.municipio} onChange={(e) => updateDireccion("municipio", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-4"><Field label="Colonia" required><InputG className={inputClass} placeholder="Ej: Centro" value={form.id_expediente.id_direccion.colonia} onChange={(e) => updateDireccion("colonia", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-2"><Field label="CP" required><InputG className={inputClass} placeholder="68000" value={form.id_expediente.id_direccion.cp} onChange={(e) => updateDireccion("cp", e.target.value)} /></Field></div>
                    <div className="col-span-6 md:col-span-2"><Field label="Núm." required><InputG className={inputClass} placeholder="101-A" value={form.id_expediente.id_direccion.numero} onChange={(e) => updateDireccion("numero", e.target.value)} /></Field></div>
                    <div className="col-span-12"><Field label="Calle" required><InputG className={inputClass} placeholder="Ej: Av. Independencia" value={form.id_expediente.id_direccion.calle} onChange={(e) => updateDireccion("calle", e.target.value)} /></Field></div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                {/* Sección: Educación */}
                <div>
                  <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em] mb-4">Información Académica</h3>
                  <div className="grid grid-cols-12 gap-x-4 gap-y-3 bg-[#0E5F63]/5 p-5 rounded-2xl border border-[#0E5F63]/10">
                    <div className="col-span-12 md:col-span-6"><Field label="Nivel Escolar Inicial" required><select className={selectClass} value={form.nivel_escolar_inicial} onChange={(e) => setForm(p => ({ ...p, nivel_escolar_inicial: e.target.value }))}><option value="">Elegir...</option><option value="Primaria">Primaria</option><option value="Secundaria">Secundaria</option></select></Field></div>
                    <div className="col-span-12 md:col-span-6"><Field label="Grado Escolar Inicial" required><InputG className={inputClass} placeholder="Ej: 1°" value={form.grado_escolar_inicial} onChange={(e) => setForm(p => ({ ...p, grado_escolar_inicial: e.target.value }))} /></Field></div>
                  </div>
                </div>

                {/* Sección: Familia */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em]">Estructura Familiar</h3>
                    <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em]">Los familiares son modificables</h3>
                    <button type="button" onClick={() => { 
                      const n = [...form.id_expediente.familia, { 
                        nombre: "", apellido_p: "", apellido_m: "", parentesco: "", edad: "", 
                        actividad_principal: "", area_laboral_escuela: "", salario: "0.00", 
                        vive_en_casa: true, telefono: "" 
                      }]; 
                      updateExpediente("familia", n); 
                    }} className="text-[10px] font-bold bg-[#0E5F63] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#0c5357] transition-colors">
                      <HiPlus /> AGREGAR INTEGRANTE
                    </button>
                  </div>

                  <div className="space-y-4">
                    {form.id_expediente.familia.map((fam, idx) => (
                      <div key={idx} className={`p-5 rounded-2xl border-2 transition-all ${idx === 0 ? 'border-[#0E5F63]/20 bg-white shadow-sm' : 'border-slate-50 bg-white'}`}>
                        <div className="flex justify-between mb-4">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${idx === 0 ? 'bg-[#0E5F63] text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {idx === 0 ? 'Tutor Principal' : `Integrante ${idx + 1}`}
                          </span>
                          {idx > 0 && <button type="button" onClick={() => { const n = form.id_expediente.familia.filter((_, i) => i !== idx); updateExpediente("familia", n); }} className="text-red-400 hover:text-red-600"><HiTrash size={16} /></button>}
                        </div>

                        {/* Grid de 4 columnas para familia */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3">
                          <Field label="Nombre"><InputG className={inputClass} placeholder="Nombre" value={fam.nombre} onChange={(e) => updateFamiliar(idx, "nombre", e.target.value)} /></Field>
                          <Field label="Ap. Paterno"><InputG className={inputClass} placeholder="Apellido P." value={fam.apellido_p} onChange={(e) => updateFamiliar(idx, "apellido_p", e.target.value)} /></Field>
                          <Field label="Ap. Materno"><InputG className={inputClass} placeholder="Apellido M." value={fam.apellido_m} onChange={(e) => updateFamiliar(idx, "apellido_m", e.target.value)} /></Field>
                          <Field label="Parentesco">
                            <select className={selectClass} value={fam.parentesco} onChange={(e) => updateFamiliar(idx, "parentesco", e.target.value)}>
                              <option value="">Elegir...</option>
                              <option value="Padre">Padre</option><option value="Madre">Madre</option><option value="Abuelo/a">Abuelo/a</option><option value="Tío/a">Tío/a</option>
                            </select>
                          </Field>

                          <Field label="Edad"><InputG className={inputClass} type="number" placeholder="0" value={fam.edad} onChange={(e) => updateFamiliar(idx, "edad", e.target.value)} /></Field>
                          <Field label="Teléfono"><InputG className={inputClass} placeholder="10 dígitos" value={fam.telefono} onChange={(e) => updateFamiliar(idx, "telefono", e.target.value)} /></Field>
                          <Field label="Actividad"><InputG className={inputClass} placeholder="Ej: Empleado" value={fam.actividad_principal} onChange={(e) => updateFamiliar(idx, "actividad_principal", e.target.value)} /></Field>
                          <Field label="Lugar Trabajo/Esc."><InputG className={inputClass} placeholder="Nombre Empresa/Esc." value={fam.area_laboral_escuela} onChange={(e) => updateFamiliar(idx, "area_laboral_escuela", e.target.value)} /></Field>
                          
                          <Field label="Salario Mensual"><InputG className={inputClass} type="number" placeholder="0.00" value={fam.salario} onChange={(e) => updateFamiliar(idx, "salario", e.target.value)} /></Field>
                          <Field label="¿Vive en casa?">
                            <select className={selectClass} value={fam.vive_en_casa} onChange={(e) => updateFamiliar(idx, "vive_en_casa", e.target.value === "true")}>
                              <option value="true">Sí</option>
                              <option value="false">No</option>
                            </select>
                          </Field>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/30">
            <button type="button" onClick={step === 1 ? onClose : () => setStep(1)} className="px-6 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
              {step === 1 ? 'Cancelar' : 'Volver'}
            </button>
            <button 
              type="button" 
              onClick={step === 1 ? () => setStep(2) : handlePreSubmit}
              className="px-8 py-2 bg-[#0E5F63] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#0E5F63]/20 hover:bg-[#0c5357] transition-all flex items-center gap-2"
            >
              {step === 1 ? (<>Siguiente <HiArrowRight/></>) : (<>{loading ? 'Guardando...' : 'Finalizar Registro'} <HiCheck/></>)}
            </button>
          </div>
        </div>
      </div>

      <ModalConfirmacion open={showConfirm} title="¿Confirmar registro?" description="Se creará el expediente y el grupo familiar." onConfirm={handleConfirmSave} onClose={() => setShowConfirm(false)} />
      <ModalResultado open={resultModal.open} type={resultModal.type} title={resultModal.title} message={resultModal.message} onClose={handleFinalClose} />
    </>
  );
}