import { useMemo, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import {HiOutlineCog, HiOutlineLogout, HiChevronDown, HiChevronRight, } from "react-icons/hi";

import logoCei from "../../assets/imagenes/logo.png";

import {mainMenu, reportesMenu, configSubmenu, } from "../../config/menuConfig";
import { usePermissions } from "../../context/PermissionsContext";

export default function Menu({ sidebarOpen, onLogout }) {
  //estados
  const [configOpen, setConfigOpen] = useState(false);
  const { hasModulePermission } = usePermissions();
  // filtrar menú principal
  const visibleMainMenu = useMemo(() => {
    return mainMenu.filter((item) => {
      if (!item.permission) return true;
      return hasModulePermission(
        item.permission.module,
        item.permission.action
      );
    });
  }, [hasModulePermission]);
  // filtrar submenu configuración
  const visibleConfigSubmenu = useMemo(() => {
    return configSubmenu.filter((item) => {
      if (!item.permission) return true;
      return hasModulePermission(
        item.permission.module,
        item.permission.action
      );
    });
  }, [hasModulePermission]);
  // permiso reportes
  const canViewReportes = useMemo(() => {
    if (!reportesMenu.permission) return true;
    return hasModulePermission(
      reportesMenu.permission.module,
      reportesMenu.permission.action
    );
  }, [hasModulePermission]);

  const canViewConfig = visibleConfigSubmenu.length > 0;

  const getLinkClasses = useCallback(
    ({ isActive }) => {
      const base = "flex items-center rounded-2xl py-3 text-[15px] font-medium transition-all duration-200";
      const expansion = sidebarOpen ? "gap-3 px-4" : "justify-center px-2 lg:justify-start lg:gap-3 lg:px-4";
      const active = isActive ? "bg-[#1F8A8A] text-white shadow-md shadow-[#1F8A8A]/20" : "text-[#0E5F63] hover:bg-slate-200/50";
      return `${base} ${expansion} ${active}`;
    },
    [sidebarOpen]
  );

  return (
    <div className="flex h-full w-full flex-col border-r border-slate-200 bg-[#f7f7f8] transition-all">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-[#f7f7f8] px-4 py-5">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-sm">          <img
          src={logoCei}
          alt="Logo CEI"
          className="h-full w-full object-contain"
          onError={(e) => {
            e.target.src =
              "https://ui-avatars.com/api/?name=CEI&background=1F8A8A&color=fff";
          }}
        />
        </div>

        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block min-w-0 animate-in fade-in slide-in-from-left-2`} >
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#0E5F63] leading-tight">
            Centro de Esperanza <br /> Infantil A.C.
          </p>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex-1 overflow-y-auto px-3 py-6 custom-scrollbar">
        {/* Principal */}
        <nav className="space-y-1.5">
          {visibleMainMenu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/app"}
                className={getLinkClasses}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon className="shrink-0 text-xl" />
                <span className={`${sidebarOpen ? "inline" : "hidden"} lg:inline truncate`} >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sistema */}
        {(canViewReportes || canViewConfig) && (
          <div className="mt-10">
            <p
              className={`${sidebarOpen ? "block" : "hidden"} lg:block mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400`}
            >
              Análisis y sistema
            </p>

            <nav className="space-y-1.5">
              {/* Reportes */}
              {canViewReportes && (
                <NavLink
                  to={reportesMenu.path}
                  className={getLinkClasses}
                  title={!sidebarOpen ? reportesMenu.label : ""}
                >
                  <reportesMenu.icon className="shrink-0 text-xl" />
                  <span className={`${sidebarOpen ? "inline" : "hidden"} lg:inline`} >
                    {reportesMenu.label}
                  </span>
                </NavLink>

              )}

              {/* Configuración */}
              {canViewConfig && (
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setConfigOpen((prev) => !prev)}
                    className={`flex w-full items-center rounded-2xl py-3 text-[15px] font-medium text-[#0E5F63] transition hover:bg-slate-200/50 ${sidebarOpen
                      ? "px-4 gap-3"
                      : "justify-center lg:justify-start lg:px-4 lg:gap-3"
                      }`}
                  >
                    <HiOutlineCog className={`shrink-0 text-xl transition-transform ${configOpen ? "rotate-45" : "" }`} />
                    <div className={`${sidebarOpen ? "flex" : "hidden"} lg:flex flex-1 items-center justify-between`} >
                      <span className="truncate">
                        Configuración
                      </span>

                      {configOpen
                        ? <HiChevronDown />
                        : <HiChevronRight />
                      }
                    </div>
                  </button>

                  {/* submenu */}
                  {configOpen &&
                    (sidebarOpen || window.innerWidth >= 1024) && (
                      <div className="mt-1 space-y-1 ml-9 border-l-2 border-slate-200 pl-2 animate-in slide-in-from-top-2 duration-200">
                        {visibleConfigSubmenu.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block rounded-xl px-4 py-2 text-sm transition-colors ${isActive
                                ? "bg-[#e7f4f3] font-bold text-[#1F8A8A]"
                                : "text-slate-500 hover:bg-slate-100 hover:text-[#0E5F63]"
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>

                        ))}
                      </div>
                    )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
      <div className="border-t border-slate-200 px-3 py-4 bg-slate-50/50">
        <button
          onClick={onLogout}
          type="button"
          className={`flex w-full items-center rounded-2xl py-3 text-[15px] font-bold text-red-500 transition-all hover:bg-red-50 active:scale-95 ${sidebarOpen
            ? "px-4 gap-3"
            : "justify-center lg:justify-start lg:px-4 lg:gap-3"
            }`}
          title={!sidebarOpen ? "Cerrar Sesión" : ""}
        >
          <HiOutlineLogout className="text-xl" />
          <span className={`${sidebarOpen ? "inline" : "hidden"} lg:inline`} >
            Cerrar Sesión
          </span>
        </button>
      </div>
    </div>
  );
}
