import { useState } from 'react';
import { X, Save, Loader2, User, MapPin, GraduationCap, Phone, Mail } from 'lucide-react';
import ModalConfirmacion from '../../../../components/shared/ModalConfirmacion';
import ModalResultado from '../../../../components/shared/ModalResultado';
import Input from '../../../../components/ui/InputG'; 
import Field from '../../../../components/ui/Field'; 
import { actualizarExpediente, actualizarDireccion } from '../../../expedientes/services/expedientesService';
import { actualizarEstudio } from '../../services/estudiosService';
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function EditarDatosGenerales({ isOpen, onClose, data, setData }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultado, setResultado] = useState({ open: false, type: 'success', title: '', message: '' });
  const [formDataCache, setFormDataCache] = useState(null);
  if (!isOpen) return null;

  const preSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    setFormDataCache(payload);
    setShowConfirm(true);
  };

  const handleFinalConfirm = async () => {
    setLoading(true);
    try {
      const { id_expediente, id_direccion, id_estudio } = data;
      await Promise.all([
        actualizarExpediente(id_expediente, {
          nombre: formDataCache.nombre,
          apellido_p: formDataCache.apellido_p,
          apellido_m: formDataCache.apellido_m,
          telefono: formDataCache.telefono,
          correo: formDataCache.correo,
          fecha_nacimiento: formDataCache.fecha_nacimiento,
          genero: formDataCache.genero
        }),
        actualizarDireccion(id_direccion, {
          calle: formDataCache.calle,
          numero: formDataCache.numero,
          colonia: formDataCache.colonia,
          municipio: formDataCache.municipio,
          cp: formDataCache.cp
        }),
        actualizarEstudio(id_estudio, {
          nivel_escolar_inicial: formDataCache.nivel_escolar_inicial,
          grado_escolar_inicial: formDataCache.grado_escolar_inicial,
          referencia_ingreso: formDataCache.referencia_ingreso,
          referencia_casa: formDataCache.referencia_casa
        })
      ]);

      setData((prev) => ({ ...prev, ...formDataCache }));
      setShowConfirm(false);
      setResultado({
        open: true,
        type: 'success',
        title: '¡Actualización Exitosa!',
        message: 'Los datos se han guardado correctamente en el sistema.'
      });
    } catch (error) {
      setShowConfirm(false);
      setResultado({
        open: true,
        type: 'error',
        title: 'Error de red',
        message: error.message || 'Hubo un problema al conectar con el servidor.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setResultado({ ...resultado, open: false });
    if (resultado.type === 'success') {
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
        <div className="bg-[#F8FAFC] rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white">
          
          {/* Header */}
          <div className="flex items-center justify-between p-8 bg-white border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#0E5F63]/10 rounded-2xl">
                <User className="w-6 h-6 text-[#0E5F63]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Editar Perfil</h2>
                <p className="text-sm text-slate-500 font-medium">Actualiza la información general del registro</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <form onSubmit={preSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-10">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <HiOutlineExclamationCircle className="text-[#0E5F63]" size={18} />
              <span>
                Los campos con <span className="font-semibold text-red-500">*</span> son obligatorios
              </span>
            </div>
              
              {/* SECCIÓN PERSONAL */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <span className="h-px w-8 bg-[#0E5F63]/20"></span>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0E5F63]">Información Personal</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Nombre(s)" required>
                    <Input name="nombre" defaultValue={data.nombre} required placeholder="Ej. Juan Manuel" />
                  </Field>
                  <Field label="Apellido Paterno">
                    <Input name="apellido_p" defaultValue={data.apellido_p} placeholder="Ej. García" />
                  </Field>
                  <Field label="Teléfono">
                    <Input name="telefono" defaultValue={data.telefono} placeholder="000 000 0000" />
                  </Field>
                  <Field label="Correo Electrónico">
                    <Input name="correo" type="email" defaultValue={data.correo} placeholder="ejemplo@correo.com" />
                  </Field>
                </div>
              </section>

              {/* SECCIÓN DIRECCIÓN */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <span className="h-px w-8 bg-[#0E5F63]/20"></span>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0E5F63]">Ubicación y Domicilio</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Field label="Calle">
                      <Input name="calle" defaultValue={data.calle} placeholder="Nombre de la vialidad" />
                    </Field>
                  </div>
                  <Field label="Número">
                    <Input name="numero" defaultValue={data.numero} placeholder="Ext/Int" />
                  </Field>
                  <Field label="Colonia">
                    <Input name="colonia" defaultValue={data.colonia} placeholder="Ej. Centro" />
                  </Field>
                  <Field label="Municipio">
                    <Input name="municipio" defaultValue={data.municipio} placeholder="Oaxaca" />
                  </Field>
                  <Field label="C.P.">
                    <Input name="cp" defaultValue={data.cp} placeholder="68000" />
                  </Field>
                </div>
              </section>

              {/* SECCIÓN ACADÉMICA Y REFERENCIAS */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <span className="h-px w-8 bg-[#0E5F63]/20"></span>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0E5F63]">Estudios y Referencias</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Nivel Escolar">
                    <select 
                      name="nivel_escolar_inicial" 
                      defaultValue={data.nivel_escolar_inicial}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[15px] focus:border-[#0E5F63] focus:ring-[5px] focus:ring-[#0E5F63]/5 focus:outline-none transition-all"
                    >
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Bachillerato">Bachillerato</option>
                    </select>
                  </Field>
                  <Field label="Grado Escolar">
                    <Input name="grado_escolar_inicial" defaultValue={data.grado_escolar_inicial} placeholder="Ej. 3er Año" />
                  </Field>
                  <Field label="Referencia de la Casa">
                    <Input name="referencia_casa" defaultValue={data.referencia_casa} placeholder="Ej. Portón café" />
                  </Field>
                  <Field label="Referencia de Ingreso">
                    <Input name="referencia_ingreso" defaultValue={data.referencia_ingreso} placeholder="¿Cómo llegó?" />
                  </Field>
                </div>
              </section>
            </div>

            {/* Footer Form */}
            <div className="flex justify-end gap-4 mt-12">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
              >
                Descartar
              </button>
              <button
                type="submit"
                className="flex items-center gap-3 px-10 py-3.5 bg-[#0E5F63] text-white text-sm font-bold rounded-2xl hover:bg-[#0A4D50] shadow-xl shadow-[#0E5F63]/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Confirmar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="¿Guardar cambios?"
        description="La información del expediente será actualizada de forma permanente en la base de datos."
        confirmText="Guardar Ahora"
        onConfirm={handleFinalConfirm}
        onClose={() => setShowConfirm(false)}
        loading={loading}
        color="teal"
      />

      <ModalResultado
        open={resultado.open}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={handleCloseSuccess}
      />
    </>
  );
}