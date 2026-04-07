import DatosTabla from "../../tablas/DatosTabla";
import AvatarGeneral from "../../shared/AvatarGeneral";
import { Calendar, Clock } from "lucide-react";
import AccionesPostulante from "./ColumnaAcciones";

const columns = [
  { key: "postulante", label: "Postulante" },
  { key: "edad", label: "Edad" },
  { key: "fecha_visita", label: "Fecha de Visita" },
  { key: "estatus", label: "Estatus Visita" },
  { key: "acciones", label: "Acciones" },
];

export default function PeriodoTabla({ postulantes, onRefresh }) {

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "--";
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    return edad;
  };

  const renderCell = (item, key) => {
    const expediente = item.id_expediente || {};

    switch (key) {
      case "postulante":
        return (
          <div className="flex items-center gap-3">
            <AvatarGeneral nombre={expediente.nombre} apellidoP={expediente.apellido_p} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800 uppercase">
                {`${expediente.nombre} ${expediente.apellido_p}`}
              </span>
              <span className="text-[10px] text-slate-400">ID: {item.id_postulante}</span>
            </div>
          </div>
        );

      case "edad":
        return <span className="text-sm text-slate-600">{calcularEdad(expediente.fecha_nacimiento)} años</span>;

      case "fecha_visita":
        if (!item.fecha_visita) {
          return (
            <div className="flex items-center gap-1.5 text-red-500 font-medium">
              <Calendar size={14} />
              <span className="text-xs italic">No programada</span>
            </div>
          );
        }
        
        const f = new Date(item.fecha_visita);
        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
              <Calendar size={13} className="text-slate-400" />
              {f.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Clock size={12} />
              {f.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </div>
          </div>
        );

      case "estatus":
        const estatus = item.estado_visita?.toLowerCase();
        let estilo = "";

        if (estatus === "no agendada") estilo = "bg-yellow-100 text-red-600 border-yellow-200";
        else if (estatus === "programada") estilo = "bg-blue-100 text-blue-700 border-blue-200";
        else if (estatus === "cancelada") estilo = "bg-red-100 text-red-700 border-red-200";
        else if (estatus === "realizada") estilo = "bg-green-100 text-green-700 border-green-200";
        else estilo = "bg-slate-100 text-slate-600 border-slate-200";

        return (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${estilo}`}>
            {item.estado_visita}
          </span>
        );

      case "acciones":
        return (
          <div className="flex justify-end pr-2">
            <AccionesPostulante item={item} onRefresh={onRefresh} />
          </div>
        );

      default: return null;
    }
  };

  return (
    <DatosTabla
      columns={columns}
      data={postulantes}
      renderCell={renderCell}
      rowKey="id_postulante"
    />
  );
}