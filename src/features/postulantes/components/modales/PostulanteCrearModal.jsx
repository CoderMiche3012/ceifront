import { useState, useEffect } from "react";
import { HiOutlineUser, HiUserGroup, HiPlus,HiTrash, HiOutlineArrowLeft, HiOutlineSearch} from "react-icons/hi";
import { ui } from "../../../../styles/ui/index";
import Select from "../../../../components/ui/Select";

import AlertaError from "../../../../components/ui/AlertaError";
import Field from "../../../../components/ui/Field";
import InputG from "../../../../components/ui/InputG";
import Boton from "../../../../components/ui/Boton";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";

import { usePostulanteCrearForm } from "../../hooks/usePostulanteCrearForm";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { obtenerDireccionPorCP } from "../../../donadores/services/donadoresService";

export default function PostulanteCrearModal({ open, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [colonias, setColonias] = useState([]);
  const [cpError, setCpError] = useState("");
  const [manualAddressMode, setManualAddressMode] = useState(false);
  const [manualCountryMode, setManualCountryMode] = useState(false);
  const estadoEditable = manualAddressMode;

  const {
    form,
    setForm,
    handleChange,
    fieldErrors,
    loading,
    loadingCP,// checar
    cpEncontrado,// checar
    setLoadingCP,// chercar
    setCpEncontrado,//c
    error,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose
  } = usePostulanteCrearForm(onSuccess, onClose);

  // reestablece todos los estados a su punto original
  useEffect(() => {
    if (!open) {
      setStep(1);

      setManualAddressMode(false);
      setManualCountryMode(false);

      setCpError("");
      setColonias([]);

      setCpEncontrado(false);
    }
  }, [open, setCpEncontrado]);
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setStep(1);
      onClose();
    }
  };
  // para buscar los datos por cep
  const handleBuscarCP = async (cpValue = form.cp) => {
    if (!cpValue) return;

    try {
      setLoadingCP(true);
      setCpError("");
      const data = await obtenerDireccionPorCP(cpValue);
      const opciones = data?.opciones || [];
      // si no hay resultados
      if (opciones.length === 0) {
        setColonias([]);
        setCpError("Este código postal no está registrado consulte con el administrador");
        setCpEncontrado(false);
        updateField("estado", "");
        updateField("municipio", "");
        updateField("colonia", "");
        updateField("id_geografia", null);
        return;
      }
      setColonias(opciones);
      updateField("estado", data.estado || "");
      updateField("municipio", data.municipio || "");
      updateField("colonia", opciones[0].nombre);
      updateField("id_geografia", opciones[0].id_geografia);
      setCpEncontrado(true);
    } catch (e) {
      setColonias([]);
      setCpError("Error al consultar el código postal");

      setCpEncontrado(false);

      updateField("estado", "");
      updateField("municipio", "");
      updateField("colonia", "");
      updateField("id_geografia", null);
    } finally {
      setLoadingCP(false);
    }
  };
  const limpiarDireccionCP = () => {
    setColonias([]);
    setCpEncontrado(false);
    setCpError("");

    updateField("estado", "");
    updateField("municipio", "");
    updateField("colonia", "");
    updateField("id_geografia", null);
  };
  const updateFamiliar = (index, field, value) => {
    setForm(prev => {
      const nueva = [...prev.familia];

      nueva[index] = {
        ...nueva[index],
        [field]: value
      };

      return {
        ...prev,
        familia: nueva
      };
    });

    handleChange(`familia.${index}.${field}`, value);
  };
  const updateField = (field, value) => {
    handleChange(field, value);
  };
  return (
    <>
      <div className={ui.modal.formOverlay} onClick={handleBackdropClick} >
        <div className={ui.modal.formContainer}>
          {/* Header */}
          <div className={`${ui.modal.formHeader} relative`}>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                onClose();
              }}
              className="absolute top-5 right-6 text-2xl text-slate-400 hover:text-slate-600"
            >
              ×
            </button>


            <div className="flex items-start justify-between gap-4 pr-10">
              <div className="flex items-start gap-4">
                <div className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}>
                  {step === 1
                    ? <HiOutlineUser size={20} />
                    : <HiUserGroup size={20} />}
                </div>

                <div>
                  <h2 className={ui.modal.title}>
                    Nuevo Ingreso
                  </h2>

                  <p className={ui.modal.description}>
                    Agrega la información del nuevo postulante
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Paso {step} de 4
                    </span>

                    <div className="flex gap-1">
                      <div
                        className={`h-1 w-5 rounded-full ${step === 1 ? "bg-[#0E5F63]" : "bg-slate-200"}`}
                      />
                      <div
                        className={`h-1 w-5 rounded-full ${step === 2 ? "bg-[#0E5F63]" : "bg-slate-200"}`}
                      />
                      <div
                        className={`h-1 w-5 rounded-full ${step === 3 ? "bg-[#0E5F63]" : "bg-slate-200"}`}
                      />
                      <div
                        className={`h-1 w-5 rounded-full ${step === 4 ? "bg-[#0E5F63]" : "bg-slate-200"}`}
                      />
                    </div>
                  </div>

                </div>
              </div>


            </div>
          </div>

          <form onSubmit={handlePreSubmit} className={ui.modal.formBody}>
            {error && (
              <div className="mb-4">
                <AlertaError mensaje={error} />
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <HiOutlineExclamationCircle className="text-[#0E5F63]" size={18} />
              <span>
                Los campos con <span className="font-semibold text-red-500">*</span> son obligatorios
              </span>
            </div>
            <div className={ui.modal.formScroll}>
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em] mb-4">
                      Información Personal
                    </h3>

                    <div className={ui.modal.twoCols}>
                      <Field label="Nombre(s)" required error={fieldErrors.nombre}>
                        <InputG

                          placeholder="Ej: Juan Antonio"
                          value={form.nombre}
                          onChange={(e) => updateField("nombre", e.target.value)}
                          error={!!fieldErrors.nombre}
                        />
                      </Field>

                      <Field label="Apellido paterno" required error={fieldErrors.apellido_p}>
                        <InputG

                          placeholder="Ej: Pérez"
                          value={form.apellido_p}
                          onChange={(e) => updateField("apellido_p", e.target.value)}
                          error={!!fieldErrors.apellido_p}
                        />
                      </Field>

                      <Field label="Apellido materno" >
                        <InputG

                          placeholder="Ej: García"
                          value={form.apellido_m}
                          onChange={(e) => updateField("apellido_m", e.target.value)}
                        />
                      </Field>

                      <Field label="Correo electrónico" required error={fieldErrors.correo}>
                        <InputG

                          type="email"
                          placeholder="ejemplo@correo.com"
                          value={form.correo}
                          onChange={(e) => updateField("correo", e.target.value)}
                          error={!!fieldErrors.correo}
                        />
                      </Field>

                      <Field label="Teléfono" required error={fieldErrors.telefono}>
                        <InputG

                          placeholder="9511234567"
                          value={form.telefono}
                          onChange={(e) => updateField("telefono", e.target.value)}
                          error={!!fieldErrors.telefono}
                        />
                      </Field>

                      <Field label="Género" required error={fieldErrors.genero}>
                        <Select

                          value={form.genero}
                          onChange={(e) => updateField("genero", e.target.value)}
                          error={!!fieldErrors.genero}
                        >
                          <option value="">Elegir...</option>
                          <option value="Femenino">Femenino</option>
                          <option value="Masculino">Masculino</option>
                        </Select>
                      </Field>

                      <Field label="Fecha nacimiento" required error={fieldErrors.fecha_nacimiento}>
                        <InputG

                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          value={form.fecha_nacimiento}
                          onChange={(e) => updateField("fecha_nacimiento", e.target.value)}
                          error={!!fieldErrors.fecha_nacimiento}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em]">
                        Dirección
                      </h3>

                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs text-[#0E5F63] font-semibold hover:underline"
                        onClick={() => {
                          if (manualAddressMode) {
                            setManualAddressMode(false);
                            setManualCountryMode(false);
                            updateField("colonia", "");
                            updateField("estado", "");
                            updateField("municipio", "");
                            updateField("id_geografia", null);

                            if (form.cp?.trim()) {
                              handleBuscarCP(form.cp);
                            }
                          } else {
                            setManualAddressMode(true);
                            setCpError("");
                          }
                        }}
                      >
                        {manualAddressMode ? (
                          <>
                            <HiOutlineArrowLeft size={14} />
                            Volver a búsqueda por CP
                          </>
                        ) : (
                          "Agregar dirección manual"
                        )}
                      </button>
                    </div>

                    <div className={ui.modal.twoCols}>
                      <Field label="Código Postal" required error={fieldErrors.cp}>
                        <div
                          className={`relative rounded-md border transition  
                                                  ${cpError
                              ? "border-amber-400" : cpEncontrado ? "border-green-400"
                                : "border-slate-200 focus-within:border-[#0E5F63]"
                            }`}
                        >
                          <InputG
                            value={form.cp}
                            onChange={(e) => {
                              const value = e.target.value;
                              updateField("cp", value);
                              limpiarDireccionCP();
                            }}
                            error={!!fieldErrors.cp}
                            className="border-0 focus:ring-0 pl-9 pr-28"
                          />
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <HiOutlineSearch size={16} />
                          </div>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <button
                              type="button"
                              onClick={() => handleBuscarCP(form.cp)}
                              disabled={!form.cp || loadingCP || manualAddressMode}
                              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition
                                                        ${cpEncontrado
                                  ? "bg-green-50 text-green-600"
                                  : "bg-slate-100 text-[#0E5F63] hover:bg-slate-200"
                                }
                                                      disabled:opacity-40`}
                            >
                              {/* carga */}
                              {loadingCP ? (
                                <div className="h-3 w-3 border-2 border-[#0E5F63] border-t-transparent rounded-full animate-spin" />
                              ) : cpEncontrado ? (
                                "Encontrado"
                              ) : (
                                "Buscar"
                              )}
                            </button>
                          </div>
                        </div>

                        {/* texto informativo */}
                        {!manualAddressMode && (
                          <p className="mt-1 text-[11px] text-slate-400 text-right">
                            La búsqueda se realiza manualmente
                          </p>
                        )}
                        {/* si no se encontro el cp */}
                        {cpError && (
                          <p className="mt-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md flex items-center gap-1">
                            <HiOutlineExclamationCircle size={14} />
                            {cpError}
                          </p>
                        )}
                      </Field>
                      <Field label="Municipio" required error={fieldErrors.municipio}>
                        <InputG
                          disabled={!estadoEditable}
                          value={form.municipio || ""}
                          onChange={(e) => updateField("municipio", e.target.value)}
                          error={!!fieldErrors.municipio}
                        />
                      </Field>
                      <Field label="Colonia" required error={fieldErrors.colonia}>
                        {manualAddressMode ? (
                          <InputG
                            value={form.colonia}
                            onChange={(e) => updateField("colonia", e.target.value)}
                          />
                        ) : (
                          <Select
                            value={form.colonia || ""}
                            disabled={!cpEncontrado || colonias.length === 0 || loadingCP}
                            onChange={(e) => {
                              const colonia = colonias.find((m) => m.nombre === e.target.value);
                              updateField("colonia", e.target.value);
                              updateField("id_geografia", colonia?.id_geografia ?? null);
                            }}
                            error={!!fieldErrors.colonia}
                          >
                            <option value="">Selecciona la colonia</option>
                            {colonias.map((m) => (
                              <option key={m.id_geografia ?? m.nombre} value={m.nombre}>
                                {m.nombre}
                              </option>
                            ))}
                          </Select>
                        )}
                      </Field>

                      <Field label="Núm." required error={fieldErrors.numero}>
                        <InputG

                          placeholder="101-A"
                          value={form.numero}
                          error={!!fieldErrors.numero}
                          onChange={(e) =>
                            updateField("numero", e.target.value)
                          }
                        />
                      </Field>


                      <Field label="Calle" required error={fieldErrors.calle}>
                        <InputG

                          placeholder="Ej: Av. Independencia"
                          value={form.calle}
                          error={!!fieldErrors.calle}
                          onChange={(e) =>
                            updateField("calle", e.target.value)
                          }
                        />
                      </Field>

                      <Field label="Referencia de la dirección" required error={fieldErrors.referencia_casa}>
                        <InputG

                          value={form.referencia_casa}
                          error={!!fieldErrors.referencia_casa}
                          onChange={(e) =>
                            updateField("referencia_casa", e.target.value)
                          }
                        />
                      </Field>


                    </div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in duration-300">

                  {/* Académica */}
                  <div className="bg-slate-50/40 border border-slate-100 rounded-2xl p-5">

                    <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em] mb-4">
                      Información Académica
                    </h3>

                    <div className={ui.modal.twoCols}>
                      <Field
                        label="Nivel Escolar Inicial"
                        required
                        error={fieldErrors.nivel_escolar_inicial}
                      >
                        <Select
                          value={form.nivel_escolar_inicial}
                          error={!!fieldErrors.nivel_escolar_inicial}
                          onChange={(e) =>
                            updateField("nivel_escolar_inicial", e.target.value)
                          }
                        >
                          <option value="">Elegir...</option>
                          <option value="Preescolar">Preescolar</option>
                          <option value="Primaria">Primaria</option>
                          <option value="Secundaria">Secundaria</option>
                          <option value="Media superior">Preparatoria</option>
                          <option value="Universidad">Universidad</option>
                        </Select>
                      </Field>

                      <Field
                        label="Grado Escolar Inicial"
                        required
                        error={fieldErrors.grado_escolar_inicial}
                      >
                        <InputG
                          value={form.grado_escolar_inicial}
                          error={!!fieldErrors.grado_escolar_inicial}
                          onChange={(e) =>
                            updateField("grado_escolar_inicial", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Socioeconómica */}
                  <div className="bg-slate-50/40 border border-slate-100 rounded-2xl p-5">
                    <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em] mb-4">
                      Información Socioeconómica
                    </h3>

                    <div className={ui.modal.twoCols}>
                      <Field
                        label="Gasto de alimentacion mensual"
                        required
                        error={fieldErrors.gasto_alimentacion}
                      >
                        <InputG
                          type="number"
                          value={form.gasto_alimentacion}
                          error={!!fieldErrors.gasto_alimentacion}
                          onChange={(e) =>
                            updateField("gasto_alimentacion", e.target.value)
                          }
                        />
                      </Field>

                      <Field
                        label="Gasto de transporte mensual"
                        required
                        error={fieldErrors.gasto_transporte}
                      >
                        <InputG
                          type="number"
                          value={form.gasto_transporte}
                          error={!!fieldErrors.gasto_transporte}
                          onChange={(e) =>
                            updateField("gasto_transporte", e.target.value)
                          }
                        />
                      </Field>

                      <Field
                        label="¿Cómo conoció el programa?"
                        required
                        error={fieldErrors.referencia_ingreso}
                      >
                        <InputG
                          value={form.referencia_ingreso}
                          error={!!fieldErrors.referencia_ingreso}
                          onChange={(e) =>
                            updateField("referencia_ingreso", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </div>

                </div>
              )}
              {step === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  {/* Sección: Educación */}

                  {/* Sección: Familia */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em]">Estructura Familiar</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const nuevoIntegrante = {
                            nombre: "",
                            apellido_p: "",
                            apellido_m: "",
                            parentesco: "",
                            fecha_nacimiento: "",
                            actividad_principal: "",
                            salario: "0.00",
                            vive_en_casa: true,
                            telefono: "",
                            es_tutor_principal: false
                          };
                          const nuevaFamilia = [...(form.familia || []), nuevoIntegrante];

                          setForm(prev => ({
                            ...prev,
                            familia: nuevaFamilia
                          }));

                          handleChange("familia", nuevaFamilia);
                        }}
                        className="text-[10px] font-bold bg-[#0E5F63] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#0c5357]"
                      >
                        <HiPlus /> Registrar Ingreso
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(form.familia || []).map((fam, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl border-2 transition-all ${idx === 0 ? 'border-[#0E5F63]/20 bg-white shadow-sm' : 'border-slate-50 bg-white'}`}>
                          <div className="flex justify-between mb-4">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${idx === 0 ? 'bg-[#0E5F63] text-white' : 'bg-slate-100 text-slate-500'}`}>
                              {idx === 0 ? 'Tutor Principal' : `Integrante ${idx + 1}`}
                            </span>
                            {idx > 0 && <button type="button" onClick={() => { const n = form.familia.filter((_, i) => i !== idx); updateField("familia", n); }} className="text-red-400 hover:text-red-600"><HiTrash size={16} /></button>}
                          </div>

                          {/* Grid de 4 columnas para familia */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                            <Field label="Nombre" required error={fieldErrors[`familia.${idx}.nombre`]}><InputG placeholder="Nombre" value={fam.nombre} error={!!fieldErrors[`familia.${idx}.nombre`]} onChange={(e) => updateFamiliar(idx, "nombre", e.target.value)} /></Field>
                            <Field label="Ap. Paterno" required error={fieldErrors[`familia.${idx}.apellido_p`]}><InputG placeholder="Apellido P." value={fam.apellido_p} error={!!fieldErrors[`familia.${idx}.apellido_p`]} onChange={(e) => updateFamiliar(idx, "apellido_p", e.target.value)} /></Field>
                            <Field label="Ap. Materno" required error={fieldErrors[`familia.${idx}.apellido_m`]}><InputG placeholder="Apellido M." value={fam.apellido_m} error={!!fieldErrors[`familia.${idx}.apellido_m`]} onChange={(e) => updateFamiliar(idx, "apellido_m", e.target.value)} /></Field>
                            <Field label="Parentesco" required error={fieldErrors[`familia.${idx}.parentesco`]}>
                              <Select value={fam.parentesco} error={!!fieldErrors[`familia.${idx}.parentesco`]} onChange={(e) => updateFamiliar(idx, "parentesco", e.target.value)}>
                                <option value="">Elegir...</option>
                                <option value="Padre">Padre</option>
                                <option value="Madre">Madre</option>
                                <option value="Hermano(a)">Hermano(a)</option>
                                <option value="Abuelo(a)">Abuelo(a)</option>
                                <option value="Tío(a)">Tío(a)</option>
                                <option value="Primo(a)">Primo(a)</option>
                                <option value="Padrastro/Madrastra">Padrastro/Madrastra</option>
                                <option value="Cónyuge">Cónyuge</option>
                                <option value="Hijo(a)">Hijo(a)</option>
                              </Select>
                            </Field>
                            <Field
                              label="Fecha Nacimiento"
                              required
                              error={fieldErrors[`familia.${idx}.fecha_nacimiento`]}
                            >
                              <InputG
                                type="date"
                                max={new Date().toISOString().split("T")[0]}
                                value={fam.fecha_nacimiento || ""}
                                error={!!fieldErrors[`familia.${idx}.fecha_nacimiento`]}
                                onChange={(e) =>
                                  updateFamiliar(idx, "fecha_nacimiento", e.target.value)
                                }
                              />
                            </Field>
                            <Field label="Teléfono" error={fieldErrors[`familia.${idx}.telefono`]}><InputG placeholder="10 dígitos" value={fam.telefono} error={!!fieldErrors[`familia.${idx}.telefono`]} onChange={(e) => updateFamiliar(idx, "telefono", e.target.value)} /></Field>
                            <Field label="Ocupación o grado escolar" required error={fieldErrors[`familia.${idx}.actividad_principal`]} ><InputG placeholder="Ej: Empleado" value={fam.actividad_principal} error={!!fieldErrors[`familia.${idx}.actividad_principal`]} onChange={(e) => updateFamiliar(idx, "actividad_principal", e.target.value)} /></Field>
                            <Field label="Salario o Escuela" required error={fieldErrors[`familia.${idx}.salario`]}><InputG value={fam.salario} onChange={(e) => updateFamiliar(idx, "salario", e.target.value)} /></Field>
                            <Field label="¿Vive en casa?" required error={fieldErrors[`familia.${idx}.vive_en_casa`]}>
                              <Select value={fam.vive_en_casa} error={!!fieldErrors[`familia.${idx}.vive_en_casa`]} onChange={(e) => updateFamiliar(idx, "vive_en_casa", e.target.value === "true")}>
                                <option value="true">Sí</option>
                                <option value="false">No</option>
                              </Select>
                            </Field>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* Footer */}
            {/* Footer */}
            <div className={ui.modal.formActions}>
              <Boton
                type="button" // Evita comportamientos extraños
                variant="secondary"
                onClick={() => {
                  if (step === 1) onClose();
                  else setStep(step - 1);
                }}
              >
                {step === 1 ? "Cancelar" : "Volver"}
              </Boton>

              <Boton
                type="button" // Cambiado de submit implícito a botón controlado
                onClick={() => {
                  if (step < 4) {
                    setStep(step + 1);
                  } else {
                    handlePreSubmit(); // Controla la confirmación manualmente
                  }
                }}
                disabled={loading}
              >
                {step < 4
                  ? "Siguiente"
                  : loading
                    ? "Guardando..."
                    : "Registrar"}
              </Boton>
            </div>
          </form>
        </div >
      </div >

      <ModalConfirmacion
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title="¿Confirmar Registro?"
        message="Se creará el expediente del postulante y su estudio correspondiente."
      />

      <ModalResultado
        open={resultModal.open}
        type={resultModal.type}
        title={resultModal.title}
        message={resultModal.message}
        onClose={() => {
          if (resultModal.type === "success") {
            setStep(1); // Regresa al paso 1 para la próxima vez
          }
          handleFinalClose(); // Ejecuta la limpieza del formulario y llama a onSuccess / onClose
          onClose(); // <-- Sincronización manual: Garantiza que el padre entere el cierre
        }}
      />
    </>
  );
}




 