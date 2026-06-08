import { useState } from "react";

import { subirDocumentoEstudio } from "../../expedientes/services/documentosService";
import { useActualizarPostulante } from "./usePostulantes";
import { useActualizarDocumento } from "../../expedientes/hooks/useDocumentos";

export function useSubirEstudio(data) {
  const [mostrarSubida, setMostrarSubida] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);

  const actualizarPostulanteMutation = useActualizarPostulante();
  const actualizarDocumentoMutation = useActualizarDocumento();

  const guardarDocumentoEstudio = async () => {
    if (!archivo || !data?.id_postulante) return;

    try {
      setLoading(true);

      const tieneDocumento =
        data?.idDocumentoEstudio && data?.link_documento;

      // =========================
      // CASO 1: YA EXISTE DOCUMENTO
      // =========================

      const formDataRemplazar = new FormData();

      formDataRemplazar.append("archivo", archivo);

      if (tieneDocumento) {
        await actualizarDocumentoMutation.mutateAsync({
          id_documento: data.idDocumentoEstudio,
          formData: formDataRemplazar,
        });

        setMostrarSubida(false);
        setArchivo(null);
        return;
      }

      // =========================
      // CASO 2: NO EXISTE DOCUMENTO (CREAR + ASOCIAR)
      // =========================
      const formData = new FormData();

      formData.append("archivo", archivo);
      formData.append("id_expediente", data.id_expediente);
      formData.append("nombre_documento", "nuevo");
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

      setMostrarSubida(false);
      setArchivo(null);
    } catch (error) {
      console.log(error);
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