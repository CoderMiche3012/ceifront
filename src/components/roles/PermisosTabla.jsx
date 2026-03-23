import { modules } from "../../utils/roles"

const DEFAULT_ACTIONS = [
  { key: "ver", label: "Ver" },
  { key: "crear", label: "Crear" },
  { key: "editar", label: "Editar" },
  { key: "eliminar", label: "Eliminar" },
]
// tabla de permisos por modulo
export default function PermisosTabla({
  permisos = {},
  onPermissionChange,
  disabled = false,
  actions = DEFAULT_ACTIONS,
}) {
  return (
    <>
      {/* Vista tabla */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 text-left">Módulo del sistema</th>
              {actions.map((action) => (
                <th key={action.key} className="px-6 py-3 text-center">
                  {action.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => {
              const Icon = module.icon
              const modulePermissions = permisos?.[module.key] || {}
              return (
                <tr key={module.key} className="border-t border-slate-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 font-medium text-slate-700">
                      <Icon size={18} className="text-slate-400" />
                      {module.name}
                    </div>
                  </td>

                  {actions.map((action) => (
                    <td key={action.key} className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={Boolean(modulePermissions[action.key])}
                        disabled={disabled}
                        onChange={() =>
                          onPermissionChange?.(module.key, action.key)
                        }
                        className="h-4 w-4 cursor-pointer accent-teal-600 disabled:cursor-not-allowed"
                      />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {/* Vista móvil  */}
      <div className="space-y-4 md:hidden">
        {modules.map((module) => {
          const Icon = module.icon
          const modulePermissions = permisos?.[module.key] || {}
          return (
            <div
              key={module.key}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="mb-4 flex items-center gap-3">
                <Icon size={18} className="text-slate-400" />
                <h3 className="font-semibold text-slate-800">{module.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => (
                  <label
                    key={action.key}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <span>{action.label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(modulePermissions[action.key])}
                      disabled={disabled}
                      onChange={() =>
                        onPermissionChange?.(module.key, action.key)
                      }
                      className="h-4 w-4 cursor-pointer accent-teal-600 disabled:cursor-not-allowed"
                    />
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}