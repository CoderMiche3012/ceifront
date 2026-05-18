import { useState, useCallback } from "react";
import { activarUsuario, desactivarUsuario } from "../services/usuariosService";

export default function useUsersUI(fetchUsers) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [statusAction, setStatusAction] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  //handlers de Modales
  const handleCloseSuccessModal = useCallback(() => {
    setIsSuccessModalOpen(false);
    setSuccessMessage("");
  }, []);
  const handleUserCreated = useCallback(async () => {
    await fetchUsers();
    setSuccessMessage("El usuario ha sido registrado exitosamente en el sistema.");
    setIsSuccessModalOpen(true);
  }, [fetchUsers]);
  const handleUserUpdated = useCallback(async () => {
    await fetchUsers();
    setSuccessMessage("Los datos del usuario han sido actualizados correctamente.");
    setIsSuccessModalOpen(true);
  }, [fetchUsers]);
  const handleView = useCallback((user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  }, []);
  const handleCloseViewModal = useCallback(() => {
    setSelectedUser(null);
    setIsViewModalOpen(false);
  }, []);
  const handleOpenCreateModal = useCallback(() => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  }, []);
  const handleCloseCreateModal = useCallback(() => {
    setSelectedUser(null);
    setIsCreateModalOpen(false);
  }, []);
  const handleEdit = useCallback((user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  }, []);
  const handleCloseEditModal = useCallback(() => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
  }, []);
  //Activación/Desactivación
  const handleDeactivate = useCallback((user) => {
    if (user.estatus === "Inactivo") return;
    setUserToDeactivate(user);
    setStatusAction("deactivate");
    setIsDeactivateModalOpen(true);
  }, []);

  const handleActivate = useCallback((user) => {
    if (user.estatus === "Activo") return;
    setUserToDeactivate(user);
    setStatusAction("activate");
    setIsDeactivateModalOpen(true);
  }, []);

  const handleCloseDeactivateModal = useCallback(() => {
    if (updatingStatus) return;
    setIsDeactivateModalOpen(false);
    setUserToDeactivate(null);
    setStatusAction("");
  }, [updatingStatus]);

  const handleConfirmDeactivate = async () => {
    if (!userToDeactivate) return;
    setUpdatingStatus(true);
    try {
      if (statusAction === "activate") {
        await activarUsuario(userToDeactivate);
      } else {
        await desactivarUsuario(userToDeactivate);
      }
      setIsDeactivateModalOpen(false);
      setUserToDeactivate(null);
      setStatusAction("");      
      await fetchUsers();
    } catch (err) {
      console.error("Error en cambio de estatus:", err);
      alert(err.response?.data?.message || err.message || "Error al procesar la solicitud");
    } finally {
      setUpdatingStatus(false);
    }
  };
  return {
    selectedUser,
    userToDeactivate,
    statusAction,
    updatingStatus,
    isViewModalOpen,
    isCreateModalOpen,
    isEditModalOpen,
    isDeactivateModalOpen,
    handleView,
    handleEdit,
    handleDeactivate,
    handleActivate,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleCloseEditModal,
    handleCloseViewModal,
    handleCloseDeactivateModal,
    handleConfirmDeactivate,
    handleUserCreated,
    handleUserUpdated,
    isSuccessModalOpen,
    successMessage,
    handleCloseSuccessModal,
  };
}