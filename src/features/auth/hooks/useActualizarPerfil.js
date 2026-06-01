import { useMutation, useQueryClient } from "@tanstack/react-query";

import { actualizarPerfil } from "../services/authService";
import { mapearUsuario } from "../services/mapper";
import { authKeys } from "../services/keys";

export const useActualizarPerfil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // envia los datos a modificar
    mutationFn: async (payload) => {
      const data = await actualizarPerfil(payload);
      return mapearUsuario(data);
    },
    // si se realizo todo exitosamente
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: authKeys.perfil(),
      });
      queryClient.invalidateQueries({
        queryKey: ["usuarios"],
      });
      const usuarioActual = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem("user", JSON.stringify
        ({
          ...usuarioActual,
          ...data,
        })
      );
      window.dispatchEvent(
        new Event("storage")
      );
    },
  });
};
