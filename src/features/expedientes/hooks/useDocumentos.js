import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  obtenerDocumentos,
  obtenerDocumentoPorId,
  subirDocumento,
  actualizarDocumento,
  eliminarDocumento,
} from "../services/documentosService";

import { documentosKeys } from "../services/documentosKeys";
import { postulantesKeys } from "../../postulantes/services/postulantesKeys";
import { expedientesKeys } from "../services/expedientesKeys";
import { seguimientosKeys } from "../../beneficiarios/services/seguimientosKeys";
import { beneficiariosKeys } from "../../beneficiarios/services/beneficiariosKeys";

export function useDocumentos() {
  return useQuery({
    queryKey: documentosKeys.list(),
    queryFn: obtenerDocumentos,
  });
}

export function useDocumento(id_documento) {
  return useQuery({
    queryKey: documentosKeys.detail(id_documento),
    queryFn: () => obtenerDocumentoPorId(id_documento),
    enabled: !!id_documento,
  });
}

export function useSubirDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subirDocumento,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
    },
  });
}

export function useActualizarDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id_documento, formData }) =>
      actualizarDocumento(id_documento, formData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
       queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      
    },
  });
}

export function useEliminarDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id_documento) => eliminarDocumento(id_documento),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: documentosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
       queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
     queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
    },
  });
}