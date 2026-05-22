import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

import { ui } from "../../styles/uiClasses";
import SubMenu from "./SubMenu";
import ModalPerfil from "../../features/usuarios/components/modales/ModalPerfil";

import { usePerfil } from "../../features/auth/hooks/usePerfil";
import { limpiarSesionLocal, guardarSesionLocal } from "../../storage/userStorage";

import logoCei from "../../assets/imagenes/logo.png";


export default function Encabezado({
  setSidebarOpen,
  sidebarOpen,
}) {
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  //estado inicial del usuario
  const [fullUser, setFullUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  });

  //sincronizacion con el perfil 
  const userId = fullUser?.id;
  const { data: perfilActualizado } = usePerfil(userId);
  useEffect(() => {
    if (!perfilActualizado) return;

    setFullUser((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(perfilActualizado)) {
        return prev;
      }

      guardarSesionLocal({
        usuario: perfilActualizado,
        access: localStorage.getItem("access"),
        refresh: localStorage.getItem("refresh"),
      });

      return perfilActualizado;
    });
  }, [perfilActualizado]);

  //cerrar sesion
  const cerrarSesion = () => {
    limpiarSesionLocal();
    navigate("/login", { replace: true });
  };
  //manejador para actualizaciones manuales
  const handleUserUpdate = useCallback((updatedUser) => {

    if (!updatedUser) return;

    setFullUser(updatedUser);

    guardarSesionLocal({
      usuario: updatedUser,
      access: localStorage.getItem("access"),
      refresh: localStorage.getItem("refresh"),
    });
  }, []);

  return (
    <>
      <header className={ui.headerBar.container}>
        <div className="flex items-center gap-4">
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