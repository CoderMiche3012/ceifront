import { HiOutlineUserCircle } from "react-icons/hi";

import { ui } from "../../../../styles/ui/uiClasses";
import Field from "../../../../components/ui/Field";
import Input from "../../../../components/ui/InputG";
import Select from "../../../../components/ui/Select";
import PasswordInput from "../../../../components/ui/PasswordInput";
import Boton from "../../../../components/ui/Boton";
import AlertaError from "../../../../components/ui/AlertaError";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import { obtenerUsuario } from "../../../../storage/userStorage";

import { useUsuarioForm } from "../../hooks/useUsuarioForm";

export default function UsuarioModal({
  open,
  mode = "create",
  user,
  roles = [],
  onClose,
  onSuccess,
  onNoChanges,
}) {
  // estado y logica
  const isEdit = mode === "edit";
  const {
    formData,
    fieldErrors,
    generalError,
    loading,
    isConfirming,
    setIsConfirming,
    roleOptions,
    handleChange,
    handleSubmit,
    handleClose,
  } = useUsuarioForm({
    mode,
    open,
    user,
    roles,
    onClose,
    onSuccess,
    onNoChanges,
  });

  const usuarioActual = obtenerUsuario();
  const puedeCrearTodo = usuarioActual?.esSuperUser === true;
  const rolesDisponibles = puedeCrearTodo
  ? roleOptions
  : roleOptions.filter(
      (rol) => rol.label !== "Administrador"
    );
  //ocultar modal
  if (!open) return null;
  //Cierre al hacer clic fuera
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className={ui.modal.formOverlay} onClick={handleBackdropClick}>
      <div className={ui.modal.formContainer}>

        <div className={ui.modal.formHeader}>
         <div className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`} >
            <HiOutlineUserCircle size={24} />
          </div>

          <div className="flex-1">
            <h2 className={ui.modal.title}>
              {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>

            <p className={ui.modal.description}>
              {isEdit
                ? "Actualiza la información del usuario"
                : "Agrega la informacion del nuevo usuario"}
            </p>
          </div>

          <button onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={ui.modal.formBody}>

          {generalError && (
            <div className="mb-4">
              <AlertaError mensaje={generalError} />
            </div>
          )}

          <div className={ui.modal.formScroll}>
            <div className={ui.modal.twoCols}>
              <Field
                label="Nombre"
                required
                error={fieldErrors.nombre}
              >
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={!!fieldErrors.nombre}
                  placeholder="Ej. Juan"
                />
              </Field>

              <Field
                label="Apellido paterno"
                required
                error={fieldErrors.apellido_p}
              >
                <Input
                  name="apellido_p"
                  value={formData.apellido_p}
                  onChange={handleChange}
                  error={!!fieldErrors.apellido_p}
                  placeholder="Ej. Pérez"
                />
              </Field>

              <Field label="Apellido materno">
                <Input
                  name="apellido_m"
                  value={formData.apellido_m}
                  onChange={handleChange}
                  placeholder="Ej. López"
                />
              </Field>

              <Field
                label="Correo"
                required
                error={fieldErrors.correo}
              >
                <Input
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  error={!!fieldErrors.correo}
                  placeholder="correo@ejemplo.com"
                />
              </Field>

              <Field label="Teléfono">
                <Input
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej. 9511111111"
                />
              </Field>

              <Field
                label="Usuario"
                required
                error={fieldErrors.nom_usuario}
              >
                <Input
                  name="nom_usuario"
                  value={formData.nom_usuario}
                  onChange={handleChange}
                  error={!!fieldErrors.nom_usuario}
                  placeholder="Ej. Juan1"
                />
              </Field>

              <Field
                label="Rol"
                required
                error={fieldErrors.id_rol}
              >
                <Select
                  name="id_rol"
                  value={formData.id_rol}
                  onChange={handleChange}
                  error={!!fieldErrors.id_rol}
                >
                  <option value="">
                    Selecciona un rol
                  </option>

                  {rolesDisponibles.map((rol) => (
                    <option
                      key={rol.value}
                      value={rol.value}
                    >
                      {rol.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <PasswordInput
                label={
                  isEdit
                    ? "Nueva contraseña"
                    : "Contraseña"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
                required={!isEdit}
                placeholder={
                  isEdit
                    ? "Déjalo vacío si no cambia"
                    : "Mínimo 8 caracteres"
                }
              />

              <PasswordInput
                label="Confirmar contraseña"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                error={fieldErrors.confirm_password}
                required={!isEdit}
                placeholder="Repite la contraseña"
              />
            </div>
          </div>

          <div className={ui.modal.formActions}>
            <Boton variant="secondary" onClick={onClose}>
              Cancelar
            </Boton>

            <Boton type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Boton>
          </div>
        </form>
      </div>

      <ModalConfirmacion
        open={isConfirming}
        title={isEdit ? "Guardar Cambios" : "Registrar Nuevo Usuario"}
        description={isEdit ? `¿Deseas actualizar al usuario "${formData.nombre}"?` : `¿Deseas crear al usuario "${formData.nombre}"?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleSubmit}
        onClose={() => setIsConfirming(false)}
        loading={loading}
        color="teal"
      />
    </div>
  );
}
