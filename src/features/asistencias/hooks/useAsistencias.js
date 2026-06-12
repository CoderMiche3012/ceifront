import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { crearAsistencias } from "../services/asistenciasService";
import { obtenerSeguimientos } from "../../beneficiarios/services/seguimientoService";
import { obtenerExpedientes } from "../../expedientes/services/expedientesService";
import { obtenerBeneficiarios } from "../../beneficiarios/services/beneficiariosService";
import { actualizarAsistenciasMasivo } from "../services/asistenciasService";

export const useAsistenciaData = (periodoId) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["asistencias", periodoId],

    queryFn: async () => {
      const [expedientes, beneficiarios, seguimientos] =
        await Promise.all([
          obtenerExpedientes(),
          obtenerBeneficiarios(),
          obtenerSeguimientos(),
        ]);

      console.log("EXPEDIENTES:", expedientes);
      console.log("BENEFICIARIOS:", beneficiarios);
      console.log("SEGUIMIENTOS:", seguimientos);

      return {
        expedientes: expedientes?.data || expedientes || [],
        beneficiarios: beneficiarios?.data || beneficiarios || [],
        seguimientos: seguimientos?.data || seguimientos || [],
      };
    },
    select: (res) => {
        console.log("RES COMPLETO:", res);

      const { expedientes, beneficiarios, seguimientos } = res;
      const seguimientoMap = {};
      //mapeo de seguimientos
      seguimientos
        .filter(
          (s) =>
            String(s.id_periodo) === String(periodoId) &&
            s.estatus?.toLowerCase() === "activo"
        )
        .forEach((s) => {
          //todos los usos de servicios de todos los seguimientos del beneficiario
          const todosLosServicios = s.usos_servicios || [];
          seguimientoMap[s.id_beneficiario] = {
            id_seguimiento: s.id_seguimiento,
            id_periodo: s.id_periodo,
            historial: todosLosServicios.map(serv => ({
              ...serv,
              id_asistencia_servicio: serv.id_servicio
            })),
          };
        });

      const beneficiariosProcesados = beneficiarios
  .filter((b) => seguimientoMap[b.id_beneficiario])
  .map((b) => ({
    id: b.id_beneficiario,

    nombreCompleto:
      b.expediente_resumen?.nombre_completo?.toUpperCase() ||
      "SIN NOMBRE",

    id_seguimiento:
      seguimientoMap[b.id_beneficiario]?.id_seguimiento || null,
  }));
console.log("PROCESADOS", beneficiariosProcesados);
      return {
        beneficiarios: beneficiariosProcesados,
        seguimientoMap,
      };
    },
    enabled: !!periodoId,
  });

  const mutation = useMutation({
    mutationFn: async (payload) => {
      //separar los que son para edicion y para crear
      const paraCrear = payload.filter(c => !c.id_asistencia_servicio);
      const paraEditar = payload.filter(c => c.id_asistencia_servicio);

      const promesas = [];
      if (paraCrear.length > 0) promesas.push(crearAsistencias(paraCrear));
      if (paraEditar.length > 0) promesas.push(actualizarAsistenciasMasivo(paraEditar));

      return await Promise.all(promesas);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asistencias", periodoId] });
    },
  });

  return {
    ...query,
    mutation,
  };
};

