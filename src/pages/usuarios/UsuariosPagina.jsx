import { UserPlus } from "lucide-react";
import UsuarioTabla from "../../components/usuarios/tabla/UsuarioTabla";
import UsuarioFiltros from "../../components/usuarios/tabla/UsuarioFiltros";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import Boton from "../../components/ui/Boton";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import useUsersPage from "../../hooks/users/useUsersPage";
import ModalResultado from "../../components/shared/ModalResultado";
import UsuarioEditarModal from "../../components/usuarios/modales/UsuarioEditarModal";
import UsuarioVerModal from "../../components/usuarios/modales/UsuarioVerModal";
import UsuarioCrearModal from "../../components/usuarios/modales/UsuarioCrearModal";
import ModalConfirmacion from "../../components/shared/ModalConfirmacion";
import { hasPermission } from "../../utils/menuPermissions"; 
import { usePermissions } from "../../context/PermissionsContext";
import { useMemo } from "react";

export default function UsuariosPagina() {
  const { permissions, loading: isPermsLoading } = usePermissions();  
  const {
    //estados de datos
    PAGE_SIZE, roles, loading, error, filteredUsers, paginatedUsers,
    //estados de UI
    search, filters, currentPage, totalPages, selectedUser, userToDeactivate,
    statusAction, updatingStatus,isSuccessModalOpen, successMessage, 
    //modales
    isViewModalOpen, isCreateModalOpen, isEditModalOpen, isDeactivateModalOpen,
    //funciones
    setCurrentPage, handleSearchChange, handleClearFilters, handleView, 
    handleEdit, handleDeactivate, handleActivate, handleOpenCreateModal,
    handleCloseCreateModal, handleCloseEditModal, handleCloseViewModal, handleCloseSuccessModal,
    handleCloseDeactivateModal, handleConfirmDeactivate, handleUserCreated, handleUserUpdated,
  } = useUsersPage();
  
  const canCreate = useMemo(() => hasPermission(permissions, "Crear Usuarios"), [permissions]);
  const canEdit = useMemo(() => hasPermission(permissions, "Editar Usuarios"), [permissions]);
  const canView = useMemo(() => hasPermission(permissions, "Ver Usuarios"), [permissions]);
  const canStatus = useMemo(() => hasPermission(permissions, "Eliminar Usuarios"), [permissions]);

  //para el modal de estatus (Lógica de UI limpia)
  const isActivate = statusAction === "activate";
  const confirmConfig = {
    title: isActivate ? "Cambiar usuario a activo" : "Cambiar usuario a inactivo",
    color: isActivate ? "green" : "amber",
    confirmText: isActivate ? "Cambiar a activo" : "Cambiar a inactivo",
    description: userToDeactivate 
      ? `¿Seguro que deseas cambiar a ${isActivate ? 'activo' : 'inactivo'} a ${userToDeactivate.nombre}?` 
      : ""
  };

  return (
    <>
      <section className="space-y-6">
        <EncabezadoPagina
          titulo="Gestión de Usuarios"
          descripcion="Administración de accesos y roles del personal."
          accion={
            !isPermsLoading && canCreate && (
              <Boton onClick={handleOpenCreateModal} icon={<UserPlus size={18} />}>
                Registrar Usuario
              </Boton>
            )
          }
        />

        <div className="overflow-hidden rounded-[24px] border border-[#dbe3eb] bg-white shadow-sm">
          <UsuarioFiltros
            search={search}
            filters={filters}
            onSearchChange={handleSearchChange}
            onClearFilters={handleClearFilters}
          />

          {/* Gestión de estados de carga/error en la tabla */}
          {loading ? (
             <div className="p-20 text-center">Cargando usuarios...</div> 
          ) : (
            <UsuarioTabla
              users={paginatedUsers}
              roles={roles}
              canView={canView}
              canEdit={canEdit}
              canStatus={canStatus}
              onView={handleView}
              onEdit={handleEdit}
              onDeactivate={handleDeactivate}
              onActivate={handleActivate}
            />
          )}

          {!loading && !error && (
            <PaginacionTabla
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </section>
      
      {isCreateModalOpen && (
        <UsuarioCrearModal
          open={isCreateModalOpen}
          roles={roles}
          onClose={handleCloseCreateModal}
          onSuccess={handleUserCreated}
        />
      )}

      {isEditModalOpen && selectedUser && (
        <UsuarioEditarModal
          open={isEditModalOpen}
          user={selectedUser}
          roles={roles}
          onClose={handleCloseEditModal}
          onSuccess={handleUserUpdated}
        />
      )}

      {isViewModalOpen && selectedUser && (
        <UsuarioVerModal
          open={isViewModalOpen}
          user={selectedUser}
          onClose={handleCloseViewModal}
        />
      )}

      {isDeactivateModalOpen && (
        <ModalConfirmacion
          open={isDeactivateModalOpen}
          title={confirmConfig.title}
          description={confirmConfig.description}
          confirmText={confirmConfig.confirmText}
          cancelText="Cancelar"
          onConfirm={handleConfirmDeactivate}
          onClose={handleCloseDeactivateModal}
          loading={updatingStatus}
          color={confirmConfig.color}
        />
      )}
      <ModalResultado
        open={isSuccessModalOpen}
        type="success"
        title="¡Operación Exitosa!"
        message={successMessage}
        onClose={handleCloseSuccessModal}
      />
    </>
  );
}