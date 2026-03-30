import { useState, useEffect } from "react";
import { actualizarPeriodo, obtenerPeriodos } from "../services/periodoService";

export const usePeriodoEditarForm = (periodo, onSuccess, onClose) => {
  const [form, setForm] = useState({
    ciclo_escolar: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: 1,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ 
    open: false, 
    type: "success", 
    title: "", 
    message: "" 
  });

  // Sincronizar el formulario cuando el periodo llega o cambia
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
      const periodosActuales = await obtenerPeriodos();
      const nombreNuevo = form.ciclo_escolar.trim().toLowerCase();
      const idActual = periodo.id_periodo;

      // Validar Duplicidad
      const nombreExiste = periodosActuales.some(p => 
        p.id_periodo !== idActual && 
        p.ciclo_escolar.trim().toLowerCase() === nombreNuevo
      );

      if (nombreExiste) {
        throw new Error(`El ciclo "${form.ciclo_escolar}" ya existe en otro registro.`);
      }

      // Validar Traslape
      const inicioNuevo = new Date(form.fecha_inicio + "T00:00:00");
      const finNuevo = new Date(form.fecha_fin + "T00:00:00");

      const conflicto = periodosActuales.find(p => {
        if (p.id_periodo === idActual) return false;
        const i = new Date(p.fecha_inicio + "T00:00:00");
        const f = new Date(p.fecha_fin + "T00:00:00");
        return inicioNuevo <= f && finNuevo >= i;
      });

      if (conflicto) {
        throw new Error(`Las fechas chocan con el periodo "${conflicto.ciclo_escolar}".`);
      }

      await actualizarPeriodo(idActual, {
        ...form,
        ciclo_escolar: form.ciclo_escolar.trim()
      });

      setResultModal({
        open: true,
        type: "success",
        title: "¡Actualización Exitosa!",
        message: `El ciclo ${form.ciclo_escolar} ha sido actualizado correctamente.`
      });
    } catch (err) {
      setResultModal({
        open: true,
        type: "error",
        title: "No se pudo actualizar",
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalClose = () => {
    setResultModal(prev => ({ ...prev, open: false }));
    if (resultModal.type === "success") {
      onSuccess();
      onClose();
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
    handleFinalClose
  };
};