import {useQuery,useMutation,  useQueryClient} from "@tanstack/react-query";

import {
  obtenerSeguimientos,obtenerSeguimiento, obtenerSeguimientosPorBeneficiario, obtenerSeguimientoPorPeriodo,
  crearSeguimiento, actualizarSeguimiento, eliminarSeguimiento,
} from "./../../services/seguimientoService";

import { seguimientosKeys } from "./../../services/seguimientosKeys";
import { beneficiariosKeys } from "../../services/beneficiariosKeys";
import { expedientesKeys } from "../../../expedientes/services/expedientesKeys";
import { donadoresKeys } from "../../../donadores/services/donadoresKeys";

export function useSeguimientos() {
  return useQuery({
    queryKey:
      seguimientosKeys.all,

    queryFn:
      obtenerSeguimientos,
  });
}

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
// obtener por beneficiario
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
// obtener por beneficiario + periodo
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
// crear
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
      queryClient.invalidateQueries({
        queryKey:
          beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          expedientesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          donadoresKeys.all,
      });
    },
  });
}
// actualizar
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
      queryClient.invalidateQueries({
        queryKey:
          beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          expedientesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          donadoresKeys.all,
      });
    },
  });
}
// eliminar
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
      queryClient.invalidateQueries({
        queryKey:
          beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          expedientesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          donadoresKeys.all,
      });
    },
  });
}
