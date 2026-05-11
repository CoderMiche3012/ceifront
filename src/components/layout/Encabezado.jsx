import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SubMenu from "./SubMenu";
import ModalPerfil from "./../usuarios/modales/ModalPerfil";
import { obtenerPerfil, guardarUsuarioLocal } from "../../services/usuariosService";

export default function Encabezado({ setSidebarOpen }) {
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  //inicialización segura del estado
  const [fullUser, setFullUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      return null;
    }
  });
  //actualizacion de usuario con callback 
  const handleUserUpdate = useCallback((updatedUser) => {
    if (!updatedUser) return;
    const usuarioActualizado = guardarUsuarioLocal(updatedUser);
    setFullUser(usuarioActualizado);
    window.dispatchEvent(new Event("storage"));
  }, []);
  //sincronizacion inicial 
  useEffect(() => {
    let isMounted = true;
    const syncUser = async () => {
      const token = localStorage.getItem("access");
      const storedData = localStorage.getItem("user");
      if (!storedData || !token) return;
      try {
        const userLocal = JSON.parse(storedData);
        const data = await obtenerPerfil(userLocal.id_usuario || userLocal.id, token);
        if (data && isMounted) {
          handleUserUpdate(data);
        }
      } catch (error) {
        console.error("Error sincronizando perfil:", error);
        if (error.response?.status === 401) {
          cerrarSesion();
        }
      }
    };
    syncUser();
    return () => { isMounted = false; };
  }, [handleUserUpdate]);
  const cerrarSesion = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-all active:scale-95"
            aria-label="Abrir menú lateral"
          >
            <span className="text-2xl">☰</span>
          </button>

          {/* NOMBRE SISTEMA */}
          <div className="hidden sm:flex flex-col leading-tight">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#2F3B3B] tracking-tight">
              Centro de Esperanza Infantil A.C
            </h1>

          </div>
        </div>

        <SubMenu
          user={fullUser}
          onLogout={cerrarSesion}
          onOpenProfile={() => setProfileModalOpen(true)}
        />
      </header>

      <ModalPerfil
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={fullUser}
        onUserUpdated={handleUserUpdate}
      />
    </>
  );
}