import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";

import {
  obtenerUsuario,
} from "../storage/userStorage";

import {
  permissionNameToModuleAction,
} from "../utils/roles";

const PermissionsContext = createContext();

export function PermissionsProvider({ children }) {

  const [usuario, setUsuario] = useState(obtenerUsuario());

  useEffect(() => {

    const syncUser = () => {
      setUsuario(obtenerUsuario());
    };

    window.addEventListener("storage", syncUser);

    syncUser();

    return () => {
      window.removeEventListener("storage", syncUser);
    };

  }, []);

  console.log("USUARIO CONTEXT", usuario);
  console.log("IS ADMIN", usuario?.esAdmin);

  const isAdmin = usuario?.esAdmin === true;

  const permissions = Array.isArray(usuario?.permisos)
    ? usuario.permisos
    : [];

  const hasModulePermission = useMemo(() => {

    return (modulo, accion) => {

      // superadmin acceso total
      if (isAdmin) return true;

      return permissions.some((permiso) => {

        const parsed = permissionNameToModuleAction(
          permiso.nombre_permiso
        );

        if (!parsed) return false;

        return (
          parsed.moduleKey === modulo &&
          parsed.actionKey === accion
        );

      });

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

export function usePermissions() {
  return useContext(PermissionsContext);
}