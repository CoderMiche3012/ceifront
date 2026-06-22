import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function GraficaAnalisis({
  data,
  valorOcupado,
  valorDisponible,
}) {
  return (
    <div className="relative w-full h-[300px] flex items-center justify-center">
      {/* Gradientes */}
      <svg width="0" height="0">
        <defs>
          {/* Azul para Disponible */}
          <linearGradient id="gradienteDisponible" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>

          {/* Rojo para Gastos */}
          <linearGradient id="gradienteGastos" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={95}
            outerRadius={140}
            paddingAngle={8}
            cornerRadius={14}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={
                  i === 0
                    ? "url(#gradienteGastos)"
                    : "url(#gradienteDisponible)"
                }
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Centro minimalista */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-6xl font-black text-rose-500 leading-none drop-shadow-sm">
          {valorOcupado}%
        </span>

        <span className="text-sm font-semibold text-gray-500 mt-1 tracking-wide uppercase">
          Gastos
        </span>

        <div className="w-16 h-[3px] rounded-full bg-gradient-to-r from-rose-400 to-cyan-400 my-3"></div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
          <span className="text-base font-bold text-cyan-600">
            {valorDisponible}% Disponible
          </span>
        </div>
      </div>
    </div>
  );
}