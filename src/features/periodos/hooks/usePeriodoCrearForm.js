import { useState } from "react";

import { useCrearPeriodo } from "./usePeriodos";

export const usePeriodoCrearForm = (onSuccess, onClose) => {
  // mutación
  const crearPeriodoMutation = useCrearPeriodo();
  // formulario
  const [form, setForm] = useState({
    ciclo_escolar: "",
    fecha_inicio: "",
    fecha_fin: "",
  });
  // estados
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // para el modal de exito
  const [resultModal, setResultModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });
  // validación básica de formulario
  const handlePreSubmit = (e) => {
    e?.preventDefault();
    setError("");
    if (!form.ciclo_escolar.trim() || !form.fecha_inicio || !form.fecha_fin) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    const inicio = new Date(form.fecha_inicio + "T00:00:00");
    const fin = new Date(form.fecha_fin + "T00:00:00");
    if (fin <= inicio) {
      setError("La fecha de fin debe ser posterior al inicio.");
      return;
    }
    setShowConfirm(true);
  };
  // guardar
  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError("");
    try {
      await crearPeriodoMutation.mutateAsync({ ...form, ciclo_escolar: form.ciclo_escolar.trim() });
      setResultModal({
        open: true,
        type: "success",
        title: "¡Registro Exitoso!",
        message: `El periodo ${form.ciclo_escolar} ha sido creado correctamente.`,
      });
      setForm({
        ciclo_escolar: "",
        fecha_inicio: "",
        fecha_fin: "",
      });
    } catch (err) {
      const mensaje = err?.message || "Ocurrió un error inesperado.";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalClose = () => {
    const fueExitoso = resultModal.type === "success";
    setResultModal((prev) => ({
      ...prev,
      open: false,
    }));
    if (fueExitoso) {
      onSuccess?.();
      onClose?.();
    }
  };

  return {
    //formulario
    form,
    setForm,
    // error y carga
    error,
    loading,
    //confirmacion, modales
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  };
};