import { useEffect, useMemo, useState, useCallback } from "react";
import { useCrearUsuario, useActualizarUsuario } from "./useUsuarios";
import { formatErrorAnidado } from "../../../utils/errorHandlers";
import { validateUsuarioForm } from "./validateUsuarioForm";
import { authKeys } from "../../auth/services/keys";
import { useQueryClient } from "@tanstack/react-query";

// estado inicial
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

export function useUsuarioForm({
  mode,
  open,
  user,
  roles = [],
  onClose,
  onSuccess,
  onNoChanges,
}) {
  const isEdit = mode === "edit" && !!user;
  // estados
  const queryClient = useQueryClient();
  const [originalData, setOriginalData] = useState(initialFormData);
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  // mutaciones
  const crearMutation = useCrearUsuario();
  const actualizarMutation = useActualizarUsuario();
  // estado de carga
  const loading = crearMutation.isPending || actualizarMutation.isPending;
  // para normalizar roles
  const roleOptions = useMemo(() => {
    const map = new Map();
    roles.forEach((rol) => {
      const value = String(rol?.id_rol || rol?.id || "").trim();
      const label = String(rol?.nombre_rol || rol?.nombre || rol?.rol || "").trim();
      if (!value || !label) return;
      if (!map.has(value)) map.set(value, { value, label });
    });

    return Array.from(map.values());
  }, [roles]);

  useEffect(() => {
    if (!open) return;

    if (isEdit && user) {
      const data = {
        nombre: user.nombre || "",
        apellido_p: user.apellido_p || "",
        apellido_m: user.apellido_m || "",
        correo: user.correo || "",
        telefono: user.telefono || "",
        nom_usuario: user.nom_usuario || "",
        id_rol: String(user.id_rol || ""),
        password: "",
        confirm_password: "",
      };
      setFormData(data);
      setOriginalData(data);
    } else {
      setFormData(initialFormData);
      setOriginalData(initialFormData);
    }
    setFieldErrors({});
    setGeneralError("");
    setIsConfirming(false);
  }, [open, user, isEdit]);
  // manejo de cambios
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setGeneralError("");
    setIsConfirming(false);
  }, []);
  // para detectar modificaciones
  const getChangedFields = () => {
    const changed = {};

    Object.keys(formData).forEach((key) => {
      const current = typeof formData[key] === "string" ? formData[key].trim() : formData[key];
      const original = typeof originalData[key] === "string" ? originalData[key].trim() : originalData[key];
      if (current !== original) {
        changed[key] = key === "id_rol" ? Number(current) : current;
      }
    });
    return changed;
  };

  const handleClose = () => {
    if (loading) return;
    setFormData(initialFormData);
    setFieldErrors({});
    setGeneralError("");
    setIsConfirming(false);
    onClose?.();
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (loading) return;
    // validacion
    if (!isConfirming) {
      const errors = validateUsuarioForm(formData, isEdit);
      setFieldErrors(errors);

      if (Object.keys(errors).length > 0) {
        setGeneralError("Revisa los campos marcados");
        return;
      }
      setIsConfirming(true);
      return;
    }
    // envio si se confirmo
    try {
      setGeneralError("");

      if (isEdit) {
        const changed = getChangedFields();

        if (Object.keys(changed).length === 0) {
          setIsConfirming(false);
          onNoChanges?.();
          return;
        }

        await actualizarMutation.mutateAsync({ id: user.id_usuario, data: changed, });
        queryClient.invalidateQueries({
          queryKey: authKeys.perfil(),
        });
      
        onSuccess?.();
        onClose?.();
      } else {
        const payload = {
          ...formData,
          correo: formData.correo.trim().toLowerCase(),
          id_rol: Number(formData.id_rol),
        };
        
        await crearMutation.mutateAsync(payload);
        queryClient.invalidateQueries({
          queryKey: authKeys.perfil(),
        });

        onSuccess?.();
        onClose?.();
      }

      setIsConfirming(false);
    } catch (err) {
      setGeneralError(formatErrorAnidado(err));
      setIsConfirming(false);
    }
  };

  return {
    formData,
    fieldErrors,
    generalError,
    loading,
    roleOptions,
    isConfirming,
    setIsConfirming,
    handleChange,
    handleSubmit,
    handleClose,
  };
}
