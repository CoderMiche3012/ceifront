import { useState, useRef, useEffect } from "react";

export const useEditarFamiliar = (editando, setEditando, onSave, onClose) => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultType, setResultType] = useState("success");
  const [resultTitle, setResultTitle] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const fieldRefs = useRef({});
  useEffect(() => {
    setFieldErrors({});
    setGeneralError("");
  }, [editando?.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;
    if (name === "telefono") val = value.replace(/\D/g, "").slice(0, 10);
    setEditando((prev) => ({ ...prev, [name]: val }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const required = ["nombre", "apellido_p", "parentesco", "edad", "telefono", "actividad_principal", "salario", "vive_en_casa"];
    const errors = {};
    required.forEach((field) => {
      if (!editando[field] || editando[field] === "") {
        errors[field] = "Este campo es obligatorio";
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setGeneralError("Completa los campos obligatorios.");
      const firstError = Object.keys(errors)[0];
      fieldRefs.current[firstError]?.focus();
      return false;
    }
    return true;
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setLoading(true);
    try {
      const dataFinal = {
        ...editando,
        edad: Number(editando.edad),
        vive_en_casa: String(editando.vive_en_casa) === "true",
      };
      await onSave(dataFinal);

      setResultType("success");
      setResultTitle("Actualización exitosa");
      setResultMessage("El familiar fue actualizado correctamente.");
      setResultOpen(true);
    } catch (error) {
      setResultType("error");
      setResultTitle("Error");
      setResultMessage(error.message || "No se pudo actualizar el familiar.");
      setResultOpen(true);
      if (error.response?.data) {
        const backendErrors = {};
        Object.entries(error.response.data).forEach(([key, val]) => {
          backendErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setFieldErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleCloseResult = () => {
    setResultOpen(false);

    if (resultType === "success") {
      onClose();
    }
  };
  return {
    handleChange,
    handleConfirm,
    validate,
    confirmOpen,
    setConfirmOpen,
    loading,
    fieldErrors,
    generalError,
    fieldRefs,
    resultOpen,
    resultType,
    resultTitle,
    resultMessage,
    handleCloseResult
  };
};