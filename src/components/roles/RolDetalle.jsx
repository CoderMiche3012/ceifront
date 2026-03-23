import { Pencil, Trash2, Users } from "lucide-react"
import Boton from "../ui/Boton"
import { isProtectedRole } from "../../utils/roles"
import PermisosTabla from "./PermisosTabla"
//para visualizar y editar el detalle de un rol
export default function RolDetalle({
  selectedRole,editMode,saving,deletingRole,currentPermissions,draftRole,onDraftRoleChange,
  onPermissionChange,onEdit,onCancel,onSave,onDelete,
}) {
  // si no hay rol seleccionado, muestra estado vacío
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
            <Users size={22} />
          </div>
          {!editMode ? (
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {selectedRole.nombre_rol}
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                {selectedRole.descripcion ||
                  "Sin descripción registrada para este rol."}
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
              {/* Campo editable para la descripción del rol */}
              <div className="w-full">
                <label className="mb-2 block text-sm text-slate-500">
                  Descripción
                </label>
                <textarea
                  value={draftRole?.descripcion || ""}
                  onChange={(e) => onDraftRoleChange(e.target.value)}
                  rows={2}
                  placeholder="Escribe una descripción clara para este rol"
                  className="block w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>
          )}
        </div>
        {/* Acciones principales: editar, eliminar, cancelar o guardar */}
        <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center md:ml-4 md:w-auto">
          {!editMode ? (
            <>
              <button
                onClick={onEdit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 sm:w-auto"
              >
                <Pencil size={16} />
                Editar
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={!canDeleteSelectedRole || deletingRole}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Trash2 size={16} />
                Eliminar rol
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
                disabled={saving}
              >
                Cancelar
              </button>
              <Boton
                onClick={onSave}
                className="w-full px-5 py-2.5 text-sm sm:w-auto"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </Boton>
            </>
          )}
        </div>
      </div>
      {/* Aviso cuando el rol es protegido y no puede eliminarse */}
      {!editMode && protectedRole ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Este es un rol protegido del sistema y no se puede eliminar.
        </div>
      ) : null}
      <PermisosTabla
        permisos={currentPermissions}
        onPermissionChange={onPermissionChange}
        disabled={!editMode || saving}
      />
      <p className="mt-4 text-xs leading-5 text-slate-500">
        Nota: Los cambios en los permisos afectarán a todos los usuarios
        asignados a este rol inmediatamente.
      </p>
    </div>
  )
}