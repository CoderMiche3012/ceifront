import { useBeneficiarios } from "../../beneficiarios/hooks/useBeneficiarios";
import {
  useCrearAsistenciasMasivo,
  useActualizarAsistenciasMasivo,
} from "./useAsistencia";

export const useAsistenciaData = (periodoId) => {
  const crearAsistencias = useCrearAsistenciasMasivo();
  const actualizarAsistencias = useActualizarAsistenciasMasivo();

  const {
    data: beneficiarios = [],
    isLoading,
    error,
  } = useBeneficiarios(periodoId);


  const beneficiariosProcesados = (beneficiarios || []).map((b) => ({
    id: b.id_beneficiario,
    nombreCompleto:
      b.expediente_resumen?.nombre_completo?.toUpperCase() ||
      "SIN NOMBRE",
    seguimiento: b.seguimiento,
    asistencias: b.seguimiento?.usos_servicios || [],
    id_seguimiento: b.seguimiento?.id_seguimiento || null,
  }));

  const guardarAsistencias = async (payload) => {
    const paraCrear = payload.filter((c) => !c.id_asistencia_servicio);
    const paraEditar = payload.filter((c) => c.id_asistencia_servicio);

    const promesas = [];

    if (paraCrear.length) {
      promesas.push(crearAsistencias.mutateAsync(paraCrear));
    }

    if (paraEditar.length) {
      promesas.push(actualizarAsistencias.mutateAsync(paraEditar));
    }

    return Promise.all(promesas);
  };

  return {
    data: beneficiariosProcesados,
    isLoading,
    error,

    mutation: {
      guardarAsistencias,
      isLoading:
        crearAsistencias.isPending ||
        actualizarAsistencias.isPending,
    },
  };
};

