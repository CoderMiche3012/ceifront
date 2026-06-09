import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  obtenerBeneficiarios,
  crearBeneficiario,
  actualizarBeneficiario,
  eliminarBeneficiario,
  obtenerBeneficiariosActivos,
  obtenerBeneficiarioId
} from "../services/beneficiariosService";

import { beneficiariosKeys } from "../services/beneficiariosKeys";

// obtener beneficiarios
export function useBeneficiarios() {
  return useQuery({
    queryKey: beneficiariosKeys.all,
    queryFn: obtenerBeneficiarios,
  });
}
export function useBeneficiario(id) {
  return useQuery({
    queryKey: beneficiariosKeys.detail(id),
    queryFn: () => obtenerBeneficiarioId(id),
    enabled: !!id,
  });
}
// crear beneficiario
export function useCrearBeneficiario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearBeneficiario,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
    },
  });
}

// actualizar beneficiario
export function useActualizarBeneficiario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => actualizarBeneficiario(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
    },
  });
}

// eliminar beneficiario
export function useEliminarBeneficiario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarBeneficiario,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
    },
  });
}

export const useBeneficiariosActivos = () => {
  return useQuery({
    queryKey: beneficiariosKeys.active(),
    queryFn: obtenerBeneficiariosActivos,
  });
};