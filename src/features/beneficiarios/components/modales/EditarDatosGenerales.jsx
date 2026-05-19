import { X, Save, Loader2, User } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ModalConfirmacion from '../../../../components/shared/ModalConfirmacion';
import ModalResultado from '../../../../components/shared/ModalResultado';
import Input from '../../../../components/ui/InputG';
import Field from '../../../../components/ui/Field';
import { actualizarExpediente, actualizarDireccion } from '../../../expedientes/services/expedientesService';
import { buscarCPCompleto } from "../../../expedientes/services/expedientesService";
import { useState, useEffect } from 'react';
import { formatErrorAnidado } from '../../../../utils/errorHandlers';
const getErrorMessage = (err) => {

  if (err?.response?.data) {
    return formatErrorAnidado(err.response.data);
  }

  if (err?.message) {
    return formatErrorAnidado(err);
  }

  return "Error inesperado";
};

export default function EditarDatosGenerales({ isOpen, onClose, data }) {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [formDataCache, setFormDataCache] = useState(null);
  const [resultado, setResultado] = useState({ open: false, type: 'success', title: '', message: '' });
  const [colonias, setColonias] = useState([]);
  const [loadingCP, setLoadingCP] = useState(false);
  const [cpEncontrado, setCpEncontrado] =
    useState(false);
  const [otraColonia, setOtraColonia] =
    useState(false);
  const [direccionForm, setDireccionForm] = useState({
    calle: data?.direccion?.calle || "",
    numero: data?.direccion?.numero || "",
    colonia: data?.direccion?.colonia || "",
    municipio: data?.direccion?.municipio || "",
    cp: data?.direccion?.cp || "",
  });
  const updateDireccion = (field, value) => {
    setDireccionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  useEffect(() => {

    if (!isOpen) return;

    // RESET COMPLETO DEL FORMULARIO
    setDireccionForm({
      calle: data?.direccion?.calle || "",
      numero: data?.direccion?.numero || "",
      colonia: data?.direccion?.colonia || "",
      municipio: data?.direccion?.municipio || "",
      cp: data?.direccion?.cp || "",
    });

    setOtraColonia(false);
    setCpEncontrado(false);
    setColonias([]);

    const cargarCPInicial = async () => {

      const cp = data?.direccion?.cp;

      if (!cp || String(cp).length !== 5) return;

      try {

        setLoadingCP(true);

        const dataCP = await buscarCPCompleto(cp);

        setColonias(dataCP?.colonias || []);

        if (dataCP?.municipio) {

          setCpEncontrado(true);

          setDireccionForm(prev => ({
            ...prev,
            municipio: dataCP.municipio
          }));

        }

        const coloniaActual = data?.direccion?.colonia;

        if (
          coloniaActual &&
          dataCP?.colonias &&
          !dataCP.colonias.includes(coloniaActual)
        ) {

          setOtraColonia(true);

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoadingCP(false);

      }
    };

    cargarCPInicial();

  }, [isOpen, data]);
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
            calle: direccionForm.calle,
            numero: direccionForm.numero,
            colonia: direccionForm.colonia,
            municipio: direccionForm.municipio,
            cp: direccionForm.cp,
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
        message: getErrorMessage(error)
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
                  <Field label="C.P.">
                    <Input
                      value={direccionForm.cp}
                      placeholder="68000"
                      onChange={async (e) => {

                        const cp = e.target.value;

                        updateDireccion("cp", cp);

                        if (!/^\d{5}$/.test(cp)) {

                          setColonias([]);
                          setCpEncontrado(false);

                          updateDireccion("municipio", "");
                          updateDireccion("colonia", "");

                          return;
                        }

                        try {

                          setLoadingCP(true);

                          const dataCP = await buscarCPCompleto(cp);

                          setColonias(dataCP?.colonias || []);

                          if (dataCP?.municipio) {

                            setCpEncontrado(true);

                            updateDireccion(
                              "municipio",
                              dataCP.municipio
                            );

                          } else {

                            setCpEncontrado(false);

                          }

                        } catch (error) {

                          console.log(error);

                          setCpEncontrado(false);
                          setColonias([]);

                        } finally {

                          setLoadingCP(false);

                        }
                      }}
                    />
                  </Field>

                  <Field label="Municipio">

                    <Input
                      value={direccionForm.municipio}
                      disabled={
                        direccionForm.cp.length === 5 &&
                        cpEncontrado
                      }
                      placeholder={
                        cpEncontrado
                          ? "Municipio detectado automáticamente"
                          : "Escribe el municipio"
                      }
                      onChange={(e) =>
                        updateDireccion(
                          "municipio",
                          e.target.value
                        )
                      }
                    />

                  </Field>

                  <Field label="Colonia">

                    {!otraColonia ? (

                      <select
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#0E5F63]"
                        value={direccionForm.colonia}
                        disabled={loadingCP}
                        onChange={(e) => {

                          const value = e.target.value;

                          if (value === "__otra__") {

                            setOtraColonia(true);

                            updateDireccion(
                              "colonia",
                              ""
                            );

                            return;
                          }

                          updateDireccion(
                            "colonia",
                            value
                          );
                        }}
                      >

                        <option value="">
                          Seleccionar colonia...
                        </option>

                        {colonias.map((colonia) => (

                          <option
                            key={colonia}
                            value={colonia}
                          >
                            {colonia}
                          </option>

                        ))}

                        <option value="__otra__">
                          Otra colonia...
                        </option>

                      </select>

                    ) : (

                      <div className="space-y-2">

                        <Input
                          value={direccionForm.colonia}
                          placeholder="Escribe la colonia"
                          onChange={(e) =>
                            updateDireccion(
                              "colonia",
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          onClick={() => {

                            setOtraColonia(false);

                            updateDireccion(
                              "colonia",
                              ""
                            );
                          }}
                          className="text-xs text-[#0E5F63] hover:underline"
                        >
                          Volver a sugerencias
                        </button>

                      </div>

                    )}

                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Calle">
                      <Input
                        value={direccionForm.calle}
                        onChange={(e) =>
                          updateDireccion("calle", e.target.value)
                        }
                      />
                    </Field>
                  </div>
                  <Field label="Número">
                    <Input
                      value={direccionForm.numero}
                      onChange={(e) =>
                        updateDireccion("numero", e.target.value)
                      }
                    />
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