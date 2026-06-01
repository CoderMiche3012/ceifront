import { HiOutlineShieldCheck } from "react-icons/hi";

import { ui } from "../../../../../styles/ui/uiClasses";

import Boton from "../../../../../components/ui/Boton";
import Field from "../../../../../components/ui/Field";
import InputG from "../../../../../components/ui/InputG";

import PermisosTabla from "./PermisosTabla";

export default function RolModal({ open, mode = "create", loading, form, onClose, onFormChange, onPermissionChange, onSave, }) {
  
  if (!open) return null;

  const isEdit = mode === "edit";

  return (
    <div className={ui.modal.formOverlay}>
      <div className={ui.modal.formContainer}>
        {/* encabezado */}
        <div className={ui.modal.formHeader}>
          <div className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`} >
            <HiOutlineShieldCheck size={24} />
          </div>

          <div className="flex-1">
            <h2 className={ui.modal.title}>
              {isEdit ? "Editar Rol" : "Nuevo Rol"}
            </h2>

            <p className={ui.modal.description}>
              {isEdit
                ? "Actualiza la información y permisos del rol"
                : "Configura nombre, descripción y permisos del nuevo rol"}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className={ui.modal.result.closeButton}
          >
            ×
          </button>
        </div>

        <div className={ui.modal.formBody}>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
            <div className={ui.modal.twoCols}>

              <Field label="Nombre del rol" required>
                <InputG
                  value={form.nombre_rol}
                  disabled={loading || isEdit}
                  placeholder="Ej. Supervisor"
                  onChange={(e) =>
                    onFormChange("nombre_rol", e.target.value)
                  }
                />
              </Field>

              <Field label="Descripción" required>
                <InputG
                  value={form.descripcion}
                  disabled={loading}
                  placeholder="Describe este rol"
                  onChange={(e) =>
                    onFormChange("descripcion", e.target.value)
                  }
                />
              </Field>

            </div>
          </div>

          <div className={`${ui.modal.formScroll} mt-6`}>
            <PermisosTabla
              permisos={form.permisos}
              role={form}
              onPermissionChange={onPermissionChange}
              disabled={loading}
            />
          </div>

          <div className={ui.modal.formActions}>
            <Boton
              size="sm"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Boton>

            <Boton
              size="sm"
              onClick={onSave}
              disabled={loading}
            >
              {loading
                ? "Procesando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Registrar Rol"}
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
}
