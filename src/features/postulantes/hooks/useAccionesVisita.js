import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCrearVisita, useActualizarVisita } from "../hooks/useVisitas";
import { visitasKeys } from "../services/visitasKeys";

export const useAccionesVisita = (item,idPostulante = null) => {
  const queryClient = useQueryClient();
  const crearVisitaMutation = useCrearVisita();
  const actualizarVisitaMutation = useActualizarVisita();
  const [modalMode, setModalMode] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fecha: "",
    hora: "",
    nota: "",
  });

  const [result, setResult] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const resetForm = () => setFormData({ fecha: "", hora: "", nota: "" });

  useEffect(() => {
    if (modalMode === "agendar") {
      if (item?.id_visita && item?.fecha_visita) {
        const [fecha, resto] = item?.fecha_visita.split("T");

        const hora = resto ? resto.substring(0, 5) : "";

        setFormData({
          fecha,
          hora,
          nota: "",
        });
      } else {
        resetForm();
      }
    }

    if ( modalMode === "finalizar" || modalMode === "cancelar" ) {
      setFormData((prev) => ({
        ...prev,
        nota: "",
      }));
    }
  }, [modalMode, item]);

  const ejecutarAccion = async () => {
    setLoading(true);

    try {

      if (modalMode === "agendar") {
        if (!formData.fecha || !formData.hora) {
          throw new Error(
            "Fecha y hora son obligatorias"
          );
        }

        const fechaIso = `${formData.fecha}T${formData.hora}:00-06:00`;

        const payload = {
          id_postulante: item?.id_postulante || idPostulante,
          fecha_visita: fechaIso,
          estado_visita: "Programada",
        };

        if (item?.id_visita) {
          await actualizarVisitaMutation.mutateAsync({
            id: item?.id_visita,
            data: payload,
          });
        } else {
          await crearVisitaMutation.mutateAsync(payload);
        }
      }
      else if (modalMode === "finalizar") {
        if (!formData.nota) {
          throw new Error(
            "La nota es obligatoria para finalizar"
          );
        }

        await actualizarVisitaMutation.mutateAsync({
          id: item?.id_visita,
          data: {
            estado_visita: "Realizada",
            nota_visita: formData.nota,
          },
        });
      }

      else if (modalMode === "cancelar") {
        await actualizarVisitaMutation.mutateAsync({
          id: item?.id_visita,
          data: {
            estado_visita: "Cancelada",
            nota_visita: formData.nota,
          },
        });
      }

      setResult({
        open: true,
        type: "success",
        title: "¡Éxito!",
        message: "La visita se actualizó correctamente.",
      });

      setModalMode(null);
      resetForm();

      queryClient.invalidateQueries({
        queryKey: visitasKeys.all,
      });
    } catch (error) {
      setResult({
        open: true,
        type: "error",
        title: "Error",
        message: error.message,
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
    ejecutarAccion,
  };
};