import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  actualizarExpediente,
} from "../../../expedientes/services/expedientesService";

import { actualizarDireccion } from "../../../expedientes/services/expedientesService";
import { actualizarEstudio } from "../../services/estudiosService";

export function useActualizarExpedienteCompleto(idPostulante) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ form, direccion, data }) => {
      const { id_expediente, id_direccion, id_estudio } = data;

      await Promise.all([
        actualizarExpediente(id_expediente, form),
        actualizarDireccion(id_direccion, direccion),
        actualizarEstudio(id_estudio, {
          nivel_escolar_inicial: form.nivel_escolar_inicial,
          grado_escolar_inicial: form.grado_escolar_inicial,
          referencia_ingreso: form.referencia_ingreso,
          referencia_casa: form.referencia_casa,
        }),
      ]);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["postulante", idPostulante],
      });
    },
  });
}