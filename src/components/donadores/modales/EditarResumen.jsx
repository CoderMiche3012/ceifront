import { useState } from 'react';
import { X, Save, Loader2, User, MapPin, GraduationCap, Phone, Mail } from 'lucide-react';
import ModalConfirmacion from '../../shared/ModalConfirmacion';
import ModalResultado from '../../shared/ModalResultado';
import Input from '../../ui/InputG';
import Field from '../../ui/Field';
import { actualizarDonador } from '../../../services/donadoresService';

export default function EditarResumen({ isOpen, onClose, data, setData }) {
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
      const { id_donador } = data;
      await actualizarDonador(id_donador, {
        estatus: formDataCache.estatus,
        fecha_ingreso: formDataCache.fecha_ingreso,
      });
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
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Editar Datos </h2>
                <p className="text-sm text-slate-500 font-medium">Actualiza la información del donador</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <form onSubmit={preSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-10">
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <Field label="Fecha de ingreso" required>
                    <Input
                      type="date"
                      name="fecha_ingreso"
                      defaultValue={data.fecha_ingreso}
                      required
                    />
                  </Field>

                  <Field label="Estatus" required>
                    <select
                      name="estatus"
                      defaultValue={data?.estatus || ''}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0E5F63]"
                    >
                      <option value="">Selecciona un estatus</option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Pausa">En pausa</option>
                    </select>
                  </Field>

                </div>
              </section>
            </div>

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