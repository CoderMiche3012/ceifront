import { useState, useCallback } from "react";
import { useActivarUsuario, useDesactivarUsuario, } from "../hooks/useUsuarios";
import { formatErrorAnidado } from "../../../utils/errorHandlers";

export default function useUsersUI() {
  // estados y mutaciones
  const activarMutation = useActivarUsuario();
  const desactivarMutation = useDesactivarUsuario();
  const [result, setResult] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });
  // modales
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [statusAction, setStatusAction] = useState(null);
  const showResult = (payload) => setResult({ open: true, ...payload });
  // abrir modal de creacion
  const openCreateModal = () => {
    setSelectedUser(null);
    setCreateModalOpen(true);
  };
  // cerrar modal de creacion
  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  // abrir modal de edicion
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };
  // cerrar modal de edicion
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };
  // modales de activar/desactivar
  const openDeactivateModal = (user, action) => {
    setUserToDeactivate(user);
    setStatusAction(action);
    setDeactivateModalOpen(true);
  };
  const closeDeactivateModal = () => {
    setDeactivateModalOpen(false);
    setUserToDeactivate(null);
    setStatusAction(null);
  };
  // para los modales de reustado
  const handleUserCreated = () =>
    showResult({
      type: "success",
      title: "Operación Exitosa",
      message: "Usuario registrado correctamente",
    });
  const handleUserUpdated = () =>
    showResult({
      type: "success",
      title: "Operación Exitosa",
      message: "Usuario actualizado correctamente",
    });

  const handleNoChanges = () =>
    showResult({
      type: "info",
      title: "Sin cambios",
      message: "No se detectaron modificaciones",
    });

  const handleError = (message) =>
    showResult({
      type: "error",
      title: "Error",
      message,
    });

  // confirmar activacion / desactivar
  const handleConfirmDeactivate = useCallback(async () => {
    if (!userToDeactivate) return;

    try {
      const id = userToDeactivate.id_usuario;

      if (statusAction === "activate") {
        await activarMutation.mutateAsync(id);
      } else {
        await desactivarMutation.mutateAsync(id);
      }

      setResult({
        open: true,
        type: "success",
        title: "Operación Exitosa",
        message:
          statusAction === "activate"
            ? "Usuario activado correctamente"
            : "Usuario desactivado correctamente",
      });

      closeDeactivateModal();
    } catch (error) {
      setResult({
        open: true,
        type: "error",
        title: "Error",
        message: formatErrorAnidado(error),
      });
    }
  }, [
    userToDeactivate,
    statusAction,
    activarMutation,
    desactivarMutation,
    closeDeactivateModal,
    setResult
  ]);
  return {
    // resultados
    result,
    setResult,
    // modales
    isCreateModalOpen,
    isEditModalOpen,
    isDeactivateModalOpen,
    selectedUser,
    userToDeactivate,
    statusAction,
    // acciones de los modales
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeactivateModal,
    closeDeactivateModal,
    handleConfirmDeactivate,
    //resultados de las acciones
    handleUserCreated,
    handleUserUpdated,
    handleNoChanges,
    handleError,
  };
}
