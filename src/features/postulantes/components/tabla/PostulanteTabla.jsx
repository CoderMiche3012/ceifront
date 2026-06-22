import { NavLink } from "react-router-dom";
import DatosTabla from "../../../../components/tablas/DatosTabla";
import AvatarGeneral from "../../../../components/shared/AvatarGeneral";
import AccionesPostulante from "./ColumnaAcciones";
import { Calendar, Clock, Eye, Printer, Check, X, Lock } from "lucide-react";
import { ui } from "../../../../styles/ui/index";
import { usePermissions } from "../../../../context/PermissionsContext";

const COLUMNS = [
  { key: "postulante", label: "Nombre" },
  { key: "edad", label: "Edad" },
  { key: "tutor", label: "Tutor" },
  { key: "visita", label: "Visita" },
  { key: "prioridad", label: "Prioridad" },
  { key: "estatus_estudio", label: "Estudio S.E" },
  { key: "estatus_postulante", label: "Estatus" },
  { key: "acciones", label: "Acciones" },
];

export default function PostulanteTabla({ postulantes = [], onPrint }) {

  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditPostulante = hasModulePermission("postulantes", "editar");

  const formatFechaVisita = (fecha) => {
    const date = new Date(fecha);

    return {
      fechaFormateada: date.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      horaFormateada: date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
  };

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
    const expediente = item.expediente || {};

    const obtenerEstadoVisual = (item) => {
      if (item.estado_visita !== "Programada") {
        return item.estado_visita;
      }

      if (!item.fecha_visita) {
        return item.estado_visita;
      }

      const fechaVisita = new Date(item.fecha_visita);
      fechaVisita.setHours(23, 59, 59, 999);

      return fechaVisita < new Date()
        ? "No realizada"
        : "Programada";
    };
    switch (key) {
      case "postulante":
        return (
          <div className={ui.table.cellFlex}>
            <AvatarGeneral
              nombre={expediente.nombre}
              apellidoP={expediente.apellido_p}
            />

            <div className={ui.table.cellStack}>
              <span className={`text-sm font-semibold ${ui.text.primary} `}>
                {`${expediente.nombre || ""} ${expediente.apellido_p || ""} ${expediente.apellido_m || ""}`}
              </span>
            </div>
          </div>
        );

      case "edad":
        return (
          <span className={`text-sm ${ui.text.secondary}`}>
            {calcularEdad(expediente.fecha_nacimiento)} años
          </span>
        );

      case "tutor":
        return (
          <div className="flex flex-col leading-tight">
            <span className={`text-sm font-medium ${ui.text.primary}`}>
              {item.tutor_nombre || "Sin tutor"}
            </span>
            <span className={`text-xs ${ui.text.muted}`}>
              {item.tutor_telefono || ""}
            </span>
          </div>
        );

      case "visita": {
        const estadoVisual = obtenerEstadoVisual(item);
        const estado = estadoVisual?.toLowerCase();

        const color = ui.visit?.[estado] || ui.text.muted;

        if (!item.fecha_visita) {
          return (
            <div className="flex items-center gap-2">
              <Calendar size={14} className={ui.icon.muted} />
              <span className={`text-sm font-medium ${ui.text.primary}`}>
                No programada
              </span>
            </div>
          );
        }

        const { fechaFormateada, horaFormateada } =
          formatFechaVisita(item.fecha_visita);

        return (
          <div className="flex flex-col gap-1">
            <span className={`text-sm font-semibold ${color}`}>
              {estadoVisual}
            </span>

            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Calendar size={12} className={ui.icon.muted} />
              {fechaFormateada}
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={12} className={ui.icon.muted} />
              {horaFormateada} hrs
            </div>
          </div>
        );
      }

      case "prioridad": {
        const estudioCompleto =
          item.estatus_estudio?.toLowerCase() === "completo";

        const prioridad =
          (item.prioridad_servicio || "sin prioridad").toLowerCase();

        const estilo =
          ui.status?.[
          prioridad === "alta"
            ? "danger"
            : prioridad === "media"
              ? "warning"
              : prioridad === "baja"
                ? "success"
                : "muted"
          ];

        if (!estudioCompleto) {
          return (
            <div className={`${ui.badge.base} ${ui.status.muted} gap-1`}>
              <Lock size={12} className={ui.icon.muted} />
              <span className="text-[10px] font-semibold leading-none">
                Bloqueado
              </span>
            </div>
          );
        }

        return (
          <span className={`${ui.badge.base} border ${estilo}`}>
            {prioridad}
          </span>
        );
      }

      case "estatus_estudio": {
        const completo =
          item.estatus_estudio?.toLowerCase() === "completo";

        return (
          <div className="flex justify-center">
            {completo ? (
              <div className={`${ui.status.success} p-1 rounded-full`}>
                <Check size={18} />
              </div>
            ) : (
              <div className={`${ui.status.danger} p-1 rounded-full`}>
                <X size={18} />
              </div>
            )}
          </div>
        );
      }

      case "estatus_postulante": {
        const estatus = (item.estatus || "pendiente").toLowerCase();

        const estilo =
          estatus === "aceptado"
            ? ui.status.success
            : estatus === "rechazado"
              ? ui.status.danger
              : ui.status.warning;

        return (
          <span className={`${ui.badge.base} border ${estilo}`}>
            {estatus.charAt(0).toUpperCase() + estatus.slice(1)}
          </span>
        );
      }

      case "acciones": {
        const puedeEditar =
          canEditPostulante &&
          !["aceptado"].includes(
            item?.estatus?.toLowerCase()
          );

        return (
          <div className="flex items-center gap-1">
            <NavLink
              to={`/App/ingresos/expediente/${item.id_postulante}`}
              className={({ isActive }) =>
                `${ui.button.base} h-8 w-8 ${isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                }`
              }
              title="Ver Expediente"
            >
              <Eye size={18} />
            </NavLink>

            <button
              onClick={() => onPrint(item)}
              className={`${ui.button.base} h-8 w-8 text-slate-400 hover:bg-slate-100 hover:text-indigo-600`}
            >
              <Printer size={18} />
            </button>

            {puedeEditar && (
              <AccionesPostulante item={item} />
            )}
          </div>
        );
      }

      default:
        return null;
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

