import { CalendarDays, Clock, MessageSquare, Info } from "lucide-react";
import AccionesPostulante from "../tabla/ColumnaAcciones"; 

export default function CitaTab({ visitas = [], onRefresh }) {
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

  if (!visitas.length) {
    return (
      <div className="rounded-3xl bg-slate-50/50 p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <CalendarDays className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-slate-900 font-semibold text-lg">Sin visitas registradas</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-xs">
          Aún no se han programado eventos para este proceso de ingreso.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visitas.map((visita) => (
        <div
          key={visita.id_visita}
          className="group relative rounded-3xl bg-white p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
        >
          {/* Encabezado: Estatus y Menú de Acciones */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${
                visita.estado_visita === "Realizada" ? "bg-emerald-50 text-emerald-600" :
                visita.estado_visita === "Programada" ? "bg-amber-50 text-amber-600" :
                "bg-slate-50 text-slate-500"
              }`}>
                <CalendarDays size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 leading-none">Visita Domiciliaria</h3>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Evento Presencial</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter border ${
                visita.estado_visita === "Realizada" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                visita.estado_visita === "Programada" ? "bg-amber-50 text-amber-700 border-amber-100" :
                "bg-rose-50 text-rose-700 border-rose-100"
              }`}>
                {visita.estado_visita}
              </span>
              
              {/* COMPONENTE DE ACCIONES */}
              <AccionesPostulante 
                item={visita} 
                onRefresh={onRefresh} 
              />
            </div>
          </div>

          {/* Grid de Información Detallada */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <CalendarDays size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Fecha</span>
              </div>
              <p className="text-sm font-semibold text-slate-700">{formatearFecha(visita.fecha_visita)}</p>
            </div>
            
            <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-50">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Clock size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Horario</span>
              </div>
              <p className="text-sm font-semibold text-slate-700">{formatearHora(visita.fecha_visita)}</p>
            </div>
          </div>

          {/* Sección de Observaciones */}
          <div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-50/50">
            <div className="flex items-center gap-2 mb-2 text-indigo-600/70">
              <MessageSquare size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Observaciones del Visitador</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              {visita.nota_visita || "Sin comentarios adicionales registrados en el sistema."}
            </p>
          </div>

          {/* Decoración sutil de hover */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-12 bg-indigo-500 rounded-r-full transition-all duration-300" />
        </div>
      ))}
    </div>
  );
}