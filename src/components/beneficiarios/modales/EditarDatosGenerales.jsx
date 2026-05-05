import { useState } from 'react';
import { X, Save, Loader2, User } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ModalConfirmacion from '../../shared/ModalConfirmacion';
import ModalResultado from '../../shared/ModalResultado';
import Input from '../../ui/InputG';
import Field from '../../ui/Field';
import { actualizarExpediente, actualizarDireccion } from '../../../services/expedientesService';

export default function EditarDatosGenerales({ isOpen, onClose, data }) {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [formDataCache, setFormDataCache] = useState(null);
  const [resultado, setResultado] = useState({ open: false, type: 'success', title: '', message: '' });

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const id_expediente = data?.id_expediente;
      const id_direccion = data?.id_direccion?.id_direccion;

      // Ejecutamos ambas actualizaciones
      const promesas = [
        actualizarExpediente(id_expediente, {
          nombre: payload.nombre,
          apellido_p: payload.apellido_p,
          apellido_m: payload.apellido_m,
          telefono: payload.telefono,
          correo: payload.correo,
          fecha_nacimiento: payload.fecha_nacimiento,
          genero: payload.genero,
        })
      ];

      if (id_direccion) {
        promesas.push(
          actualizarDireccion(id_direccion, {
            calle: payload.calle,
            numero: payload.numero,
            colonia: payload.colonia,
            municipio: payload.municipio,
            cp: payload.cp,
          })
        );
      }

      return Promise.all(promesas);
    },
    onSuccess: () => {
      // Invalidamos para refrescar listas y detalles
      queryClient.invalidateQueries(['beneficiarios']);
      queryClient.invalidateQueries(['expediente', data?.id_expediente]);

      setResultado({
        open: true,
        type: 'success',
        title: '¡Actualización Exitosa!',
        message: 'Los datos personales y de ubicación se han guardado correctamente.'
      });
      setShowConfirm(false);
    },
    onError: (error) => {
      setResultado({
        open: true,
        type: 'error',
        title: 'Error de actualización',
        message: error.message || 'Hubo un problema al conectar con el servidor.'
      });
      setShowConfirm(false);
    }
  });

  if (!isOpen) return null;

  const preSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    setFormDataCache(payload);
    setShowConfirm(true);
  };

  const handleFinalConfirm = () => {
    mutation.mutate(formDataCache);
  };

  const handleCloseSuccess = () => {
    setResultado(prev => ({ ...prev, open: false }));
    if (resultado.type === 'success') onClose();
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
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Editar Datos Personales</h2>
                <p className="text-sm text-slate-500 font-medium">Actualiza la información general y de contacto</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <form onSubmit={preSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-10">
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
                  <Field label="Apellido Materno">
                    <Input name="apellido_m" defaultValue={data.apellido_m} placeholder="Ej. López" />
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
                      <Input name="calle" defaultValue={data.direccion.calle} placeholder="Nombre de la vialidad" />
                    </Field>
                  </div>
                  <Field label="Número">
                    <Input name="numero" defaultValue={data.direccion.numero} placeholder="Ext/Int" />
                  </Field>
                  <Field label="Colonia">
                    <Input name="colonia" defaultValue={data.direccion.colonia} placeholder="Ej. Centro" />
                  </Field>
                  <Field label="Municipio">
                    <Input name="municipio" defaultValue={data.direccion.municipio} placeholder="Oaxaca" />
                  </Field>
                  <Field label="C.P.">
                    <Input name="cp" defaultValue={data.direccion.cp} placeholder="68000" />
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
                disabled={mutation.isLoading}
                className="flex items-center gap-3 px-10 py-3.5 bg-[#0E5F63] text-white text-sm font-bold rounded-2xl hover:bg-[#0A4D50] shadow-xl shadow-[#0E5F63]/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {mutation.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Confirmar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="¿Guardar cambios?"
        description="Se actualizarán los datos personales y la dirección de forma permanente."
        onConfirm={handleFinalConfirm}
        onClose={() => setShowConfirm(false)}
        loading={mutation.isLoading}
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