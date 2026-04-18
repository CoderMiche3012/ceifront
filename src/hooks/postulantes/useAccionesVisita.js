import { useState, useEffect } from "react";
import { crearVisita, actualizarVisita } from "../../services/visitasService";

export const useAccionesVisita = (item, onRefresh) => {
  const [modalMode, setModalMode] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fecha: "", hora: "", nota: "" });
  const [result, setResult] = useState({
    open: false,
    type: "success",
    title: "",
    message: ""
  });
  const resetForm = () => setFormData({ fecha: "", hora: "", nota: "" });

  useEffect(() => {
    if (modalMode === "agendar") {
      if (item?.id_visita && item?.fecha_visita) {
        const [fecha, resto] = item.fecha_visita.split("T");
        const hora = resto ? resto.substring(0, 5) : "";

        setFormData({
          fecha,
          hora,
          nota: ""
        });
      } else {
        resetForm();
      }
    }

    if (modalMode === "finalizar") {
      setFormData(prev => ({
        ...prev,
        nota: ""
      }));
    }

    if (modalMode === "finalizar" || modalMode === "cancelar") {
      setFormData(prev => ({
        ...prev,
        nota: "" 
      }));
    }
  }, [modalMode]); 

  const ejecutarAccion = async () => {
    setLoading(true);

    try {
      if (modalMode === "agendar") {
        if (!formData.fecha || !formData.hora) {
          throw new Error("Fecha y hora son obligatorias");
        }

        const fechaIso = `${formData.fecha}T${formData.hora}:00-06:00`;

        const payload = {
          id_postulante: item.id_postulante,
          fecha_visita: fechaIso,
          estado_visita: "Programada"
        };

        if (item.id_visita) {
          await actualizarVisita(item.id_visita, payload);
        } else {
          await crearVisita(payload);
        }
      }

      else if (modalMode === "finalizar") {
        if (!formData.nota) {
          throw new Error("La nota es obligatoria para finalizar");
        }
        if (!item.id_visita) {
          throw new Error("No se encontró ID de visita para finalizar");
        }

        await actualizarVisita(item.id_visita, {
          estado_visita: "Realizada",
          nota_visita: formData.nota
        });
      }

      else if (modalMode === "cancelar") {
        if (!item.id_visita) {
          throw new Error("No se encontró ID de visita para cancelar");
        }

        await actualizarVisita(item.id_visita, {
          estado_visita: "Cancelada",
          nota_visita: formData.nota
        });
      }

      setResult({
        open: true,
        type: "success",
        title: "¡Éxito!",
        message: `La visita ha sido ${item.id_visita ? "actualizada" : "agendada"
          } correctamente.`
      });

      setModalMode(null);
      resetForm();

      if (onRefresh) onRefresh();

    } catch (error) {
      setResult({
        open: true,
        type: "error",
        title: "Error",
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    modalMode,
    setModalMode,
    loading,
    formData,
    setFormData,
    result,
    setResult,
    ejecutarAccion
  };
};