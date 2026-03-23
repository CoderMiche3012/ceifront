import UsuarioEditarModal from "./usuarioEditarModal";
import UsuarioVerModal from "./UsuarioVerModal";
import ModalConfirmacion from "../../shared/ModalConfirmacion";
import UsuarioCrearModal from "./UsuarioCrearModal";
//contenedor central que maneja todos los modales de usuario
export default function UsuarioModal({
  selectedUser,roles,userToDeactivate,statusAction,updatingStatus,
  isViewModalOpen,isCreateModalOpen,isEditModalOpen,isDeactivateModalOpen,
  onCloseViewModal,onCloseCreateModal,onCloseEditModal,onCloseDeactivateModal,
  onUserCreated,onUserUpdated,onConfirmDeactivate,
}) {
  //si la acción es activar o desactivar
  const isActivateAction = statusAction === "activate";
  const title = isActivateAction
    ? "Cambiar usuario a activo"
    : "Cambiar usuario a inactivo";
  const description = userToDeactivate
    ? isActivateAction
      ? `¿Seguro que deseas cambiar a activo a ${userToDeactivate.nombre} ${userToDeactivate.apellido_p}?`
      : `¿Seguro que deseas cambiar a inactivo a ${userToDeactivate.nombre} ${userToDeactivate.apellido_p}?`
    : "";
  const confirmText = isActivateAction
    ? "Cambiar a activo"
    : "Cambiar a inactivo";
  const color = isActivateAction ? "green" : "amber";
  return (
    <>
      {/* Modal: ver usuario */}
      <UsuarioVerModal
        open={isViewModalOpen}
        user={selectedUser}
        onClose={onCloseViewModal}
      />
      {/* Modal: editar usuario */}
      <UsuarioEditarModal
        open={isEditModalOpen}
        user={selectedUser}
        roles={roles}
        onClose={onCloseEditModal}
        onSuccess={onUserUpdated}
      />
      {/* Modal: crear usuario */}
      <UsuarioCrearModal
        open={isCreateModalOpen}
        roles={roles}
        onClose={onCloseCreateModal}
        onSuccess={onUserCreated}
      />
      {/* Modal: confirmar activar/inactivar */}
      <ModalConfirmacion
        open={isDeactivateModalOpen}
        title={title}
        description={description}
        confirmText={confirmText}
        cancelText="Cancelar"
        onConfirm={onConfirmDeactivate}
        onClose={onCloseDeactivateModal}
        loading={updatingStatus}
        color={color}
      />
    </>
  );
}