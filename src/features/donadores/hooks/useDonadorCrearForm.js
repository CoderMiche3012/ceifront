import { useState } from "react";
import { crearDonador } from "../services/donadoresService";

export const useDonadorCrearForm = (onSuccess, onClose) => {
  const getInitialForm = () => ({
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    telefono: "",
    cp: "",
    tipo: "",
    correo: "",
    estatus: "Activo",
    fecha_ingreso: new Date().toISOString().split("T")[0],
    nota: "",
    calle: "",
    numero: "",
    colonia: "",
    localidad: "",
    pais: "",
  });

  const [form, setForm] = useState(getInitialForm());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [resultModal, setResultModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const resetForm = () => {
    setForm(getInitialForm());
    setError("");
  };

  const validarFormulario = () => {
    if (!(form.nombre || "").trim())
      return "El nombre es obligatorio.";

    if (!(form.correo || "").trim())
      return "El correo es obligatorio.";

    if (!(form.telefono || "").trim())
      return "El teléfono es obligatorio.";

    if (!(form.tipo || "").trim())
      return "Selecciona el tipo de donador.";

    if (!(form.fecha_ingreso || "").trim())
      return "Selecciona la fecha de ingreso.";

    return "";
  };

  const handlePreSubmit = () => {
    const mensajeError = validarFormulario();

    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setError("");
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    try {
      setLoading(true);
      setShowConfirm(false);

      await crearDonador(form);

      setResultModal({
        open: true,
        type: "success",
        title: "Donador registrado",
        message: "El donador fue creado correctamente.",
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setResultModal({
        open: true,
        type: "error",
        title: "Error al guardar",
        message:
          err?.response?.data?.message ||
          err?.message ||
          "No se pudo registrar el donador.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalClose = () => {
    setResultModal((prev) => ({ ...prev, open: false }));

    if (resultModal.type === "success") {
      resetForm();
      if (onClose) onClose();
    }
  };

  return {
    form,
    setForm,
    loading,
    error,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  };
};