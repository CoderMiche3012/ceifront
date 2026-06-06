import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { obtenerDonadores, obtenerDonadorPorId, crearDonador, actualizarDonador, } from "../services/donadoresService";
import { donadoresKeys } from "../services/donadoresKeys";

// obtener donadores
export function useDonadores() {
  return useQuery({
    queryKey: donadoresKeys.all,
    queryFn: obtenerDonadores,
  });
}

// obtener donador por id
export function useDonador(id) {
  return useQuery({
    queryKey: donadoresKeys.detail(id),
    queryFn: () => obtenerDonadorPorId(id),
    enabled: !!id,
  });
}

// crear donador
export function useCrearDonador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearDonador,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: donadoresKeys.all,
      });
    },
  });
}

// actualizar donador
export function useActualizarDonador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, }) =>
      actualizarDonador(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: donadoresKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: donadoresKeys.detail(variables.id),
      });
    },
  });
}