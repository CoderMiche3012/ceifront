import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";

import {
  obtenerDonativos, obtenerDonativoPorId, obtenerDonativosConPeriodo,
  crearDonativo, actualizarDonativo,
} from "../services/donativosService";

import { donativosKeys } from "../services/donativosKeys";

// obtener donativos
export function useDonativos() {
  return useQuery({
    queryKey: donativosKeys.list(),
    queryFn: obtenerDonativos,
  });
}

// obtener donativo por id
export function useDonativo(id) {
  return useQuery({
    queryKey: donativosKeys.detail(id),
    queryFn: () => obtenerDonativoPorId(id),
    enabled: !!id,
  });
}

// obtener donativos con periodo
export function useDonativosConPeriodo() {
  return useQuery({
    queryKey: donativosKeys.conPeriodo(),
    queryFn: obtenerDonativosConPeriodo,
  });
}

// crear donativo
export function useCrearDonativo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearDonativo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: donativosKeys.all,
      });
    },
  });
}

// actualizar donativo
export function useActualizarDonativo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, }) => actualizarDonativo( id, data ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: donativosKeys.all,
      });
    },
  });
}