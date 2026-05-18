import { useEffect, useMemo, useState, useCallback } from "react";
import { crearUsuario } from "../services/usuariosService";

export const initialFormData = {
  nombre: "",
  apellido_p: "",
  apellido_m: "",
  correo: "",
  telefono: "",
  nom_usuario: "",
  id_rol: "",
  password: "",
  confirm_password: "",
};
export function useUsuarioCrearModal({ open, roles = [], onClose, onSuccess }) {
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  //opciones de roles
  const roleOptions = useMemo(() => {
    const uniqueRoles = new Map();
    roles.forEach((rol) => {
      const value = String(rol?.id || rol?.id_rol || rol?.pk_id_rol || "").trim();
      const label = String(rol?.nombre || rol?.nombre_rol || rol?.rol || "").trim();
      if (!value || !label) return;
      if (!uniqueRoles.has(value)) {
        uniqueRoles.set(value, { value, label });
      }
    });
    return Array.from(uniqueRoles.values());
  }, [roles]);

  //cerrar
  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setFieldErrors({});
      setGeneralError("");
      setIsConfirming(false);
    }
  }, [open]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open && !loading) onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (isConfirming) setIsConfirming(false);
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (generalError) setGeneralError("");
  }, [fieldErrors, generalError, isConfirming]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!formData.apellido_p.trim()) errors.apellido_p = "El apellido paterno es obligatorio";
    if (!formData.correo.trim()) {
      errors.correo = "El correo es obligatorio";
    } else if (!emailRegex.test(formData.correo)) {
      errors.correo = "Formato de correo no válido";
    }
    if (!formData.nom_usuario.trim()) errors.nom_usuario = "El nombre de usuario es obligatorio";
    if (!formData.id_rol) errors.id_rol = "Selecciona un rol";
    if (!formData.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      errors.password = "Mínimo 8 caracteres";
    }
    if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Las contraseñas no coinciden";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (loading) return;
    if (!isConfirming) {
      if (validateForm()) {
        setIsConfirming(true);
      } else {
        setGeneralError("Revisa los campos marcados.");
      }
      return;
    }
    setLoading(true);
    setGeneralError("");

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        apellido_p: formData.apellido_p.trim(),
        apellido_m: formData.apellido_m.trim(),
        correo: formData.correo.trim(),
        telefono: formData.telefono.trim(),
        nom_usuario: formData.nom_usuario.trim(),
        id_rol: Number(formData.id_rol),
        password: formData.password,
        confirm_password: formData.confirm_password, 
        estatus: 1,
      };
      await crearUsuario(payload);
      if (onSuccess) await onSuccess();
      onClose?.();

    } catch (err) {
      setGeneralError(err.message || "Error al crear el usuario");
      setIsConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, fieldErrors, generalError, loading, isConfirming,
    showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
    roleOptions,
    initials: `${formData.nombre?.[0] || "N"}${formData.apellido_p?.[0] || "U"}`.toUpperCase(),
    fullName: `${formData.nombre} ${formData.apellido_p}`.trim() || "Nuevo usuario",
    handleChange, handleSubmit, setIsConfirming,
    handleClose: () => !loading && onClose?.(),
    handleBackdropClick: (e) => e.target === e.currentTarget && !loading && onClose?.()
  };
}