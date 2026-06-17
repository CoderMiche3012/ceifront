import { X } from "lucide-react";

import Field from "../../../../components/ui/Field";
import InputG from "../../../../components/ui/InputG";
import AlertaError from "../../../../components/ui/AlertaError";

import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";

import { useEditarFamiliar } from "../../hooks/useEditarFamiliar";

import { HiOutlineUser, HiOutlineX } from "react-icons/hi";
import { ui } from "../../../../styles/ui/index";
import Boton from "../../../../components/ui/Boton";

export default function ModalEditarFamiliar({
  open,
  onClose,
  editando,
  setEditando,
  loading = false,
}) {

  const {
    handleChange,
    handleConfirm,
    validate,
    confirmOpen,
    setConfirmOpen,
    fieldErrors,
    generalError,
    fieldRefs,

    resultOpen,
    resultType,
    resultTitle,
    resultMessage,
    handleCloseResult,
  } = useEditarFamiliar(
    editando,
    setEditando,
    onClose,
  );

  if (!open || !editando) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setConfirmOpen(true);
    }
  };
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setStep(1);
      onClose();
    }
  };
  const selectStyle = (error) => `
    w-full rounded-xl border px-4 py-3 text-sm transition-all
    ${error
      ? "border-rose-400 bg-rose-50"
      : "border-slate-300 focus:border-[#0E5F63] focus:ring-2 focus:ring-[#0E5F63]/20 bg-white"
    }
  `;

  return (
    <div className={ui.modal.formOverlay} onClick={handleBackdropClick}>

      <div className="w-full max-w-4xl">
        <div className={ui.modal.formContainer}>
          {/* HEADER */}
          <div className={ui.modal.formHeader}>
            <div
              className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}
            >
              <HiOutlineUser size={24} />
            </div>

            <div className="flex-1">
              <h2 className={ui.modal.title}>
                Editar Familiar
              </h2>

              <p className={ui.modal.description}>
                Modifica los datos del familiar seleccionado
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition"
            >
              <HiOutlineX size={20} />
            </button>
          </div>

          {/* BODY */}
          <div className={ui.modal.formBody}>
            <div className={ui.modal.formScroll}>

              <AlertaError mensaje={generalError} />

              <form
                id="edit-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >

                <Field
                  required
                  label="Nombre "
                  error={fieldErrors.nombre}
                >
                  <InputG
                    name="nombre"
                    value={editando.nombre || ""}
                    onChange={handleChange}
                    error={!!fieldErrors.nombre}
                    ref={(el) =>
                      (fieldRefs.current.nombre = el)
                    }
                  />
                </Field>

                <Field
                  required
                  label="Apellido Paterno"
                  error={fieldErrors.apellido_p}
                >
                  <InputG
                    name="apellido_p"
                    value={editando.apellido_p || ""}
                    onChange={handleChange}
                    error={!!fieldErrors.apellido_p}
                  />
                </Field>

                <Field
                  required
                  label="Apellido Materno"
                  error={fieldErrors.apellido_m}
                >
                  <InputG
                    name="apellido_m"
                    value={editando.apellido_m || ""}
                    onChange={handleChange}
                    error={!!fieldErrors.apellido_m}
                  />
                </Field>

                <Field
                  required
                  label="Parentesco"
                  error={fieldErrors.parentesco}
                >
                  <select
                    name="parentesco"
                    value={editando.parentesco || ""}
                    onChange={handleChange}
                    className={selectStyle(
                      fieldErrors.parentesco
                    )}
                  >
                    <option value="">
                      Elegir...
                    </option>

                    <option value="Madre">
                      Madre
                    </option>

                    <option value="Padre">
                      Padre
                    </option>

                    <option value="Hermano/a">
                      Hermano/a
                    </option>

                    <option value="Abuelo/a">
                      Abuelo/a
                    </option>

                    <option value="Tutor">
                      Tutor
                    </option>

                    <option value="Otro">
                      Otro
                    </option>
                  </select>
                </Field>

                <Field
                  required
                  label="Fecha de nacimiento"
                  error={fieldErrors.fecha_nacimiento}
                >
                  <InputG
                    type="date"
                    name="fecha_nacimiento"
                    value={
                      editando.fecha_nacimiento || ""
                    }
                    onChange={handleChange}
                    error={
                      !!fieldErrors.fecha_nacimiento
                    }
                  />
                </Field>

                <Field
                  required
                  label="Teléfono"
                  error={fieldErrors.telefono}
                >
                  <InputG
                    name="telefono"
                    value={editando.telefono || ""}
                    onChange={handleChange}
                    error={!!fieldErrors.telefono}
                  />
                </Field>

                <Field
                  required
                  label="Ocupación o grado escolar"
                  error={fieldErrors.actividad_principal}
                >
                  <InputG
                    required
                    name="actividad_principal"
                    value={
                      editando.actividad_principal ||
                      ""
                    }
                    onChange={handleChange}
                    error={
                      !!fieldErrors.actividad_principal
                    }
                  />
                </Field>

                <Field
                  required
                  label="Salario / Escuela"
                  error={fieldErrors.salario}
                >
                  <InputG
                    required
                    name="salario"
                    value={editando.salario || ""}
                    onChange={handleChange}
                    error={!!fieldErrors.salario}
                  />
                </Field>

                <Field
                  required
                  label="¿Vive en casa? *"
                  error={fieldErrors.vive_en_casa}
                >
                  <select
                    name="vive_en_casa"
                    value={String(
                      editando.vive_en_casa ?? ""
                    )}
                    onChange={handleChange}
                    className={selectStyle(
                      fieldErrors.vive_en_casa
                    )}
                  >
                    <option value="">
                      Elegir...
                    </option>

                    <option value="true">
                      Sí
                    </option>

                    <option value="false">
                      No
                    </option>
                  </select>
                </Field>

              </form>
            </div>

            {/* FOOTER */}
            <div className={ui.modal.formActions}>
              <Boton
                variant="secondary"
                onClick={onClose}
              >
                Cancelar
              </Boton>

              <Boton
                form="edit-form"
                type="submit"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Boton>
            </div>
          </div>

          {/* CONFIRM */}
          <ModalConfirmacion
            open={confirmOpen}
            title="Confirmar cambios"
            description={`¿Guardar cambios de ${editando.nombre}?`}
            onConfirm={handleConfirm}
            onClose={() => setConfirmOpen(false)}
            loading={loading}
          />

          {/* RESULT */}
          <ModalResultado
            open={resultOpen}
            type={resultType}
            title={resultTitle}
            message={resultMessage}
            onClose={handleCloseResult}
          />
        </div>
      </div>
    </div>
  );
}