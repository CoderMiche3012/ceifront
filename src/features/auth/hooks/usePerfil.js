import { useQuery } from "@tanstack/react-query";
import { obtenerPerfil } from "../services/authService";
import { mapearPerfil } from "../services/mapper";
import { authKeys } from "../services/keys";

export const usePerfil = () => {
  return useQuery({
    queryKey: authKeys.perfil(),
    queryFn: async () => {
      const data = await obtenerPerfil();
      return mapearPerfil(data);
    },
    // considera inicialemnete los datos viejos
    staleTime: 0,
    // recarga el perfil si el usuario cierra o cambia de pestaña
    refetchOnWindowFocus: true,
    // pos si se pierde coneccion a internet
    refetchOnReconnect: true,
  });
};
