import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

import { ui } from "../../styles/ui/uiClasses";
import { obtenerUsuario, limpiarSesionLocal, guardarUsuarioLocal } from "../../storage/userStorage";

import SubMenu from "./SubMenu";
import ModalPerfil from "../../features/auth/components/ModalPerfil";

import logoCei from "../../assets/imagenes/logo.png";

export default function Encabezado({ setSidebarOpen, sidebarOpen, }) {
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  //estado inicial del usuario
  const [fullUser, setFullUser] = useState( obtenerUsuario() );
  //sincronizacion con el perfil (detectar cambios)
  useEffect(() => {
    const syncUser = () => { setFullUser(obtenerUsuario()); };
    window.addEventListener("storage", syncUser);
    syncUser();
    return () => {
      window.removeEventListener(
        "storage",
        syncUser
      );
    };
  }, []);
  //cerrar sesion
  const cerrarSesion = () => {
    limpiarSesionLocal();
    navigate("/login", { replace: true });
  };
  //manejador para actualizaciones manuales
  const handleUserUpdate = useCallback((updatedUser) => {
    if (!updatedUser) return;
    guardarUsuarioLocal(updatedUser);
    window.dispatchEvent(
      new Event("storage")
    );
  }, []);

  return (
    <>
      <header className={ui.headerBar.container}>
        <div className="flex items-center gap-4">
          {/*para mostrar segun si se abre o no el menu*/}
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Abrir menú lateral"
            className={ui.headerBar.menuButton}
          >
            <Menu size={22} />
          </button>

          {!sidebarOpen && (
            <div className={ui.headerBar.brand}>
              <img
                src={logoCei}
                alt="CEI"
                className={ui.headerBar.logo}
              />

              <div className={ui.headerBar.brandText}>
                <p className={ui.headerBar.brandTitle}>
                  Centro de Esperanza Infantil A.C.
                </p>
              </div>
            </div>
          )}
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