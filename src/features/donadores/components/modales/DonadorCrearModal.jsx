// por corregir
import { useState } from "react";
import { HiOutlineUserCircle, HiOutlineExclamationCircle, } from "react-icons/hi";

import { ui } from "../../../../styles/ui/uiClasses";

import Field from "../../../../components/ui/Field";
import Input from "../../../../components/ui/InputG";
import Select from "../../../../components/ui/Select";
import Boton from "../../../../components/ui/Boton";
import AlertaError from "../../../../components/ui/AlertaError";

import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";

import { useDonadorCrearForm } from "../../hooks/useDonadorCrearForm";
import { buscarCPZippopotam } from "../../services/donadoresService";
import { countries } from "../../../../utils/countries";

export default function DonadorCrearModal({
  open,
  onClose,
  onSuccess,
}) {
  const [step, setStep] =
    useState(1);

  const [otroPais, setOtroPais] =
    useState(false);

  const [otraLocalidad, setOtraLocalidad] =
    useState(false);

  const [localidades, setLocalidades] =
    useState([]);

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
    handleFinalClose,
  } = useDonadorCrearForm(
    onSuccess,
    onClose
  );

  if (!open) return null;

  const updateField = (
  field,
  value
) => {
  handleChange({
    target: {
      name: field,
      value,
    },
  });
};

  const handleBackdropClick = (e) => {
    if (
      e.target ===
      e.currentTarget
    ) {
      setStep(1);
      onClose();
    }
  };

  const handleBuscarCP =
    async (
      cpValue = form.cp
    ) => {
      if (
        !form.pais ||
        !cpValue
      )
        return;

      try {
        setLoadingCP(true);

        const data =
          await buscarCPZippopotam(
            form.pais,
            cpValue
          );

        const lista =
          data?.places?.map(
            (p) =>
              p[
              "place name"
              ]
          ) || [];

        setLocalidades(
          lista
        );

        if (
          lista.length > 0
        ) {
          updateField(
            "localidad",
            lista[0]
          );

          updateField(
            "colonia",
            data?.places?.[0]
              ?.state || ""
          );

          setCpEncontrado(
            true
          );
        }
      } catch {
        setLocalidades(
          []
        );
        updateField(
          "localidad",
          ""
        );
        updateField(
          "colonia",
          ""
        );
        setCpEncontrado(
          false
        );
      } finally {
        setLoadingCP(
          false
        );
      }
    };

  return (
    <>
      <div
        className={
          ui.modal
            .formOverlay
        }
        onClick={
          handleBackdropClick
        }
      >
        <div className={ ui.modal .formContainer }>
          {/* HEADER */}
          <div
            className={
              ui.modal
                .formHeader
            }
          >
            <div
              className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}
            >
              <HiOutlineUserCircle size={24} />
            </div>

            <div className="flex-1">
              <h2 className={ui.modal.title}>
                Nuevo Donador
              </h2>

              <p
                className={
                  ui.modal
                    .description
                }
              >
                Agrega la
                información del
                nuevo donador
              </p>

              <div className="flex items-center gap-3 mt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Paso {step} de 2
                </span>

                <div className="flex gap-1">
                  <div
                    className={`h-1 w-5 rounded-full ${step === 1
                        ? "bg-[#0E5F63]"
                        : "bg-slate-200"
                      }`}
                  />
                  <div
                    className={`h-1 w-5 rounded-full ${step === 2
                        ? "bg-[#0E5F63]"
                        : "bg-slate-200"
                      }`}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setStep(1);
                onClose();
              }}
            >
              ×
            </button>
          </div>

          <div
            className={
              ui.modal
                .formBody
            }
          >
            {error && (
              <div className="mb-4">
                <AlertaError
                  mensaje={
                    error
                  }
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <HiOutlineExclamationCircle
                className="text-[#0E5F63]"
                size={18}
              />

              <span>
                Los campos
                con{" "}
                <span className="text-red-500 font-semibold">
                  *
                </span>{" "}
                son
                obligatorios
              </span>
            </div>

            <div
              className={
                ui.modal
                  .formScroll
              }
            >
              {/* PASO 1 */}
              {step ===
                1 && (
                  <>
                    <h3 className="text-xs font-bold text-[#0E5F63] mb-4 uppercase tracking-wider">
                      Información
                      General
                    </h3>

                    <div
                      className={
                        ui.modal
                          .twoCols
                      }
                    >
                      <Field label="Nombre" required error={fieldErrors.nombre}>
                        <Input
                          value={
                            form.nombre
                          }
                          onChange={(e) =>
                            updateField(
                              "nombre",
                              e.target.value
                            )
                          }
                          error={!!fieldErrors.nombre}
                        />
                      </Field>

                      <Field label="Apellido paterno" required error={fieldErrors.apellido_p}>
                        <Input
                          value={form.apellido_p}
                          onChange={(e) =>
                            updateField(
                              "apellido_p",
                              e.target.value
                            )
                          }
                          error={!!fieldErrors.apellido_p}
                        />
                      </Field>

                      <Field label="Apellido materno" required >
                        <Input
                          value={form.apellido_m}
                          onChange={(e) =>
                            updateField(
                              "apellido_m",
                              e.target.value
                            )
                          }
                        />
                      </Field>

                      <Field label="Correo" required error={fieldErrors.correo}>
                        <Input
                          type="email"
                          value={form.correo}
                          onChange={(e) =>
                            updateField(
                              "correo",
                              e.target.value
                            )
                          }
                          error={!!fieldErrors.correo}
                        />
                      </Field>

                      <Field label="Teléfono" required error={fieldErrors.telefono}>
                        <Input
                          value={form.telefono}
                          onChange={(e) =>
                            updateField(
                              "telefono",
                              e.target.value
                            )
                          }
                          error={!!fieldErrors.telefono}
                        />
                      </Field>

                      <Field label="Tipo donador" required error={fieldErrors.tipo}>
                        <Select
                          value={form.tipo}
                          onChange={(e) =>
                            updateField(
                              "tipo",
                              e.target.value
                            )
                          }
                          error={!!fieldErrors.tipo}
                        >
                          <option value="">
                            Selecciona
                          </option>
                          <option value="CEI">
                            CEI
                          </option>
                          <option value="OYE">
                            OYE
                          </option>
                          <option value="CANFRO">
                            CANFRO
                          </option>
                        </Select>
                      </Field>

                      <Field label="Fecha ingreso" required error={fieldErrors.fecha_ingreso}>
                        <Input
                          type="date"
                          value={form.fecha_ingreso}
                          onChange={(e) =>
                            updateField(
                              "fecha_ingreso",
                              e.target.value
                            )
                          }
                          error={!!fieldErrors.fecha_ingreso}
                        />
                      </Field>
                    </div>
                  </>
                )}

              {/* PASO 2 */}
              {step ===
                2 && (
                  <>
                    <h3 className="text-xs font-bold text-[#0E5F63] mb-4 uppercase tracking-wider">
                      Dirección
                    </h3>

                    <div
                      className={
                        ui.modal
                          .twoCols
                      }
                    >
                      <Field label="País" required error={fieldErrors.pais}>
                        <Select
                          value={form.pais}
                          onChange={(e) => {
                            updateField(
                              "pais",
                              e.target.value
                            );
                          }}
                          error={!!fieldErrors.pais}
                        >
                          <option value="">
                            Selecciona país
                          </option>

                          {countries.map(
                            (c) => (
                              <option
                                key={c.code}
                                value={c.code}
                              >
                                {c.name}
                              </option>
                            )
                          )}
                        </Select>
                      </Field>

                      <Field label="Código Postal" required error={fieldErrors.cp}>
                        <Input
                          value={form.cp}
                          onChange={async (
                            e
                          ) => {
                            const cp =
                              e.target
                                .value;

                            updateField(
                              "cp",
                              cp
                            );

                            if (
                              cp.length ===
                              5
                            ) {
                              await handleBuscarCP(
                                cp
                              );
                            }
                          }}
                          error={!!fieldErrors.cp}
                        />
                      </Field>

                      <Field label="Estado" >
                        <Input
                          disabled={
                            cpEncontrado
                          }
                          value={
                            form.colonia
                          }
                          onChange={(e) =>
                            updateField(
                              "colonia",
                              e.target
                                .value
                            )
                          }
                      
                        />
                      </Field>

                      <Field
                        label="Localidad"
                        required
                        error={fieldErrors.localidad}
                      >
                        <Input
                          value={
                            form.localidad
                          }
                          onChange={(e) =>
                            updateField(
                              "localidad",
                              e.target
                                .value
                            )
                          }
                          error={!!fieldErrors.localidad}
                        />
                      </Field>

                      <Field
                        label="Calle"
                        required
                        error={fieldErrors.calle}
                      >
                        <Input
                          value={
                            form.calle
                          }
                          onChange={(e) =>
                            updateField(
                              "calle",
                              e.target
                                .value
                            )
                          }
                          error={!!fieldErrors.calle}
                        />
                      </Field>

                      <Field
                        label="Número"
                        required
                        error={fieldErrors.numero}
                      >
                        <Input
                          value={
                            form.numero
                          }
                          onChange={(e) =>
                            updateField(
                              "numero",
                              e.target
                                .value
                            )
                          }
                          error={!!fieldErrors.numero}
                        />
                      </Field>
                    </div>
                  </>
                )}
            </div>

            <div
              className={
                ui.modal
                  .formActions
              }
            >
              <Boton
                variant="secondary"
                onClick={() =>
                  step ===
                    1
                    ? onClose()
                    : setStep(
                      1
                    )
                }
              >
                {step ===
                  1
                  ? "Cancelar"
                  : "Atrás"}
              </Boton>

              {step ===
                1 ? (
                <Boton
                  onClick={() =>
                    setStep(
                      2
                    )
                  }
                >
                  Siguiente
                </Boton>
              ) : (
                <Boton
                  onClick={
                    handlePreSubmit
                  }
                  disabled={
                    loading
                  }
                >
                  {loading
                    ? "Guardando..."
                    : "Registrar"}
                </Boton>
              )}
            </div>
          </div>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="Registrar Donador"
        description={`¿Deseas crear a "${form.nombre}"?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={
          handleConfirmSave
        }
        onClose={() =>
          setShowConfirm(
            false
          )
        }
        loading={loading}
        color="teal"
      />

      <ModalResultado
        open={
          resultModal.open
        }
        type={
          resultModal.type
        }
        title={
          resultModal.title
        }
        message={
          resultModal.message
        }
        onClose={
          handleFinalClose
        }
      />
    </>
  );
}