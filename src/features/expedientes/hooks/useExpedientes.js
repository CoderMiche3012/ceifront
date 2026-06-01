import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  obtenerExpedientes,
  obtenerExpedientePorId,
  crearExpediente,
  actualizarExpediente,
  eliminarExpediente,
} from "../services/expedientesService";

import { expedientesKeys } from "../services/expedientesKeys";

// lista
export function useExpedientes() {
  return useQuery({
    queryKey: expedientesKeys.all,
    queryFn: obtenerExpedientes,
  });
}

// detalle
export function useExpediente(id) {
  return useQuery({
    queryKey: expedientesKeys.detail(id),

    queryFn: () =>
      obtenerExpedientePorId(id),

    enabled: !!id,
  });
}

// crear expediente
export function useCrearExpediente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearExpediente,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
    },
  });
}

// actualizar expediente
export function useActualizarExpediente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      actualizarExpediente(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
    },
  });
}

// eliminar expediente
export function useEliminarExpediente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarExpediente,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
    },
  });
}