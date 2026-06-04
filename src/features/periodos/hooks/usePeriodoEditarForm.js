import { useState, useEffect } from "react";

import { usePeriodos, useActualizarPeriodo } from "./usePeriodos";

export const usePeriodoEditarForm = (periodo, onSuccess, onClose) => {
  // consultas y mutaciones
  const { data: periodosActuales = [] } = usePeriodos();
  const actualizarPeriodoMutation = useActualizarPeriodo();
  const [form, setForm] = useState({
    ciclo_escolar: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: 1,
  });
  // estados
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });
  // sincronizar formulario cuando cambia el periodo
  useEffect(() => {
    if (periodo) {
      setForm({
        ciclo_escolar: periodo.ciclo_escolar || "",
        fecha_inicio: periodo.fecha_inicio || "",
        fecha_fin: periodo.fecha_fin || "",
        estado: periodo.estado ?? 1,
      });
    }
  }, [periodo]);

  const handlePreSubmit = (e) => {
    if (e) e.preventDefault();
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

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError("");

    try {
      await actualizarPeriodoMutation.mutateAsync({
        id: periodo.id_periodo,
        data: { ...form, ciclo_escolar: form.ciclo_escolar.trim(), },
      });

      setResultModal({
        open: true,
        type: "success",
        title: "¡Actualización Exitosa!",
        message: `El periodo ${form.ciclo_escolar} ha sido actualizado correctamente.`,
      });
    } catch (err) {
      const mensaje = err?.message || "Ocurrió un error inesperado.";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalClose = () => {
    const wasSuccess = resultModal.type === "success";
    setResultModal((prev) => ({
      ...prev,
      open: false,
    }));

    if (wasSuccess) {
      onSuccess?.();
      onClose?.();
    }
  };

  return {
    form,
    setForm,

    error,
    loading,

    showConfirm,
    setShowConfirm,

    resultModal,

    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  };
};