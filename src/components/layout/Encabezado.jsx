import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubMenu from "./SubMenu";
import ModalPerfil from "./../usuarios/modales/ModalPerfil";
import {obtenerPerfil,guardarUsuarioLocal,} from "../../services/usuariosService";

export default function Encabezado({ setSidebarOpen }) {
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  //estado local del usuario completo obtenido desde localStorage
  const [fullUser, setFullUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  //actualiza el usuario en localStorage y en el estado
  const handleUserUpdate = (updatedUser) => {
    const usuarioActualizado = guardarUsuarioLocal(updatedUser);
    setFullUser(usuarioActualizado);
  };
  useEffect(() => {
    //sincroniza el usuario local con la información más reciente del perfil
    const syncUser = async () => {
      const storedData = localStorage.getItem("user");
      if (!storedData) return;
      const userLocal = JSON.parse(storedData);
      const token = localStorage.getItem("access");
      if (userLocal?.id && token) {
        try {
          const data = await obtenerPerfil(userLocal.id, token);
          if (data) {
            const usuarioActualizado = guardarUsuarioLocal(data);
            setFullUser(usuarioActualizado);
            console.log("Usuario sincronizado:", usuarioActualizado);
          }
        } catch (error) {
          console.error("Error en la sincronización:", error);
        }
      } else {
        console.warn("No se pudo sincronizar: ID de usuario no encontrado en localStorage");
      }
    };
    syncUser();
  }, []);

  //limpia la sesión y redirige al login
  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="flex h-20 items-center justify-between border-b border-[#e7e3e8] bg-white px-4 md:px-8">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="rounded-xl p-2 hover:bg-slate-100 transition-colors"
        >
          ☰
        </button>
        <SubMenu
          user={fullUser}
          onLogout={cerrarSesion}
          onOpenProfile={() => setProfileModalOpen(true)}
        />
      </header>
      {/* modal para ver y editar el perfil del usuario */}
      <ModalPerfil
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={fullUser}
        onUserUpdated={handleUserUpdate}
      />
    </>
  );
}