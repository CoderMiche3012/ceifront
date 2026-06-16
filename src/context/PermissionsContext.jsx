import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { obtenerUsuario } from "../storage/userStorage";

const PermissionsContext = createContext();

export function PermissionsProvider({ children }) {
  const [usuario, setUsuario] = useState(obtenerUsuario());

  useEffect(() => {
    const syncUser = () => setUsuario(obtenerUsuario());

    window.addEventListener("storage", syncUser);
    syncUser();

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const permissions = Array.isArray(usuario?.permisos)
    ? usuario.permisos
    : [];

  const esAdmin = usuario?.esAdmin === true;
  const esSuperUser = usuario?.esSuperUser === true;

  const hasModulePermission = useMemo(() => {
    return (modulo, accion) => {
      // SuperAdmin: acceso total
      if (esSuperUser) return true;

      // Admin: todo menos gestión de permisos
      if (esAdmin) {
        return modulo !== "roles";
      }

      // Usuario normal
      return permissions.includes(`${modulo}.${accion}`);
    };
  }, [permissions, esAdmin, esSuperUser]);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        esAdmin,
        esSuperUser,
        loading: false,
        hasModulePermission,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionsContext);
}