import { Pencil, Trash2, Users } from "lucide-react";
import { isProtectedRole } from "../../../../../utils/roles";
import PermisosTabla from "./PermisosTabla";

export default function RolDetalle({
  selectedRole,
  currentPermissions,
  deletingRole,
  onEdit,
  onDelete,
}) {
  if (!selectedRole) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">
          No hay roles disponibles.
        </p>
      </div>
    );
  }

  const protectedRole = isProtectedRole(selectedRole);

  return (
    <div className="flex h-[calc(100vh-250px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">      {/* Encabezado */}
      <div className="border-b border-slate-100 bg-white p-4 sm:px-6 sm:pt-5 sm:pb-4">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <Users size={22} />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                {selectedRole.nombre_rol}
              </h2>

              <p className="text-sm leading-6 text-slate-600">
                {selectedRole.descripcion ||
                  "Sin descripción registrada para este rol."}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <button
              onClick={onEdit}
              disabled={protectedRole || deletingRole}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"

            >
              <Pencil size={16} />
              Editar
            </button>

          </div>
        </div>

        {protectedRole && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Este es un rol protegido del sistema y no se puede editar.
          </div>
        )}
      </div>

      {/* Permisos */}
      <div className="custom-scroll flex-1 overflow-y-auto p-4 pt-2 sm:p-6 sm:pt-3">
        <PermisosTabla
          permisos={currentPermissions}
          role={selectedRole}
          disabled={true}
        />
      </div>
    </div>
  );
}
