import { useMutation, useQueryClient } from "@tanstack/react-query";
import { iniciarSesion } from "../services/authService";
import { mapearInicioSesion } from "../services/mapper";
import { guardarSesionLocal } from "../../../storage/userStorage";

export const useInicioSesion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const data = await iniciarSesion(payload);
      console.log(mapearInicioSesion(data));
      return mapearInicioSesion(data);
    },
    onSuccess: (data) => {
      guardarSesionLocal(data);
      window.dispatchEvent(new Event("storage"));
      queryClient.clear();
    },
  });
};