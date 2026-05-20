import { useState } from "react";
import { HiOutlineUser, HiCheck } from "react-icons/hi";
import AlertaError from "../../../../components/ui/AlertaError";
import Field from "../../../../components/ui/Field";
import InputG from "../../../../components/ui/InputG";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";
import { useDonadorCrearForm } from "../../hooks/useDonadorCrearForm";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { buscarCPZippopotam } from "../../services/donadoresService";
import { countries } from "../../../../utils/countries";

export default function DonadorCrearModal({ open, onClose, onSuccess }) {
  const {
    form,
    setForm,
    loading,
    loadingCP,
    cpEncontrado,
    setLoadingCP,
    setCpEncontrado,
    error,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  } = useDonadorCrearForm(onSuccess, onClose);
  const [otroPais, setOtroPais] = useState(false);
  const [otraLocalidad, setOtraLocalidad] = useState(false);

  const [localidades, setLocalidades] = useState([]);


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
  const handleBuscarCP = async (cpValue = form.cp) => {
    if (!form.pais || !cpValue) return;

    try {
      setLoadingCP(true);

      const data = await buscarCPZippopotam(
        form.pais,
        cpValue
      );

      const lista =
        data?.places?.map(
          p => p["place name"]
        ) || [];

      setLocalidades(lista);

      if (lista.length > 0) {
        updateField("localidad", lista[0]);
        updateField(
          "colonia",
          data?.places?.[0]?.state || ""
        );
        setCpEncontrado(true);
      }

    } catch (error) {
      setLocalidades([]);
      updateField("localidad", "");
      updateField("colonia", "");
      setCpEncontrado(false); // importante
    } finally {
      setLoadingCP(false);
    }
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

          {/* Header */}
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0E5F63]">
                <HiOutlineUser size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Registrar Donador
                </h2>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">
                  Nuevo registro
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
            {/* Datos generales */}
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
                      onChange={(e) => updateField("nombre", e.target.value)}
                    />
                  </Field>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <Field label="Apellido Paterno" required>
                    <InputG
                      className={inputClass}
                      value={form.apellido_p}
                      onChange={(e) => updateField("apellido_p", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Apellido Materno" required>
                    <InputG
                      className={inputClass}
                      value={form.apellido_m}
                      onChange={(e) => updateField("apellido_m", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Correo Electrónico" required>
                    <InputG
                      type="email"
                      className={inputClass}
                      value={form.correo}
                      onChange={(e) => updateField("correo", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Teléfono" required>
                    <InputG
                      className={inputClass}
                      value={form.telefono}
                      onChange={(e) => updateField("telefono", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="col-span-12 md:col-span-4">
                  <Field label="Tipo Donador" required>
                    <select
                      className={selectClass}
                      value={form.tipo}
                      onChange={(e) => updateField("tipo", e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="CEI">CEI</option>
                      <option value="OYE">OYE</option>
                      <option value="CANFRO">CANFRO </option>
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

                {/* PAÍS */}
                <div className="col-span-12 md:col-span-4">
                  <Field label="País" required>
                    {!otroPais ? (
                      <select
                        className={selectClass}
                        value={form.pais}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value === "__otro__") {
                            setOtroPais(true);
                            updateField("pais", "");
                            return;
                          }

                          updateField("pais", value); 
                          updateField("cp", "");
                          updateField("localidad", "");
                          updateField("colonia", "");
                          setLocalidades([]);
                          setCpEncontrado(false);
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
                    ) : (
                      <div className="space-y-2">
                        <InputG
                          className={inputClass}
                          value={form.pais}
                          placeholder="Escribe el país"
                          onChange={(e) =>
                            updateField("pais", e.target.value)
                          }
                        />

                        <button
                          type="button"
                          className="text-xs text-[#0E5F63] hover:underline"
                          onClick={() => {
                            setOtroPais(false);
                            updateField("pais", "");
                          }}
                        >
                          Volver a lista
                        </button>
                      </div>
                    )}
                  </Field>
                </div>


                {/* CP */}
                <div className="col-span-12 md:col-span-4">
                  <Field label="Código Postal" required>
                    <InputG
                      className={inputClass}
                      disabled={!form.pais}
                      placeholder={
                        form.pais
                          ? "Escribe el CP"
                          : "Primero selecciona país"
                      }
                      value={form.cp}
                      onChange={async (e) => {
                        const cp = e.target.value;

                        updateField("cp", cp);

                        if (!cp) {
                          setLocalidades([]);
                          updateField("localidad", "");
                          updateField("colonia", "");
                          setCpEncontrado(false);
                          return;
                        }

                        // espera 5 caracteres
                        if (cp.length === 5) {
                          await handleBuscarCP(cp);
                        }
                      }}
                    />
                  </Field>
                </div>


                {/* ESTADO (se guarda en colonia) */}
                <div className="col-span-12 md:col-span-4">
                  <Field label="Estado">
                    <InputG
                      className={inputClass}
                      value={form.colonia}
                      disabled={cpEncontrado}
                      placeholder={
                        cpEncontrado
                          ? "Autocompletado"
                          : "Escribe el estado"
                      }
                      onChange={(e) =>
                        updateField("colonia", e.target.value)
                      }
                    />
                  </Field>
                </div>


                {/* LOCALIDAD */}
                <div className="col-span-12 md:col-span-4">
                  <Field label="Localidad / Ciudad" required>
                    {!otraLocalidad && localidades.length > 0 ? (
                      <select
                        className={selectClass}
                        value={form.localidad}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value === "__otra__") {
                            setOtraLocalidad(true);
                            updateField("localidad", "");
                            return;
                          }

                          updateField("localidad", value);
                        }}
                      >
                        {localidades.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}

                        <option value="__otra__">
                          Otra localidad...
                        </option>
                      </select>
                    ) : (
                      <div className="space-y-2">
                        <InputG
                          className={inputClass}
                          value={form.localidad}
                          placeholder="Escribe localidad"
                          onChange={(e) =>
                            updateField(
                              "localidad",
                              e.target.value
                            )
                          }
                        />

                        {localidades.length > 0 && (
                          <button
                            type="button"
                            className="text-xs text-[#0E5F63] hover:underline"
                            onClick={() => {
                              setOtraLocalidad(false);
                              updateField(
                                "localidad",
                                localidades[0]
                              );
                            }}
                          >
                            Volver a sugerencias
                          </button>
                        )}
                      </div>
                    )}
                  </Field>
                </div>


                {/* CALLE */}
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


                {/* NÚMERO */}
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

          {/* Footer */}
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
              {loading ? "Guardando..." : "Registrar Donador"}
              <HiCheck />
            </button>
          </div>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="¿Registrar donador?"
        description="Se guardará la información del nuevo donador."
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