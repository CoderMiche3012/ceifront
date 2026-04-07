import { useEffect, useState, useCallback, useRef } from "react";
import { formatError } from "../utils/errorHandlers";
import { actualizarUsuario } from "../services/usuariosService";
export function usePerfilForm({ user, open, onClose, onUserUpdated, setResultado }) {
  //estados de usuario
  const [nombre, setNombre] = useState("");
  const [nom_usuario, setNomUsuario] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  //estados de contraseña
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [cambiarPass, setCambiarPass] = useState(false);
  //estados de UI
  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showNuevaPassword, setShowNuevaPassword] = useState(false);
  const [showConfirmarPassword, setShowConfirmarPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //sincronizar datos cuando el modal abre o el usuario cambia
  useEffect(() => {
    if (!open || !user) return;
    setNombre(user.nombre || "");
    setNomUsuario(user.nom_usuario || "");
    setApellidoP(user.apellido_p || "");
    setApellidoM(user.apellido_m || "");
    setCorreo(user.correo || "");
    setTelefono(user.telefono || "");
    //reset de errores y estados de password al abrir
    setError("");
    setLoading(false);
    resetPasswordFields();
  }, [open, user]);
  const resetPasswordFields = useCallback(() => {
    setPasswordActual("");
    setNuevaPassword("");
    setConfirmarPassword("");
    setCambiarPass(false);
    setShowPasswordActual(false);
    setShowNuevaPassword(false);
    setShowConfirmarPassword(false);
  }, []);
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo.trim()) return "El correo es obligatorio";
    if (!emailRegex.test(correo.trim())) return "El formato del correo no es válido";
    if (cambiarPass) {
      if (!passwordActual) return "Ingresa la contraseña actual para validar el cambio";
      if (nuevaPassword.length < 8) return "La nueva contraseña debe tener al menos 8 caracteres";
      if (nuevaPassword !== confirmarPassword) return "Las contraseñas nuevas no coinciden";
      if (nuevaPassword === passwordActual) return "La nueva contraseña no puede ser igual a la actual";
    }
    return null;
  };
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      // Construcción del payload limpia
      const payload = {
        correo: correo.trim().toLowerCase(),
        telefono: telefono?.trim() || "",
      };
      if (cambiarPass) {
        payload.password_actual = passwordActual;
        payload.password = nuevaPassword;
        payload.confirm_password = confirmarPassword;
      }
      const data = await actualizarUsuario(user.id_usuario, payload);
      setResultado({
        open: true,
        type: "success",
        title: "¡Perfil actualizado!",
        message: "Los cambios se guardaron correctamente",
      });
      if (onUserUpdated) onUserUpdated(data);
      resetPasswordFields(); 
    } catch (err) {
      const mensaje = formatError(err?.response?.data || err);
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }, [
    correo, telefono, cambiarPass, passwordActual, 
    nuevaPassword, confirmarPassword, user?.id_usuario, 
    onUserUpdated, setResultado, resetPasswordFields
  ]);
  return {
    //datos
    nombre, nom_usuario, apellidoP, apellidoM, correo, setCorreo, telefono, setTelefono,
    //contraseña
    passwordActual, setPasswordActual, 
    nuevaPassword, setNuevaPassword, 
    confirmarPassword, setConfirmarPassword,
    cambiarPass, setCambiarPass,
    //visibilidad
    showPasswordActual, setShowPasswordActual, 
    showNuevaPassword, setShowNuevaPassword, 
    showConfirmarPassword, setShowConfirmarPassword,
    // estado
    error, loading,
    // acciones
    handleSubmit, 
    cancelarCambioPassword: resetPasswordFields,
  };
}