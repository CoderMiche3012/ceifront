import { useState } from "react";
import {
  HiOutlineUser,
  HiUserGroup,
  HiPlus,
  HiTrash,
  HiArrowRight,
  HiCheck
} from "react-icons/hi";
import { ui } from "../../../../styles/ui/uiClasses";
import Select from "../../../../components/ui/Select";

import AlertaError from "../../../../components/ui/AlertaError";
import Field from "../../../../components/ui/Field";
import InputG from "../../../../components/ui/InputG";
import Boton from "../../../../components/ui/Boton";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";

import { usePostulanteCrearForm } from "../../hooks/usePostulanteCrearForm";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { buscarCPCompleto } from "../../../expedientes/services/expedientesService";


export default function PostulanteCrearModal({ open, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [colonias, setColonias] = useState([]);
  const [loadingCP, setLoadingCP] = useState(false);
  const [cpEncontrado, setCpEncontrado] = useState(false);
  const [otraColonia, setOtraColonia] = useState(false);

  const {
    form,
    setForm,
    handleChange,
    fieldErrors,
    loading,
    error,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose
  } = usePostulanteCrearForm(onSuccess, onClose);
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (
      e.target ===
      e.currentTarget
    ) {
      setStep(1);
      onClose();
    }
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
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Paso {step} de 3
                </span>

                <div className="flex gap-1 mt-2 justify-end">
                  <div className={`h-1 w-8 rounded-full ${step >= 1 ? "bg-[#0E5F63]" : "bg-slate-200"}`} />
                  <div className={`h-1 w-8 rounded-full ${step >= 2 ? "bg-[#0E5F63]" : "bg-slate-200"}`} />
                  <div className={`h-1 w-8 rounded-full ${step >= 3 ? "bg-[#0E5F63]" : "bg-slate-200"}`} />
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
                    <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em] mb-4">
                      Dirección
                    </h3>

                    <div className={ui.modal.twoCols}>

                      <Field label="CP" required error={fieldErrors.cp}>
                        <InputG

                          placeholder="68000"
                          value={form.cp}
                          error={!!fieldErrors.cp}
                          onChange={async (e) => {
                            const cp = e.target.value;
                            updateField("cp", cp);

                            if (!/^\d{5}$/.test(cp)) {
                              setColonias([]);
                              updateField("municipio", "");
                              updateField("colonia", "");
                              setOtraColonia(false);
                              setCpEncontrado(false);
                              return;
                            }

                            try {
                              setLoadingCP(true);

                              const data = await buscarCPCompleto(cp);

                              if (data?.municipio) {
                                updateField("municipio", data.municipio);
                                setCpEncontrado(true);
                              } else {
                                setCpEncontrado(false);
                              }

                              setColonias(data?.colonias || []);
                            } catch (error) {
                              console.log(error);
                              setCpEncontrado(false);
                              setColonias([]);
                            } finally {
                              setLoadingCP(false);
                            }
                          }


                          }
                        />
                      </Field>

                      <Field label="Municipio" required error={fieldErrors.municipio}>
                        <InputG

                          disabled={form.cp.length !== 5 || cpEncontrado}
                          placeholder={
                            form.cp.length !== 5
                              ? "Primero ingresa CP"
                              : cpEncontrado
                                ? "Municipio detectado automáticamente"
                                : "Escribe el municipio"
                          }
                          value={form.municipio}
                          error={!!fieldErrors.municipio}
                          onChange={(e) =>
                            updateField("municipio", e.target.value)
                          }
                        />
                      </Field>

                      <Field label="Colonia" required error={fieldErrors.colonia}>
                        {!otraColonia ? (
                          <Select

                            disabled={form.cp.length !== 5}
                            value={form.colonia}
                            error={!!fieldErrors.colonia}
                            onChange={(e) => {
                              const value = e.target.value;

                              if (value === "__otra__") {
                                setOtraColonia(true);
                                updateField("colonia", "");
                                return;
                              }

                              updateField("colonia", value);
                            }}
                          >
                            <option value="">Seleccionar colonia...</option>

                            {colonias.map((colonia) => (
                              <option key={colonia} value={colonia}>
                                {colonia}
                              </option>
                            ))}

                            <option value="__otra__">
                              Otra colonia...
                            </option>
                          </Select>
                        ) : (
                          <div className="space-y-2">
                            <InputG

                              placeholder="Escribe la colonia"
                              value={form.colonia}
                              error={!!fieldErrors.colonia}
                              onChange={(e) =>
                                updateField("colonia", e.target.value)
                              }
                            />

                            <button
                              type="button"
                              onClick={() => {
                                setOtraColonia(false);
                                updateField("colonia", "");
                              }}
                              className="text-xs text-[#0E5F63] hover:underline"
                            >
                              Volver a sugerencias
                            </button>
                          </div>
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

                      <Field
                        label="Referencia de ingreso o como conoció el programa"
                        required error={fieldErrors.referencia_ingreso}
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
              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  {/* Sección: Educación */}
                  <div>
                    <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em] mb-4">Información Académica</h3>
                    <div className={`${ui.modal.twoCols} bg-[#0E5F63]/5 p-5 rounded-2xl border border-[#0E5F63]/10`}>
                      <Field label="Nivel Escolar Inicial" required error={fieldErrors.nivel_escolar_inicial}>
                        <Select

                          value={form.nivel_escolar_inicial}
                          error={!!fieldErrors.nivel_escolar_inicial}
                          onChange={(e) =>
                            updateField(
                              "nivel_escolar_inicial",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Elegir...</option>
                          <option value="Preescolar">Preescolar</option>
                          <option value="Primaria">Primaria</option>
                          <option value="Secundaria">Secundaria</option>
                          <option value="Preparatoria">Preparatoria</option>
                          <option value="Universidad">Universidad</option>
                        </Select>
                      </Field>

                      <Field label="Grado Escolar Inicial" required error={fieldErrors.grado_escolar_inicial}>
                        <InputG

                          placeholder="Ej: 1°"
                          value={form.grado_escolar_inicial}
                          error={!!fieldErrors.grado_escolar_inicial}
                          onChange={(e) =>
                            updateField(
                              "grado_escolar_inicial",
                              e.target.value
                            )
                          }
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Sección: Familia */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em]">Estructura Familiar</h3>
                      <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em]">Los familiares son modificables</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const nuevoIntegrante = {
                            nombre: "",
                            apellido_p: "",
                            apellido_m: "",
                            parentesco: "",
                            fecha_nacimiento: "",
                            edad: "",
                            actividad_principal: "",
                            area_laboral_escuela: "",
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
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3">
                            <Field label="Nombre" required error={fieldErrors[`familia.${idx}.nombre`]}><InputG placeholder="Nombre" value={fam.nombre} error={!!fieldErrors[`familia.${idx}.nombre`]} onChange={(e) => updateFamiliar(idx, "nombre", e.target.value)} /></Field>
                            <Field label="Ap. Paterno" required error={fieldErrors[`familia.${idx}.apellido_p`]}><InputG placeholder="Apellido P." value={fam.apellido_p} error={!!fieldErrors[`familia.${idx}.apellido_p`]} onChange={(e) => updateFamiliar(idx, "apellido_p", e.target.value)} /></Field>
                            <Field label="Ap. Materno" required error={fieldErrors[`familia.${idx}.apellido_m`]}><InputG placeholder="Apellido M." value={fam.apellido_m} error={!!fieldErrors[`familia.${idx}.apellido_m`]} onChange={(e) => updateFamiliar(idx, "apellido_m", e.target.value)} /></Field>
                            <Field label="Parentesco" required error={fieldErrors[`familia.${idx}.parentesco`]}>
                              <Select value={fam.parentesco} error={!!fieldErrors[`familia.${idx}.parentesco`]} onChange={(e) => updateFamiliar(idx, "parentesco", e.target.value)}>
                                <option value="">Elegir...</option>
                                <option value="Padre">Padre</option><option value="Madre">Madre</option><option value="Abuelo/a">Abuelo/a</option><option value="Tío/a">Tío/a</option>
                              </Select>
                            </Field>
                            <Field label="Fecha Nacimiento" required error={fieldErrors[`familia.${idx}.fecha_nacimiento`]}>
                              <InputG
                                type="date"
                                max={new Date().toISOString().split("T")[0]}
                                value={fam.fecha_nacimiento || ""}
                                error={!!fieldErrors[`familia.${idx}.fecha_nacimiento`]}
                                onChange={(e) => {

                                  const fecha = e.target.value;

                                  const hoy = new Date();
                                  const nacimiento = new Date(fecha);

                                  let edad =
                                    hoy.getFullYear() -
                                    nacimiento.getFullYear();

                                  const mes =
                                    hoy.getMonth() -
                                    nacimiento.getMonth();

                                  if (
                                    mes < 0 ||
                                    (mes === 0 &&
                                      hoy.getDate() < nacimiento.getDate())
                                  ) {
                                    edad--;
                                  }

                                  updateFamiliar(idx, "fecha_nacimiento", fecha);
                                  updateFamiliar(idx, "edad", edad);
                                }}
                              />
                            </Field>
                            <Field label="Teléfono" error={fieldErrors[`familia.${idx}.telefono`]}><InputG placeholder="10 dígitos" value={fam.telefono} error={!!fieldErrors[`familia.${idx}.telefono`]} onChange={(e) => updateFamiliar(idx, "telefono", e.target.value)} /></Field>
                            <Field label="Actividad" required error={fieldErrors[`familia.${idx}.actividad_principal`]} ><InputG placeholder="Ej: Empleado" value={fam.actividad_principal} error={!!fieldErrors[`familia.${idx}.actividad_principal`]} onChange={(e) => updateFamiliar(idx, "actividad_principal", e.target.value)} /></Field>
                            <Field label="Lugar Trabajo/Esc."><InputG placeholder="Nombre Empresa/Esc." value={fam.area_laboral_escuela} onChange={(e) => updateFamiliar(idx, "area_laboral_escuela", e.target.value)} /></Field>
                            <Field label="Salario Mensual"><InputG type="number" placeholder="0.00" value={fam.salario} onChange={(e) => updateFamiliar(idx, "salario", e.target.value)} /></Field>
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
                  if (step < 3) {
                    setStep(step + 1);
                  } else {
                    handlePreSubmit(); // Controla la confirmación manualmente
                  }
                }}
                disabled={loading}
              >
                {step < 3
                  ? "Siguiente"
                  : loading
                    ? "Guardando..."
                    : "Registrar"}
              </Boton>
            </div>
          </form>
        </div>
      </div>

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


