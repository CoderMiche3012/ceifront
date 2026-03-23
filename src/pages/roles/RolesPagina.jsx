import { useEffect, useMemo, useState } from "react"
import { UserPlus } from "lucide-react"
import RolLista from "../../components/roles/RolLista"
import RolDetalle from "../../components/roles/RolDetalle"
import RolCrearModal from "../../components/roles/RolCrearModal"
import EncabezadoPagina from "../../components/shared/EncabezadoPagina"
import ModalConfirmacion from "../../components/shared/ModalConfirmacion"
import ModalResultado from "../../components/shared/ModalResultado"
import useRoles from "../../hooks/useRoles"
import Boton from "../../components/ui/Boton"
export default function RolesPagina() {
  const {
    roles,selectedRole,editMode,draftRole,loading,saving,creatingRole,deletingRole,error,success,showCreateModal,
    showConfirmSaveEditModal,showConfirmCreateRoleModal,showConfirmDeleteRoleModal,createRoleForm,currentPermissions,
    setShowConfirmSaveEditModal,setShowConfirmCreateRoleModal,setShowConfirmDeleteRoleModal,handleSelectRole,
    handleEditPermissions,handleCancelEdit,handlePermissionChange,handleDraftRoleChange,handleSavePermissions,
    openCreateModal,closeCreateModal,handleCreateFormChange,handleCreatePermissionChange,openConfirmCreateRoleModal,
    handleCreateRole,openConfirmDeleteRoleModal,handleDeleteRole,
  } = useRoles()
  const [showResultModal, setShowResultModal] = useState(false)
  //configura el contenido del modal de resultado error o éxito
  const resultConfig = useMemo(() => {
    if (error) {
      return {
        type: "error",
        title: "Ocurrió un problema",
        message: error,
      }
    }
    if (success) {
      return {
        type: "success",
        title: "Operación realizada",
        message: success,
      }
    }
    return {
      type: "info",
      title: "",
      message: "",
    }
  }, [error, success])
  //muestra  el modal cuando exista un resultado
  useEffect(() => {
    if (error || success) {
      setShowResultModal(true)
    }
  }, [error, success])
  //estado de carga inicial
  if (loading) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-800">
          Roles y Permisos
        </h1>
        <p className="text-slate-500">Cargando información...</p>
      </section>
    )
  }
  return (
    <>
      <section className="space-y-6">
        <EncabezadoPagina
          titulo="Roles y Permisos"
          descripcion="Administración de niveles de acceso y facultades por rol del sistema."
          accion={
            <Boton
              onClick={openCreateModal}
              icon={<UserPlus size={18} />}
              className="w-full md:w-auto px-6"
              disabled={creatingRole}
            >
              Registrar Rol
            </Boton>
          }
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* lista de roles disponibles */}
          <RolLista
            roles={roles}
            selectedRole={selectedRole}
            editMode={editMode}
            onSelectRole={handleSelectRole}
          />
          {/* detalle y edición del rol seleccionado */}
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
        </div>
      </section>
      {/* modal para registrar un nuevo rol */}
      <RolCrearModal
        open={showCreateModal}
        creatingRole={creatingRole}
        createRoleForm={createRoleForm}
        onClose={closeCreateModal}
        onFormChange={handleCreateFormChange}
        onPermissionChange={handleCreatePermissionChange}
        onSave={openConfirmCreateRoleModal}
      />
      {/* confirmación para guardar cambios en un rol */}
      <ModalConfirmacion
        open={showConfirmSaveEditModal}
        onClose={() => !saving && setShowConfirmSaveEditModal(false)}
        onConfirm={handleSavePermissions}
        title="Confirmar cambios"
        description={
          <>
            ¿Estás seguro de guardar los cambios realizados en el rol{" "}
            <span className="font-semibold">{selectedRole?.nombre_rol}</span>?
          </>
        }
        confirmText="Sí, guardar"
        loading={saving}
        color="amber"
      />

      {/*confirmacion para crear un nuevo rol */}
      <ModalConfirmacion
        open={showConfirmCreateRoleModal}
        onClose={() => !creatingRole && setShowConfirmCreateRoleModal(false)}
        onConfirm={handleCreateRole}
        title="Confirmar registro"
        description={
          <>
            ¿Deseas registrar el rol{" "}
            <span className="font-semibold">
              {createRoleForm.nombre_rol || "nuevo"}
            </span>
            ?
          </>
        }
        confirmText="Sí, guardar"
        loading={creatingRole}
        color="teal"
      />
      {/* confirmacion para eliminar un rol */}
      <ModalConfirmacion
        open={showConfirmDeleteRoleModal}
        onClose={() => !deletingRole && setShowConfirmDeleteRoleModal(false)}
        onConfirm={handleDeleteRole}
        title="Confirmar eliminación"
        description={
          <>
            <p>
              ¿Estás seguro de eliminar el rol{" "}
              <span className="font-semibold">{selectedRole?.nombre_rol}</span>?
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Esta acción no se puede deshacer.
            </p>
          </>
        }
        confirmText="Sí, eliminar"
        loading={deletingRole}
        color="red"
      />
      {/* modal de resultado exito o error */}
      <ModalResultado
        open={showResultModal && Boolean(error || success)}
        type={resultConfig.type}
        title={resultConfig.title}
        message={resultConfig.message}
        onClose={() => setShowResultModal(false)}
      />
    </>
  )
}