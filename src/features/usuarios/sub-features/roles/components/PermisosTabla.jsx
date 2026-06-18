import React, { useState } from "react";
import { ChevronDown, ChevronRight, Check, ShieldCheck } from "lucide-react";
import { modules } from "../../../../../utils/roles";

const ACTION_LABELS = {
  ver: "Ver", crear: "Crear", editar: "Editar", eliminar: "Eliminar",
  aceptar: "Aceptar", rechazar: "Rechazar", exportar: "Exportar", migrar: "Migrar",
};

// Componente de Chip con manejo de estado integrado
function PermissionChip({ checked, label, disabled, onChange }) {
  return (
    <label className={`
      flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all
      ${checked
        ? "border-teal-500 bg-teal-50 text-teal-700 shadow-sm"
        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}
      ${disabled ? "pointer-events-none opacity-50" : ""}
    `}>
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <div className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? "border-teal-600 bg-teal-600" : "border-slate-300"}`}>
        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>
      {label}
    </label>
  );
}

export default function PermisosTabla({ permisos = {}, onPermissionChange, disabled = false }) {
  const [expandedModules, setExpandedModules] = useState(
    Object.fromEntries(modules.map((m) => [m.key, false]))
  );

  const toggleModule = (key) => {
    setExpandedModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Esta función es la que hace que "agarre" el cambio
  const handleToggle = (moduleKey, actionKey) => {
    if (disabled) return;

    onPermissionChange?.(moduleKey, actionKey);
  };

  return (
    <div className="space-y-4">
      {modules.filter(m => m.key !== "seguridad").map((module) => (
        <div key={module.key} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleModule(module.key)}
            className="flex w-full items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {module.icon && (
                <module.icon
                  size={20}
                  className="text-teal-600"
                />
              )}

              <span className="font-semibold text-slate-800">
                {module.name}
              </span>
            </div>
            {expandedModules[module.key] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {expandedModules[module.key] && (
            <div className="border-t border-slate-100 p-5 bg-slate-50/30 space-y-4">
              {/* Permisos del módulo */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(permisos[module.key] || {}).map((action) => (
                  <PermissionChip
                    key={action}
                    label={ACTION_LABELS[action] || action}
                    checked={!!permisos[module.key][action]}
                    disabled={disabled}
                    onChange={() => handleToggle(module.key, action)}
                  />
                ))}
              </div>

              {/* Submódulos */}

              {module.children?.map(child => (
                <div key={child.key} className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-500 mb-2">{child.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(permisos[child.key] || {}).map((action) => (
                      <PermissionChip
                        key={action}
                        label={ACTION_LABELS[action] || action}
                        checked={!!permisos[child.key][action]}
                        disabled={disabled}
                        // AQUÍ PASAMOS EL childKey
                        onChange={() => onPermissionChange(child.key, action)}
                      />
                    ))}
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      ))}
    </div>
  );
}




