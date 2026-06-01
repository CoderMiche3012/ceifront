import useUsersData from "./useUsersData";
import useUsersUI from "./useUsersUI";

export default function useUsersPage() {
  const usersData = useUsersData();
  const usersUI = useUsersUI();

  return {
    ...usersData,
    ...usersUI,
    // puente de edicion
    handleEdit: usersUI.openEditModal,
    // adaptador de estatus
    handleDeactivate: (user) => usersUI.openDeactivateModal(user, "deactivate"),
    handleActivate: (user) => usersUI.openDeactivateModal(user, "activate"),
    //Los puentes de cierre y control
    handleOpenCreateModal: usersUI.openCreateModal,
    handleCloseCreateModal: usersUI.closeCreateModal,
    handleCloseEditModal: usersUI.closeEditModal,
    handleCloseDeactivateModal: usersUI.closeDeactivateModal,
    handleNoChanges: usersUI.handleNoChanges,

  };
}
