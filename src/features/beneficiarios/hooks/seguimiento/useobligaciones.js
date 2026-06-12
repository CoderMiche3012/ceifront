import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  obtenerObligaciones,
  obtenerObligacion,
  crearObligacion,
  actualizarObligacion,
  eliminarObligacion,
} from "../../services/obligacionesService";

import { obligacionesKeys } from "../../services/obligacionesKeys";
import { expedientesKeys } from "../../../expedientes/services/expedientesKeys";
import { seguimientosKeys } from "../../services/seguimientosKeys";
import { beneficiariosKeys } from "../../services/beneficiariosKeys";

// lista
export function useObligaciones() {
  return useQuery({
    queryKey: obligacionesKeys.lists(),
    queryFn: obtenerObligaciones,
  });
}

// detalle
export function useObligacion(id) {
  return useQuery({
    queryKey: obligacionesKeys.detail(id),
    queryFn: () => obtenerObligacion(id),
    enabled: !!id,
  });
}

// crear
export function useCrearObligacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearObligacion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: obligacionesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
    },
  });
}

// actualizar
export function useActualizarObligacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      actualizarObligacion(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: obligacionesKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: obligacionesKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
    },
  });
}

// eliminar
export function useEliminarObligacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarObligacion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: obligacionesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
    },
  });
}