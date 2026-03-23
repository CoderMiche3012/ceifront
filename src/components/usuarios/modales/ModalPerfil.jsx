import {HiOutlineX,HiOutlineUserCircle,HiOutlineShieldCheck,HiOutlineEye,HiOutlineEyeOff,} from "react-icons/hi"
import AlertaError from "../../ui/AlertaError"
import { usePerfilForm } from "../../../hooks/usePerfilForm"

function InputField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder = "",
  required = false,
  maxLength,
}) {
  return (
    <div className="space-y-2">
      <label className="ml-1 text-xs font-bold text-slate-600">{label}</label>
      <input
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
            : "border-transparent bg-slate-50 focus:border-[#1F8A8A]/30 focus:bg-white"
        }`}
      />
    </div>
  )
}

function PasswordField({label,value,onChange,show,onToggle,placeholder,required = false,}) {
  return (
    <div className="space-y-2">
      <label className="ml-1 text-xs font-bold text-slate-600">{label}</label>
      <div className="relative">
        <input
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
  )
}
// para editar la información del perfil del usuario autenticado
export default function ModalPerfil({ open, onClose, user, onUserUpdated }) {
  // centraliza estado, validaciones y envío del formulario
  const {
    nombre,apellidoP,apellidoM,correo,setCorreo,username,telefono,setTelefono,passwordActual,setPasswordActual,
    nuevaPassword,setNuevaPassword,confirmarPassword,setConfirmarPassword,cambiarPass,setCambiarPass,
    showPasswordActual,setShowPasswordActual,showNuevaPassword,setShowNuevaPassword,
    showConfirmarPassword,setShowConfirmarPassword,error,success,loading,handleSubmit,cancelarCambioPassword,
  } = usePerfilForm({ user, open, onClose, onUserUpdated })
  //si el modal no está abierto, no se renderiza
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-md transition-all">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl">
        <div className="relative border-b border-slate-100 bg-slate-50 px-10 py-8">
          <div className="flex items-center gap-5">
            <div className="rounded-2xl bg-[#1F8A8A] p-4 text-white shadow-xl shadow-[#1F8A8A]/20">
              <HiOutlineUserCircle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-800">
                Mi Perfil
              </h2>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                Sesión: {user.nom_usuario}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-8 top-8 rounded-full p-2 text-slate-400 transition-all hover:bg-white hover:shadow-md"
          >
            <HiOutlineX size={24} />
          </button>
        </div>
        {/* Formulario principal del perfil */}
        <form
          onSubmit={handleSubmit}
          className="custom-scrollbar max-h-[70vh] space-y-8 overflow-y-auto p-10"
        >
          <div className="space-y-6">
            <h3 className="px-1 text-sm font-bold uppercase tracking-widest text-slate-400">
              Información de Cuenta
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Nombre(s)"
                value={nombre}
                onChange={() => {}}
                disabled
              />
              <InputField
                label="Nombre de Usuario"
                value={username}
                onChange={() => {}}
                disabled
              />
              <InputField
                label="Apellido Paterno"
                value={apellidoP}
                onChange={() => {}}
                disabled
              />
              <InputField
                label="Apellido Materno"
                value={apellidoM}
                onChange={() => {}}
                disabled
              />
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
                onChange={(e) => setTelefono(e.target.value)}
                maxLength={10}
              />
            </div>
            {/* aviso campos editables */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Solo puedes editar tu correo y teléfono desde esta sección.
            </div>
          </div>
          {/* seguridad para cambio de contraseña */}
          <div className="space-y-6 rounded-[2.5rem] border border-emerald-100/50 bg-emerald-50/40 p-8">
            <div className="flex items-center gap-3 text-[#1F8A8A]">
              <HiOutlineShieldCheck size={24} />
              <span className="text-base font-bold">
                Seguridad y Validación
              </span>
            </div>
            {!cambiarPass ? (
              <button
                type="button"
                onClick={() => setCambiarPass(true)}
                className="rounded-full border border-emerald-100 bg-white px-5 py-2.5 text-xs font-extrabold text-[#1F8A8A] shadow-sm transition-all hover:shadow-md"
              >
                ¿Deseas cambiar tu contraseña?
              </button>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                <PasswordField
                  label="Contraseña actual"
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  show={showPasswordActual}
                  onToggle={() => setShowPasswordActual((prev) => !prev)}
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <PasswordField
                    label="Nueva contraseña"
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    show={showNuevaPassword}
                    onToggle={() => setShowNuevaPassword((prev) => !prev)}
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                  <PasswordField
                    label="Confirmar nueva contraseña"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    show={showConfirmarPassword}
                    onToggle={() => setShowConfirmarPassword((prev) => !prev)}
                    placeholder="Repite la nueva contraseña"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={cancelarCambioPassword}
                  className="text-xs font-bold text-slate-500 transition hover:text-slate-700"
                >
                  Cancelar cambio de contraseña
                </button>
              </div>
            )}
          </div>
          <AlertaError mensaje={error} />
          {success && (
            <div className="animate-in fade-in rounded-2xl border-l-4 border-emerald-500 bg-emerald-50 p-4 text-xs font-bold text-emerald-700">
              {success}
            </div>
          )}
          {/* Botones finales del formulario */}
          <div className="flex items-center justify-end gap-5 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-400 transition-colors hover:text-slate-600"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[#1F8A8A] px-12 py-4 text-sm font-black text-white shadow-xl shadow-[#1F8A8A]/30 transition-all hover:bg-[#166d6d] disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}