import { Navigate } from "react-router-dom";
import { usePermissions } from "../context/PermissionsContext";

export default function PermissionRoute({
  children,
  modulo,
  accion,
  permisos = [],
}) {
  const { hasModulePermission, loading } = usePermissions();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  const tienePermisoBasico =
    modulo && accion
      ? hasModulePermission(modulo, accion)
      : true;

  const tienePermisosAvanzados =
    permisos.length > 0
      ? permisos.every(
          (p) => hasModulePermission(p.modulo, p.accion)
        )
      : true;

  const tieneAcceso = tienePermisoBasico && tienePermisosAvanzados;

  if (!tieneAcceso) {
    return <Navigate to="/app" replace />;
  }

  return children;
}