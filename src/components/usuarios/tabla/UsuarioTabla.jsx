import { Eye, Pencil, UserX, UserCheck } from "lucide-react";
import Avatar from "../Avatar";
import InsigniaRol from "../../usuarios/insignias/InsigniaRol";
import InsigniaEstatus from "../../usuarios/insignias/InsigniaEstatus";
import AccionesTabla from "../../tablas/AccionesTabla";
import DatosTabla from "../../tablas/DatosTabla";
import {getRoleId,getRoleLabel,} from "../../../utils/usuarios";
//columnas de la tabla de usuarios
const columns = [
  { key: "usuario", label: "Usuario" },
  { key: "correo", label: "Correo electrónico" },
  { key: "rol", label: "Rol" },
  { key: "telefono", label: "Teléfono" },
  { key: "estatus", label: "Estatus" },
  { key: "acciones", label: "Acciones" },
];
//muestra la informacion y acciones de cada usuario
export default function UsuarioTabla({users,roles,onView,onEdit,onDeactivate,onActivate,}) {
  const renderCell = (user, key) => {
    switch (key) {
      case "usuario":
        return (
          <div className="flex items-center gap-3">
            <Avatar nombre={user.nombre} apellidoP={user.apellido_p} />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {user.nombre} {user.apellido_p} {user.apellido_m}
              </p>
              <p className="text-xs text-slate-400">@{user.nom_usuario}</p>
            </div>
          </div>
        );
      case "correo":
        return <span className="text-sm text-slate-500">{user.correo}</span>;
      case "rol":
        return (
          <InsigniaRol
            roleId={getRoleId(user)}
            label={getRoleLabel(user, roles)}
          />
        );
      case "telefono":
        return <span className="text-sm text-slate-500">{user.telefono}</span>;
      case "estatus":
        return <InsigniaEstatus status={user.estatus} />;
      case "acciones":
        return (
          <AccionesTabla
            row={user}
            actions={[
              {
                label: "Ver",
                icon: <Eye className="h-4 w-4" />,
                onClick: onView,
              },
              {
                label: "Editar",
                icon: <Pencil className="h-4 w-4" />,
                onClick: onEdit,
              },
              //cambia la acción según el estatus actual del usuario
              user.estatus === "Inactivo"
                ? {
                    label: "Activar",
                    icon: <UserCheck className="h-4 w-4" />,
                    onClick: onActivate,
                    className: "hover:text-green-500",
                  }
                : {
                    label: "Desactivar",
                    icon: <UserX className="h-4 w-4" />,
                    onClick: onDeactivate,
                    className: "hover:text-amber-500",
                  },
            ]}
          />
        );
      default:
        return null;
    }
  };
  return (
    <DatosTabla
      columns={columns}
      data={users}
      renderCell={renderCell}
    />
  );
}