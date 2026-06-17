import { useQuery, useMutation, useQueryClient,} from "@tanstack/react-query";
import {obtenerVisitas,obtenerVisitaPorId,crearVisita,actualizarVisita,eliminarVisita,} from "../services/visitasService";

import { visitasKeys } from "../services/visitasKeys";
import { postulantesKeys } from "../services/postulantesKeys";

//lista
export function useVisitas() {
  return useQuery({
    queryKey: visitasKeys.all,
    queryFn: obtenerVisitas,
  });
}
// detalle
export function useVisita(id) {
  return useQuery({
    queryKey: visitasKeys.detail(id),
    queryFn: () => obtenerVisitaPorId(id),
    enabled: !!id,
  });
}

// crear
export function useCrearVisita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearVisita,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: visitasKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
    },
  });
}

// actualizar
export function useActualizarVisita() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => actualizarVisita(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: visitasKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: visitasKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
    },
  });
}
// eliminar
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

      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
    },
  });
}