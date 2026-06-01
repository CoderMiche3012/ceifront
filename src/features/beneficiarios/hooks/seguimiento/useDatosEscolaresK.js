import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  obtenerDatosEscolares,
  crearDatosEscolaresInd,
  actualizarDatosEscolaresInd,
} from "./../../services/escuelaService";

import { datosEscolaresKeys } from "./../../services/datosEscolaresKeys";

// obtener datos escolares
export function useDatosEscolares() {
  return useQuery({
    queryKey: datosEscolaresKeys.list(),
    queryFn: obtenerDatosEscolares,
  });
}

// crear datos escolares
export function useCrearDatosEscolares() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearDatosEscolaresInd,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datosEscolaresKeys.all,
      });
    },
  });
}

// actualizar datos escolares
export function useActualizarDatosEscolares() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      actualizarDatosEscolaresInd(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: datosEscolaresKeys.all,
      });
    },
  });
}