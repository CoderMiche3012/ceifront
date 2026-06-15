import { useQuery } from "@tanstack/react-query";
import {
  obtenerAsistencias,
  obtenerAsistenciaIndividual,
  obtenerAsistenciasPorFiltro,
} from "../services/asistenciasService";
import { asistenciaKeys } from "../services/asistenciaKeys";

export const useAsistencias = () => {
  return useQuery({
    queryKey: asistenciaKeys.lists(),
    queryFn: obtenerAsistencias,
  });
};

export const useAsistencia = (id) => {
  return useQuery({
    queryKey: asistenciaKeys.detail(id),
    queryFn: () => obtenerAsistenciaIndividual(id),
    enabled: !!id,
  });
};

export const useAsistenciasPorFiltro = (mes, servicio) => {
  return useQuery({
    queryKey: asistenciaKeys.filtro(mes, servicio),
    queryFn: () => obtenerAsistenciasPorFiltro(mes, servicio),
    enabled: !!mes && !!servicio,
  });
};