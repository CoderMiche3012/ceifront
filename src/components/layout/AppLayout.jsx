// componente para em menu lateral y el encabezado
import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react";

import Menu from "./Menu"
import Encabezado from "./Encabezado"
//obtener el perfil del usuario actual
import { usePerfil } from "../../features/auth/hooks/usePerfil";
import { guardarUsuarioLocal } from "../../storage/userStorage";

export default function AppLayout() {
  //estado del menu lateral si esta abierto o cerrado
  const [sidebarOpen, setSidebarOpen] = useState(false)
  //trae la informacion del usuario en uso
  const { data: perfil } = usePerfil();
  // sincronisa los datos del usuario
  useEffect(() => {
    if (!perfil) return;
    const actual = localStorage.getItem("user");
    const nuevo = JSON.stringify(perfil);
    if (actual !== nuevo) {
      guardarUsuarioLocal(perfil);
      window.dispatchEvent(
        new Event("storage")
      );
    }
  }, [perfil]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f1f4]">
      {/* Si el menu se abre*/}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-black/40 lg:bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* mostrar el menu */}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-72 border-r border-slate-200 bg-white shadow-xl transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`} >
        <Menu sidebarOpen={sidebarOpen} />
      </aside>

      <div className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-72" : "lg:ml-0"}`} >
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