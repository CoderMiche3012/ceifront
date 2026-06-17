import { useState } from "react";
import { HiOutlineUser, HiOutlineX } from "react-icons/hi";

import { X } from "lucide-react";

import Field from "../../../../components/ui/Field";
import InputG from "../../../../components/ui/InputG";
import AlertaError from "../../../../components/ui/AlertaError";

import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";

import { useFamiliarForm } from "../../hooks/useFamiliarForm";
import { ui } from "../../../../styles/ui/index";
import Boton from "../../../../components/ui/Boton";

export default function ModalCrearFamiliar({
  open,
  onClose,
  expedienteId,
  postulanteId,
}) {

  const [resultadoModal, setResultadoModal] =
    useState({
      open: false,
      type: "success",
      title: "",
      message: "",
    });

  const {
    formData,

    handleChange,
    handleConfirm,
    validate,

    confirmOpen,
    setConfirmOpen,

    loading,

    fieldErrors,

    generalError,

  } = useFamiliarForm(
    expedienteId,
    postulanteId,
    onClose,
    setResultadoModal,
  );


  if (!open) return null;

  const parentescos = [
    "Madre",
    "Padre",
    "Hermano/a",
    "Abuelo/a",
    "Tío/a",
    "Tutor",
    "Otro",
  ];

  const handleSubmit = (e) => {

    e.preventDefault();

    if (validate()) {
      setConfirmOpen(true);
    }
  };

  const updateField = (field, value) => {
    handleChange({
      target: { name: field, value },
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setStep(1);
      onClose();
    }
  };
  const selectStyle = (error) => `
    w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200
    ${error
      ? "border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-200"
      : "border-slate-300 focus:border-[#0E5F63] focus:ring-2 focus:ring-[#0E5F63]/20 bg-white"
    }
  `;

  return (
    <>
      <div className={ui.modal.formOverlay} onClick={handleBackdropClick}>
        <div className="w-full max-w-4xl">
          <div className={ui.modal.formContainer}>

            {/* Header */}
            <div className={ui.modal.formHeader}>
              <div
                className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}
              >
                <HiOutlineUser size={24} />
              </div>

              <div className="flex-1">
                <h2 className={ui.modal.title}>
                  Agregar Familiar
                </h2>

                <p className={ui.modal.description}>
                  Complete los datos del integrante para el expediente actual.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className={ui.modal.formBody}>
              <div className={ui.modal.formScroll}>

                <AlertaError mensaje={generalError} />

                <form
                  id="familiar-form"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Field label="Nombre(s)" required error={fieldErrors.nombre} >
                      <InputG name="nombre"
                        value={formData.nombre}
                        onChange={(e) => updateField("nombre", e.target.value)}
                        placeholder="Ej. Juan"
                        error={!!fieldErrors.nombre}
                      />
                    </Field>

                    <Field
                      label="Apellido Paterno" required
                      error={fieldErrors.apellido_p}
                    >
                      <InputG
                        name="apellido_p"
                        value={formData.apellido_p}
                        onChange={(e) => updateField("apellido_p", e.target.value)}
                        error={!!fieldErrors.apellido_p}
                      />
                    </Field>

                    <Field
                      label="Apellido Materno"
                      error={fieldErrors.apellido_m}
                    >
                      <InputG
                        name="apellido_m"
                        value={formData.apellido_m}
                        onChange={(e) => updateField("apellido_m", e.target.value)}
                        error={!!fieldErrors.apellido_m}
                      />
                    </Field>

                    <Field
                      label="Parentesco" required
                      error={fieldErrors.parentesco}
                    >
                      <select
                        name="parentesco"
                        value={formData.parentesco}
                        onChange={(e) => updateField("parentesco", e.target.value)}
                        className={selectStyle(
                          !!fieldErrors.parentesco,
                        )}
                      >
                        <option value="">
                          Seleccionar...
                        </option>

                        {parentescos.map((p) => (
                          <option
                            key={p}
                            value={p}
                          >
                            {p}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      label="Fecha de nacimiento" required
                      error={fieldErrors.fecha_nacimiento}
                    >
                      <InputG
                        type="date"
                        name="fecha_nacimiento"
                        value={formData.fecha_nacimiento}
                        onChange={(e) => updateField("fecha_nacimiento", e.target.value)}
                        error={!!fieldErrors.fecha_nacimiento}
                      />
                    </Field>

                    <Field
                      label="Teléfono (10 dígitos)" required
                      error={fieldErrors.telefono}
                    >
                      <InputG
                        name="telefono"
                        value={formData.telefono}
                        onChange={(e) => updateField("telefono", e.target.value)}
                        placeholder="5512345678"
                        maxLength={10}
                        error={!!fieldErrors.telefono}
                      />
                    </Field>

                    <Field
                      label="Ocupación / Grado Escolar" required
                      error={fieldErrors.actividad_principal}
                    >
                      <InputG
                        name="actividad_principal"
                        value={
                          formData.actividad_principal
                        }
                        onChange={(e) => updateField("actividad_principal", e.target.value)}
                        placeholder="Ej. Empleado, Estudiante"
                        error={!!fieldErrors.actividad_principal}
                      />
                    </Field>


                    <Field
                      label="Salario o Escuela" required
                      error={fieldErrors.salario}
                    >
                      <InputG
                        name="salario"
                        value={formData.salario}
                        onChange={(e) => updateField("salario", e.target.value)}
                        placeholder="0.00"
                        error={!!fieldErrors.salario}
                      />
                    </Field>

                    <Field
                      label="¿Habita en el mismo domicilio?" required
                      error={
                        fieldErrors.vive_en_casa
                      }
                    >
                      <select
                        name="vive_en_casa"
                        value={formData.vive_en_casa}
                        onChange={(e) => updateField("vive_en_casa", e.target.value)}
                        className={selectStyle(
                          !!fieldErrors.vive_en_casa,
                        )}
                      >
                        <option value="">
                          Seleccionar...
                        </option>

                        <option value="true">
                          Sí, vive en casa
                        </option>

                        <option value="false">
                          No vive en casa
                        </option>
                      </select>
                    </Field>

                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className={ui.modal.formActions}>


                <Boton
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancelar
                </Boton>

                <Boton
                  form="familiar-form"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Guardando..."
                    : "Guardar Familiar"}
                </Boton>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ModalConfirmacion
        open={confirmOpen}
        title="Confirmar Registro"
        description={`¿Estás seguro de agregar a ${formData.nombre} como familiar?`}
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
        loading={loading}
        color="teal"
      />

      <ModalResultado
  open={resultadoModal.open}
  type={resultadoModal.type}
  title={resultadoModal.title}
  message={resultadoModal.message}
  onClose={() => {
    setResultadoModal({
      open: false,
      type: "",
      title: "",
      message: "",
    });

    onClose();
  }}
/>
    </>
  );
}
