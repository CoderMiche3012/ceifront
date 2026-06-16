import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerPeriodos, obtenerPeriodoActivo, crearPeriodo, actualizarPeriodo } from "../services/periodoService";
import { periodosKeys } from "../services/periodosKeys";
import { beneficiariosKeys } from "../../beneficiarios/services/beneficiariosKeys";
import { donadoresKeys } from "../../donadores/services/donadoresKeys";
import { expedientesKeys } from "../../expedientes/services/expedientesKeys";
import { seguimientosKeys } from "../../beneficiarios/services/seguimientosKeys";
import { apoyoKeys } from "../../beneficiarios/services/apoyoKeys";
import { boletasKeys } from "../../beneficiarios/services/boletasKeys";
import { datosEscolaresKeys } from "../../beneficiarios/services/datosEscolaresKeys";
import { obligacionesKeys } from "../../beneficiarios/services/obligacionesKeys";
import { asistenciaKeys } from "../../asistencias/services/asistenciaKeys";


// obtener todos los periodos
export function usePeriodos() {
  return useQuery({
    queryKey: periodosKeys.list(),
    queryFn: obtenerPeriodos,
  });
}

// obtener periodo activo
export function usePeriodoActivo() {
  return useQuery({
    queryKey: periodosKeys.active(),
    queryFn: obtenerPeriodoActivo,
  });
}

// crear periodo
export function useCrearPeriodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearPeriodo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: periodosKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: periodosKeys.active(),
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
      queryClient.invalidateQueries({
        queryKey:
          seguimientosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          apoyoKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          boletasKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          datosEscolaresKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          obligacionesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          asistenciaKeys.all,
      });
    },
  });
}

// actualizar periodo
export function useActualizarPeriodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => actualizarPeriodo(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: periodosKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: periodosKeys.active(),
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
      queryClient.invalidateQueries({
        queryKey:
          seguimientosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          apoyoKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          boletasKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          datosEscolaresKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          obligacionesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey:
          asistenciaKeys.all,
      });
    },
  });
}
