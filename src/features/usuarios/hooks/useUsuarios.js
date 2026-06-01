import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  obtenerUsuarios, crearUsuario, actualizarUsuario,
  activarUsuario, desactivarUsuario,
} from "../services/usuariosService";

import { usuariosKeys } from "../services/usuariosKeys";

// obtener usuarios
export function useUsuarios() {
  return useQuery({
    queryKey: usuariosKeys.all,
    queryFn: obtenerUsuarios,
  });
}

// crear usuario
export function useCrearUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearUsuario,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usuariosKeys.all,
      });
    },
  });
}


// actualizar usuario
export function useActualizarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      actualizarUsuario(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usuariosKeys.all,
      });
    },
  });
}


// activar usuario
export function useActivarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activarUsuario,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usuariosKeys.all,
      });
    },
  });
}


// desactivar usuario
export function useDesactivarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: desactivarUsuario,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usuariosKeys.all,
      });
    },
  });
}