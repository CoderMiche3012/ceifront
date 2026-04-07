import { useEffect, useMemo, useState, useCallback } from "react";
import { actualizarUsuarioCompleto } from "../../services/usuariosService";

const initialFormData = {
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
export function useUsuarioEditarModal({
  open,
  user,
  roles = [],
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const getRoleId = useCallback((u) => {
    const id = u?.id_rol || u?.idRol || u?.rol_id || "";
    return String(id).trim();
  }, []);

  const roleOptions = useMemo(() => {
    const uniqueRoles = new Map();
    roles.forEach((rol) => {
      const value = String(rol?.id_rol || rol?.id || "").trim();
      const label = String(rol?.nombre_rol || rol?.rol || rol?.nombre || "").trim();
      if (!value || !label) return;
      if (!uniqueRoles.has(value)) {
        uniqueRoles.set(value, { value, label });
      }
    });
    return Array.from(uniqueRoles.values());
  }, [roles]);

  useEffect(() => {
    if (!open) {
      setIsConfirming(false);
      setFormData(initialFormData);
      setFieldErrors({});
      setGeneralError("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    } else if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido_p: user.apellido_p || "",
        apellido_m: user.apellido_m || "",
        correo: user.correo || "",
        telefono: user.telefono || "",
        nom_usuario: user.nom_usuario || "",
        id_rol: getRoleId(user),
        password: "",
        confirm_password: "",
      });
    }
  }, [open, user, getRoleId]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onClose]);

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setGeneralError("");
  }, []);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!formData.apellido_p.trim()) errors.apellido_p = "El apellido paterno es obligatorio";
    
    if (!formData.correo.trim()) {
      errors.correo = "El correo electrónico es obligatorio";
    } else if (!emailRegex.test(formData.correo)) {
      errors.correo = "El formato de correo no es válido";
    }

    if (!formData.nom_usuario.trim()) errors.nom_usuario = "El nombre de usuario es obligatorio";
    if (!formData.id_rol) errors.id_rol = "Debes seleccionar un rol";

    const hasPassword = formData.password.length > 0 || formData.confirm_password.length > 0;
    if (hasPassword) {
      if (formData.password.length < 8) errors.password = "Mínimo 8 caracteres";
      if (formData.password !== formData.confirm_password) {
        errors.confirm_password = "Las contraseñas no coinciden";
      }
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    //evita doble clic accidental
    if (loading) return;
    if (!isConfirming) {
      if (validateForm()) {
        setIsConfirming(true);
      } else {
        setGeneralError("Revisa los campos marcados");
      }
      return;
    }
    //validacion extra de ID de usuario antes de disparar API
    if (!user?.id_usuario) {
      setGeneralError("Error: No se encontró el ID del usuario.");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        nombre: formData.nombre.trim(),
        apellido_p: formData.apellido_p.trim(),
        apellido_m: formData.apellido_m.trim(),
        correo: formData.correo.trim(),
        telefono: formData.telefono.trim(),
        nom_usuario: formData.nom_usuario.trim(),
        id_rol: Number(formData.id_rol),
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
        payload.confirm_password = formData.confirm_password;
      }
      await actualizarUsuarioCompleto(user.id_usuario, payload);
      setIsConfirming(false);
      if (onSuccess) await onSuccess();
      onClose?.();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Error al actualizar";
      setGeneralError(errorMsg);
      setIsConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, fieldErrors, generalError, loading, showPassword, showConfirmPassword, roleOptions,
    initials: `${user?.nombre?.[0] || "U"}${user?.apellido_p?.[0] || "S"}`.toUpperCase(),
    fullName: `${user?.nombre || ""} ${user?.apellido_p || ""}`.trim(),
    setShowPassword, setShowConfirmPassword, handleClose, handleBackdropClick, handleChange, handleSubmit,
    isConfirming, setIsConfirming,
  };
}