import {Pencil,CalendarDays,FileText,Briefcase,} from "lucide-react";
import { formatearFecha, obtenerBadge,} from "./servicioSocial.helpers";
export default function ServicioSocialItemCard({
  item,
  onEditar,
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-100 flex items-center justify-center">
            <Briefcase className="text-teal-700" />
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">
              {item.nombre}
            </h4>

            <span
              className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${obtenerBadge(
                item.estatus
              )}`}
            >
              {item.estatus}
            </span>
          </div>
        </div>

        <button
          aria-label="Editar servicio"
          onClick={() =>
            onEditar(item)
          }
          className="text-slate-600 hover:text-teal-600"
        >
          <Pencil size={18} />
        </button>
      </div>

      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
          <CalendarDays
            size={18}
            className="text-teal-700"
          />

          <div>
            <p className="text-xs uppercase text-slate-500">
              Fecha
            </p>

            <p className="font-medium text-slate-800">
              {formatearFecha(
                item.fecha
              )}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 flex gap-3">
          <FileText
            size={18}
            className="text-blue-700 mt-1"
          />

          <div>
            <p className="text-xs uppercase text-slate-500">
              Nota
            </p>

            <p className="text-sm text-slate-700">
              {item.observaciones?.trim()
                ? item.observaciones
                : "Sin nota registrada"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}