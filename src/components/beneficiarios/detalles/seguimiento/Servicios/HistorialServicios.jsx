import { HandHelping, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { obtenerSeguimientosPorBeneficiario } from "../../../../../services/seguimientoService";
import { obtenerPeriodos } from "../../../../../services/periodoService";
import ResumenServiciosCard from "./ResumenServiciosCard";

export default function HistorialServicios({ data }) {
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
          Cargando historial de servicios...
        </p>
      </div>
    );
  }

  const periodosMap = Object.fromEntries(
    periodos.map((p) => [p.id_periodo, p])
  );

  const listaOrdenada = [...seguimientos].sort((a, b) => {
    const indexA = periodos.findIndex(
      (p) => p.id_periodo === a.id_periodo
    );

    const indexB = periodos.findIndex(
      (p) => p.id_periodo === b.id_periodo
    );

    return indexB - indexA;
  });

  const toggle = (id) => {
    setAbierto((prev) => (prev === id ? null : id));
  };

  if (!listaOrdenada.length) {
    return (
      <div className="rounded-2xl bg-white p-6 border border-slate-200">
        <p className="text-sm text-slate-500 text-center">
          Sin historial de servicios
        </p>
      </div>
    );
  }

  const contarServicios = (servicios = []) => {
    return servicios.filter((s) => s.asistencia).length;
  };

  const obtenerUltimaFecha = (servicios = []) => {
    if (!servicios.length) return null;

    const ordenadas = [...servicios].sort(
      (a, b) =>
        new Date(b.fecha_realizacion) -
        new Date(a.fecha_realizacion)
    );

    const fecha = ordenadas[0].fecha_realizacion;

    const [year, month, day] = fecha.split("-");

    return new Date(year, month - 1, day).toLocaleDateString(
      "es-MX",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

      <h3 className="text-sm font-bold text-slate-800 mb-4">
        Historial de Servicios
      </h3>

      <div className="space-y-3">

        {listaOrdenada.map((item) => {
          const periodo = periodosMap[item.id_periodo];

          const isOpen =
            abierto === item.id_seguimiento;

          const totalServicios = contarServicios(
            item.usos_servicios
          );

          const ultimaFecha = obtenerUltimaFecha(
            item.usos_servicios
          );

          return (
            <div key={item.id_seguimiento}>

              <div
                onClick={() =>
                  toggle(item.id_seguimiento)
                }
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50 transition cursor-pointer"
              >

                {/* IZQUIERDA */}
                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                    <HandHelping size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {periodo?.ciclo_escolar ||
                        "Periodo"}
                    </p>

                    <p className="text-xs text-slate-500">
                      Comedor • Psicología
                    </p>
                  </div>
                </div>

                {/* DERECHA */}
                <div className="flex items-center gap-4">

                  <div className="text-right">
                    <p className="text-[10px] uppercase text-slate-400 font-semibold">
                      Servicios
                    </p>

                    <p className="text-sm font-bold text-teal-600">
                      {totalServicios}
                    </p>
                  </div>

                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] uppercase text-slate-400 font-semibold">
                      Último registro
                    </p>

                    <p className="text-xs font-medium text-slate-600">
                      {ultimaFecha || "--"}
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
                  <ResumenServiciosCard
                    idSeguimiento={
                      item.id_seguimiento
                    }
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}