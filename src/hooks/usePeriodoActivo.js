import { useQuery } from "@tanstack/react-query";
import { obtenerPeriodos } from "../services/periodoService";

export const usePeriodoActivo = () => {
  return useQuery({
    queryKey: ["periodo-activo"],

    queryFn: async () => {
      const res = await obtenerPeriodos();

      const periodos = Array.isArray(res)
        ? res
        : res?.data || [];

      const periodoActivo = periodos.find(
        (p) => p.estado
      );

      return {
        periodoActivo,
        idPeriodoActivo: periodoActivo
          ? String(periodoActivo.id_periodo)
          : null,
      };
    },

    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};