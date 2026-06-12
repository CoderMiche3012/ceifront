import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { eliminarApoyo , actualizarApoyo ,obtenerApoyos,obtenerApoyo,crearApoyo   } from "../services/apoyosService";
import { apoyoKeys } from "./../services/apoyoKeys";
import { beneficiariosKeys } from "./../services/beneficiariosKeys";
import { expedientesKeys } from "./../../expedientes/services/expedientesKeys";
import { seguimientosKeys } from "../services/seguimientosKeys";
export const useApoyos = () => {
  return useQuery({
    queryKey: apoyoKeys.lists(),
    queryFn: obtenerApoyos,
    staleTime: 1000 * 60 * 5,
  });
};
export const useApoyo = (id) => {
  return useQuery({
    queryKey: apoyoKeys.detail(id),
    queryFn: () => obtenerApoyo(id),
    enabled: !!id,
  });
};

export const useCrearApoyo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearApoyo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: apoyoKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });
    },
  });
};

export const useActualizarApoyo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      actualizarApoyo(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: apoyoKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: apoyoKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });
    },
  });
};

export const useEliminarApoyo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarApoyo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: apoyoKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: beneficiariosKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: expedientesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: seguimientosKeys.all,
      });
    },
  });
};