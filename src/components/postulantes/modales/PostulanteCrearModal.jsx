import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUser } from "react-icons/hi";
import AlertaError from "../../ui/AlertaError";
import Field from "../../ui/Field";
import InputG from "../../ui/InputG";
import ModalConfirmacion from "../../shared/ModalConfirmacion";
import ModalResultado from "../../shared/ModalResultado";
import { usePostulanteCrearForm } from "../../../hooks/postulantes/usePostulanteCrearForm";

export default function PostulanteCrearModal({ open, onClose, onSuccess }) {
  const {
    form, setForm, error, loading, showConfirm, setShowConfirm,
    resultModal, handlePreSubmit, handleConfirmSave, handleFinalClose
  } = usePostulanteCrearForm(onSuccess, onClose);

  if (!open) return null;

  const updateExpediente = (field, value) => {
    setForm(prev => ({
      ...prev,
      id_expediente: { ...prev.id_expediente, [field]: value }
    }));
  };

  const updateDireccion = (field, value) => {
    setForm(prev => ({
      ...prev,
      id_expediente: {
        ...prev.id_expediente,
        id_direccion: { ...prev.id_expediente.id_direccion, [field]: value }
      }
    }));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-left transition-all">
        {/* Se aumentó el max-w a 4xl para dar espacio a las 3 columnas */}
        <div className="w-full max-w-4xl rounded-[32px] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">

          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 flex items-center gap-4 flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0E5F63]/10 text-[#0E5F63]"><HiOutlineCalendar size={24} /></div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800">Nuevo Postulante</h2>
              <p className="text-sm text-slate-500">Los campos con * son obligatorios</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full">×</button>
          </div>

          <form onSubmit={handlePreSubmit} className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 custom-scrollbar">
            <AlertaError mensaje={error} />

            {/* Grid principal: 3 columnas en pantallas medianas */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mt-6">
              <Field label="Nombre(s)" required>
                <InputG value={form.id_expediente.nombre} onChange={(e) => updateExpediente("nombre", e.target.value)} placeholder="Ej. Juan" disabled={loading} required />
              </Field>

              <Field label="Apellido Paterno" required>
                <InputG value={form.id_expediente.apellido_p} onChange={(e) => updateExpediente("apellido_p", e.target.value)} placeholder="Ej. Perez" disabled={loading} required />
              </Field>

              <Field label="Apellido Materno" required>
                <InputG value={form.id_expediente.apellido_m} onChange={(e) => updateExpediente("apellido_m", e.target.value)} placeholder="Robles" disabled={loading} />
              </Field>

              <Field label="Género" required>
                <select
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-[#0E5F63] outline-none transition-all"
                  value={form.id_expediente.genero}
                  onChange={(e) => updateExpediente("genero", e.target.value)}
                  disabled={loading}
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </Field>

              <Field label="Fecha de Nacimiento" required>
                <InputG type="date" value={form.id_expediente.fecha_nacimiento} onChange={(e) => updateExpediente("fecha_nacimiento", e.target.value)} disabled={loading} required />
              </Field>

              <Field label="Teléfono" required>
                <InputG value={form.id_expediente.telefono} onChange={(e) => updateExpediente("telefono", e.target.value)} placeholder="Ej. 9528889900" disabled={loading} required />
              </Field>

              <div className="md:col-span-3">
                <Field label="Correo Electrónico" required>
                  <InputG type="email" value={form.id_expediente.correo} onChange={(e) => updateExpediente("correo", e.target.value)} placeholder="correo@ejemplo.com" disabled={loading} required />
                </Field>
              </div>
            </div>
            {/* Nueva sección: Información de Ingreso */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-xs font-bold text-[#0E5F63] uppercase tracking-widest mb-4 px-2">
                Detalles de Ingreso
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Nivel Escolar Inicial" required>
                  <select
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#0E5F63] outline-none transition-all"
                    value={form.nivel_escolar_inicial} // Suponiendo que los guardas en la raíz del form en el hook
                    onChange={(e) => setForm(prev => ({ ...prev, nivel_escolar_inicial: e.target.value }))}
                    disabled={loading}
                    required
                  >
                    <option value="">Seleccionar nivel...</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                  </select>
                </Field>

                <Field label="Grado Escolar Inicial" required>
                  <InputG
                    placeholder="Ej. 3er Año"
                    value={form.grado_escolar_inicial}
                    onChange={(e) => setForm(prev => ({ ...prev, grado_escolar_inicial: e.target.value }))}
                    disabled={loading}
                    required
                  />
                </Field>
              </div>
            </div>

            {/* Grid de dirección: 3 columnas en pantallas medianas */}
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 p-6 rounded-[24px] bg-slate-50/50 border border-slate-100">
              <Field label="Municipio" required>
                <InputG value={form.id_expediente.id_direccion.municipio} onChange={(e) => updateDireccion("municipio", e.target.value)} placeholder="Oaxaca" disabled={loading} required />
              </Field>
              <Field label="Colonia" required>
                <InputG value={form.id_expediente.id_direccion.colonia} onChange={(e) => updateDireccion("colonia", e.target.value)} disabled={loading} placeholder="Oaxaca" required />
              </Field>
              <Field label="Código Postal" required>
                <InputG value={form.id_expediente.id_direccion.cp} onChange={(e) => updateDireccion("cp", e.target.value)} disabled={loading} placeholder="12345" required />
              </Field>

              <div className="md:col-span-2">
                <Field label="Calle" required>
                  <InputG value={form.id_expediente.id_direccion.calle} onChange={(e) => updateDireccion("calle", e.target.value)} placeholder="Flores" disabled={loading} required />
                </Field>
              </div>
              <Field label="Número" required>
                <InputG value={form.id_expediente.id_direccion.numero} onChange={(e) => updateDireccion("numero", e.target.value)} placeholder="numero o SN" disabled={loading} />
              </Field>
            </div>

            <div className="mt-10 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-slate-100 pt-8">
              <button type="button" onClick={onClose} disabled={loading} className="px-8 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">Cancelar</button>
              <button type="submit" disabled={loading} className="px-10 py-3 font-bold text-white bg-[#0E5F63] hover:bg-[#0c5357] rounded-2xl shadow-xl transition-all">
                {loading ? "Registrando..." : "Registrar Postulante"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="¿Confirmar registro?"
        description={`Se registrará a "${form.id_expediente.nombre}". ¿Deseas continuar?`}
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