import { useEffect, useState, useCallback } from "react";

import { formatErrorAnidado } from "../../../utils/errorHandlers";
import { useActualizarPerfil } from "./useActualizarPerfil";

import { guardarUsuarioLocal, limpiarSesionLocal } from "../../../storage/userStorage";

import { useMutation, useQueryClient } from "@tanstack/react-query";


export function usePerfilForm({ user, open, onUserUpdated, setResultado, }) {

  const mutation = useActualizarPerfil();
  const queryClient = useQueryClient();

  const [nombre, setNombre] = useState("");
  const [nom_usuario, setNomUsuario] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [cambiarPass, setCambiarPass] = useState(false);

  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showNuevaPassword, setShowNuevaPassword] = useState(false);
  const [showConfirmarPassword, setShowConfirmarPassword] = useState(false);
  const [error, setError] = useState("");

  const resetPasswordFields = useCallback(() => {
    setPasswordActual("");
    setNuevaPassword("");
    setConfirmarPassword("");
    setCambiarPass(false);
    setShowPasswordActual(false);
    setShowNuevaPassword(false);
    setShowConfirmarPassword(false);
  }, []);
  // llenar automaticamente
  useEffect(() => {
    if (!open || !user) return;
    setNombre(user.nombre ?? "");
    setNomUsuario(user.nombreUsuario ?? "");
    setApellidoP(user.apellido_p ?? "");
    setApellidoM(user.apellido_m ?? "");
    setCorreo(user.correo ?? "");
    setTelefono(user.telefono ?? "");
    setError("");
    resetPasswordFields();
  }, [open, user, resetPasswordFields]);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correo.trim())
      return "El correo es obligatorio";

    if (!emailRegex.test(correo.trim()))
      return "El formato del correo no es válido";

    if (cambiarPass) {
      if (!passwordActual)
        return "Ingresa la contraseña actual";

      if (nuevaPassword.length < 8)
        return "La nueva contraseña debe tener al menos 8 caracteres";

      if (nuevaPassword !== confirmarPassword)
        return "Las contraseñas nuevas no coinciden";

      if (nuevaPassword === passwordActual)
        return "La nueva contraseña no puede ser igual";
    }

    return null;
  };

  const handleSubmit = async () => {
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return false;
    }

    try {
      const payload = {};
      if (nombre !== user.nombre)
        payload.nombre = nombre.trim();

      if (nom_usuario !== user.nombreUsuario)
        payload.nom_usuario = nom_usuario.trim();

      if (apellidoP !== user.apellido_p)
        payload.apellido_p = apellidoP.trim();

      if (apellidoM !== user.apellido_m)
        payload.apellido_m = apellidoM.trim();

      if (
        correo.trim().toLowerCase() !==
        user.correo?.trim().toLowerCase()
      ) {
        payload.correo = correo.trim().toLowerCase();
      }

      if (
        telefono.trim() !==
        user.telefono?.trim()
      ) {
        payload.telefono = telefono.trim();
      }

      if (cambiarPass) {
        payload.password_actual = passwordActual;
        payload.password = nuevaPassword;
        payload.confirm_password = confirmarPassword;
      }

      if (!Object.keys(payload).length) {
        setResultado({
          open: true,
          type: "info",
          title: "Sin cambios",
          message: "No realizaste ninguna modificación",
        });
        return false;
      }

      const data = await mutation.mutateAsync(payload);

      //cambio de contraseña
      if (cambiarPass) {
        limpiarSesionLocal();
        setResultado({
          open: true,
          type: "success",
          title: "Contraseña actualizada",
          message: "Tu sesión se cerrará.",
          logoutAction: true,
        });
        return { logout: true };
      }
      guardarUsuarioLocal(data);
      window.dispatchEvent(new Event("storage"));

      setResultado({
        open: true,
        type: "success",
        title: "¡Perfil actualizado!",
        message: "Los cambios se guardaron correctamente",
        logoutAction: false,
      });
      onUserUpdated?.(data);
      resetPasswordFields();

      return { logout: false };
    } catch (err) {
      const mensaje = formatErrorAnidado(err);

      setError(mensaje);

      setResultado({
        open: true,
        type: "error",
        title: "Error al actualizar",
        message: mensaje,
      });

      return false;
    }
  };

  return {
    nombre,
    nom_usuario,
    apellidoP,
    apellidoM,
    correo,
    setCorreo,
    telefono,
    setTelefono,

    passwordActual,
    setPasswordActual,
    nuevaPassword,
    setNuevaPassword,
    confirmarPassword,
    setConfirmarPassword,
    cambiarPass,
    setCambiarPass,

    showPasswordActual,
    setShowPasswordActual,
    showNuevaPassword,
    setShowNuevaPassword,
    showConfirmarPassword,
    setShowConfirmarPassword,

    error,
    loading: mutation.isPending,
    handleSubmit,
    cancelarCambioPassword: resetPasswordFields,
  };
}

