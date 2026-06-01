import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { obtenerPeriodos, crearPeriodo, actualizarPeriodo, eliminarPeriodo, } from "../services/periodoService";
import { periodosKeys } from "../services/periodosKeys";

// obtener periodos
export function usePeriodos() {
  return useQuery({
    queryKey: periodosKeys.all,
    queryFn: obtenerPeriodos,
  });
}

// crear periodo
export function useCrearPeriodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearPeriodo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: periodosKeys.all,
      });
    },
  });
}

// actualizar periodo
export function useActualizarPeriodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      actualizarPeriodo(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: periodosKeys.all,
      });
    },
  });
}

// eliminar periodo
export function useEliminarPeriodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarPeriodo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: periodosKeys.all,
      });
    },
  });
}