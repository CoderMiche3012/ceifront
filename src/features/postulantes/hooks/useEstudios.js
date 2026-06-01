import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerEstudios, obtenerEstudioPorId, crearEstudio, actualizarEstudio, eliminarEstudio, } from "../services/estudiosService";
import { estudiosKeys } from "../services/estudiosKeys";


// lista
export function useEstudios() {
  return useQuery({
    queryKey: estudiosKeys.all,
    queryFn: obtenerEstudios,
  });
}

// detalle
export function useEstudio(id) {
  return useQuery({
    queryKey: estudiosKeys.detail(id),
    queryFn: () => obtenerEstudioPorId(id),
    enabled: !!id,
  });
}

// crear estudio
export function useCrearEstudio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearEstudio,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: estudiosKeys.all,
      });
    },
  });
}

// actualizar estudio
export function useActualizarEstudio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      actualizarEstudio(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: estudiosKeys.all,
      });
    },
  });
}

// eliminar estudio
export function useEliminarEstudio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarEstudio,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: estudiosKeys.all,
      });
    },
  });
}