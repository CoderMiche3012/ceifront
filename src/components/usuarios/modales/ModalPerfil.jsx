import { useEffect, useState, useCallback } from "react";
import { HiOutlineX, HiOutlineUserCircle, HiOutlineShieldCheck, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import AlertaError from "../../ui/AlertaError";
import { usePerfilForm } from "../../../hooks/usePerfilForm";
import ModalResultado from "../../shared/ModalResultado";
function InputField({ label, value, onChange, type = "text", disabled = false, placeholder = "", required = false, maxLength, name }) {
  return (
    <div className="space-y-2">
      <label className="ml-1 text-xs font-bold text-slate-600">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className={`w-full rounded-2xl border-2 p-3.5 text-sm outline-none transition-all ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : "border-transparent bg-slate-50 focus:border-[#1F8A8A]/30 focus:bg-white focus:ring-4 focus:ring-[#1F8A8A]/5"
        }`}
      />
    </div>
  );
}
function PasswordField({ label, value, onChange, show, onToggle, placeholder, required = false, name }) {
  return (
    <div className="space-y-2">
      <label className="ml-1 text-xs font-bold text-slate-600">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 pr-12 text-sm outline-none transition-all focus:border-[#1F8A8A] focus:ring-4 focus:ring-[#1F8A8A]/5"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {show ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
        </button>
      </div>
    </div>
  );
}

export default function ModalPerfil({ open, onClose, user, onUserUpdated }) {
  const [resultado, setResultado] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  //manejo de cierre con tecla ESC 
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);
  const {
    nombre, apellidoP, apellidoM, correo, setCorreo,
    nom_usuario,
    telefono, setTelefono, passwordActual, setPasswordActual,
    nuevaPassword, setNuevaPassword, confirmarPassword, setConfirmarPassword,
    cambiarPass, setCambiarPass, showPasswordActual, setShowPasswordActual,
    showNuevaPassword, setShowNuevaPassword, showConfirmarPassword, setShowConfirmarPassword,
    error, loading, handleSubmit, cancelarCambioPassword,
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
        {/* Header */}
        <div className="relative border-b border-slate-100 bg-slate-50 px-10 py-8">
          <div className="flex items-center gap-5">
            <div className="rounded-2xl bg-[#1F8A8A] p-4 text-white shadow-xl shadow-[#1F8A8A]/20">
              <HiOutlineUserCircle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-800">Mi Perfil</h2>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                Sesión activa: {nom_usuario}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-8 top-8 rounded-full p-2 text-slate-400 transition-all hover:bg-white hover:shadow-md hover:text-red-500"
          >
            <HiOutlineX size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="custom-scrollbar max-h-[70vh] space-y-8 overflow-y-auto p-10">
          <div className="space-y-6">
            <h3 className="px-1 text-sm font-bold uppercase tracking-widest text-slate-400">Información de Cuenta</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <InputField label="Nombre(s)" value={nombre} disabled />
              <InputField label="Nombre de Usuario" value={nom_usuario} disabled />
              <InputField label="Apellido Paterno" value={apellidoP} disabled />
              <InputField label="Apellido Materno" value={apellidoM} disabled />
              
              <InputField 
                label="Email" 
                type="email" 
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)} 
                required 
              />
              <InputField 
                label="Teléfono" 
                value={telefono} 
                onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))} // Solo números
                maxLength={10} 
              />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Nota: Solo el correo y el teléfono son editables.
            </div>
          </div>

          {/* Seguridad */}
          <div className="space-y-6 rounded-[2.5rem] border border-emerald-100/50 bg-emerald-50/40 p-8">
            <div className="flex items-center gap-3 text-[#1F8A8A]">
              <HiOutlineShieldCheck size={24} />
              <span className="text-base font-bold">Seguridad y Contraseña</span>
            </div>

            {!cambiarPass ? (
              <button
                type="button"
                onClick={() => setCambiarPass(true)}
                className="rounded-full border border-emerald-100 bg-white px-6 py-2.5 text-xs font-extrabold text-[#1F8A8A] shadow-sm transition-all hover:shadow-md active:scale-95"
              >
                ¿Cambiar contraseña?
              </button>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                <PasswordField
                  label="Contraseña actual"
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  show={showPasswordActual}
                  onToggle={() => setShowPasswordActual(!showPasswordActual)}
                  required
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <PasswordField
                    label="Nueva contraseña"
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    show={showNuevaPassword}
                    onToggle={() => setShowNuevaPassword(!showNuevaPassword)}
                    required
                  />
                  <PasswordField
                    label="Confirmar nueva"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    show={showConfirmarPassword}
                    onToggle={() => setShowConfirmarPassword(!showConfirmarPassword)}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={cancelarCambioPassword}
                  className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
                >
                  Cancelar cambio de contraseña
                </button>
              </div>
            )}
          </div>
          <AlertaError mensaje={error} />
          {/* Footer fijo o final de form */}
          <div className="flex items-center justify-end gap-5 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[#1F8A8A] px-12 py-4 text-sm font-black text-white shadow-xl shadow-[#1F8A8A]/30 transition-all hover:bg-[#166d6d] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
        <ModalResultado
          {...resultado}
          onClose={() => setResultado(prev => ({ ...prev, open: false }))}
        />
      </div>
    </div>
  );
}