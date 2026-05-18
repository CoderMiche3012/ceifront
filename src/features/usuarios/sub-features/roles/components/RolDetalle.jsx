import { Pencil, Trash2, Users } from "lucide-react"
import Boton from "../../../../../components/ui/Boton"
import { isProtectedRole } from "../../../../../utils/roles"
import PermisosTabla from "./PermisosTabla"

export default function RolDetalle({
  selectedRole, editMode, saving, deletingRole, currentPermissions, draftRole, onDraftRoleChange,
  onPermissionChange, onEdit, onCancel, onSave, onDelete,
}) {
  if (!selectedRole) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">No hay roles disponibles.</p>
      </div>
    )
  }

  const protectedRole = isProtectedRole(selectedRole)
  const canDeleteSelectedRole = !editMode && !protectedRole

  return (
    /* Contenedor principal con altura adaptable a la pantalla */
    <div className="mt-6 flex flex-col h-[calc(100vh-250px)] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      
      {/* SECCIÓN FIJA: Encabezado y botones (No se mueven) */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-white">
        <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <Users size={22} />
            </div>
            {!editMode ? (
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl truncate">
                  {selectedRole.nombre_rol}
                </h2>
                <p className="text-sm leading-6 text-slate-600 line-clamp-2">
                  {selectedRole.descripcion || "Sin descripción registrada para este rol."}
                </p>
              </div>
            ) : (
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Define qué módulos puede ver y editar este rol
                </p>
                <h2 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
                  {selectedRole.nombre_rol}
                </h2>
                <div className="w-full">
                  <label className="mb-2 block text-sm text-slate-500">Descripción</label>
                  <textarea
                    value={draftRole?.descripcion || ""}
                    onChange={(e) => onDraftRoleChange(e.target.value)}
                    rows={2}
                    className="block w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
            {!editMode ? (
              <>
                <button onClick={onEdit} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
                  <Pencil size={16} /> Editar
                </button>
                <button onClick={onDelete} disabled={!canDeleteSelectedRole || deletingRole} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
                  <Trash2 size={16} /> Eliminar rol
                </button>
              </>
            ) : (
              <>
                <button onClick={onCancel} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50" disabled={saving}>
                  Cancelar
                </button>
                <Boton onClick={onSave} className="px-5 py-2.5 text-sm" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Boton>
              </>
            )}
          </div>
        </div>

        {!editMode && protectedRole && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Este es un rol protegido del sistema y no se puede eliminar.
          </div>
        )}
      </div>

      {/* SECCIÓN CON SCROLL: Solo la tabla de permisos */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <PermisosTabla
          permisos={currentPermissions}
          onPermissionChange={onPermissionChange}
          role={selectedRole}
          disabled={!editMode || saving}
        />

        <p className="mt-4 text-xs leading-5 text-slate-500 italic">
          Nota: Los cambios en los permisos afectarán a todos los usuarios
          asignados a este rol inmediatamente.
        </p>
      </div>

    </div>
  )
}
