import { useMemo, useState, useEffect } from "react";

import { useUsuarios } from "../hooks/useUsuarios";
import useRoles from "../sub-features/roles/hooks/useRoles";
import { obtenerUsuario } from "../../../storage/userStorage";
import {normalizeStatus, buildRoleOptions, filterAndSortUsers, } from "../../../utils/usuarios";

const PAGE_SIZE = 4;
export default function useUsersData() {
  // estados del buacdor y filtros
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: users = [], isLoading: loading, error, } = useUsuarios();
  const { roles = [] } = useRoles();

  // usuario actual
  const currentUser = obtenerUsuario();
  // normalizar usuarios
  const normalizedUsers = useMemo(() => {
    return users
      .filter(
        (user) =>
          user.id_usuario !== currentUser?.id_usuario &&
          user.id_rol != null
      )
      .map((user) => ({
        ...user,
        estatus: normalizeStatus(user.estatus),
      }));
  }, [users, currentUser]);

  // roles
  const roleOptions = useMemo( () => buildRoleOptions(roles || []), [roles] );

  // filtros 
  const filters = useMemo(
    () => [
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
    ],
    [roleFilter, statusFilter, roleOptions]
  );

  // filtrado
  const filteredUsers = useMemo(() => {
    return filterAndSortUsers({
      users: normalizedUsers,
      search,
      statusFilter,
      roleFilter,
    });
  }, [normalizedUsers, search, statusFilter, roleFilter]);

  const totalPages = Math.max( 1, Math.ceil(filteredUsers.length / PAGE_SIZE) );
  // paginación segura
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

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
    users: normalizedUsers,
    roles,
    loading,
    error: error?.message || "",
    search,
    filters,
    currentPage,
    totalPages,
    filteredUsers,
    paginatedUsers,
    setCurrentPage,
    handleSearchChange,
    handleClearFilters,
  };
}
