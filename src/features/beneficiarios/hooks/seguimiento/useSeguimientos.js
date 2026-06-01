
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  obtenerSeguimientos,
  obtenerSeguimiento,
  obtenerSeguimientosPorBeneficiario,
  obtenerSeguimientoPorPeriodo,
  crearSeguimiento,
  actualizarSeguimiento,
  eliminarSeguimiento,
} from "./../../services/seguimientoService";

import { seguimientosKeys } from "./../../services/seguimientosKeys";

// ==============================
// obtener todos
// ==============================
export function useSeguimientos() {
  return useQuery({
    queryKey:
      seguimientosKeys.all,

    queryFn:
      obtenerSeguimientos,
  });
}

// ==============================
// obtener uno por id
// ==============================
export function useSeguimiento(
  id
) {
  return useQuery({
    queryKey:
      seguimientosKeys.detail(
        id
      ),

    queryFn: () =>
      obtenerSeguimiento(
        id
      ),

    enabled: !!id,
  });
}

// ==============================
// obtener por beneficiario
// ==============================
export function useSeguimientosPorBeneficiario(
  id_beneficiario
) {
  return useQuery({
    queryKey:
      seguimientosKeys.byBeneficiario(
        id_beneficiario
      ),

    queryFn: () =>
      obtenerSeguimientosPorBeneficiario(
        id_beneficiario
      ),

    enabled:
      !!id_beneficiario,
  });
}

// ==============================
// obtener por beneficiario + periodo
// ==============================
export function useSeguimientoPorPeriodo({
  id_beneficiario,
  id_periodo,
}) {
  return useQuery({
    queryKey:
      seguimientosKeys.byPeriodo({
        id_beneficiario,
        id_periodo,
      }),

    queryFn: () =>
      obtenerSeguimientoPorPeriodo({
        id_beneficiario,
        id_periodo,
      }),

    enabled:
      !!id_beneficiario &&
      !!id_periodo,
  });
}

// ==============================
// crear
// ==============================
export function useCrearSeguimiento() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      crearSeguimiento,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          seguimientosKeys.all,
      });
    },
  });
}

// ==============================
// actualizar
// ==============================
export function useActualizarSeguimiento() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }) =>
      actualizarSeguimiento(
        id,
        data
      ),

    onSuccess: (
      _,
      variables
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          seguimientosKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey:
          seguimientosKeys.detail(
            variables.id
          ),
      });
    },
  });
}

// ==============================
// eliminar
// ==============================
export function useEliminarSeguimiento() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      eliminarSeguimiento,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          seguimientosKeys.all,
      });
    },
  });
}
