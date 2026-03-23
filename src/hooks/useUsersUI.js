import { useState } from "react";
import {
  activarUsuario,
  desactivarUsuario,
} from "../services/usuariosService";
//para centralizar la logica de modales y acciones de usuarios
export default function useUsersUI(fetchUsers) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [statusAction, setStatusAction] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  // abre el modal de visualización
  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setSelectedUser(null);
    setIsViewModalOpen(false);
  };
  // abre el modal para crear usuario
  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(false);
  };
  // abre el modal para editar usuario
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
  };

  // prepara la acción para desactivar un usuario
  const handleDeactivate = (user) => {
    if (user.estatus === "Inactivo") return;
    setUserToDeactivate(user);
    setStatusAction("deactivate");
    setIsDeactivateModalOpen(true);
  };
  //prepara la acción para activar un usuario
  const handleActivate = (user) => {
    if (user.estatus === "Activo") return;
    setUserToDeactivate(user);
    setStatusAction("activate");
    setIsDeactivateModalOpen(true);
  };
  const handleCloseDeactivateModal = () => {
    if (updatingStatus) return;
    setIsDeactivateModalOpen(false);
    setUserToDeactivate(null);
    setStatusAction("");
  };
  //cambio de estatus y recarga la lista de usuarios
  const handleConfirmDeactivate = async () => {
    if (!userToDeactivate) return;
    try {
      setUpdatingStatus(true);
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
      console.error("Error al cambiar estatus:", err);
      alert(err.message || "Error al cambiar el estatus del usuario");
    } finally {
      setUpdatingStatus(false);
    }
  };
  //refresca usuarios después de crear uno nuevo
  const handleUserCreated = async () => {
    handleCloseCreateModal();
    await fetchUsers();
  };
  //refresca usuarios después de editar uno existente
  const handleUserUpdated = async () => {
    handleCloseEditModal();
    await fetchUsers();
  };
  return {
    selectedUser,userToDeactivate,statusAction,updatingStatus,
    isViewModalOpen,isCreateModalOpen,isEditModalOpen,isDeactivateModalOpen,

    handleView,handleEdit,handleDeactivate,handleActivate,

    handleOpenCreateModal,handleCloseCreateModal,handleCloseEditModal,handleCloseViewModal,handleCloseDeactivateModal,

    handleConfirmDeactivate,handleUserCreated,handleUserUpdated,
  };
}