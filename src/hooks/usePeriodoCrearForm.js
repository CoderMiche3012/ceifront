import { useState } from "react";
import { crearPeriodo, actualizarPeriodo, obtenerPeriodos } from "../services/periodoService";

export const usePeriodoCrearForm = (onSuccess, onClose) => {
  const [form, setForm] = useState({ ciclo_escolar: "", fecha_inicio: "", fecha_fin: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({ open: false, type: "success", title: "", message: "" });
  const handlePreSubmit = (e) => {
    e.preventDefault();
    setError("");
    //validaciones
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
      //validar duplicidad
      if (periodosActuales.some(p => p.ciclo_escolar.trim().toLowerCase() === nombreNuevo)) {
        throw new Error(`El ciclo "${form.ciclo_escolar}" ya existe.`);
      }
      //validar traslape
      const inicioNuevo = new Date(form.fecha_inicio + "T00:00:00");
      const finNuevo = new Date(form.fecha_fin + "T00:00:00");
      const conflicto = periodosActuales.find(p => {
        const i = new Date(p.fecha_inicio + "T00:00:00");
        const f = new Date(p.fecha_fin + "T00:00:00");
        return inicioNuevo <= f && finNuevo >= i;
      });
      if (conflicto) throw new Error(`Choca con el periodo "${conflicto.ciclo_escolar}".`);
      //desactivar anteriores y crear
      const activos = periodosActuales.filter((p) => Number(p.estado) === 1);
      if (activos.length > 0) {
        await Promise.all(activos.map((p) => actualizarPeriodo(p.id_periodo, { ...p, estado: 0 })));
      }
      await crearPeriodo({ ...form, ciclo_escolar: form.ciclo_escolar.trim(), estado: 1 });
      setResultModal({
        open: true,
        type: "success",
        title: "¡Registro Exitoso!",
        message: `El ciclo ${form.ciclo_escolar} ha sido activado.`
      });
      setForm({ ciclo_escolar: "", fecha_inicio: "", fecha_fin: "" });
    } catch (err) {
      setResultModal({ open: true, type: "error", title: "Error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalClose = () => {
    setResultModal({ ...resultModal, open: false });
    if (resultModal.type === "success") {
      onSuccess();
      onClose();
    }
  };

  return {
    form, setForm, error, loading, showConfirm, setShowConfirm,
    resultModal, handlePreSubmit, handleConfirmSave, handleFinalClose
  };
};