import { useMemo } from "react";

import { useSeguimientosPorBeneficiario } from "./useSeguimientos";
import { usePeriodos } from "../../../periodos/hooks/usePeriodos";

export function useSeguimientoLinea(id_beneficiario) {

  // ======================
  // DATA
  // ======================
  const { data: seguimientos = [] } =
    useSeguimientosPorBeneficiario(id_beneficiario);

  const { data: periodos = [], isLoading: loadingPer } =
    usePeriodos();

  // ======================
  // MAPA PERIODOS
  // ======================
  const periodosMap = useMemo(() => {
    return Object.fromEntries(
      periodos.map((p) => [p.id_periodo, p.ciclo_escolar])
    );
  }, [periodos]);

  // ======================
  // FILTRO BENEFICIARIO
  // ======================
  const lista = useMemo(() => {
    return seguimientos.filter(
      (s) => s.id_beneficiario === id_beneficiario
    );
  }, [seguimientos, id_beneficiario]);

  // ======================
  // ORDENADOS
  // ======================
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

  // ======================
  // MÁS RECIENTE
  // ======================
  const idMasReciente = listaOrdenada[0]?.id_periodo;

  // ======================
  // USADOS
  // ======================
  const usadosIds = useMemo(() => {
    return lista.map((s) => s.id_periodo);
  }, [lista]);

  // ======================
  // DISPONIBLES
  // ======================
  const periodosDisponibles = useMemo(() => {
    return periodos.filter(
      (p) => !usadosIds.includes(p.id_periodo)
    );
  }, [periodos, usadosIds]);

  // ======================
  // RETURN
  // ======================
  return {
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