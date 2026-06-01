import { UserPlus } from "lucide-react";
import { ui } from "../styles/ui/uiClasses";

import UsuarioTabla from "../features/usuarios/components/tabla/UsuarioTabla";
import UsuarioFiltros from "../features/usuarios/components/tabla/UsuarioFiltros";

import PaginacionTabla from "../components/tablas/PaginacionTabla";
import Boton from "../components/ui/Boton";
import EncabezadoPagina from "../components/shared/EncabezadoPagina";
import ModalResultado from "../components/shared/ModalResultado";
import ModalConfirmacion from "../components/shared/ModalConfirmacion";

import useUsersPage from "../features/usuarios/hooks/useUsersPage";
import UsuarioModal from "../features/usuarios/components/modales/UsuarioModal";
import { usePermissions } from "../context/PermissionsContext";

export default function UsuariosPagina() {
  const {
    // filtros y paginacion
    PAGE_SIZE,
    roles,
    loading,
    error,
    filteredUsers,
    paginatedUsers,
    search,
    filters,
    currentPage,
    totalPages,
    // datos del usuario
    selectedUser,
    userToDeactivate,
    statusAction,
    updatingStatus,
    //modales
    isCreateModalOpen,
    isEditModalOpen,
    isDeactivateModalOpen,
    setCurrentPage,
    handleSearchChange,
    handleClearFilters,
    handleEdit,
    handleDeactivate,
    handleActivate,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleCloseEditModal,
    handleCloseDeactivateModal,
    handleConfirmDeactivate,
    handleUserCreated,
    handleUserUpdated,
    result,
    setResult,
    handleNoChanges
  } = useUsersPage();
  // permisos
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canCreate = hasModulePermission( "usuarios", "crear" );
  const canEdit = hasModulePermission( "usuarios", "editar" );
  const canStatus = hasModulePermission( "usuarios", "eliminar" );
  // estatus del usuario
  const isActivate = statusAction === "activate";
  const estado = isActivate ? "activo" : "inactivo";

  const confirmConfig = { 
    title: isActivate ? "Activar usuario" : "Desactivar usuario",
    color: isActivate ? "green" : "amber",
    confirmText: isActivate ? "Cambiar a activo" : "Cambiar a inactivo",
    description: userToDeactivate ? `¿Seguro que deseas cambiar el estado de "${userToDeactivate.nombre}" a ${estado}?` : null,
  };

  return (
    <>
      <section className={ui.section}>
        <EncabezadoPagina
          titulo="Gestión de Usuarios"
          descripcion="Administración de accesos y roles del personal."
          accion={
            !isPermsLoading &&
            canCreate && (
              <Boton onClick={ handleOpenCreateModal } icon={ <UserPlus size={18} /> } >
                Registrar Usuario
              </Boton>
            )
          }
        />

        <div className={ui.card}>
          <UsuarioFiltros
            search={search}
            filters={filters}
            onSearchChange={ handleSearchChange }
            onClearFilters={ handleClearFilters }
          />

          {loading ? (
            <div className={ui.table.empty}>
              Cargando usuarios...
            </div>
          ) : error ? (
            <div className={ui.table.empty}>
              {error}
            </div>
          ) : (
            <UsuarioTabla
              users={ paginatedUsers }
              roles={roles}
              canEdit={canEdit}
              canStatus={ canStatus }
              onEdit={handleEdit}
              onDeactivate={ handleDeactivate }
              onActivate={ handleActivate }
            />
          )}

          {!loading &&
            !error && (
              <PaginacionTabla
                currentPage={currentPage }
                totalPages={ totalPages }
                totalItems={ filteredUsers.length }
                pageSize={ PAGE_SIZE }
                onPageChange={ setCurrentPage }
              />
            )}
        </div>
      </section>

      {isCreateModalOpen && (
        <UsuarioModal
          open={ isCreateModalOpen }
          mode="create"
          roles={roles}
          onClose={ handleCloseCreateModal }
          onSuccess={ handleUserCreated }
        />
      )}

      {isEditModalOpen &&
        selectedUser && (
          <UsuarioModal
            open={isEditModalOpen}
            mode="edit"
            user={selectedUser}
            roles={roles}
            onClose={handleCloseEditModal}
            onSuccess={handleUserUpdated}
            onNoChanges={handleNoChanges}
          />
        )}

      {isDeactivateModalOpen && (
        <ModalConfirmacion
          open={ isDeactivateModalOpen }
          title={ confirmConfig.title }
          description={ confirmConfig.description }
          confirmText={ confirmConfig.confirmText }
          cancelText="Cancelar"
          onConfirm={ handleConfirmDeactivate }
          onClose={ handleCloseDeactivateModal }
          loading={ updatingStatus }
          color={ confirmConfig.color }
        />
      )}

      <ModalResultado
        open={result.open}
        type={result.type}
        title={result.title}
        message={result.message}
        onClose={() =>
          setResult((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </>
  );
}

