import { useEffect, useMemo, useState, useCallback } from "react";
import { emptyPermissions, getEmptyPermissions, permissionsObjectToIds, roleToPermissionsObject, isProtectedRole, } from "../../utils/roles";
import { getRoles, getPermissions, updateRole, createRole, deleteRole, } from "../../services/rolesService";
import { formatError } from "../../utils/errorHandlers";

export default function useRoles() {
  //estados
  const [roles, setRoles] = useState([]);
  const [permissionsCatalog, setPermissionsCatalog] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [draftPermissions, setDraftPermissions] = useState(null);
  const [draftRole, setDraftRole] = useState(null);
  const [createRoleForm, setCreateRoleForm] = useState({
    nombre_rol: "",
    descripcion: "",
    permisos: getEmptyPermissions(),
  });
  //estados de carga y feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
  const [deletingRole, setDeletingRole] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  //modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmSaveEditModal, setShowConfirmSaveEditModal] = useState(false);
  const [showConfirmCreateRoleModal, setShowConfirmCreateRoleModal] = useState(false);
  const [showConfirmDeleteRoleModal, setShowConfirmDeleteRoleModal] = useState(false);
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [rolesResponse, permissionsResponse] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);
      const rolesData = Array.isArray(rolesResponse) ? rolesResponse : rolesResponse?.data || [];
      const permissionsData = Array.isArray(permissionsResponse) ? permissionsResponse : permissionsResponse?.data || [];
      setRoles(rolesData);
      setPermissionsCatalog(permissionsData);
      if (rolesData.length > 0) {
        setSelectedRole(rolesData[0]);
      }
    } catch (err) {
      setError(formatError(err) || "No se pudo sincronizar la información");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  //acciones UI
  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  const handleSelectRole = useCallback((role) => {
    if (editMode) return;
    setSelectedRole(role);
    clearMessages();
  }, [editMode, clearMessages]);

  const handleEditPermissions = useCallback(() => {
    if (!selectedRole) return;
    setDraftPermissions(roleToPermissionsObject(selectedRole, permissionsCatalog));
    setDraftRole({ descripcion: selectedRole.descripcion || "" });
    setEditMode(true);
    clearMessages();
  }, [selectedRole, permissionsCatalog, clearMessages]);

  const handleCancelEdit = useCallback(() => {
    setDraftPermissions(null);
    setDraftRole(null);
    setEditMode(false);
    setShowConfirmSaveEditModal(false);
    clearMessages();
  }, [clearMessages]);
  //manejo de cambios
  const handlePermissionChange = useCallback((moduleKey, action) => {
    if (!editMode) return;

    // RESTRICCIÓN: Solo administradores pueden tener editar/eliminar en usuarios
    const isUserModule = moduleKey === "usuarios";
    const isRestrictedAction = action === "editar" || action === "eliminar";
    const isNotAdmin = !isProtectedRole(selectedRole);

    if (isUserModule && isRestrictedAction && isNotAdmin) {
      return setError("Solo el rol de Administrador puede gestionar permisos de edición/eliminación de usuarios");
    }

    setDraftPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [action]: !prev[moduleKey][action],
      },
    }));
  }, [editMode, selectedRole, setError]);

  const handleDraftRoleChange = useCallback((value) => {
    setDraftRole((prev) => ({ ...prev, descripcion: value }));
  }, []);

  const handleSavePermissions = useCallback(async () => {
    if (!selectedRole || !draftPermissions || !draftRole) return;
    try {
      setSaving(true);
      clearMessages();
      const permisosIds = permissionsObjectToIds(draftPermissions, permissionsCatalog);
      const payload = {
        nombre_rol: selectedRole.nombre_rol,
        descripcion: draftRole.descripcion.trim(),
        permisos: permisosIds,
      };
      await updateRole(selectedRole.id_rol, payload);
      const updatedRole = {
        ...selectedRole,
        descripcion: payload.descripcion,
        permisos: permisosIds,
      };
      setRoles((prev) => prev.map((r) => (r.id_rol === selectedRole.id_rol ? updatedRole : r)));
      setSelectedRole(updatedRole);
      setEditMode(false);
      setShowConfirmSaveEditModal(false);
      setSuccess("Cambios guardados exitosamente");
    } catch (err) {
      setError(formatError(err) || "Error al actualizar el rol");
    } finally {
      setSaving(false);
    }
  }, [selectedRole, draftPermissions, draftRole, permissionsCatalog, clearMessages]);

  const handleCreateRole = useCallback(async () => {
    const { nombre_rol, descripcion, permisos } = createRoleForm;
    if (!nombre_rol.trim()) return setError("El nombre es requerido");

    try {
      setCreatingRole(true);
      clearMessages();

      const permisosIds = permissionsObjectToIds(permisos, permissionsCatalog);
      const payload = {
        nombre_rol: nombre_rol.trim(),
        descripcion: descripcion.trim(),
        permisos: permisosIds
      };

      const response = await createRole(payload);
      const newRole = response?.data || response;

      setRoles((prev) => [...prev, newRole]);
      setSelectedRole(newRole);
      setShowCreateModal(false);
      setShowConfirmCreateRoleModal(false);
      setSuccess(`Rol "${newRole.nombre_rol}" creado con éxito`);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setCreatingRole(false);
    }
  }, [createRoleForm, permissionsCatalog, clearMessages]);

  const handleDeleteRole = useCallback(async () => {
    if (!selectedRole) return;
    try {
      setDeletingRole(true);
      clearMessages();
      await deleteRole(selectedRole.id_rol);

      const updatedRoles = roles.filter((r) => r.id_rol !== selectedRole.id_rol);
      setRoles(updatedRoles);
      setSelectedRole(updatedRoles.length > 0 ? updatedRoles[0] : null);
      setShowConfirmDeleteRoleModal(false);
      setSuccess("Rol eliminado del sistema");
    } catch (err) {
      setError(formatError(err) || "No se pudo eliminar. Verifique si tiene usuarios asociados.");
    } finally {
      setDeletingRole(false);
    }
  }, [selectedRole, roles, clearMessages]);

  const openCreateModal = useCallback(() => {
    setCreateRoleForm({
      nombre_rol: "",
      descripcion: "",
      permisos: getEmptyPermissions(),
    });
    setShowCreateModal(true);
    clearMessages();
  }, [clearMessages]);

  const openConfirmDeleteRoleModal = useCallback(() => {
    if (isProtectedRole(selectedRole)) {
      return setError("Este rol es vital para el sistema y no puede ser eliminado");
    }
    setShowConfirmDeleteRoleModal(true);
    clearMessages();
  }, [selectedRole, clearMessages]);

  const currentPermissions = useMemo(() => {
    if (!selectedRole) return emptyPermissions;
    if (editMode) return draftPermissions || emptyPermissions;
    return roleToPermissionsObject(selectedRole, permissionsCatalog);
  }, [selectedRole, permissionsCatalog, editMode, draftPermissions]);



  return {
    //estados
    roles, permissionsCatalog, selectedRole, editMode, draftRole, loading,
    saving, creatingRole, deletingRole, error, success, showCreateModal,
    showConfirmSaveEditModal, showConfirmCreateRoleModal, showConfirmDeleteRoleModal,
    createRoleForm, currentPermissions,
    setShowConfirmSaveEditModal, setShowConfirmCreateRoleModal, setShowConfirmDeleteRoleModal,
    handleSelectRole, handleEditPermissions, handleCancelEdit, handlePermissionChange,
    handleDraftRoleChange, handleSavePermissions, openCreateModal,
    closeCreateModal: () => !creatingRole && setShowCreateModal(false),
    handleCreateFormChange: (field, value) => setCreateRoleForm(p => ({ ...p, [field]: value })),
    handleCreatePermissionChange: (mod, act) => {
      //validar nombre del rol 
      const isUserModule = mod === "usuarios";
      const isRestrictedAction = act === "editar" || act === "eliminar";
      const roleName = createRoleForm.nombre_rol.toLowerCase();
      const isNotAdminName = !roleName.includes("admin");
      if (isUserModule && isRestrictedAction && isNotAdminName) {
        return setError("Para asignar estos permisos, el nombre del rol debe ser Administrativo");
      }
      setCreateRoleForm(p => ({
        ...p,
        permisos: {
          ...p.permisos,
          [mod]: { ...p.permisos[mod], [act]: !p.permisos[mod][act] }
        }
      }));
    },
    openConfirmCreateRoleModal: () => createRoleForm.nombre_rol.trim() ? setShowConfirmCreateRoleModal(true) : setError("Asigna un nombre al rol"),
    handleCreateRole, openConfirmDeleteRoleModal, handleDeleteRole, clearMessages
  };
}