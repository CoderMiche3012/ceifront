import { useState } from "react";

import { subirDocumentoEstudio } from "../../expedientes/services/documentosService";
import { actualizarEstudio } from "../services/estudiosService";

export function useSubirEstudio(data) {
  const [mostrarSubida, setMostrarSubida] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);

  const guardarDocumentoEstudio = async () => {
    if (!archivo || !data?.id_estudio) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("archivo", archivo);
      formData.append(
        "id_expediente",
        data.id_expediente
      );
      formData.append(
        "nombre_documento",
        "nuevo"
      );
      formData.append(
        "tipo_documento",
        "Estudio"
      );

      const documento =
        await subirDocumentoEstudio(
          formData
        );

      const urlDocumento =
        documento.url ||
        documento.link_documento ||
        documento.archivo;

      await actualizarEstudio(
        data.id_estudio,
        {
          link_documento: urlDocumento,
          estatus_estudio: "Completo",
        }
      );

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
