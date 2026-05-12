import { BookOpen, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { obtenerSeguimientosPorBeneficiario } from "../../../../../services/seguimientoService";
import { obtenerPeriodos } from "../../../../../services/periodoService";
import DetalleSeguimientoEscolar from "./DetalleSeguimientoEscolar";


export default function HistorialEscolarCard({ data }) {
  const id_beneficiario = data?.id_beneficiario;

  const [abierto, setAbierto] = useState(null);
  const {
    data: seguimientos = [],
    isLoading: loadingSeg,
  } = useQuery({
    queryKey: ["seguimientos", id_beneficiario],
    queryFn: () => obtenerSeguimientosPorBeneficiario(id_beneficiario),
    enabled: !!id_beneficiario,
  });
  const {
    data: periodos = [],
    isLoading: loadingPer,
  } = useQuery({
    queryKey: ["periodos"],
    queryFn: obtenerPeriodos,
  });
  if (loadingSeg || loadingPer) {
    return (
      <div className="rounded-2xl bg-white p-6 border border-slate-200">
        <p className="text-sm text-slate-500 text-center">
          Cargando historial...
        </p>
      </div>
    );
  }

  const periodosMap = Object.fromEntries(
    periodos.map((p) => [p.id_periodo, p])
  );

  const listaOrdenada = [...seguimientos].sort((a, b) => {
    const indexA = periodos.findIndex(p => p.id_periodo === a.id_periodo);
    const indexB = periodos.findIndex(p => p.id_periodo === b.id_periodo);
    return indexB - indexA;
  });

  const toggle = (id) => {
    setAbierto(prev => (prev === id ? null : id));
  };

  if (!listaOrdenada.length) {
    return (
      <div className="rounded-2xl bg-white p-6 border border-slate-200">
        <p className="text-sm text-slate-500 text-center">
          Sin historial escolar
        </p>
      </div>
    );
  }
  const calcularPromedio = (boletas) => {
  if (!boletas || boletas.length === 0) return null;

  const suma = boletas.reduce(
    (acc, b) => acc + Number(b.promedio_boleta || 0),
    0
  );

  return (suma / boletas.length).toFixed(2);
};

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      <h3 className="text-sm font-bold text-slate-800 mb-4">
        Historial Escolar
      </h3>

      <div className="space-y-3">

        {listaOrdenada.map((item) => {
          const periodo = periodosMap[item.id_periodo];
          const isOpen = abierto === item.id_seguimiento;

          return (
            <div key={item.id_seguimiento}>

              <div
                onClick={() => toggle(item.id_seguimiento)}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50 transition cursor-pointer"
              >
                {/* IZQUIERDA */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                    <BookOpen size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {periodo?.ciclo_escolar || "Ciclo"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {item.datos_escolares?.id_escolaridad?.nivel_escolar || "Nivel"} • {item.datos_escolares?.id_escolaridad?.grado_escolar || "Grado"}
                    </p>
                  </div>
                </div>

                {/* DERECHA */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-slate-400 font-semibold">
                      Promedio
                    </p>
                    <p className="text-sm font-bold text-teal-600">
                      {calcularPromedio(item.datos_escolares?.boletas) ?? "--"}
                    </p>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </div>

              <div
                className={`transition-all duration-300 ${isOpen ? "mt-2" : "hidden"
                  }`}
              >
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <DetalleSeguimientoEscolar idSeguimiento={item.id_seguimiento} />
                </div>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}
