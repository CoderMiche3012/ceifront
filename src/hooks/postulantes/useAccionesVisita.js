import { useState } from "react";
import { crearVisita } from "../../services/visitasService";
import { actualizarVisita } from "../../services/visitasService";

export const useAccionesVisita = (item, onRefresh) => {
  const [modalMode, setModalMode] = useState(null); // 'agendar', 'finalizar', 'cancelar'
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fecha: "", hora: "", nota: "" });
  const [result, setResult] = useState({ open: false, type: "success", title: "", message: "" });

  const resetForm = () => setFormData({ fecha: "", hora: "", nota: "" });

  const ejecutarAccion = async () => {
    setLoading(true);
    try {
      if (modalMode === 'agendar') {
        if (!formData.fecha || !formData.hora) throw new Error("Fecha y hora son obligatorias");
        const fechaIso = `${formData.fecha}T${formData.hora}:00-06:00`;
        await crearVisita({
          id_postulante: item.id_postulante,
          fecha_visita: fechaIso,
          estado_visita: "Programada"
        });
      } 
      
      else if (modalMode === 'finalizar') {
        if (!formData.nota) throw new Error("La nota es obligatoria para finalizar");
        await actualizarVisita(item.id_postulante, {
          estado_visita: "Realizada",
          nota_visita: formData.nota
        });
      } 
      
      else if (modalMode === 'cancelar') {
        await actualizarVisita(item.id_postulante, { estado_visita: "Cancelada" });
      }

      setResult({
        open: true,
        type: "success",
        title: "¡Éxito!",
        message: `Acción ${modalMode} completada correctamente.`
      });
      setModalMode(null);
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      setResult({ open: true, type: "error", title: "Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return {
    modalMode, setModalMode,
    loading,
    formData, setFormData,
    result, setResult,
    ejecutarAccion
  };
};