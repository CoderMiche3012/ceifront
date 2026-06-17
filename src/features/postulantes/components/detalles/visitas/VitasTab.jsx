import { CalendarDays, Clock, MessageSquare } from "lucide-react";

import { ui } from "../../../../../styles/ui/index";

import Card from "../../../../../components/ui/Card";
import AccionesPostulante from "../../tabla/ColumnaAcciones";

export default function VitasTab({ visitas = [], data, puedeEditar = true }) {
  const idPostulante = data?.id_postulante;
  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatearHora = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const obtenerEstadoVisual = (visita) => {
    if (visita.estado_visita !== "Programada") {
      return visita.estado_visita;
    }

    const fechaVisita = new Date(visita.fecha_visita);
    fechaVisita.setHours(23, 59, 59, 999);

    return fechaVisita < new Date()
      ? "No realizada"
      : "Programada";
  };


  if (!visitas.length) {
    return (
      <Card className="border-2 border-dashed border-slate-200">
        {puedeEditar && (
          <div className="flex justify-end mb-4">
            <AccionesPostulante item={null} idPostulante={idPostulante} />
          </div>
        )}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <CalendarDays className="w-10 h-10 text-slate-300" />
          </div>

          <h3 className="text-slate-900 font-semibold text-lg">
            Sin visitas registradas
          </h3>

          <p className="text-sm text-slate-400 mt-1 max-w-xs">
            Aún no se han programado eventos para este proceso de ingreso.
          </p>
        </div>

      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {visitas.map((visita) => {
        const estadoVisual = obtenerEstadoVisual(visita);
        return (
          <Card
            key={visita.id_visita}
            className="group relative hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-2xl ${estadoVisual === "Realizada"
                    ? "bg-emerald-50 text-emerald-600"
                    : estadoVisual === "Programada"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-rose-50 text-rose-600"
                    }`}
                >
                  <CalendarDays size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 leading-none">
                    Visita Domiciliaria
                  </h3>
                  <span className={ui.text.label}>
                    Evento Presencial
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`${ui.badge.base} border uppercase ${estadoVisual === "Realizada"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : estadoVisual === "Programada"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}
                >
                  {estadoVisual}
                </span>
                {puedeEditar && (
                  <AccionesPostulante item={visita} idPostulante={idPostulante} />
                )}
              </div>
            </div>

            {/* informacion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <CalendarDays size={14} />
                  <span className={ui.text.label}>
                    Fecha
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {formatearFecha(visita.fecha_visita)}
                </p>
              </div>

              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Clock size={14} />
                  <span className={ui.text.label}>
                    Horario
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {formatearHora(visita.fecha_visita)}
                </p>
              </div>
            </div>

            {/* OBSERVACIONES */}
            <div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-50/50">
              <div className="flex items-center gap-2 mb-2 text-indigo-600/70">
                <MessageSquare size={14} />
                <span className={ui.text.label}>
                  Observaciones del Visitador
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed italic">
                {visita.nota_visita ||
                  "Sin comentarios adicionales registrados en el sistema."}
              </p>
            </div>

            {/* decoracion */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-12 bg-indigo-500 rounded-r-full transition-all duration-300" />
          </Card>
        );
      })}
    </div>
  );
}