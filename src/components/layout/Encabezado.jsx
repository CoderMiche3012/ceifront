import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { ui } from "../../styles/uiClasses";
import SubMenu from "./SubMenu";
import ModalPerfil from "../../features/usuarios/components/modales/ModalPerfil";
import { obtenerPerfil, guardarUsuarioLocal, } from "../../features/usuarios/services/usuariosService";

import logoCei from "../../assets/imagenes/logo.png";

export default function Encabezado({
  setSidebarOpen,
  sidebarOpen,
}) {
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [fullUser, setFullUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  });

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/", { replace: true });
  };

  const handleUserUpdate = useCallback((updatedUser) => {
    if (!updatedUser) return;

    const usuarioActualizado = guardarUsuarioLocal(updatedUser);
    setFullUser(usuarioActualizado);

    window.dispatchEvent(new Event("storage"));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const syncUser = async () => {
      const token = localStorage.getItem("access");
      const storedData = localStorage.getItem("user");

      if (!storedData || !token) return;

      try {
        const userLocal = JSON.parse(storedData);

        const data = await obtenerPerfil(
          userLocal.id_usuario || userLocal.id,
          token
        );

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

    return () => {
      isMounted = false;
    };
  }, [handleUserUpdate]);

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