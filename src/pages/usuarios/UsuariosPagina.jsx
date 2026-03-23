import { UserPlus } from "lucide-react";
import UsuarioTabla from "../../components/usuarios/tabla/UsuarioTabla";
import UsuarioFiltros from "../../components/usuarios/tabla/UsuarioFiltros";
import UsuarioModal from "../../components/usuarios/modales/UsuarioModal";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import Boton from "../../components/ui/Boton";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import useUsersPage from "../../hooks/useUsersPage";

export default function UsuariosPagina() {
  const {
    PAGE_SIZE,roles,loading,error,search,filters,currentPage,totalPages,filteredUsers,paginatedUsers,selectedUser,userToDeactivate,
    statusAction,updatingStatus,isViewModalOpen,isCreateModalOpen,isEditModalOpen,isDeactivateModalOpen,
    setCurrentPage,handleSearchChange,handleClearFilters,handleView,handleEdit,handleDeactivate,handleActivate,handleOpenCreateModal,
    handleCloseCreateModal,handleCloseEditModal,handleCloseViewModal,handleCloseDeactivateModal,handleConfirmDeactivate,
    handleUserCreated,handleUserUpdated,
  } = useUsersPage();
  return (
    <>
      <section className="space-y-6">
        <EncabezadoPagina
          titulo="Gestión de Usuarios"
          descripcion="Administración de accesos y roles del personal."
          accion={
            <Boton onClick={handleOpenCreateModal} icon={<UserPlus size={18} />}>
              Registrar Usuario
            </Boton>
          }
        />
        <div className="overflow-hidden rounded-[24px] border border-[#dbe3eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          {/* filtros y búsqueda de usuarios */}
          <UsuarioFiltros
            search={search}
            filters={filters}
            onSearchChange={handleSearchChange}
            onClearFilters={handleClearFilters}
          />
          {/* tabla principal de usuarios */}
          <UsuarioTabla
            users={paginatedUsers}
            roles={roles}
            onView={handleView}
            onEdit={handleEdit}
            onDeactivate={handleDeactivate}
            onActivate={handleActivate}
          />
          {/* paginacion */}
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
      {/* modal para ver, crear, editar y cambiar estatus */}
      <UsuarioModal
        selectedUser={selectedUser}
        roles={roles}
        userToDeactivate={userToDeactivate}
        statusAction={statusAction}
        updatingStatus={updatingStatus}
        isViewModalOpen={isViewModalOpen}
        isCreateModalOpen={isCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        isDeactivateModalOpen={isDeactivateModalOpen}
        onCloseViewModal={handleCloseViewModal}
        onCloseCreateModal={handleCloseCreateModal}
        onCloseEditModal={handleCloseEditModal}
        onCloseDeactivateModal={handleCloseDeactivateModal}
        onUserCreated={handleUserCreated}
        onUserUpdated={handleUserUpdated}
        onConfirmDeactivate={handleConfirmDeactivate}
      />
    </>
  );
}