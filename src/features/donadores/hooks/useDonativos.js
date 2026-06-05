import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  obtenerDonativos,
  obtenerDonativoPorId,
  crearDonativo,
  actualizarDonativo,
  obtenerDonativosPorDonadorPeriodo,
  obtenerDonativosPorDonador,
  obtenerResumenDonativos,
  obtenerPeriodosDonativosPorDonador,
  obtenerDonativosPeriodoActivo,
  obtenerResumenPeriodo,
} from "../services/donativosService";

import { donativosKeys } from "../services/donativosKeys";

// obtener todos los donativos
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

// obtener donativos de un donador en un periodo
export function useDonativosPorDonadorPeriodo(
  idDonador,
  idPeriodo
) {
  return useQuery({
    queryKey:
      donativosKeys.porDonadorPeriodo(
        idDonador,
        idPeriodo
      ),
    queryFn: () =>
      obtenerDonativosPorDonadorPeriodo(
        idDonador,
        idPeriodo
      ),
    enabled:
      !!idDonador && !!idPeriodo,
  });
}

// obtener todos los donativos de un donador
export function useDonativosPorDonador(
  idDonador
) {
  return useQuery({
    queryKey:
      donativosKeys.porDonador(
        idDonador
      ),
    queryFn: () =>
      obtenerDonativosPorDonador(
        idDonador
      ),
    enabled: !!idDonador,
  });
}

// resumen de donativos por periodo
export function useResumenDonativos(
  idPeriodo
) {
  return useQuery({
    queryKey:
      donativosKeys.resumen(
        idPeriodo
      ),
    queryFn: () =>
      obtenerResumenDonativos(
        idPeriodo
      ),
    enabled: !!idPeriodo,
  });
}

// resumen general del periodo
export function useResumenPeriodo(
  idPeriodo
) {
  return useQuery({
    queryKey:
      donativosKeys.resumenPeriodo(
        idPeriodo
      ),
    queryFn: () =>
      obtenerResumenPeriodo(
        idPeriodo
      ),
    enabled: !!idPeriodo,
  });
}

// periodos válidos de un donador
export function usePeriodosDonativosPorDonador(
  idDonador
) {
  return useQuery({
    queryKey:
      donativosKeys.periodosDonador(
        idDonador
      ),
    queryFn: () =>
      obtenerPeriodosDonativosPorDonador(
        idDonador
      ),
    enabled: !!idDonador,
  });
}

// donativos del periodo activo
export function useDonativosPeriodoActivo() {
  return useQuery({
    queryKey:
      donativosKeys.periodoActivo(),
    queryFn:
      obtenerDonativosPeriodoActivo,
  });
}

// crear donativo
export function useCrearDonativo() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: crearDonativo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          donativosKeys.all,
      });
    },
  });
}

// actualizar donativo
export function useActualizarDonativo() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      actualizarDonativo(
        id,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          donativosKeys.all,
      });
    },
  });
}