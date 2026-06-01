import { useMemo } from "react";

export function useDonativosPorPeriodo( donador, periodoActivo ) {
  const donativosDelPeriodo =
    useMemo(() => {
      if ( !donador?.donativos ||!periodoActivo ) {
        return [];
      }
      return donador.donativos.filter( (d) => Number( d.id_periodo ) === Number( periodoActivo.id_periodo ) );
    }, [ donador, periodoActivo, ]);

  const totalesPorMoneda =
    useMemo(() => {
      return donativosDelPeriodo.reduce(
        ( acc, item ) => {
          const moneda = item.moneda || "MXN";
          acc[moneda] = (acc[ moneda ] || 0) + Number( item.monto || 0 );
          return acc;
        }, {}
      );
    }, [ donativosDelPeriodo, ]);

  return {
    donativosDelPeriodo,
    totalesPorMoneda,
  };
}