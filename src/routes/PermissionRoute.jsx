import { Navigate } from "react-router-dom";
import { usePermissions } from "../context/PermissionsContext";

export default function PermissionRoute({
  children,
  modulo,
  accion,
}) {
  const {
    hasModulePermission,
    loading,
  } = usePermissions();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }
 console.log("ROUTE", modulo, accion);
  console.log("ADMIN ROUTE", hasModulePermission(modulo, accion));
 
  if (!hasModulePermission(modulo, accion)) {
    return <Navigate to="/app" replace />;
  }

  return children;
}