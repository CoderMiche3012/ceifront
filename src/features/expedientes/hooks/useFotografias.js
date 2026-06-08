import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  obtenerFotografiasPorExpediente,
  subirFotografia,
  eliminarFotografia,
} from "../services/fotografiaService";

import { fotografiasKeys } from "../services/fotografiasKeys";
import { postulantesKeys } from "../../postulantes/services/postulantesKeys";


export const useFotografias = (idExpediente) => {
  return useQuery({
    queryKey: fotografiasKeys.expediente(idExpediente),
    queryFn: () => obtenerFotografiasPorExpediente(idExpediente),
    enabled: !!idExpediente,
  });
};

export const useSubirFotografia = (idExpediente, idPostulante) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subirFotografia,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fotografiasKeys.expediente(idExpediente),
      });

      queryClient.invalidateQueries({
        queryKey: postulantesKeys.detail(idPostulante),
      });

      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
    },
  });
};

export const useEliminarFotografia = (idExpediente, idPostulante) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarFotografia,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fotografiasKeys.expediente(idExpediente),
      });

      queryClient.invalidateQueries({
        queryKey: postulantesKeys.detail(idPostulante),
      });
      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
    },
  });
};