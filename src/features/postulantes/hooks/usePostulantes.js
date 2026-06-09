import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerPostulantes, obtenerPostulantePorId, crearPostulante, actualizarPostulante, eliminarPostulante,aceptarPostulante } from "../services/postulantesService";
import { postulantesKeys } from "../services/postulantesKeys";
import { actualizarEstudio } from "../services/estudiosService";
import { estudiosKeys } from "../services/estudiosKeys";

export function useActualizarEstudioDetalle(id) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      actualizarEstudio(id, data),

    onSuccess: (nuevoEstudio) => {
      queryClient.setQueryData(
        estudiosKeys.detail(id),
        nuevoEstudio
      );

      queryClient.invalidateQueries({
        queryKey: estudiosKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
    }
  });
}

// lista
export function usePostulantes() {
  return useQuery({
    queryKey: postulantesKeys.all,
    queryFn: obtenerPostulantes,
  });
}

// detalle
export function usePostulante(id) {
  return useQuery({
    queryKey: postulantesKeys.detail(id),
    queryFn: () => obtenerPostulantePorId(id),
    enabled: !!id,
  });
}

// crear
export function useCrearPostulante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearPostulante,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
    },
  });
}

// actualizar
export function useActualizarPostulante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      actualizarPostulante(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
    },
  });
}

export function useActualizarPostulanteDetalle(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => actualizarPostulante(id, data),

    onSuccess: (nuevoData) => {
      queryClient.setQueryData(
        postulantesKeys.detail(id),
        (old) => ({
          ...old,
          ...nuevoData,
        })
      );

      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
    },
  });

}
// eliminar
export function useEliminarPostulante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarPostulante,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
    },
  });
}

// aceptar al postulante
export function useAceptarPostulante() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => aceptarPostulante(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postulantesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: postulantesKeys.detail,
      });
    },
  });
}