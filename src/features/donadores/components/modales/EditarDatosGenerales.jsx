import { HiOutlineUser, HiCheck, HiPencilAlt } from "react-icons/hi";
import AlertaError from "../../../../components/ui/AlertaError";
import Field from "../../../../components/ui/Field";
import InputG from "../../../../components/ui/InputG";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";
import { useDonadorEditarForm } from "../../hooks/useDonadorEditarForm";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import { countries } from "../../../../utils/countries";
import { buscarCPZippopotam } from "../../services/donadoresService";


export default function EditarDatosGenerales({ open, onClose, onSuccess, donador, }) {
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
  const [cpEncontrado, setCpEncontrado] = useState(false);
  const [loadingCP, setLoadingCP] = useState(false);
  const [localidades, setLocalidades] = useState([]);
  const [otraLocalidad, setOtraLocalidad] = useState(false);
  const [otroPais, setOtroPais] = useState(false);
  const [initLoaded, setInitLoaded] = useState(false);

  const handleBuscarCP = async (cpValue, paisValue) => {
    const pais = paisValue || form.pais;

    if (!pais || !cpValue) return;

    try {
      setLoadingCP(true);

      const data = await buscarCPZippopotam(pais, cpValue);

      const lista = data?.places?.map((p) => p["place name"]) || [];

      setLocalidades(lista);

      if (lista.length > 0) {
        setForm((prev) => ({
          ...prev,
          localidad: lista[0],
          colonia: data?.places?.[0]?.state || "",
        }));

        setCpEncontrado(true);
        setOtraLocalidad(false);
      } else {
        setCpEncontrado(false);
        setOtraLocalidad(true);

        setForm((prev) => ({
          ...prev,
          localidad: "",
          colonia: "",
        }));
      }
    } catch (err) {
      setLocalidades([]);
      setCpEncontrado(false);
      setOtraLocalidad(true);
    } finally {
      setLoadingCP(false);
    }
  };

  useEffect(() => {
    if (!donador || initLoaded) return;

    const match = countries.find(
      (c) =>
        c.code === donador.pais ||
        c.name?.toLowerCase() === donador.pais?.toLowerCase()
    );

    const paisFinal = match?.code || donador.pais || "";

    setForm((prev) => ({
      ...prev,
      pais: paisFinal,
      cp: donador.cp || "",
      localidad: donador.localidad || "",
      colonia: donador.colonia || "",
    }));

    setOtroPais(false);
    setInitLoaded(true);
  }, [donador]);
  useEffect(() => {
    if (!form.cp || form.cp.length < 4) return;
    if (!form.pais) return;

    const timer = setTimeout(() => {
      handleBuscarCP(form.cp, form.pais);
    }, 500);

    return () => clearTimeout(timer);
  }, [form.cp, form.pais]);

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
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <HiOutlineExclamationCircle className="text-[#0E5F63]" size={18} />
              <span>
                Los campos con <span className="font-semibold text-red-500">*</span> son obligatorios
              </span>
            </div>
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
                  <Field label="Correo Electrónico" required>
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

                <div className="col-span-12 md:col-span-4" >
                  <Field label="Teléfono" required>
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
                  <Field label="Fecha Ingreso" required>
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
                  <Field label="País" required>
                    <select
                      className={selectClass}
                      value={otroPais ? "__otro__" : form.pais}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "__otro__") {
                          setOtroPais(true);
                          setForm((prev) => ({ ...prev, pais: "" }));
                          return;
                        }

                        setOtroPais(false);

                        const newPais = value;

                        updateField("pais", newPais);

                        updateField("cp", "");
                        updateField("localidad", "");
                        updateField("colonia", "");

                        setLocalidades([]);
                        setCpEncontrado(false);
                        setOtraLocalidad(false);
                      }}
                    >
                      <option value="">Selecciona país...</option>

                      {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}

                      <option value="__otro__">Otro país...</option>
                    </select>
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Código Postal" required>
                    <InputG
                      className={inputClass}
                      value={form.cp}
                      disabled={!form.pais && !otroPais}
                      placeholder={
                        form.pais ? "Escribe CP" : "Primero selecciona país"
                      }
                      onChange={(e) => {
                        updateField("cp", e.target.value);
                      }}
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Estado">
                    <InputG
                      className={inputClass}
                      value={form.colonia}
                      disabled={cpEncontrado}
                      placeholder={
                        cpEncontrado
                          ? "Autocompletado por CP"
                          : "Escribe estado manual"
                      }
                      onChange={(e) =>
                        updateField("colonia", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Localidad / Ciudad">
                    {!otraLocalidad && localidades.length > 0 ? (
                      <select
                        className={selectClass}
                        value={form.localidad}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value === "__otra__") {
                            setOtraLocalidad(true);
                            return;
                          }

                          updateField("localidad", value);
                        }}
                      >
                        {localidades.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}

                        <option value="__otra__">Otra localidad...</option>
                      </select>
                    ) : (
                      <div className="space-y-2">
                        <InputG
                          className={inputClass}
                          value={form.localidad}
                          onChange={(e) => updateField("localidad", e.target.value)}
                        />

                        {localidades.length > 0 && (
                          <button
                            type="button"
                            className="text-xs text-[#0E5F63] hover:underline"
                            onClick={() => {
                              setOtraLocalidad(false);
                              updateField("localidad", localidades[0]); // 🔥 vuelve a sugerencia
                            }}
                          >
                            Volver a sugerencias
                          </button>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Calle" required>
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
                  <Field label="Número" required>
                    <InputG
                      className={inputClass}
                      value={form.numero}
                      onChange={(e) =>
                        updateField("numero", e.target.value)
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