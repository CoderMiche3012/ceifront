import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  obtenerAsistencias,
  obtenerAsistenciaIndividual,
  obtenerAsistenciasPorFiltro,
  crearAsistencia,
  crearAsistencias,
  eliminarAsistencia,
  actualizarAsistencia,
  actualizarAsistenciasMasivo,
} from "../services/asistenciasService";

import { asistenciaKeys } from "../services/asistenciaKeys";
import { beneficiariosKeys } from "../../beneficiarios/services/beneficiariosKeys";
import { seguimientosKeys } from "../../beneficiarios/services/seguimientosKeys";
import { expedientesKeys } from "../../expedientes/services/expedientesKeys";

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


export const useCrearAsistencia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearAsistencia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asistenciaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: beneficiariosKeys.all() });
      queryClient.invalidateQueries({ queryKey: seguimientosKeys.all() });
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all() });

    },
  });
};

export const useCrearAsistenciasMasivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearAsistencias,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asistenciaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: beneficiariosKeys.all() });
      queryClient.invalidateQueries({ queryKey: seguimientosKeys.all() });
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all() });
    },
  });
};

export const useEliminarAsistencia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarAsistencia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asistenciaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: beneficiariosKeys.all() });
      queryClient.invalidateQueries({ queryKey: seguimientosKeys.all() });
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all() });
    },
  });
};

export const useActualizarAsistencia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      actualizarAsistencia(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: asistenciaKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: asistenciaKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: beneficiariosKeys.all() });
      queryClient.invalidateQueries({ queryKey: seguimientosKeys.all() });
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all() });
    },
  });
};

export const useActualizarAsistenciasMasivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actualizarAsistenciasMasivo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: asistenciaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: beneficiariosKeys.all() });
      queryClient.invalidateQueries({ queryKey: seguimientosKeys.all() });
      queryClient.invalidateQueries({ queryKey: expedientesKeys.all() });
    },
  });
};