import { useMemo } from "react";
import { Eye, Pencil, UserX, UserCheck, } from "lucide-react";

import { ui } from "../../../../styles/ui/uiClasses";
import Avatar from "../../../../components/shared/AvatarGeneral";
import Insignia from "../../../../components/ui/Insignia";
import AccionesTabla from "../../../../components/tablas/AccionesTabla";
import DatosTabla from "../../../../components/tablas/DatosTabla";

import { getRoleLabel } from "../../../../utils/usuarios";

export default function UsuarioTabla({
  users,
  roles,
  onEdit,
  onDeactivate,
  onActivate,
  canView = false,
  canEdit = false,
  canStatus = false,
  puedeEditarTodo = false,
}) {
  const columns = useMemo(() => {
    const baseColumns = [
      { key: "usuario", label: "Usuario" },
      { key: "correo", label: "Correo electrónico" },
      { key: "rol", label: "Rol" },
      { key: "telefono", label: "Teléfono" },
      { key: "estatus", label: "Estatus" },
    ];

    if (canView || canEdit || canStatus) {
      baseColumns.push({
        key: "acciones",
        label: "Acciones",
      });
    }

    return baseColumns;
  }, [canView, canEdit, canStatus]);

  const renderCell = (user, key) => {
    switch (key) {
      case "usuario":
        return (
          <div className={ui.table.userCell}>
            <Avatar
              nombre={user.nombre}
              apellidoP={user.apellido_p}
            />

            <div className="min-w-0">
              <p className={`truncate ${ui.text.body} font-semibold`} >
                {user.nombre} {user.apellido_p}{" "}
                {user.apellido_m}
              </p>

              <p className={ui.text.caption}>
                @{user.nom_usuario}
              </p>
            </div>
          </div>
        );

      case "correo":
        return (
          <span className={ui.text.muted}>
            {user.correo}
          </span>
        );

      case "rol":
        return (
          <Insignia
            label={getRoleLabel(user, roles)}
            variant="slate"
          />
        );

      case "telefono":
        return (
          <span className={ui.text.muted}>
            {user.telefono || "N/A"}
          </span>
        );

      case "estatus":
        return (
          <Insignia status={user.estatus} />
        );

      case "acciones": {
        const availableActions = [];

        const roleLabel = getRoleLabel(user, roles);

        const esAdministrador =
          roleLabel === "Administrador";

        const puedeAdministrarUsuario =
          puedeEditarTodo || !esAdministrador;

        if (canEdit && puedeAdministrarUsuario) {
          availableActions.push({
            label: "Editar",
            icon: <Pencil className="h-4 w-4" />,
            onClick: onEdit,
          });
        }

        if (canStatus && puedeAdministrarUsuario) {
          const isInactive =
            user.estatus === "Inactivo";

          availableActions.push({
            label: isInactive
              ? "Activar"
              : "Desactivar",
            icon: isInactive ? (
              <UserCheck className="h-4 w-4" />
            ) : (
              <UserX className="h-4 w-4" />
            ),
            onClick: isInactive
              ? onActivate
              : onDeactivate,
            className: isInactive
              ? "hover:text-green-500"
              : "hover:text-amber-500",
          });
        }

        return (
          <AccionesTabla
            row={user}
            actions={availableActions}
          />
        );
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