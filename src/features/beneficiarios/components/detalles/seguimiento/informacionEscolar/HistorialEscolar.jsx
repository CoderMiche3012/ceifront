import HistorialBase from "./../Historial";
import DetalleSeguimientoEscolar from "./DetalleSeguimientoEscolar";

export default function HistorialEscolarCard({ data }) {
  const calcularPromedio = (boletas) => {
    if (!boletas?.length) return null;

    const suma = boletas.reduce(
      (acc, b) => acc + Number(b.promedio_boleta || 0),
      0
    );

    return (suma / boletas.length).toFixed(2);
  };

  return (
    <HistorialBase
      title="Historial Escolar"
      items={data?.historial_seguimientos ?? []}
      periodos={data?.periodos ?? []}
      periodoActivo={data?.periodoActivo}

      /* 🟢 TÍTULO PRINCIPAL */
      renderTitulo={(item, periodo) => (
        <p className="text-sm font-semibold text-slate-800">
          Periodo escolar: {periodo?.ciclo_escolar || "Ciclo"}
        </p>
      )}

      /* 🟢 SUBTÍTULO */
      renderSubtitulo={(item) => (
        <p className="text-xs text-slate-500">
          {item.datos_escolares?.id_escolaridad?.nivel_escolar || "Nivel"} •{" "}
          {item.datos_escolares?.id_escolaridad?.grado_escolar || "Grado"}
        </p>
      )}

      /* 🟢 LADO DERECHO (variable: promedio, cantidad, estado, etc) */
      renderMeta={(item) => (
        <div className="text-right">
          <p className="text-[10px] uppercase text-slate-400 font-semibold">
            Promedio
          </p>
          <p className="text-sm font-bold text-teal-600">
            {calcularPromedio(item.datos_escolares?.boletas) ?? "--"}
          </p>
        </div>
      )}

      /* 🟢 DETALLE EXPANDIBLE */
      renderDetalle={(item) => (
        <DetalleSeguimientoEscolar
          seguimiento={item}
          id_expediente={data?.id_expediente}
        />
      )}
    />
  );
}