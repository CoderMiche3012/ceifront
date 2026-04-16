import { NavLink } from "react-router-dom";
import DatosTabla from "../../tablas/DatosTabla";
import AvatarGeneral from "../../shared/AvatarGeneral";
import AccionesPostulante from "./ColumnaAcciones";
import { Calendar, Clock, Eye, Printer, Check, X, Lock } from "lucide-react";

const COLUMNS = [
  { key: "postulante", label: "Nombre" },
  { key: "edad", label: "Edad" },
  { key: "tutor", label: "Tutor" },
  { key: "fecha_visita", label: "Fecha de Visita" },
  { key: "estatus", label: "Estatus Visita" },
  { key: "estatus_estudio", label: "Estudio S.E" },
  { key: "estatus_postulante", label: "Decisión final" },
  { key: "acciones", label: "Acciones" },
];
export default function PeriodoTabla({ postulantes = [], onRefresh, onPrint }) {
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
    //posicionamiento de las acciones
    const totalRegistros = postulantes.length;
    const indiceActual = postulantes.indexOf(item);
    const abrirHaciaArriba = indiceActual >= totalRegistros - 2 && totalRegistros > 1;
    switch (key) {
      case "postulante":
        return (
          <div className="flex items-center gap-3">
            <AvatarGeneral nombre={expediente.nombre} apellidoP={expediente.apellido_p} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800 uppercase leading-none">
                {`${expediente.nombre || ""} ${expediente.apellido_p || ""}`}
              </span>
            </div>
          </div>
        );
      case "edad":
        return <span className="text-sm text-slate-600">{calcularEdad(expediente.fecha_nacimiento)} años</span>;
      case "tutor":
        return (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-slate-800">
              {item.tutor_nombre || "Sin tutor"}
            </span>
            <span className="text-xs text-slate-500">
              {item.tutor_telefono || ""}
            </span>
          </div>
        );
      case "fecha_visita":
        if (!item.fecha_visita) {
          return (
            <div className="flex items-center gap-1.5 text-rose-500 font-medium bg-rose-50 px-2 py-1 rounded-md w-fit">
              <Calendar size={14} />
              <span className="text-[11px] italic uppercase">No programada</span>
            </div>
          );
        }
        try {
          const [fecha, horaCompleta] = item.fecha_visita.split("T");
          const [year, month, day] = fecha.split("-");
          const hora = horaCompleta?.substring(0, 5) || "";
          const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
          const fechaFormateada = `${day} ${meses[parseInt(month, 10) - 1]} ${year}`;
          return (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
                <Calendar size={13} className="text-slate-400" />
                {fechaFormateada}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock size={12} />
                {hora} hrs
              </div>
            </div>
          );
        } catch (e) {
          return <span className="text-xs text-slate-400">Error en fecha</span>;
        }
      case "estatus":
        const estatus = item.estado_visita?.toLowerCase();
        const configEstatus = {
          "no agendada": "bg-amber-100 text-amber-700 border-amber-200",
          "programada": "bg-blue-100 text-blue-700 border-blue-200",
          "cancelada": "bg-rose-100 text-rose-700 border-rose-200",
          "realizada": "bg-emerald-100 text-emerald-700 border-emerald-200",
        };
        const estilo = configEstatus[estatus] || "bg-slate-100 text-slate-600 border-slate-200";
        return (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${estilo}`}>
            {item.estado_visita}
          </span>
        );
      // ... dentro del switch (key)

      case "estatus_estudio":
        const completado = item.estatus_estudio?.toLowerCase() === "completado";
        return (
          <div className="flex justify-center">
            {completado ? (
              <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full" title="Completado">
                <Check size={18} strokeWidth={3} />
              </div>
            ) : (
              <div className="bg-rose-100 text-rose-600 p-1 rounded-full" title="Pendiente">
                <X size={18} strokeWidth={3} />
              </div>
            )}
          </div>
        );

      case "estatus_postulante":
        const estudioFinalizado = item.estatus_estudio?.toLowerCase() === "completado";
        return (
          <div className="flex items-center gap-2">
            {estudioFinalizado ? (
              <span className="text-sm font-medium text-slate-700">
                {item.estatus_postulante || "Sin decisión"}
              </span>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-200 shadow-sm">
                <Lock size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Bloqueado</span>
              </div>
            )}
          </div>
        );
      case "acciones":
        return (
          <div className="flex items-center gap-1">
            <NavLink
              to={`/App/ingresos/expediente/${item.id_postulante}`}
              className={({ isActive }) => `
                inline-flex h-8 w-8 items-center justify-center rounded-full transition-all
                ${isActive ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:bg-slate-100 hover:text-blue-600"}
              `}
              title="Ver Expediente"
            >
              <Eye size={18} />
            </NavLink>
            <button
              onClick={() => onPrint(item)}
              type="button"
              title="Descargar Formato PDF"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all"
            >
              <Printer size={18} />
            </button>
            <AccionesPostulante
              item={item}
              onRefresh={onRefresh}
              abrirHaciaArriba={abrirHaciaArriba}
            />
          </div>
        );
      default: return null;
    }
  };

  return (
    <DatosTabla
      columns={COLUMNS}
      data={postulantes}
      renderCell={renderCell}
      rowKey="id_postulante"
    />
  );
}