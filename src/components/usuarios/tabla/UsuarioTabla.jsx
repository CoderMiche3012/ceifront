import { useMemo } from "react"; 
import { Eye, Pencil, UserX, UserCheck } from "lucide-react";
import Avatar from "../Avatar";
import InsigniaRol from "../../usuarios/insignias/InsigniaRol";
import InsigniaEstatus from "../../usuarios/insignias/InsigniaEstatus";
import AccionesTabla from "../../tablas/AccionesTabla";
import DatosTabla from "../../tablas/DatosTabla";
import { getRoleId, getRoleLabel } from "../../../utils/usuarios";

export default function UsuarioTabla({
  users,
  roles,
  onView,
  onEdit,
  onDeactivate,
  onActivate,
  // Nuevas props de permisos
  canView = false,
  canEdit = false,
  canStatus = false,
}) {
  
  const columns = useMemo(() => {
    const baseColumns = [
      { key: "usuario", label: "Usuario" },
      { key: "correo", label: "Correo electrónico" },
      { key: "rol", label: "Rol" },
      { key: "telefono", label: "Teléfono" },
      { key: "estatus", label: "Estatus" },
    ];

    // Solo añadir la columna de acciones si tiene al menos un permiso
    if (canView || canEdit || canStatus) {
      baseColumns.push({ key: "acciones", label: "Acciones" });
    }

    return baseColumns;
  }, [canView, canEdit, canStatus]);

  const renderCell = (user, key) => {
    switch (key) {
      case "usuario":
        return (
          <div className="flex items-center gap-3">
            <Avatar nombre={user.nombre} apellidoP={user.apellido_p} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
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
        return <span className="text-sm text-slate-500">{user.telefono || "N/A"}</span>;
      case "estatus":
        return <InsigniaEstatus status={user.estatus} />;
      case "acciones": {
        const availableActions = [];

        if (canView) {
          availableActions.push({
            label: "Ver",
            icon: <Eye className="h-4 w-4" />,
            onClick: onView,
          });
        }

        if (canEdit) {
          availableActions.push({
            label: "Editar",
            icon: <Pencil className="h-4 w-4" />,
            onClick: onEdit,
          });
        }

        if (canStatus) {
          const isInactive = user.estatus === "Inactivo";
          availableActions.push({
            label: isInactive ? "Activar" : "Desactivar",
            icon: isInactive ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />,
            onClick: isInactive ? onActivate : onDeactivate,
            className: isInactive ? "hover:text-green-500" : "hover:text-amber-500",
          });
        }

        return <AccionesTabla row={user} actions={availableActions} />;
      }
      default:
        return null;
    }
  };

  return (
    <DatosTabla
      columns={columns}
      data={users}
      renderCell={renderCell}
      rowKey="id_usuario"
    />
  );
}