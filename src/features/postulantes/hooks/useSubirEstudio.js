import { useState } from "react";

import { subirDocumentoEstudio } from "../../expedientes/services/documentosService";
import { useActualizarPostulante } from "./usePostulantes";
import { useActualizarDocumento } from "../../expedientes/hooks/useDocumentos";
import { useActualizarEstudio } from "./useEstudios";

export function useSubirEstudio(data) {
  const [mostrarSubida, setMostrarSubida] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const actualizarEstudioMutation = useActualizarEstudio();

  const actualizarPostulanteMutation = useActualizarPostulante();
  const actualizarDocumentoMutation = useActualizarDocumento();

  const guardarDocumentoEstudio = async () => {
    if (!archivo || !data?.id_postulante) return;
    if (archivo?.type !== "application/pdf") {
      throw new Error("Solo se permiten archivos PDF");
    }

    try {
      setLoading(true);

      const tieneDocumento = data?.idDocumentoEstudio && data?.link_documento;

      const formDataRemplazar = new FormData();

      formDataRemplazar.append("archivo", archivo);

      if (tieneDocumento) {
        await actualizarDocumentoMutation.mutateAsync({
          id_documento: data.idDocumentoEstudio,
          formData: formDataRemplazar,
        });
        await actualizarEstudioMutation.mutateAsync({
          id: data.id_estudio,
          data: {
            estatus_estudio: "Completo",
          },
        });

        setMostrarSubida(false);
        setArchivo(null);
        return;
      }

      // no existe
      const formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("id_expediente", data.id_expediente);
      formData.append("nombre_documento", "EstudioSocioeconomico");
      formData.append("tipo_documento", "Estudio");

      const documento = await subirDocumentoEstudio(formData);

      await actualizarPostulanteMutation.mutateAsync({
        id: data.id_postulante,
        data: {
          estudio: {
            id_documento: documento.id_documento,
          },
        },
      });
      await actualizarEstudioMutation.mutateAsync({
        id: data.id_estudio,
        data: {
          estatus_estudio: "Completo",
        },
      });

      setMostrarSubida(false);
      setArchivo(null);
    } catch (error) {
      console.error(error);

      const mensaje =
        error?.errors?.archivo?.[0] ||
        error?.message ||
        "Error al subir documento";

      throw new Error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const cancelar = () => {
    setMostrarSubida(false);
    setArchivo(null);
  };

  return {
    mostrarSubida,
    setMostrarSubida,
    archivo,
    setArchivo,
    loading,
    guardarDocumentoEstudio,
    cancelar,
  };
}
