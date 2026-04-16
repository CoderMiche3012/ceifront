import { useEffect, useMemo, useState, useCallback } from "react";
import { UserPlus } from "lucide-react";
import RolLista from "../../components/roles/RolLista";
import RolDetalle from "../../components/roles/RolDetalle";
import RolCrearModal from "../../components/roles/RolCrearModal";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import ModalConfirmacion from "../../components/shared/ModalConfirmacion";
import ModalResultado from "../../components/shared/ModalResultado";
import useRoles from "../../hooks/Roles/useRoles";
import Boton from "../../components/ui/Boton";

export default function RolesPagina() {
  const {
    roles, selectedRole, editMode, draftRole, loading, saving,
    creatingRole, deletingRole, error, success, showCreateModal,
    showConfirmSaveEditModal, showConfirmCreateRoleModal, showConfirmDeleteRoleModal,
    createRoleForm, currentPermissions,
    setShowConfirmSaveEditModal, setShowConfirmCreateRoleModal, setShowConfirmDeleteRoleModal,
    handleSelectRole, handleEditPermissions, handleCancelEdit, handlePermissionChange,
    handleDraftRoleChange, handleSavePermissions, openCreateModal, closeCreateModal,
    handleCreateFormChange, handleCreatePermissionChange, openConfirmCreateRoleModal,
    handleCreateRole, openConfirmDeleteRoleModal, handleDeleteRole,
    clearMessages 
  } = useRoles();
  const [showResultModal, setShowResultModal] = useState(false);
  //configuracion de resultados con validación de nulidad
  const resultConfig = useMemo(() => {
    if (error) return { type: "error", title: "Ocurrió un problema", message: error };
    if (success) return { type: "success", title: "Operación exitosa", message: success };
    return null;
  }, [error, success]);
  //efecto para controlar la visibilidad del modal de resultado
  useEffect(() => {
    if (error || success) {
      setShowResultModal(true);
    }
  }, [error, success]);
  //para cerrar el modal de resultado y limpiar el estado global
  const handleCloseResult = useCallback(() => {
    setShowResultModal(false);
    if (clearMessages) clearMessages();
  }, [clearMessages]);
  if (loading && roles.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1F8A8A]"></div>
        <p className="font-medium text-slate-500 animate-pulse">Cargando privilegios del sistema...</p>
      </div>
    );
  }

  return (
    <>
      <section className="space-y-6 animate-in fade-in duration-500">
        <EncabezadoPagina
          titulo="Roles y Permisos"
          descripcion="Administra los niveles de acceso y facultades de los usuarios."
          accion={
            <Boton
              onClick={openCreateModal}
              icon={<UserPlus size={18} />}
              className="w-full md:w-auto px-6 shadow-lg shadow-[#1F8A8A]/20"
              disabled={creatingRole || saving || deletingRole}
            >
              Nuevo Rol
            </Boton>
          }
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
          {/* Columna Izquierda: Lista con scroll independiente si es necesario */}
          <aside className="lg:sticky lg:top-6 h-fit">
            <RolLista
              roles={roles}
              selectedRole={selectedRole}
              editMode={editMode}
              onSelectRole={handleSelectRole}
            />
          </aside>
          {/* Detalle */}
          <main>
            <RolDetalle
              selectedRole={selectedRole}
              editMode={editMode}
              saving={saving}
              deletingRole={deletingRole}
              currentPermissions={currentPermissions}
              draftRole={draftRole}
              onDraftRoleChange={handleDraftRoleChange}
              onPermissionChange={handlePermissionChange}
              onEdit={handleEditPermissions}
              onCancel={handleCancelEdit}
              onSave={() => setShowConfirmSaveEditModal(true)}
              onDelete={openConfirmDeleteRoleModal}
            />
          </main>
        </div>
      </section>

      <RolCrearModal
        open={showCreateModal}
        creatingRole={creatingRole}
        createRoleForm={createRoleForm}
        onClose={closeCreateModal}
        onFormChange={handleCreateFormChange}
        onPermissionChange={handleCreatePermissionChange}
        onSave={openConfirmCreateRoleModal}
      />

      <ModalConfirmacion
        open={showConfirmSaveEditModal}
        onClose={() => !saving && setShowConfirmSaveEditModal(false)}
        onConfirm={handleSavePermissions}
        title="Guardar Cambios"
        description={
          <p>
            ¿Estás seguro de actualizar los permisos para el rol 
            <span className="mx-1 font-bold text-slate-800">{selectedRole?.nombre_rol}</span>? 
            Los usuarios con este rol verán los cambios reflejados de inmediato.
          </p>
        }
        confirmText="Confirmar"
        loading={saving}
        color="amber"
      />

      <ModalConfirmacion
        open={showConfirmCreateRoleModal}
        onClose={() => !creatingRole && setShowConfirmCreateRoleModal(false)}
        onConfirm={handleCreateRole}
        title="Registrar Nuevo Rol"
        description={`¿Deseas dar de alta el rol "${createRoleForm.nombre_rol || ""}" en el sistema?`}
        confirmText="Registrar"
        loading={creatingRole}
        color="teal"
      />

      <ModalConfirmacion
        open={showConfirmDeleteRoleModal}
        onClose={() => !deletingRole && setShowConfirmDeleteRoleModal(false)}
        onConfirm={handleDeleteRole}
        title="Eliminar Rol"
        description={
          <div className="space-y-2 text-red-600">
            <p className="font-bold text-base text-red-700">¡Advertencia!</p>
            <p>Estás a punto de eliminar el rol <span className="font-black italic">{selectedRole?.nombre_rol}</span>.</p>
            <p className="text-xs opacity-80">Si hay usuarios asignados a este rol, podrías generar errores de acceso.</p>
          </div>
        }
        confirmText="Eliminar permanentemente"
        loading={deletingRole}
        color="red"
      />
      {/* Modal de Resultado  */}
      {resultConfig && (
        <ModalResultado
          open={showResultModal}
          type={resultConfig.type}
          title={resultConfig.title}
          message={resultConfig.message}
          onClose={handleCloseResult}
        />
      )}
    </>
  );
}