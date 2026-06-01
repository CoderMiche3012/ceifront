const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalize = (v) => typeof v === "string" ? v.trim() : v ?? "";

export function validateUsuarioForm(formData, isEdit) {
  const errors = {};
  const nombre = normalize(formData.nombre);
  const apellido_p = normalize(formData.apellido_p);
  const correo = normalize(formData.correo);
  const nom_usuario = normalize(formData.nom_usuario);
  const id_rol = normalize(formData.id_rol);
  const password = normalize(formData.password);
  const confirm = normalize(formData.confirm_password);

  if (!nombre) {
    errors.nombre = "El nombre es obligatorio";
  }

  if (!apellido_p) {
    errors.apellido_p = "El apellido paterno es obligatorio";
  }

  if (!correo) {
    errors.correo = "El correo es obligatorio";
  } else if (!emailRegex.test(correo)) {
    errors.correo = "Correo inválido";
  }

  if (!nom_usuario) {
    errors.nom_usuario = "Usuario requerido";
  }

  if (!id_rol) {
    errors.id_rol = "Selecciona un rol";
  }

  const hasPassword = password.length > 0 || confirm.length > 0;

  if (!isEdit || hasPassword) {
    if (password.length < 8) {
      errors.password = "Mínimo 8 caracteres";
    }

    if (password !== confirm) {
      errors.confirm_password = "No coinciden";
    }
  }

  return errors;
}