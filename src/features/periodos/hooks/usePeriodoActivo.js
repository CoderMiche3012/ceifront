//para optener el periodo que se encuentra activo en el momento

import { usePeriodos } from "./usePeriodos";

export const usePeriodoActivo = () => {
  const { data: periodos = [] } = usePeriodos();
  const periodoActivo = periodos.find( (p) => Number(p.estado) === 1 );
  return {
    periodoActivo,
    idPeriodoActivo: periodoActivo ? String(periodoActivo.id_periodo) : null,
  };
};