import {
  createContext,
  useContext,
  useMemo,
} from "react";

import {
  obtenerUsuario,
} from "../storage/userStorage";

import {
  permissionNameToModuleAction,
} from "../utils/roles";

const PermissionsContext = createContext();

export function PermissionsProvider({ children }) {

  const usuario = obtenerUsuario();

  const isAdmin = usuario?.esAdmin === true;

  // permisos vienen desde login
  const permissions = Array.isArray(usuario?.permisos)
    ? usuario.permisos
    : [];

  const hasModulePermission = useMemo(() => {

    return (modulo, accion) => {

      // superadmin tiene acceso total
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