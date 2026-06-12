import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  obtenerDatosEscolares,
  crearDatosEscolaresInd,
  actualizarDatosEscolaresInd,
} from "./../../services/escuelaService";

import { datosEscolaresKeys } from "./../../services/datosEscolaresKeys";
import { expedientesKeys } from "../../../expedientes/services/expedientesKeys";
import { donadoresKeys } from "../../../donadores/services/donadoresKeys";
import { beneficiariosKeys } from "../../services/beneficiariosKeys";
import { seguimientosKeys } from "../../services/seguimientosKeys";

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
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: donadoresKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
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
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: donadoresKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });
    },
  });
}