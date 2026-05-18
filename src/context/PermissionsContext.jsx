import { createContext, useContext, useState, useEffect } from "react";
import { cargarPermisosUsuario } from "../features/usuarios/services/permisosService";

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerms = async () => {
      try {
        const perms = await cargarPermisosUsuario();
        setPermissions(perms || []);
      } catch (err) {
        console.error("Error al cargar permisos globales:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerms();
  }, []);

  return (
    <PermissionsContext.Provider value={{ permissions, loading }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions debe usarse dentro de un PermissionsProvider");
  }
  return context;
};