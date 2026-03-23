import { useCallback, useEffect, useMemo, useState } from "react";
import { getRoles } from "../services/rolesService";
import { obtenerUsuarios } from "../services/usuariosService";
import { normalizeStatus, buildRoleOptions, filterAndSortUsers,} from "../utils/usuarios";
const PAGE_SIZE = 4;
// para centralizar la carga, filtros y paginación de usuarios
export default function useUsersData() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  //obtiene usuarios desde la API y normaliza su estatus
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await obtenerUsuarios();
      const normalizedUsers = data.map((user) => ({
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
  //catálogo de roles
  const fetchRoles = useCallback(async () => {
    try {
      const data = await getRoles();
      const rolesData = Array.isArray(data) ? data : data?.data || [];
      setRoles(rolesData);
    } catch (err) {
      console.error("Error al cargar roles:", err);
    }
  }, []);
  //inicial de usuarios y roles
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);
  const roleOptions = useMemo(() => buildRoleOptions(roles), [roles]);
  //configura filtros reutilizables para la UI
  const filters = useMemo(() => {
    return [
      {
        value: roleFilter,
        onChange: (value) => {
          setRoleFilter(value);
          setCurrentPage(1);
        },
        placeholder: "Todos los roles",
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
    ];
  }, [roleFilter, statusFilter, roleOptions]);
  //filtra y ordena los usuarios
  const filteredUsers = useMemo(() => {
    return filterAndSortUsers({
      users,
      search,
      statusFilter,
      roleFilter,
    });
  }, [users, search, statusFilter, roleFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  //obtiene solo los usuarios de la página actual
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };
  // limpia busqueda y filtros
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setRoleFilter("");
    setCurrentPage(1);
  };
  return {
    PAGE_SIZE,users,roles,loading,error,search,filters,
    currentPage,totalPages,filteredUsers,paginatedUsers,
    setCurrentPage,fetchUsers,handleSearchChange,handleClearFilters,
  };
}