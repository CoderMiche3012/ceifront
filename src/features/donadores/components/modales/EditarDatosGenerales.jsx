import { useEffect, useState } from "react";
import { HiOutlinePencilAlt, HiOutlineExclamationCircle, HiOutlineArrowLeft, HiOutlineSearch } from "react-icons/hi";
import { ui } from "../../../../styles/ui/index";

import Field from "../../../../components/ui/Field";
import Input from "../../../../components/ui/InputG";
import Select from "../../../../components/ui/Select";
import Boton from "../../../../components/ui/Boton";
import AlertaError from "../../../../components/ui/AlertaError";

import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";

import { useDonadorEditarForm } from "../../hooks/useDonadorEditarForm";

import { obtenerDireccionPorCP } from "../../services/donadoresService";
import { obtenerPaises } from "../../services/donadoresService";

import { countries } from "../../../../utils/countries";
import { buildCountriesList } from "../../../../utils/buildCountriesList";

import { usePermissions } from "../../../../context/PermissionsContext";
import { obtenerUsuario } from "../../../../storage/userStorage";

export default function EditarDatosGenerales({ open, onClose, onSuccess, donador,
}) {
  const {
    form,
    setForm,
    fieldErrors,
    setFieldErrors,
    loading,
    error,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
    loadingCP,
    setLoadingCP,
    cpEncontrado,
    setCpEncontrado,
  } = useDonadorEditarForm(open, donador, onSuccess, onClose);

  const usuarioActual = obtenerUsuario();
  const puedeEditarNombre = usuarioActual?.esAdmin === true || usuarioActual?.esSuperUser === true;
  
  const [step, setStep] = useState(1);
  const [cpError, setCpError] = useState("");
  const [manualAddressMode, setManualAddressMode] = useState(false);
  const [manualCountryMode, setManualCountryMode] = useState(false);
  const [paises, setPaises] = useState([]);
  const estadoEditable = manualAddressMode;
  const [municipios, setMunicipios] = useState([]);
  const { hasModulePermission } = usePermissions();

  const canCreate = hasModulePermission("direcciones", "crear");

  useEffect(() => {
    const loadPaises = async () => {
      try {
        const api = await obtenerPaises();
        const merged = buildCountriesList(countries, api);
        setPaises(merged);
      } catch {
        setPaises(countries);
      }
    };
    loadPaises();
  }, []);
  useEffect(() => {
    if (!open) {
      setStep(1);
      setManualAddressMode(false);
      setManualCountryMode(false);
      setCpError("");
      setMunicipios([]);
      setCpEncontrado(false);
    }
  }, [open, setCpEncontrado]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const handleBuscarCP = async (cpValue = form.cp) => {
    if (!form.pais || !cpValue) return;

    try {
      setLoadingCP(true);
      setCpError("");
      const data = await obtenerDireccionPorCP(cpValue, form.pais);
      const opciones = data?.opciones || [];
      // si no hay resultados
      if (opciones.length === 0) {
        setMunicipios([]);
        setCpError("Este código postal no está registrado consulte con el administrador");
        setCpEncontrado(false);
        updateField("estado", "");
        updateField("municipio", "");
        updateField("colonia", "");
        updateField("id_geografia", null);
        return;
      }
      setMunicipios(opciones);
      updateField("estado", data.estado || "");
      updateField("colonia", data.colonia || "");
      updateField("municipio", opciones[0].nombre);
      updateField("id_geografia", opciones[0].id_geografia);
      setCpEncontrado(true);
    } catch (e) {
      setMunicipios([]);
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setStep(1);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      <div className={ui.modal.formOverlay} onClick={handleBackdropClick}>
        <div className={ui.modal.formContainer}>

          <div className={ui.modal.formHeader}>
            <div className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}>
              <HiOutlinePencilAlt size={24} />
            </div>

            <div className="flex-1">
              <h2 className={ui.modal.title}>Editar Donador</h2>

              <p className={ui.modal.description}>
                Actualiza la información del donador
              </p>

              <div className="flex items-center gap-3 mt-4">
                <span className="text-[10px] font-bold text-slate-400">
                  Paso {step} de 2
                </span>

                <div className="flex gap-1">
                  <div className={`h-1 w-5 rounded-full ${step === 1 ? "bg-[#0E5F63]" : "bg-slate-200"}`} />
                  <div className={`h-1 w-5 rounded-full ${step === 2 ? "bg-[#0E5F63]" : "bg-slate-200"}`} />
                </div>
              </div>
            </div>

            <button onClick={() => { setStep(1); onClose(); }} >
              ×
            </button>
          </div>

          <div className={ui.modal.formBody}>
            {error && (
              <div className="mb-4">
                <AlertaError mensaje={error} />
              </div>
            )}

            <div className={ui.modal.formScroll}>

              {step === 1 && (
                <>
                  <h3 className="text-xs font-bold text-[#0E5F63] mb-4 uppercase">
                    Información General
                  </h3>

                  <div className={ui.modal.twoCols}>
                    <Field label="Nombre" required error={fieldErrors.nombre}>
                      <Input value={form.nombre}
                        disabled={!puedeEditarNombre} onChange={(e) => updateField("nombre", e.target.value)} error={!!fieldErrors.nombre} />
                    </Field>

                    <Field label="Apellido paterno" required error={fieldErrors.apellido_p}>
                      <Input value={form.apellido_p}
                        disabled={!puedeEditarNombre} onChange={(e) => updateField("apellido_p", e.target.value)} error={!!fieldErrors.apellido_p} />
                    </Field>

                    <Field label="Apellido materno"  error={fieldErrors.apellido_m} >
                      <Input value={form.apellido_m}
                        disabled={!puedeEditarNombre} onChange={(e) => updateField("apellido_m", e.target.value)} error={!!fieldErrors.apellido_m} />
                    </Field>

                    <Field label="Correo" required error={fieldErrors.correo}>
                      <Input value={form.correo}
                        onChange={(e) => updateField("correo", e.target.value)} error={!!fieldErrors.correo} />
                    </Field>

                    <Field label="Teléfono" required error={fieldErrors.telefono}>
                      <Input value={form.telefono}
                        onChange={(e) => updateField("telefono", e.target.value)} error={!!fieldErrors.telefono} />
                    </Field>

                    <Field label="Origen donador" required error={fieldErrors.tipo}>
                      <Select value={form.tipo}
                        onChange={(e) => updateField("tipo", e.target.value)} error={!!fieldErrors.tipo}>
                        <option value="">Selecciona</option>
                        <option value="CEI">CEI</option>
                        <option value="OYE">OYE</option>
                        <option value="CANFRO">CANFRO</option>
                      </Select>
                    </Field>
                  </div>
                </>
              )}
              {/* PASO 2 */}
              {step ===
                2 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-[#0E5F63] uppercase tracking-wider">
                        Dirección
                      </h3>
                      {canCreate && (
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs text-[#0E5F63] font-semibold hover:underline"
                          onClick={() => {
                            if (manualAddressMode) {
                              setManualAddressMode(false);
                              setManualCountryMode(false);
                              updateField("estado", "");
                              updateField("municipio", "");
                              updateField("id_geografia", null);
                              if (form.cp?.length === 5) {
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

                    <div
                      className={ui.modal.twoCols}
                    >
                      <Field label="País" required error={fieldErrors.pais}>
                        {manualCountryMode ? (
                          // modo manual de pais
                          <div className="space-y-1">
                            <Input
                              value={form.pais}
                              onChange={(e) => updateField("pais", e.target.value)}
                              placeholder="Escribe el nombre del país"
                              error={!!fieldErrors.pais}
                            />
                            <button
                              type="button"
                              className="text-xs text-slate-500 underline block hover:text-[#0E5F63] transition-colors"
                              onClick={() => {
                                setManualCountryMode(false);
                                updateField("pais", "");
                              }}
                            >
                              <HiOutlineArrowLeft size={14} />
                              Volver a lista de países
                            </button>
                          </div>
                        ) : (
                          //  modo automatico
                          <Select
                            value={form.pais}
                            onChange={(e) => {
                              const value = e.target.value;
                              setMunicipios([]);
                              setCpEncontrado(false);
                              setCpError("");
                              updateField("cp", "");
                              updateField("estado", "");
                              updateField("municipio", "");
                              updateField("colonia", "");
                              updateField("id_geografia", null);
                              if (value === "OTHER") {
                                setManualCountryMode(true);
                                updateField("pais", "");
                              } else {
                                updateField("pais", value);
                              }
                            }}
                            error={!!fieldErrors.pais}
                          >
                            <option value="">Selecciona país</option>
                            {paises.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.name}
                              </option>
                            ))}

                            {/* para mostrar otro */}
                            {manualAddressMode && (
                              <option value="OTHER">Otro / Escribir manual</option>
                            )}
                          </Select>
                        )}
                      </Field>

                      <Field label="Código Postal" required error={fieldErrors.cp}>
                        <div
                          className={`relative rounded-md border transition
                              ${cpError
                              ? "border-amber-400"
                              : cpEncontrado
                                ? "border-green-400"
                                : "border-slate-200 focus-within:border-[#0E5F63]"
                            }
                            `}
                        >
                          <Input
                            value={form.cp}
                            onChange={(e) => {
                              const value = e.target.value;
                              updateField("cp", value);
                              setCpError("");
                              setCpEncontrado(false);
                              setMunicipios([]);
                              updateField("estado", "");
                              updateField("municipio", "");
                              updateField("colonia", "");
                              updateField("id_geografia", null);
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

                        {!manualAddressMode && (
                          <p className="mt-1 text-[11px] text-slate-400 text-right">
                            La búsqueda se realiza manualmente
                          </p>
                        )}

                        {cpError && (
                          <p className="mt-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md flex items-center gap-1">
                            <HiOutlineExclamationCircle size={14} />
                            {cpError}
                          </p>
                        )}
                      </Field>
                      <Field label="Estado" required>
                        <Input
                          disabled={!estadoEditable}
                          value={form.estado || ""}
                          onChange={(e) => updateField("estado", e.target.value)}
                        />
                      </Field>

                      <Field label="Localidad" required error={fieldErrors.municipio} >
                        {manualAddressMode ? (
                          <Input
                            value={form.municipio}
                            onChange={(e) => updateField("municipio", e.target.value)}
                          />
                        ) : municipios.length === 0 ? (
                          <Input value={form.municipio || ""} disabled />
                        ) : (
                          <Select
                            value={form.municipio || ""}
                            disabled={!cpEncontrado || loadingCP}
                            onChange={(e) => {
                              const municipio = municipios.find(
                                (m) => m.nombre === e.target.value
                              );
                              updateField("municipio", e.target.value);
                              updateField("id_geografia", municipio?.id_geografia ?? null);
                            }}
                            error={!!fieldErrors.municipio}
                          >
                            <option value="">
                              Selecciona la localidad
                            </option>

                            {municipios.map((m) => (
                              <option
                                key={m.id_geografia ?? m.nombre}
                                value={m.nombre}
                              >
                                {m.nombre}
                              </option>
                            ))}
                          </Select>
                        )}
                      </Field>
                      <Field label="Calle" required error={fieldErrors.calle} >
                        <Input
                          value={form.calle}
                          onChange={(e) => updateField("calle", e.target.value)}
                          error={!!fieldErrors.calle}
                        />
                      </Field>

                      <Field label="Número" required error={fieldErrors.numero} >
                        <Input
                          value={form.numero}
                          onChange={(e) => updateField("numero", e.target.value)}
                          error={!!fieldErrors.numero}
                        />
                      </Field>
                    </div>
                  </>
                )}
            </div>

            <div className={ui.modal.formActions}>
              <Boton
                variant="secondary"
                onClick={() => (step === 1 ? onClose() : setStep(1))}
              >
                {step === 1 ? "Cancelar" : "Atrás"}
              </Boton>

              {step === 1 ? (
                <Boton onClick={() => setStep(2)}>
                  Siguiente
                </Boton>
              ) : (
                <Boton onClick={handlePreSubmit} disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Boton>
              )}
            </div>
          </div>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="Guardar cambios"
        description={`¿Deseas actualizar a "${form.nombre}"?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmSave}
        onClose={() => setShowConfirm(false)}
        loading={loading}
        color="teal"
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

