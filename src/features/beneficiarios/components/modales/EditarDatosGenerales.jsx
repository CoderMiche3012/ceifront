import { useState, useEffect } from "react";
import {
  HiOutlineUser,
  HiUserGroup,
  HiPlus,
  HiTrash,
  HiOutlineArrowLeft,
  HiOutlineSearch
} from "react-icons/hi";


import { ui } from "../../../../styles/ui/index";
import Select from "../../../../components/ui/Select";

import AlertaError from "../../../../components/ui/AlertaError";
import Field from "../../../../components/ui/Field";
import InputG from "../../../../components/ui/InputG";
import Boton from "../../../../components/ui/Boton";

import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";

import { HiOutlineExclamationCircle } from "react-icons/hi";
import { obtenerDireccionPorCP } from "../../../donadores/services/donadoresService";
import { useBeneficiarioEditarForm } from "../../hooks/useBeneficiarioEditarForm";
import { obtenerUsuario } from "../../../../storage/userStorage";
import { usePermissions } from "../../../../context/PermissionsContext";
import loadingAnimation from "../../../../assets/imagenes/loading.json";
import Lottie from "lottie-react";

export default function BeneficiarioEditarModal({ open, data, onSuccess, onClose }) {
  const [step, setStep] = useState(1);
  const [colonias, setColonias] = useState([]);
  const [cpError, setCpError] = useState("");
  const [manualAddressMode, setManualAddressMode] = useState(false);
  const estadoEditable = manualAddressMode;
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canCreate = hasModulePermission("direcciones", "crear");

  const usuarioActual = obtenerUsuario();
  const puedeEditarNombre = usuarioActual?.esAdmin === true || usuarioActual?.esSuperUser === true;

  const {
    form,
    setForm,
    handleChange,
    fieldErrors,
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
    handleFinalClose
  } = useBeneficiarioEditarForm(open, data, onSuccess, onClose);


  useEffect(() => {
    if (!open) {
      setStep(1);
      setManualAddressMode(false);
      setCpError("");
      setColonias([]);
      setCpEncontrado(false);
    }
  }, [open, setCpEncontrado]);
  useEffect(() => {
    if (
      open &&
      form.cp &&
      form.colonia &&
      colonias.length === 0
    ) {
      handleBuscarCP(form.cp);
    }
  }, [open, form.cp]);

  if (!open) return null;

  const updateField = (field, value) => {
    handleChange(field, value);
  };


  const handleBuscarCP = async (cpValue = form.cp) => {
    if (!cpValue) return;

    try {
      setLoadingCP(true);
      setCpError("");

      const data = await obtenerDireccionPorCP(cpValue);
      const opciones = data?.opciones || [];

      if (opciones.length === 0) {
        setColonias([]);
        setCpError("Este código postal no está registrado");
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setStep(1);
      onClose();
    }
  };

  return (
    <>
      <div className={ui.modal.formOverlay} onClick={handleBackdropClick}>
        <div className={ui.modal.formContainer}>

          {/* HEADER */}
          <div className={`${ui.modal.formHeader} relative`}>
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-6 text-2xl text-slate-400 hover:text-slate-600"
            >
              ×
            </button>

            <div className="flex items-start gap-4">
              <div className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}>
                <HiOutlineUser size={20} />
              </div>

              <div>
                <h2 className={ui.modal.title}>
                  Editar Beneficiario
                </h2>

                <p className={ui.modal.description}>
                  Actualiza la información del benefiarios
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Paso {step} de 2
                  </span>

                  <div className="flex gap-1">
                    <div className={`h-1 w-5 rounded-full ${step === 1 ? "bg-[#0E5F63]" : "bg-slate-200"}`} />
                    <div className={`h-1 w-5 rounded-full ${step === 2 ? "bg-[#0E5F63]" : "bg-slate-200"}`} />
                  </div>
                </div>

              </div>
            </div>
          </div>

          <form className={ui.modal.formBody} onSubmit={handlePreSubmit}>

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

              {/* ================= STEP 1 ================= */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em] mb-4">
                      Información Personal
                    </h3>

                    <div className={ui.modal.twoCols}>
                      <Field label="Nombre(s)" required error={fieldErrors.nombre}>
                        <InputG
                          disabled={!puedeEditarNombre}
                          placeholder="Ej: Juan Antonio"
                          value={form.nombre}
                          onChange={(e) => updateField("nombre", e.target.value)}
                          error={!!fieldErrors.nombre}
                        />
                      </Field>

                      <Field label="Apellido paterno" required error={fieldErrors.apellido_p}>
                        <InputG
                          disabled={!puedeEditarNombre}
                          value={form.apellido_p}
                          onChange={(e) => updateField("apellido_p", e.target.value)}
                          error={!!fieldErrors.apellido_p}
                        />
                      </Field>

                      <Field label="Apellido materno" error={fieldErrors.apellido_m}>
                        <InputG
                          disabled={!puedeEditarNombre}
                          value={form.apellido_m}
                          onChange={(e) => updateField("apellido_m", e.target.value)}
                          error={!!fieldErrors.apellido_m}
                        />
                      </Field>

                      <Field label="Correo electrónico" required error={fieldErrors.correo}>
                        <InputG
                          type="email"
                          value={form.correo}
                          onChange={(e) => updateField("correo", e.target.value)}
                          error={!!fieldErrors.correo}
                        />
                      </Field>

                      <Field label="Teléfono" required error={fieldErrors.telefono}>
                        <InputG
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
                          disabled={!puedeEditarNombre}
                          type="date"
                          value={form.fecha_nacimiento}
                          onChange={(e) => updateField("fecha_nacimiento", e.target.value)}
                          error={!!fieldErrors.fecha_nacimiento}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STEP 2 ================= */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[10px] font-black text-[#0E5F63]/60 uppercase tracking-[0.2em]">
                        Dirección
                      </h3>
                      {canCreate && (
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs text-[#0E5F63] font-semibold hover:underline"
                          onClick={() => {
                            if (manualAddressMode) {
                              setManualAddressMode(false);
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
                      )}
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
                              updateField("cp", e.target.value);
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


                      <Field label="Calle" required error={fieldErrors.calle}>
                        <InputG
                          value={form.calle}
                          onChange={(e) => updateField("calle", e.target.value)}
                          error={!!fieldErrors.calle}
                        />
                      </Field>

                      <Field label="Número" required error={fieldErrors.numero}>
                        <InputG
                          value={form.numero}
                          onChange={(e) => updateField("numero", e.target.value)}
                          error={!!fieldErrors.numero}
                        />
                      </Field>

                    </div>
                  </div>
                </div>
              )}

              {/* ================= STEP 3 ================= */}

            </div>

            <div className={ui.modal.formActions}>

              <Boton
                type="button"
                variant="secondary"
                onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
              >
                {step === 1 ? "Cancelar" : "Volver"}
              </Boton>

              <Boton
                type="button"
                onClick={() => {
                  if (step < 2) setStep(step + 1);
                  else handlePreSubmit();
                }}
                disabled={loading}
              >
                {step < 2 ? "Siguiente" : loading ? "Guardando..." : "Guardar cambios"}
              </Boton>

            </div>

          </form>

        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title="Confirmar cambios"
        description="¿Deseas actualizar al beneficiario?"
      />
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">

          <div className="w-56">
            <Lottie animationData={loadingAnimation} loop />
          </div>

          <p className="mt-4 text-slate-600 font-medium">
              Esto puede tardar unos segundos...
          </p>

        </div>
      )}
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