import { createContext, useContext, useMemo, useEffect, useState, } from "react";
import { obtenerUsuario, } from "../storage/userStorage";

const PermissionsContext = createContext();

export function PermissionsProvider({ children }) {
  // para obtener los datos del usuario en uso
  const [usuario, setUsuario] = useState(obtenerUsuario());

  useEffect(() => {
    // sincronizacion entre Pestañas
    const syncUser = () => { setUsuario(obtenerUsuario()); };
    window.addEventListener("storage", syncUser);
    syncUser();
    return () => { window.removeEventListener("storage", syncUser); };
  }, []);
  //lectura de Permisos
  const isAdmin = usuario?.esAdmin === true || usuario?.esSuperUser === true;
  const permissions = Array.isArray(usuario?.permisos)
    ? usuario.permisos
    : [];
  // validador de permisos de módulo si es admin o super usuario tiene todos los pemisos
  const hasModulePermission = useMemo(() => {
    return (modulo, accion) => {
      if (isAdmin) return true;
      return permissions.includes(
        `${modulo}.${accion}`
      );
    };
  }, [permissions, isAdmin]);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        isAdmin,
        loading: false,
        hasModulePermission,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}
//atajo
export function usePermissions() {
  return useContext(PermissionsContext);
}

