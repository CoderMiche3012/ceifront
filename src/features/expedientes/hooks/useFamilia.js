import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  obtenerFamilia,
  obtenerFamiliaId,
  crearFamilia,
  actualizarFamilia,
  eliminarFamilia,
} from "../services/familiaService";

import { familiaKeys } from "../services/familiaKeys";
import { postulantesKeys } from "../../postulantes/services/postulantesKeys";
import { beneficiariosKeys } from "../../beneficiarios/services/beneficiariosKeys";
import { expedientesKeys } from "../services/expedientesKeys";
// lista
export function useFamilia() {
  return useQuery({
    queryKey: familiaKeys.all,
    queryFn: obtenerFamilia,
  });
}

// detalle
export function useFamiliaDetalle(id) {
  return useQuery({
    queryKey: familiaKeys.detail(id),

    queryFn: () =>
      obtenerFamiliaId(id),

    enabled: !!id,
  });
}

// crear familia
export function useCrearFamilia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearFamilia,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: familiaKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
    },
  });
}

// actualizar familia
export function useActualizarFamilia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      actualizarFamilia(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: familiaKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
    },
  });
}

// eliminar familia
export function useEliminarFamilia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarFamilia,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: familiaKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });

    },
  });
}