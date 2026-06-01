import { useEffect, useMemo, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { obtenerRoles, obtenerPermisos, actualizarRol, crearRol, eliminarRol, } from "../services/rolesService";
import { rolesKeys } from "./queryKeys";
import { authKeys } from "../../../../auth/services/keys";

import {
  emptyPermissions, getEmptyPermissions, permissionsObjectToIds,
  roleToPermissionsObject, isProtectedRole,
} from "../../../../../utils/roles";
import { formatErrorAnidado } from "../../../../../utils/errorHandlers";


export default function useRoles() {

  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(null);

  //estados para crear o editar
  const [modalMode, setModalMode] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const [roleForm, setRoleForm] = useState({
    nombre_rol: "",
    descripcion: "",
    permisos: getEmptyPermissions(),
  });

  const [showConfirmRoleModal, setShowConfirmRoleModal] = useState(false);
  const [showConfirmDeleteRoleModal, setShowConfirmDeleteRoleModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // consultas 
  const { data: roles = [], isLoading: loadingRoles, } = useQuery({
    queryKey: rolesKeys.all,
    queryFn: obtenerRoles,
  });
  const { data: permissionsCatalog = [], isLoading: loadingPermissions, } = useQuery({
    queryKey: rolesKeys.permisos,
    queryFn: obtenerPermisos,
  });

  useEffect(() => {
    if (roles.length && !selectedRole) {
      setSelectedRole(roles[0]);
    }
  }, [roles, selectedRole]);

  useEffect(() => {
    if (!selectedRole) return;
    const updatedRole = roles.find(
      (r) => r.id_rol === selectedRole.id_rol
    );
    if (updatedRole) {
      setSelectedRole(updatedRole);
    }
  }, [roles, selectedRole]);
  const loading = loadingRoles || loadingPermissions;

  // crear rol
  const createMutation = useMutation({
    mutationFn: crearRol,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: rolesKeys.permisos,
      });

      queryClient.invalidateQueries({
        queryKey: authKeys.perfil(),
      });

      setSuccess("Rol creado correctamente");
      setShowRoleModal(false);
      setShowConfirmRoleModal(false);
    },

    onError: (err) => {
      setShowConfirmRoleModal(false);
      setError(formatErrorAnidado(err));
    },
  });
  // editar rol
  const updateMutation = useMutation({
    mutationFn: actualizarRol,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: rolesKeys.permisos,
      });

      queryClient.invalidateQueries({
        queryKey: authKeys.perfil(),
      });

      setSuccess("Rol actualizado correctamente");
      setShowRoleModal(false);
      setShowConfirmRoleModal(false);
    },
    onError: (err) => {
      setShowConfirmRoleModal(false);
      setError(formatErrorAnidado(err));
    },
  });
  //eliminar rol
  const deleteMutation = useMutation({
    mutationFn: eliminarRol,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: rolesKeys.permisos,
      });

      queryClient.invalidateQueries({
        queryKey: authKeys.perfil(),
      });

      setSuccess("Rol eliminado");
      setShowConfirmDeleteRoleModal(false);
      setSelectedRole(null);
    },
    onError: (err) => {

      setShowConfirmDeleteRoleModal(false);
      setError(formatErrorAnidado(err));
    },
  });

  //para borrar los letreros de éxito o error
  const clearMessages = useCallback(() => { setError(""); setSuccess(""); }, []);
  const handleSelectRole = useCallback((role) => { setSelectedRole(role); }, []);
  //modal crear
  const openCreateModal = () => {
    setModalMode("create");
    setRoleForm({
      nombre_rol: "",
      descripcion: "",
      permisos: getEmptyPermissions(),
    });
    setShowRoleModal(true);
  };

  // modal editar
  const openEditModal = () => {
    if (!selectedRole) return;
    setModalMode("edit");
    setRoleForm({
      nombre_rol: selectedRole.nombre_rol,
      descripcion: selectedRole.descripcion || "",
      permisos: roleToPermissionsObject(selectedRole, permissionsCatalog),
    });
    setShowRoleModal(true);
  };

  // manejo de cambios en el Formulario
  const handleFormChange = (field, value) => {
    setRoleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionChange = (
    moduleKey,
    action,
    childKey = null
  ) => {
    setRoleForm((prev) => {

      const permisos = structuredClone(prev.permisos);

      // Permiso de submódulo
      if (childKey) {
        permisos[moduleKey].children[childKey][action] = !permisos[moduleKey].children[childKey][action];
      } else {
        // Permiso de módulo principal
        permisos[moduleKey][action] = !permisos[moduleKey][action];
      }
      return {
        ...prev,
        permisos,
      };
    });
  };
  //guardar
  const handleSaveRole = () => {
    const permisos = permissionsObjectToIds(roleForm.permisos, permissionsCatalog);
    if (modalMode === "create") {
      createMutation.mutate({ ...roleForm, permisos, });
      return;
    }

    updateMutation.mutate({
      id: selectedRole.id_rol,
      payload: { ...roleForm, permisos, },
    });
  };

  // eliminar
  const handleDeleteRole = () => {
    if (isProtectedRole(selectedRole)) {
      setError("Este rol está protegido");
      return;
    }
    deleteMutation.mutate(selectedRole.id_rol);
  };
  // vista detalle
  const currentPermissions = useMemo(() => {
    if (!selectedRole) { return getEmptyPermissions(); }

    return roleToPermissionsObject(
      selectedRole,
      permissionsCatalog
    );
  }, [selectedRole, permissionsCatalog]);

  return {
    roles,
    selectedRole,
    currentPermissions,

    roleForm,
    modalMode,

    loading,

    saving: createMutation.isPending || updateMutation.isPending,

    creatingRole: createMutation.isPending,
    deletingRole: deleteMutation.isPending,

    error,
    success,
    clearMessages,

    showRoleModal,
    showConfirmRoleModal,
    showConfirmDeleteRoleModal,

    setShowRoleModal,
    setShowConfirmRoleModal,
    setShowConfirmDeleteRoleModal,

    handleSelectRole,
    openCreateModal,
    openEditModal,
    handleFormChange,
    handlePermissionChange,
    handleSaveRole,
    handleDeleteRole,
  };
}
