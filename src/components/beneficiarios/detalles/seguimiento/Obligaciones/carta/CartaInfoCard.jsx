import { Pencil, CalendarDays, FileText } from "lucide-react";
import { formatearFecha, obtenerBadge } from "./carta.helpers";

export default function CartaInfoCard({ carta, onEditar, loading }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Informacion de la carta</h3>
          <p className="text-sm text-slate-500 mt-1">Registro de cumplimiento</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${obtenerBadge(carta?.estatus)}`}>
            {carta?.estatus || "Pendiente"}
          </span>

          <button
            aria-label="Editar carta"
            onClick={onEditar}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition disabled:opacity-50"
          >
            <Pencil size={15} /> Editar
          </button>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
          <CalendarDays size={18} className="text-teal-700" />
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500 font-medium">Fecha</p>
          <p className="text-slate-800 font-medium">{formatearFecha(carta?.fecha)}</p>
        </div>
      </div>

      <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText size={18} className="text-blue-700" />
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500 font-medium mb-1">Nota</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {carta?.observaciones?.trim() ? carta.observaciones : "Sin nota registrada"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
