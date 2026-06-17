import { ClipboardList, CalendarDays, AlertCircle, FileText, ShieldAlert, NotebookPen } from "lucide-react";

export default function CardVisitaSocial({
  data
}) {

  const tieneVisita =
    data?.visitas?.fecha_visita ||
    data?.visitas?.nota_visita ||
    data?.visitas?.nota_servicio;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-5">

        <div className="h-11 w-11 rounded-xl bg-teal-100 flex items-center justify-center">

          <ClipboardList className="w-5 h-5 text-teal-600" />
        </div>

        <div>

          <h3 className="text-sm font-bold text-slate-800">
            Visita Social
          </h3>

          <p className="text-xs text-slate-500">
            Información del estudio socioeconómico
          </p>
        </div>
      </div>

      {/* SIN VISITA */}

      {!tieneVisita ? (

        <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center">

          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />

          <p className="text-sm font-medium text-slate-500">
            No hay registros de visita social
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Aún no se ha capturado información del estudio.
          </p>
        </div>

      ) : (

        <div className="space-y-4">

          {/* FECHA */}

          <div className="flex items-start gap-3">

            <CalendarDays className="w-4 h-4 text-teal-600 mt-0.5" />

            <div>
              <p className="text-xs uppercase text-slate-400 font-semibold">
                Fecha de realización
              </p>

              <p className="text-sm text-slate-700 font-medium">
                {data?.visitas?.fecha_visita || "--"}
              </p>
            </div>
          </div>

          {/* ESTADO */}

          <div className="flex items-start gap-3">

            <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5" />

            <div>
              <p className="text-xs uppercase text-slate-400 font-semibold">
                Estado
              </p>

              <p className="text-sm text-slate-700 font-medium">
                {data?.estatus_estudio || "--"}
              </p>
            </div>
          </div>

          {/* PRIORIDAD */}

          <div className="flex items-start gap-3">

            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />

            <div>
              <p className="text-xs uppercase text-slate-400 font-semibold">
                Prioridad
              </p>

              <p className="text-sm text-slate-700 font-medium">
                {data?.prioridad_servicio || "--"}
              </p>
            </div>
          </div>

          {/* NOTA */}

          <div className="flex items-start gap-3">

            <NotebookPen className="w-4 h-4 text-blue-500 mt-0.5" />

            <div>
              <p className="text-xs uppercase text-slate-400 font-semibold">
                Nota
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                {data?.nota_servicio || "Sin observaciones"}
              </p>
            </div>
          </div>

          {/* DOCUMENTO */}

          <div className="pt-2">

            {data?.link_documento ? (

              <a
                href={data.link_documento}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-center gap-2
                  rounded-xl
                  border border-teal-200
                  bg-teal-50
                  px-4 py-3
                  text-sm font-medium text-teal-700
                  hover:bg-teal-100
                  transition
                "
              >
                <FileText className="w-4 h-4" />

                Ver estudio socioeconómico
              </a>

            ) : (

              <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center">

                <p className="text-sm text-slate-400">
                  No hay documento adjunto
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}