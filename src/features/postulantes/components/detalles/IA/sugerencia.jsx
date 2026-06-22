import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Sugerencias({ analisisIA }) {
  if (!analisisIA?.datos_graficas?.metricas_postulante) {
    return (
      <div className="p-6 text-center text-gray-500">
        Cargando análisis...
      </div>
    );
  }

  const {
    ingreso_familiar,
    gastos_totales,
    ingreso_per_capita,
    dependientes,
  } = analisisIA.datos_graficas.metricas_postulante;

  const disponible = ingreso_familiar - gastos_totales;

  const data = [
    { name: "Gastos", value: gastos_totales, color: "#f59e0b" },
    { name: "Disponible", value: disponible > 0 ? disponible : 0, color: "#10b981" },
  ];

  const porcentaje =
    ingreso_familiar > 0
      ? ((data[1].value / ingreso_familiar) * 100).toFixed(0)
      : 0;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      
      <div className="mb-6 p-4 bg-orange-50/50 border-l-4 border-orange-500 rounded-lg">
        <h3 className="text-lg font-bold text-orange-900">
          Análisis IA: Prioridad {analisisIA.prioridad}
        </h3>
        <p className="text-sm text-orange-800/80 mt-1 leading-relaxed">
          {analisisIA.justificacion}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        <div style={{ width: '100%', height: 260 }} className="relative">
          <ResponsiveContainer width={400} height={260}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                cornerRadius={10}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Centro del gráfico */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-gray-400 uppercase font-bold">
              Disponible
            </span>
            <span className="text-xl font-black text-gray-700">
              {porcentaje}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Ingreso", val: `$${ingreso_familiar}` },
            { label: "Gastos", val: `$${gastos_totales}` },
            { label: "Per Cápita", val: `$${ingreso_per_capita}` },
            { label: "Personas", val: dependientes },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 p-4 rounded-xl border border-gray-100"
            >
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                {item.label}
              </p>
              <p className="text-sm font-bold text-gray-800 mt-1">
                {item.val}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}