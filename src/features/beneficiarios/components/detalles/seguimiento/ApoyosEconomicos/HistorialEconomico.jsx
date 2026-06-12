import HistorialBase from "../Historial";
import DetalleSeguimientoEconomico from "./DetalleSeguimientoEconomico";

export default function HistorialEconomicoCard({ data }) {
  const calcularTotalPeriodo = (apoyos = []) => {
    return apoyos.reduce(
      (acc, apoyo) => acc + Number(apoyo.monto || 0),
      0
    );
  };

  return (
    <HistorialBase
      title="Historial Económico"
      items={data?.historial_seguimientos ?? []}
      periodos={data?.periodos ?? []}
      periodoActivo={data?.periodoActivo}
      
      /* TÍTULO */
      renderTitulo={(item, periodo) => (
        <p className="text-sm font-semibold text-slate-800">
          Periodo escolar: {periodo?.ciclo_escolar || "Ciclo"}
        </p>
      )}

      /* SUBTÍTULO */
      renderSubtitulo={(item) => (
        <p className="text-xs text-slate-500">
          {item.apoyos_economicos?.length || 0} apoyos registrados
        </p>
      )}

      /* LADO DERECHO */
      renderMeta={(item) => (
        <div className="text-right">
          <p className="text-[10px] uppercase text-slate-400 font-semibold">
            Total Periodo
          </p>

          <p className="text-sm font-bold text-teal-600">
            $
            {calcularTotalPeriodo(
              item.apoyos_economicos
            ).toLocaleString()}
          </p>
        </div>
      )}

      /* DETALLE */
      renderDetalle={(item) => (
        <DetalleSeguimientoEconomico
          seguimiento={item} dataT={data}
        />
      )}
    />
  );
}