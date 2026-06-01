import React, { useState } from "react";
import { ChevronDown, ChevronRight, } from "lucide-react";

import { modules } from "../../../../../utils/roles";

const DEFAULT_ACTIONS = [
  { key: "ver", label: "Ver" },
  { key: "crear", label: "Crear" },
  { key: "editar", label: "Editar" },
  { key: "eliminar", label: "Eliminar" },
];

export default function PermisosTabla({
  permisos = {},
  onPermissionChange,
  role,
  disabled = false,
  actions = DEFAULT_ACTIONS,
}) {
  const [expandedModules, setExpandedModules] =
    useState(
      Object.fromEntries(
        modules.map((m) => [m.key, false])
      )
    );

  const toggleModule = (moduleKey) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }));
  };

  const isAdminRole = role?.nombre_rol?.trim().toLowerCase() === "administrador";

  const modulesFiltrados = modules.filter((module) => {
    if (module.key === "usuarios") {
      return isAdminRole;
    }
    return true;
  });

  const handleCheckboxChange = (
    moduleKey,
    actionKey,
    modulePermissions
  ) => {
    const current = modulePermissions || {};

    const isCrudAction = [
      "ver",
      "crear",
      "editar",
      "eliminar",
    ].includes(actionKey);

    // activar ver automáticamente
    if (
      isCrudAction &&
      actionKey !== "ver" &&
      !current.ver
    ) { onPermissionChange?.(moduleKey, "ver"); }
    // limitar lo de editar crear o eliminar a ver
    if (
      isCrudAction &&
      actionKey === "ver" &&
      current.ver
    ) {
      ["crear", "editar", "eliminar"].forEach(
        (perm) => {
          if (current[perm]) {
            onPermissionChange?.(
              moduleKey,
              perm
            );
          }
        }
      );
    }

    onPermissionChange?.(
      moduleKey,
      actionKey
    );
  };

  const renderCheckbox = (
    moduleKey,
    actionKey,
    modulePermissions
  ) => (
    <input
      type="checkbox"
      checked={Boolean( modulePermissions?.[actionKey])}
      disabled={disabled}
      onChange={() =>
        handleCheckboxChange(
          moduleKey,
          actionKey,
          modulePermissions
        )
      }
      className="h-4 w-4 cursor-pointer accent-teal-600 disabled:cursor-not-allowed"
    />
  );

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-3 text-left">
                Módulo del sistema
              </th>

              {actions.map((action) => (
                <th
                  key={action.key}
                  className="px-6 py-3 text-center"
                >
                  {action.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {modulesFiltrados.map((module) => {
              const Icon = module.icon;

              const modulePermissions = permisos?.[module.key] || {};

              return (
                <React.Fragment key={module.key}>
                  <tr className="border-t border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => toggleModule(module.key) }
                        className="flex items-center gap-3 font-semibold text-slate-900"
                      >
                        {(module.children?.length > 0 ||
                          module.extraActions?.length > 0) &&
                          (expandedModules[module.key] ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          ))}

                        <Icon
                          size={18}
                          className="text-slate-500"
                        />

                        <span>{module.name}</span>
                      </button>
                    </td>

                    {actions.map((action) => (
                      <td
                        key={action.key}
                        className="px-6 py-4 text-center"
                      >
                        {renderCheckbox(
                          module.key,
                          action.key,
                          modulePermissions
                        )}
                      </td>
                    ))}
                  </tr>
                  {/* submodulos */}
                  {expandedModules[module.key] &&
                    module.children?.map((child) => {
                      const childPermissions = permisos?.[child.key] || {};
                      return (
                        <tr
                          key={child.key}
                          className="border-t border-slate-100 bg-white"
                        >
                          <td className="px-6 py-3 pl-16">
                            <span className="inline-flex rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                              {child.name}
                            </span>
                          </td>

                          {actions.map((action) => (
                            <td
                              key={action.key}
                              className="px-6 py-3 text-center"
                            >
                              {renderCheckbox(
                                child.key,
                                action.key,
                                childPermissions
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}

                  {/* especiales */}
                  {expandedModules[module.key] &&
                    module.extraActions?.map(
                      (extra) => (
                        <tr
                          key={`${module.key}-${extra}`}
                          className="border-t border-slate-100 bg-amber-50/40"
                        >
                          <td className="px-6 py-3 pl-16">
                            <div className="flex items-center gap-3">
                              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                                Especial
                              </span>

                              <span className="font-medium text-slate-700">
                                {extra
                                  .charAt(0)
                                  .toUpperCase() +
                                  extra.slice(1)}
                              </span>
                            </div>
                          </td>

                          {actions.map((_, index) => (
                            <td
                              key={index}
                              className="px-6 py-3 text-center"
                            >
                              {index === 0
                                ? renderCheckbox(
                                  module.key,
                                  extra,
                                  modulePermissions
                                )
                                : null}
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* para movil */}
      <div className="space-y-4 md:hidden">
        {modulesFiltrados.map((module) => {
          const Icon = module.icon;
          const modulePermissions = permisos?.[module.key] || {};

          return (
            <div
              key={module.key}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <button
                type="button"
                onClick={() => toggleModule(module.key) }
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className="text-slate-400"
                  />
                  <h3 className="font-semibold text-slate-800">
                    {module.name}
                  </h3>
                </div>

                {expandedModules[module.key] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => (
                  <label
                    key={action.key}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    <span>
                      {action.label}
                    </span>

                    {renderCheckbox(
                      module.key,
                      action.key,
                      modulePermissions
                    )}
                  </label>
                ))}
              </div>

              {module.children?.length >
                0 && (
                  <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                    {module.children.map(
                      (child) => {
                        const childPermissions = permisos?.[ child.key ] || {};

                        return (
                          <div
                            key={child.key}
                            className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                          >
                            <p className="mb-2 text-sm font-medium text-slate-700">
                              {child.name}
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                              {actions.map(
                                ( action ) => (
                                  <label
                                    key={ action.key }
                                    className="flex items-center justify-between text-xs"
                                  >
                                    <span>
                                      { action.label }
                                    </span>
                                    {renderCheckbox(
                                      child.key,
                                      action.key,
                                      childPermissions
                                    )}
                                  </label>
                                )
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

              {module.extraActions?.length >
                0 && (
                  <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                    {module.extraActions.map(
                      (extra) => (
                        <label
                          key={extra}
                          className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
                        >
                          <span>
                            ★{" "}
                            {extra .charAt(0) .toUpperCase() + extra.slice( 1 )}
                          </span>
                          {renderCheckbox(
                            module.key,
                            extra,
                            modulePermissions
                          )}
                        </label>
                      )
                    )}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </>
  );
}