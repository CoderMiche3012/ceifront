import HistorialBase from "../Historial";
import ResumenServiciosCard from "./ResumenServiciosCard";

export default function HistorialServicios({ data }) {
  const contarServicios = (servicios = []) => {
    return servicios.filter((s) => s.asistencia).length;
  };

  const obtenerUltimaFecha = (servicios = []) => {
    if (!servicios.length) return "--";

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
    <HistorialBase
      title="Historial de Servicios"
      items={data?.historial_seguimientos ?? []}
      periodos={data?.periodos ?? []}
      periodoActivo={data?.periodoActivo}

      renderTitulo={(item, periodo) => (
        <p className="text-sm font-semibold text-slate-800">
          {periodo?.ciclo_escolar || "Periodo"}
        </p>
      )}

      renderSubtitulo={() => (
        <p className="text-xs text-slate-500">
          Comedor • Psicología
        </p>
      )}

      renderMeta={(item) => (
        <>
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-400 font-semibold">
              Servicios
            </p>

            <p className="text-sm font-bold text-teal-600">
              {contarServicios(item.usos_servicios)}
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase text-slate-400 font-semibold">
              Último registro
            </p>

            <p className="text-xs font-medium text-slate-600">
              {obtenerUltimaFecha(item.usos_servicios)}
            </p>
          </div>
        </>
      )}

      renderDetalle={(item) => (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <ResumenServiciosCard
            seguimiento={item}
          />
        </div>
      )}
    />
  );
}