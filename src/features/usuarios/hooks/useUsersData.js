import { useCallback, useEffect, useMemo, useState } from "react";
import { getRoles } from "../sub-features/roles/services/rolesService";
import { obtenerUsuarios } from "../services/usuariosService";
import { normalizeStatus, buildRoleOptions, filterAndSortUsers } from "../../../utils/usuarios";

const PAGE_SIZE = 4;
export default function useUsersData() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  //carga de usuarios
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await obtenerUsuarios();
      const rawUsers = Array.isArray(data) ? data : (data?.data || []);
      const usuarioGuardado = JSON.parse(localStorage.getItem("user"));
      const usuarioActualId = usuarioGuardado?.id_usuario;
      const normalizedUsers = rawUsers
        .filter(
          (user) =>
            user.id_usuario !== usuarioActualId && 
            user.id_rol !== null &&
            user.id_rol !== undefined &&
            user.id_rol !== ""
        )
        .map((user) => ({
          ...user,
          estatus: normalizeStatus(user.estatus),
        }));
      setUsers(normalizedUsers);
    } catch (err) {
      setError(err.message || "Ocurrió un error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  //carga de Roles
  const fetchRoles = useCallback(async () => {
    try {
      const data = await getRoles();
      const rolesData = Array.isArray(data) ? data : data?.data || [];
      setRoles(rolesData);
    } catch (err) {
      console.error("Error al cargar roles:", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  //opciones de Roles 
  const roleOptions = useMemo(() => buildRoleOptions(roles), [roles]);
  const filters = useMemo(() => [
    {
      value: roleFilter,
      onChange: (value) => {
        setRoleFilter(value);
        setCurrentPage(1);
      },
      placeholder: "Todos los puestos",
      options: roleOptions,
    },
    {
      value: statusFilter,
      onChange: (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
      },
      placeholder: "Todos los estatus",
      options: [
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
      ],
    },
  ], [roleFilter, statusFilter, roleOptions]);

  //Filtrado y Búsqueda
  const filteredUsers = useMemo(() => {
    return filterAndSortUsers({
      users,
      search,
      statusFilter,
      roleFilter,
    });
  }, [users, search, statusFilter, roleFilter]);

  //paginacion
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setRoleFilter("");
    setCurrentPage(1);
  };

  return {
    PAGE_SIZE,
    users,
    roles,
    loading,
    error,
    search,
    filters,
    currentPage,
    totalPages,
    filteredUsers,
    paginatedUsers,
    setCurrentPage,
    fetchUsers,
    handleSearchChange,
    handleClearFilters,
  };
}