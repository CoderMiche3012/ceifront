import { useMemo } from "react";

import { useSeguimientosPorBeneficiario } from "./useSeguimientos";
import { usePeriodos } from "../../../periodos/hooks/usePeriodos";

export function useSeguimientoLinea(id_beneficiario) {

  const { data: seguimientos = [] } = useSeguimientosPorBeneficiario(id_beneficiario);
  const { data: periodos = [], isLoading: loadingPer } =usePeriodos();
  // mapa de periodos
  const periodosMap = useMemo(() => {
    return Object.fromEntries(
      periodos.map((p) => [p.id_periodo, p.ciclo_escolar])
    );
  }, [periodos]);
  // filtro
  const lista = useMemo(() => {
    return seguimientos.filter(
      (s) => s.id_beneficiario === id_beneficiario
    );
  }, [seguimientos, id_beneficiario]);

  // periodos ordenados
  const listaOrdenada = useMemo(() => {
    return [...lista].sort((a, b) => {
      const indexA = periodos.findIndex(
        (p) => p.id_periodo === a.id_periodo
      );
      const indexB = periodos.findIndex(
        (p) => p.id_periodo === b.id_periodo
      );
      return indexB - indexA;
    });
  }, [lista, periodos]);

  // periodo mas reciente
  const idMasReciente = listaOrdenada[0]?.id_periodo;

  // en uso
  const usadosIds = useMemo(() => {
    return lista.map((s) => s.id_periodo);
  }, [lista]);

  // disponibles
  const periodosDisponibles = useMemo(() => {
    return periodos.filter(
      (p) => !usadosIds.includes(p.id_periodo)
    );
  }, [periodos, usadosIds]);

  return {
    listaOrdenada,
    // data lista principal
    seguimientos: listaOrdenada,
    // periodos
    periodos,
    periodosMap,
    periodosDisponibles,
    // helpers
    idMasReciente,
    loadingPer,
  };
}