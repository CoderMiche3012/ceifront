import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarUsuario } from "../services/usuariosService";
import { mapearUsuario } from "../../auth/services/mapper";

export const useActualizarPerfil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, payload }) => {
      const data = await actualizarUsuario(userId, payload);

      // normalizar respuesta
      return mapearUsuario(data);
    },

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
