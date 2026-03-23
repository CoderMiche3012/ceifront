import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Menu from "../components/layout/Menu"
import Encabezado from "../components/layout/Encabezado"
import { cargarPermisosUsuario } from "../services/permisosService"

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userPermissions, setUserPermissions] = useState([])
  const [loadingPermissions, setLoadingPermissions] = useState(true)

  useEffect(() => {
    const obtenerPermisos = async () => {
      try {
        const permisos = await cargarPermisosUsuario()
        setUserPermissions(permisos)
      } catch (error) {
        console.error("Error al cargar permisos:", error)
        setUserPermissions([])
      } finally {
        setLoadingPermissions(false)
      }
    }

    obtenerPermisos()
  }, [])

  if (loadingPermissions) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f3f1f4]">
        <p className="text-sm text-slate-600">Cargando permisos...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f1f4]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-black/40 lg:bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Menu
          sidebarOpen={sidebarOpen}
          userPermissions={userPermissions}
        />
      </aside>

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
          sidebarOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        <Encabezado
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-[#f3f1f4] p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}