import DatosTabla from "../../tablas/DatosTabla";
import AvatarGeneral from "../../shared/AvatarGeneral";
import { Calendar, Clock, Eye } from "lucide-react";
import AccionesPostulante from "./ColumnaAcciones";
import { NavLink } from "react-router-dom";

const columns = [
  { key: "postulante", label: "Postulante" },
  { key: "edad", label: "Edad" },
  { key: "tutor", label: "Tutor" },
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
    const indiceActual = postulantes.indexOf(item);
    const esUltimo = indiceActual === postulantes.length - 1;
    const pocosRegistros = postulantes.length <= 2;

    switch (key) {
      case "postulante":
        return (
          <div className="flex items-center gap-3">
            <AvatarGeneral nombre={expediente.nombre} apellidoP={expediente.apellido_p} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800 uppercase">
                {`${expediente.nombre} ${expediente.apellido_p}`}
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
              {item.tutor_nombre}
            </span>
            <span className="text-xs text-slate-500">
              {item.tutor_telefono}
            </span>
          </div>
        );

      case "fecha_visita":
        if (!item.fecha_visita) {
          return (
            <div className="flex items-center gap-1.5 text-red-500 font-medium">
              <Calendar size={14} />
              <span className="text-xs italic">No programada</span>
            </div>
          );
        }

        const [fecha, horaCompleta] = item.fecha_visita.split("T");
        const hora = horaCompleta?.substring(0, 5);

        // Formatear fecha manual (sin new Date)
        const [year, month, day] = fecha.split("-");

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
              {hora}
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
        const indiceActual = postulantes.indexOf(item);
        const esUltimo = indiceActual === postulantes.length - 1;
        const pocosRegistros = postulantes.length <= 2;

        return (

          <div className="flex items-center gap-2">
            {/* Usamos 'inline-flex' y una altura fija para que coincida con el botón de al lado */}
            <NavLink
              to={`/App/postulantes/expediente/${item.id_postulante}`}
              className={({ isActive }) => `
          inline-flex h-8 w-8 items-center justify-center rounded-full transition-all
          ${isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-400 hover:bg-slate-100 hover:text-blue-600"}
        `}
            >
              <Eye size={18} />
            </NavLink>

            {/* Este componente debe devolver un botón de exactamente h-8 w-8 */}
            <AccionesPostulante
              item={item}
              onRefresh={onRefresh}
              abrirHaciaArriba={esUltimo || pocosRegistros}
            />
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