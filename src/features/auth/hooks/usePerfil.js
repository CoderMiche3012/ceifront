import { useQuery } from "@tanstack/react-query";
import { obtenerPerfil } from "../services/authService";
import { mapearPerfil } from "../services/mapper";
import { authKeys } from "../services/keys";

export const usePerfil = (userId) => {
  return useQuery({
    queryKey: authKeys.perfil(userId),
    queryFn: async () => {
      const data = await obtenerPerfil(userId);
      return mapearPerfil(data);
    },
    enabled: !!userId,
  });
};