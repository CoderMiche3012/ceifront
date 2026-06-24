import HeaderAnalisis from "./HeaderAnalisis";
import GraficaAnalisis from "./GraficaAnalisis";
import MetricasAnalisis from "./MetricasAnalisis";
import { useLayoutEffect, useRef, useState } from "react";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export default function SugerenciasIA({ analisisIA }) {
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (chartRef.current?.clientHeight > 0) {
      setReady(true);
    }
  }, []);

  if (!analisisIA?.datos_graficas?.metricas_postulante) return null;

  const m = analisisIA.datos_graficas.metricas_postulante;

  const ingreso = m.ingreso_familiar || 0;
  const gastos = m.gastos_totales || 0;

  const disponible = ingreso - gastos;
  const total = ingreso > 0 ? ingreso : 0;

  const pctGastos =
    total > 0 ? Math.round((gastos / total) * 100) : 0;

  const pctDisponible =
    total > 0 ? Math.round(((total - gastos) / total) * 100) : 0;

  const data = [
    { name: "Gastos", value: gastos },
    { name: "Disponible", value: disponible },
  ];

  const listaMetricas = [
    { label: "Ingreso familiar", val: `$${formatMoney(m.ingreso_familiar)}` },
    { label: "Gastos Totales", val: `$${formatMoney(m.gastos_totales)}` },
    { label: "Ingreso Per Cápita", val: `$${formatMoney(m.ingreso_per_capita)}` },
    { label: "Integrantes dependientes", val: m.dependientes },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <HeaderAnalisis
        prioridad={analisisIA.prioridad}
        justificacion={analisisIA.justificacion}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        <div ref={chartRef} className="h-72 w-full">
          {ready && (
            <GraficaAnalisis
              data={data}
              valorOcupado={pctGastos}
              valorDisponible={pctDisponible}
            />
          )}
        </div>

        <MetricasAnalisis datos={listaMetricas} />
      </div>
    </div>
  );
}