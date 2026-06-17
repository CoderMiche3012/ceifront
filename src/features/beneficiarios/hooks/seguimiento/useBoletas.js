import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {obtenerBoletas,obtenerBoleta,crearBoleta,actualizarBoleta} from "../../services/boletasService";

import { boletasKeys } from "../../services/boletasKeys";
import { expedientesKeys } from "../../../expedientes/services/expedientesKeys";
import {beneficiariosKeys} from "../../services/beneficiariosKeys";
import { seguimientosKeys } from "../../services/seguimientosKeys";
import { datosEscolaresKeys } from "../../services/datosEscolaresKeys";
//listar boletas
export function useBoletas() {
  return useQuery({
    queryKey: boletasKeys.lists(),
    queryFn: obtenerBoletas,
  });
}
//obtener por id
export function useBoleta(id) {
  return useQuery({
    queryKey: boletasKeys.detail(id),
    queryFn: () => obtenerBoleta(id),
    enabled: !!id,
  });
}
//crear
export function useCrearBoleta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearBoleta,

    onSuccess: (data, variables) => {
      // Refrescar todas las boletas
      queryClient.invalidateQueries({
        queryKey: boletasKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: datosEscolaresKeys.all,
      });

      const idSeguimiento = variables?.id_datos_escolares;

      if (idSeguimiento) {
        queryClient.invalidateQueries({
          queryKey: ["seguimiento", idSeguimiento],
        });
      }

      return data;
    },
  });
}
//actualizar
export function useActualizarBoleta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      actualizarBoleta(id, data),

    onSuccess: (data, variables) => {
      // Refrescar lista general
      queryClient.invalidateQueries({
        queryKey: boletasKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      })

      // Refrescar detalle específico
      queryClient.invalidateQueries({
        queryKey: boletasKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });

      const idSeguimiento =
        variables?.payload?.id_datos_escolares;

      if (idSeguimiento) {
        queryClient.invalidateQueries({
          queryKey: ["seguimiento", idSeguimiento],
        });
      }
      queryClient.invalidateQueries({
        queryKey: datosEscolaresKeys.all,
      });

      return data;
    },
  });
}