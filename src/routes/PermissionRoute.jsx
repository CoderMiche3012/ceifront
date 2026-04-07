// src/routes/PermissionRoute.jsx
import { Navigate } from "react-router-dom";
import { usePermissions } from "../context/PermissionsContext";
import { hasPermission } from "../utils/menuPermissions";

const PermissionRoute = ({ children, permiso }) => {
  const { permissions, loading } = usePermissions();
  if (loading) return <div className="loading-screen">Cargando...</div>;
  if (hasPermission(permissions, permiso)) {
    return children;
  }
  return <Navigate to="/app" replace />;
};

export default PermissionRoute;