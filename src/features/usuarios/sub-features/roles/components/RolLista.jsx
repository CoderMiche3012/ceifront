export default function RolLista({roles,selectedRole,editMode,onSelectRole,}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-600">Roles Existentes</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
          {roles.length} Roles
        </span>
      </div>
      <div className="space-y-3">
        {roles.map((role) => {
          const isSelected = selectedRole?.id_rol === role.id_rol
          const isLocked = editMode && !isSelected
          return (
            <button
              key={role.id_rol}
              onClick={() => onSelectRole(role)}
              disabled={editMode}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                isSelected
                  ? "border-teal-500 bg-teal-50/70 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              } ${editMode ? "cursor-not-allowed" : ""} ${
                isLocked ? "opacity-60" : ""
              }`}
            >
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-800">
                  {role.nombre_rol}
                </p>
                <p className="text-sm leading-5 text-slate-500">
                  {role.descripcion || "Sin descripción"}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}