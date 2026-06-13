import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  obtenerBeneficiarios,
  crearBeneficiario,
  actualizarBeneficiario,
  eliminarBeneficiario,
  obtenerBeneficiariosActivos,
  obtenerBeneficiarioId,
  obtenerAntecedentesIngreso,
  obtenerBeneficiariosPorPeriodo,
  obtenerBeneficiariosUltimoPorPeriodo
} from "../services/beneficiariosService";

import { beneficiariosKeys } from "../services/beneficiariosKeys";
import { expedientesKeys } from "../../expedientes/services/expedientesKeys";


// obtener beneficiarios
export function useBeneficiarios(periodo) {
  return useQuery({
    queryKey: periodo
      ? beneficiariosKeys.byPeriodo(periodo)
      : beneficiariosKeys.lastByPeriod(),

    queryFn: () =>
      periodo
        ? obtenerBeneficiariosPorPeriodo({ periodo })
        : obtenerBeneficiariosUltimoPorPeriodo(),

    enabled: true,
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
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
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
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
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
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
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
export const useAntecedentesIngreso = (idBeneficiario) => {
  return useQuery({
    queryKey: ["antecedentes-ingreso", idBeneficiario],
    queryFn: () => obtenerAntecedentesIngreso(idBeneficiario),
    enabled: !!idBeneficiario,
  });
};
// obtiene a los beneficiarios que tienen un seguimiento en el periodo selccionado solo manda ese seguimiento
export function useBeneficiariosPorPeriodo({ periodo }) {
  return useQuery({
    queryKey: beneficiariosKeys.byPeriodo(periodo),
    queryFn: () => obtenerBeneficiariosPorPeriodo({ periodo }),
    enabled: !!periodo,
  });
}

// manda los datos del ultimo periodo que tiene registrado cada beneficiario
export function useBeneficiariosUltimoPorPeriodo() {
  return useQuery({
    queryKey: beneficiariosKeys.lastByPeriod(),
    queryFn: obtenerBeneficiariosUltimoPorPeriodo,
  });
}