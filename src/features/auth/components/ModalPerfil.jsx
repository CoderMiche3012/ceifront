import { useEffect, useState, useRef } from "react";
import { HiOutlineX, HiOutlineUserCircle, HiOutlineShieldCheck, HiOutlineEye, HiOutlineEyeOff, } from "react-icons/hi";

import ModalConfirmacion from "../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../components/shared/ModalResultado";
import AlertaError from "../../../components/ui/AlertaError";
import Field from "../../../components/ui/Field";
import InputG from "../../../components/ui/InputG";
import Boton from "../../../components/ui/Boton";

import { ui } from "../../../styles/ui/uiClasses";

import { usePerfilForm } from "../hooks/usePerfilForm";

//componente interno para contraseña
function PasswordField({
  label, value, onChange,
  show, onToggle, required = false,
}) {
  return (
    <Field label={label} required={required}>
      <div className="relative">
        <InputG
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="pr-12"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {show ? (
            <HiOutlineEyeOff size={20} />
          ) : (
            <HiOutlineEye size={20} />
          )}
        </button>
      </div>
    </Field>
  );
}

export default function ModalPerfil({ open, onClose, user, onUserUpdated, }) {
  // estados
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isLoggingOut = useRef(false);
  const [resultado, setResultado] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleEsc);
    return () =>
      window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const {
    nombre,
    apellidoP,
    apellidoM,
    correo,
    setCorreo,
    nom_usuario,
    telefono,
    setTelefono,
    passwordActual,
    setPasswordActual,
    nuevaPassword,
    setNuevaPassword,
    confirmarPassword,
    setConfirmarPassword,
    cambiarPass,
    setCambiarPass,
    showPasswordActual,
    setShowPasswordActual,
    showNuevaPassword,
    setShowNuevaPassword,
    showConfirmarPassword,
    setShowConfirmarPassword,
    error,
    loading,
    handleSubmit,
    cancelarCambioPassword,
  } = usePerfilForm({
    user,
    open,
    onClose,
    onUserUpdated,
    setResultado,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-md animate-in fade-in duration-300">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl animate-in zoom-in-95 duration-300"
      >
        <div className={ui.modal.formHeader}>
          <div className={`${ui.modal.iconWrapper} bg-[#1F8A8A]/10 text-[#1F8A8A]`} >
            <HiOutlineUserCircle size={24} />
          </div>
          <div className="flex-1">
            <h2 className={ui.modal.title}>Mi Perfil</h2>
          </div>

          <button
            onClick={onClose}
            className={ui.modal.result.closeButton}
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setConfirmOpen(true);
          }}
          className="custom-scrollbar max-h-[70vh] space-y-8 overflow-y-auto p-10"
        >
          <AlertaError mensaje={error} />

          <div className="space-y-6">

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Nombre(s)">
                <InputG value={nombre} disabled />
              </Field>

              <Field label="Usuario">
                <InputG value={nom_usuario} disabled />
              </Field>

              <Field label="Apellido Paterno">
                <InputG value={apellidoP} disabled />
              </Field>

              <Field label="Apellido Materno">
                <InputG value={apellidoM} disabled />
              </Field>

              <Field label="Email" required>
                <InputG
                  type="email"
                  value={correo}
                  onChange={(e) =>
                    setCorreo(e.target.value)
                  }
                />
              </Field>

              <Field label="Teléfono">
                <InputG
                  value={telefono}
                  maxLength={10}
                  onChange={(e) =>
                    setTelefono(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                />
              </Field>
            </div>

          </div>

          {/* seguridad */}
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#1F8A8A]">
                <HiOutlineShieldCheck size={22} />
                <span className="text-sm font-bold">
                  Seguridad y contraseña
                </span>
              </div>

              {!cambiarPass && (
                <Boton
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setCambiarPass(true)}
                >
                  Cambiar
                </Boton>
              )}
            </div>

            {cambiarPass && (
              <div className="mt-5 space-y-5 animate-in slide-in-from-top-2 duration-300">
                <PasswordField
                  label="Contraseña actual"
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  show={showPasswordActual}
                  onToggle={() => setShowPasswordActual(!showPasswordActual) }
                  required
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <PasswordField
                    label="Nueva contraseña"
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value) }
                    show={showNuevaPassword}
                    onToggle={() => setShowNuevaPassword(!showNuevaPassword) }
                    required
                  />

                  <PasswordField
                    label="Confirmar nueva"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value) }
                    show={showConfirmarPassword}
                    onToggle={() => setShowConfirmarPassword( !showConfirmarPassword ) }
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={cancelarCambioPassword}
                  className="text-sm font-medium text-slate-500 transition hover:text-[#1F8A8A]"
                >
                  Cancelar cambio
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-5 pt-4">
            <Boton
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cerrar
            </Boton>

            <Boton
              type="submit"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Boton>
          </div>
        </form>

        <ModalResultado
          {...resultado}
          onClose={() => {
            setResultado((prev) => ({ ...prev, open: false }));
            // si la operacion fue exitosa o informativa, cerramos el modal principal
            if (resultado.type === "success" || resultado.type === "info") {
              onClose();
              // si es el de cambiar contraseña
              if (resultado.logoutAction) {
                window.location.href = "/login";
              }
            }
          }}
        />

        <ModalConfirmacion
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={async () => {
            setConfirmOpen(false);
            await handleSubmit();
          }}
          title="Guardar cambios"
          description="¿Deseas actualizar tu perfil?"
          confirmText="Sí, guardar"
        />
      </div>
    </div>
  );
}


