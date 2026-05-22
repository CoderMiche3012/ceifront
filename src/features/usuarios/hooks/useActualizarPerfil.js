import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarUsuario } from "../services/usuariosService";


export const useActualizarPerfil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }) =>
      actualizarUsuario(userId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["auth", "perfil", variables.userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["usuarios"],
      });
    },
  });
};