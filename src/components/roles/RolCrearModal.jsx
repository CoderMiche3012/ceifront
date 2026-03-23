import { X } from "lucide-react"
import Boton from "../ui/Boton"
import PermisosTabla from "./PermisosTabla"

export default function RolCrearModal({
  open,creatingRole,createRoleForm,onClose,onFormChange,onPermissionChange,onSave,
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Registrar Rol</h2>
            <p className="text-sm text-slate-500">
              Agrega el nombre, la descripción y los permisos del nuevo rol.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            disabled={creatingRole}
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Nombre del rol
              </label>
              <input
                type="text"
                value={createRoleForm.nombre_rol}
                onChange={(e) => onFormChange("nombre_rol", e.target.value)}
                placeholder="Ej. Supervisor"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Descripción
              </label>
              <input
                type="text"
                value={createRoleForm.descripcion}
                onChange={(e) => onFormChange("descripcion", e.target.value)}
                placeholder="Describe este rol"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          <div className="mt-6">
            <PermisosTabla
              permisos={createRoleForm.permisos}
              onPermissionChange={onPermissionChange}
              disabled={creatingRole}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
            disabled={creatingRole}
          >
            Cancelar
          </button>
          <Boton
            onClick={onSave}
            className="w-full px-5 py-2.5 text-sm sm:w-auto"
            disabled={creatingRole}
          >
            {creatingRole ? "Creando..." : "Guardar rol"}
          </Boton>
        </div>
      </div>
    </div>
  )
}