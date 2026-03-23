import { useMemo, useState } from "react"
import { NavLink } from "react-router-dom"
import {HiOutlineCog,HiOutlineLogout,HiChevronDown,HiChevronRight,} from "react-icons/hi"
import logoCei from "../../assets/imagenes/logo.png"
import { mainMenu,reportesMenu,configSubmenu,} from "../../config/menuConfig"
import {hasPermission,filterMenuByPermissions,} from "../../utils/menuPermissions"

export default function Menu({ sidebarOpen, userPermissions = [] }) {
  const [configOpen, setConfigOpen] = useState(false)

  const visibleMainMenu = useMemo(() => {
    return filterMenuByPermissions(mainMenu, userPermissions)
  }, [userPermissions])

  const visibleConfigSubmenu = useMemo(() => {
    return filterMenuByPermissions(configSubmenu, userPermissions)
  }, [userPermissions])

  const canViewReportes = hasPermission(
    userPermissions,
    reportesMenu.permission
  )

  const canViewConfig = visibleConfigSubmenu.length > 0

  const expandedClasses = sidebarOpen
    ? "gap-3 px-4"
    : "justify-center px-2 lg:justify-start lg:gap-3 lg:px-4"

  return (
    <aside className="flex h-screen w-full flex-col border-r border-[#e7e3e8] bg-[#f7f7f8]">
      <div className="flex items-center gap-3 border-b border-[#e7e3e8] px-4 py-4">
        <img
          src={logoCei}
          alt="Logo Centro de Esperanza"
          className="h-12 w-12 shrink-0 object-contain"
        />

        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block min-w-0`}>
          <p className="mt-1 text-xs uppercase tracking-wide text-[#0E5F63]">
            Centro de Esperanza Infantil A.C.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6">
        <nav className="space-y-2">
          {visibleMainMenu.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/app"}
                className={({ isActive }) =>
                  `flex items-center rounded-2xl py-3 text-[15px] font-medium transition ${expandedClasses} ${
                    isActive
                      ? "bg-[#1F8A8A] text-white shadow-sm"
                      : "text-[#0E5F63] hover:bg-[#eceff1]"
                  }`
                }
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon className="shrink-0 text-lg" />
                <span className={`${sidebarOpen ? "inline" : "hidden"} lg:inline`}>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </nav>

        {(canViewReportes || canViewConfig) && (
          <div className="mt-8">
            <p
              className={`${sidebarOpen ? "block" : "hidden"} lg:block mb-3 px-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#b6b8c2]`}
            >
              Análisis y sistema
            </p>

            <nav className="space-y-2">
              {canViewReportes && (
                <NavLink
                  to={reportesMenu.path}
                  className={({ isActive }) =>
                    `flex items-center rounded-2xl py-3 text-[15px] font-medium transition ${expandedClasses} ${
                      isActive
                        ? "bg-[#1F8A8A] text-white shadow-sm"
                        : "text-[#0E5F63] hover:bg-[#eceff1]"
                    }`
                  }
                  title={!sidebarOpen ? reportesMenu.label : ""}
                >
                  <reportesMenu.icon className="shrink-0 text-lg" />
                  <span className={`${sidebarOpen ? "inline" : "hidden"} lg:inline`}>
                    {reportesMenu.label}
                  </span>
                </NavLink>
              )}

              {canViewConfig && (
                <>
                  <button
                    type="button"
                    onClick={() => setConfigOpen((prev) => !prev)}
                    className={`flex w-full items-center rounded-2xl py-3 text-[15px] font-medium text-[#0E5F63] transition hover:bg-[#eceff1] ${expandedClasses}`}
                    title={!sidebarOpen ? "Configuración" : ""}
                  >
                    <HiOutlineCog className="shrink-0 text-lg" />

                    <div className={`${sidebarOpen ? "flex" : "hidden"} lg:flex flex-1 items-center`}>
                      <span className="flex-1 text-left">Configuración</span>
                      {configOpen ? (
                        <HiChevronDown className="text-lg" />
                      ) : (
                        <HiChevronRight className="text-lg" />
                      )}
                    </div>
                  </button>

                  {configOpen && (
                    <div className="mt-2 space-y-1 pl-10">
                      {visibleConfigSubmenu.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `block rounded-xl px-3 py-2 text-sm transition ${
                              isActive
                                ? "bg-[#e7f4f3] font-semibold text-[#1F8A8A]"
                                : "text-[#6d7a80] hover:bg-[#eceff1]"
                            }`
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      <div className="border-t border-[#e7e3e8] px-3 py-4">
        <button
          className={`flex w-full items-center rounded-2xl py-3 text-[15px] font-medium text-[#ef5b5b] transition hover:bg-red-50 ${expandedClasses}`}
          title={!sidebarOpen ? "Cerrar Sesión" : ""}
        >
          <HiOutlineLogout className="text-lg" />
          <span className={`${sidebarOpen ? "inline" : "hidden"} lg:inline`}>
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  )
}