import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  obtenerVisitas,
  obtenerVisitaPorId,
  crearVisita,
  actualizarVisita,
  eliminarVisita,
} from "../services/visitasService";

import { visitasKeys } from "../services/visitasKeys";

// =====================
// LISTA
// =====================
export function useVisitas() {
  return useQuery({
    queryKey: visitasKeys.all,
    queryFn: obtenerVisitas,
  });
}

// =====================
// DETALLE
// =====================
export function useVisita(id) {
  return useQuery({
    queryKey: visitasKeys.detail(id),
    queryFn: () => obtenerVisitaPorId(id),
    enabled: !!id,
  });
}

// =====================
// CREAR
// =====================
export function useCrearVisita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearVisita,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: visitasKeys.all,
      });
    },
  });
}

// =====================
// ACTUALIZAR
// =====================
export function useActualizarVisita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      actualizarVisita(id, data),

    onSuccess: (_, variables) => {
      // lista
      queryClient.invalidateQueries({
        queryKey: visitasKeys.all,
      });

      // detalle específico
      queryClient.invalidateQueries({
        queryKey: visitasKeys.detail(variables.id),
      });
    },
  });
}

// =====================
// ELIMINAR
// =====================
export function useEliminarVisita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarVisita,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: visitasKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: visitasKeys.detail(variables),
      });
    },
  });
}