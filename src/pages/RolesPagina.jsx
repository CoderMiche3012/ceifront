import { useEffect, useMemo, useState, useCallback } from "react";
import { Shield } from "lucide-react";

import RolLista from "../features/usuarios/sub-features/roles/components/RolLista";
import RolDetalle from "../features/usuarios/sub-features/roles/components/RolDetalle";
import RolModal from "../features/usuarios/sub-features/roles/components/RolModal";

import EncabezadoPagina from "../components/shared/EncabezadoPagina";
import ModalConfirmacion from "../components/shared/ModalConfirmacion";
import ModalResultado from "../components/shared/ModalResultado";
import Boton from "../components/ui/Boton";

import useRoles from "../features/usuarios/sub-features/roles/hooks/useRoles";

export default function RolesPagina() {
  const {
    // datos rol
    roles,
    selectedRole,
    currentPermissions,
    roleForm,
    modalMode,
    loading,
    saving,
    creatingRole,
    deletingRole,
    error,
    success,
    // modales
    showRoleModal,
    showConfirmRoleModal,
    showConfirmDeleteRoleModal,
    setShowRoleModal,
    setShowConfirmRoleModal,
    setShowConfirmDeleteRoleModal,
    handleSelectRole,
    openCreateModal,
    openEditModal,
    handleFormChange,
    handlePermissionChange,
    handleSaveRole,
    handleDeleteRole,
    clearMessages,
  } = useRoles();

  const [showResultModal, setShowResultModal] = useState(false);
  // resultado
  const resultConfig = useMemo(() => {
    if (error) {
      return {
        type: "error",
        title: "Ocurrió un problema",
        message: error,
      };
    }

    if (success) {
      return {
        type: "success",
        title: "Operación exitosa",
        message: success,
      };
    }

    return null;
  }, [error, success]);

  useEffect(() => {
    if (error || success) {
      setShowResultModal(true);
    }
  }, [error, success]);

  const handleCloseResult =
    useCallback(() => {
      setShowResultModal(false);
      clearMessages();
    }, [clearMessages]);

  // espera inicial
  if (loading && roles.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1F8A8A]" />
        <p className="font-medium text-slate-500 animate-pulse">
          Cargando privilegios del sistema...
        </p>
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
              icon={<Shield size={18} />}
              className="w-full md:w-auto px-6 shadow-lg shadow-[#1F8A8A]/20"
              disabled={
                creatingRole ||
                saving ||
                deletingRole
              }
            >
              Registrar Rol
            </Boton>
          }
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">

          <aside className="lg:sticky lg:top-6">
            <RolLista
              roles={roles}
              selectedRole={selectedRole}
              onSelectRole={handleSelectRole}
            />
          </aside>

          <main>
            <RolDetalle
              selectedRole={selectedRole}
              currentPermissions={currentPermissions}
              onEdit={openEditModal}
              onDelete={() => setShowConfirmDeleteRoleModal(true)}
            />
          </main>

        </div>
      </section>

      <RolModal
        open={showRoleModal}
        mode={modalMode}
        form={roleForm}
        loading={saving || creatingRole}
        onClose={() => setShowRoleModal(false) }
        onFormChange={handleFormChange}
        onPermissionChange={ handlePermissionChange }
        onSave={() => setShowConfirmRoleModal(true) }
      />

      <ModalConfirmacion
        open={showConfirmRoleModal}
        onClose={() => !saving && !creatingRole && setShowConfirmRoleModal(false) }
        onConfirm={handleSaveRole}
        title={ modalMode === "edit" ? "Guardar Cambios" : "Registrar Nuevo Rol" }
        description={
          modalMode === "edit"
            ? `¿Deseas actualizar el rol "${selectedRole?.nombre_rol}"?`
            : `¿Deseas crear el rol "${roleForm.nombre_rol}"?`
        }
        confirmText={ modalMode === "edit" ? "Guardar" : "Registrar" }
        loading={ saving || creatingRole }
        color={ modalMode === "edit" ? "teal" : "teal" }
      />

      <ModalConfirmacion
        open={ showConfirmDeleteRoleModal }
        onClose={() => !deletingRole && setShowConfirmDeleteRoleModal(false) }
        onConfirm={handleDeleteRole}
        title="Eliminar Rol"
        description={
          <div className="space-y-2 text-red-600">
            <p className="font-bold text-base text-red-700">
              ¡Advertencia!
            </p>
            <p>
              Estás a punto de eliminar el rol{" "}
              <span className="font-black italic">
                {selectedRole?.nombre_rol}
              </span>
            </p>
            <p className="text-xs opacity-80">
              Si hay usuarios asignados a este rol,
              podrías generar errores de acceso.
            </p>
          </div>
        }
        confirmText="Eliminar"
        loading={deletingRole}
        color="red"
      />

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