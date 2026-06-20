import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function GraficaAnalisis({ data, porcentajeDisponible }) {
  return (
    // Mantenemos la estructura tal cual la tenías
    <div className="relative w-full h-[300px] flex items-center justify-center">
      
      <svg width="0" height="0">
        <defs>
          {/* DEGRADADO PRINCIPAL (El original, intacto) */}
          <linearGradient id="gradienteContinuo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>

          {/* DEGRADADO DISPONIBLE (Nuevo degradado Rosa a Rojo) */}
          <linearGradient id="gradienteDisponible" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f472b6" /> {/* Rosa claro */}
            <stop offset="100%" stopColor="#e11d48" /> {/* Rojo/Rose intenso */}
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
            innerRadius={70} 
            outerRadius={100}
            paddingAngle={8}
            cornerRadius={10}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell 
                key={`cell-${i}`} 
                // Aplicamos el nuevo gradiente al índice 1 (el de disponible)
                fill={i === 1 ? "url(#gradienteDisponible)" : "url(#gradienteContinuo)"} 
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Contenido central absoluto */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-[10px] tracking-[0.2em] font-bold text-gray-400">RELACIÓN</p>
        <p className="text-4xl font-black text-gray-800">{porcentajeDisponible.toFixed(0)}%</p>
      </div>
    </div>
  );
}