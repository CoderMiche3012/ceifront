import { useMemo } from "react";
import {
  Utensils,
  Brain,
  ChevronRight,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { obtenerSeguimiento } from "../../../../../services/seguimientoService";

export default function ResumenServiciosCard({ idSeguimiento }) {
  const { data, isLoading } = useQuery({
    queryKey: ["seguimiento-servicios", idSeguimiento],
    queryFn: () => obtenerSeguimiento(idSeguimiento),
    enabled: !!idSeguimiento,
  });

  const resumen = useMemo(() => {
    const servicios = data?.usos_servicios || [];

    const comedor = servicios.filter(
      (s) => s.tipo_servicio === "comedor" && s.asistencia
    );

    const psicologia = servicios.filter(
      (s) => s.tipo_servicio === "psicologia" && s.asistencia
    );

    const totalAcompanantes = servicios.reduce(
      (total, servicio) =>
        total + (Number(servicio.numero_acompanantes) || 0),
      0
    );

    return {
      comedor: comedor.length,
      psicologia: psicologia.length,
      acompanantes: totalAcompanantes,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl border border-slate-200 bg-white animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* COMEDOR */}
      <div className="group bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center">
              <Utensils size={20} className="text-teal-600" />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
                Servicio de Comedor
              </p>

              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-extrabold text-slate-800">
                  {resumen.comedor}
                </h3>

                <span className="text-sm text-slate-500 mb-1">
                  asistencias totales
                </span>
              </div>
            </div>
          </div>

          <ChevronRight
            size={18}
            className="text-slate-300 group-hover:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* PSICOLOGÍA */}
      <div className="group bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
              <Brain size={20} className="text-indigo-600" />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
                Servicio de Psicología
              </p>

              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-extrabold text-slate-800">
                  {resumen.psicologia}
                </h3>

                <span className="text-sm text-slate-500 mb-1">
                  sesiones completadas
                </span>
              </div>
            </div>
          </div>

          <ChevronRight
            size={18}
            className="text-slate-300 group-hover:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* ACOMPAÑANTES */}
      <div className="group bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
              <Users size={20} className="text-amber-600" />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
                Acompañantes
              </p>

              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-extrabold text-slate-800">
                  {resumen.acompanantes}
                </h3>

                <span className="text-sm text-slate-500 mb-1">
                  familiares asistentes
                </span>
              </div>
            </div>
          </div>

          <ChevronRight
            size={18}
            className="text-slate-300 group-hover:text-slate-500 transition-colors"
          />
        </div>
      </div>

    </div>
  );
}