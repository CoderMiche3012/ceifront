import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi"
import AlertaError from "../../ui/AlertaError"
import { useUsuarioCrearModal } from "../../../hooks/useUsuarioCrearForm"

function Field({ label, name, error, required = false, children }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-[13px] font-bold uppercase tracking-wide text-slate-500"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {children}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  )
}
function Input({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  autoComplete,
  error = false,
}) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      className={`w-full rounded-2xl border bg-white px-4 py-3 text-[15px] text-slate-700 outline-none transition placeholder:text-slate-400 ${
        error
          ? "border-rose-300 ring-2 ring-rose-100"
          : "border-slate-200 focus:border-[#0E5F63] focus:ring-4 focus:ring-[#0E5F63]/10"
      } ${disabled ? "cursor-not-allowed bg-slate-100 opacity-70" : ""}`}
    />
  )
}
function Select({
  id,
  name,
  value,
  onChange,
  disabled = false,
  error = false,
  children,
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded-2xl border bg-white px-4 py-3 text-[15px] text-slate-700 outline-none transition ${
        error
          ? "border-rose-300 ring-2 ring-rose-100"
          : "border-slate-200 focus:border-[#0E5F63] focus:ring-4 focus:ring-[#0E5F63]/10"
      } ${disabled ? "cursor-not-allowed bg-slate-100 opacity-70" : ""}`}
    >
      {children}
    </select>
  )
}
//para registrar un nuevo usuario
export default function UsuarioCrearModal({ open,roles = [],onClose,onSuccess,}) {
  //maneja estado, validaciones y envío del formulario
  const {
    formData,fieldErrors,generalError,loading,showPassword,showConfirmPassword,roleOptions,initials,fullName,
    setShowPassword,setShowConfirmPassword,handleClose,handleBackdropClick,handleChange,handleSubmit,
  } = useUsuarioCrearModal({
    open,roles,onClose,onSuccess,
  })
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/55 px-3 py-4 backdrop-blur-[2px] sm:px-4 sm:py-6"
      onClick={handleBackdropClick}
    >
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div className="my-2 w-full max-w-3xl overflow-hidden rounded-[24px] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.28)] sm:my-6 sm:rounded-[32px]">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0E5F63]/10 text-sm font-bold uppercase text-[#0E5F63] sm:h-14 sm:w-14 sm:text-base">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                    Registrar usuario
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Captura la información general del nuevo usuario
                  </p>
                  <p className="mt-2 truncate text-sm font-medium text-slate-700">
                    {fullName}
                    <span className="ml-2 text-slate-400">
                      @{formData.nom_usuario || "usuario"}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>
          </div>
          {/* Formulario principal de registro */}
          <form
            onSubmit={handleSubmit}
            className="max-h-[calc(100vh-120px)] overflow-y-auto px-4 py-5 sm:max-h-[90vh] sm:px-6 sm:py-6 lg:px-8 lg:py-7"
          >
            <div className="mb-6">
              <AlertaError mensaje={generalError} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              <Field
                label="Nombre"
                name="nombre"
                required
                error={fieldErrors.nombre}
              >
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa el nombre"
                  disabled={loading}
                  autoComplete="given-name"
                  error={!!fieldErrors.nombre}
                />
              </Field>
              <Field
                label="Apellido paterno"
                name="apellido_p"
                required
                error={fieldErrors.apellido_p}
              >
                <Input
                  id="apellido_p"
                  name="apellido_p"
                  value={formData.apellido_p}
                  onChange={handleChange}
                  placeholder="Ingresa el apellido paterno"
                  disabled={loading}
                  autoComplete="family-name"
                  error={!!fieldErrors.apellido_p}
                />
              </Field>
              <Field
                label="Apellido materno"
                name="apellido_m"
                error={fieldErrors.apellido_m}
              >
                <Input
                  id="apellido_m"
                  name="apellido_m"
                  value={formData.apellido_m}
                  onChange={handleChange}
                  placeholder="Ingresa el apellido materno"
                  disabled={loading}
                  autoComplete="additional-name"
                  error={!!fieldErrors.apellido_m}
                />
              </Field>
              <Field
                label="Correo electrónico"
                name="correo"
                required
                error={fieldErrors.correo}
              >
                <Input
                  id="correo"
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  disabled={loading}
                  autoComplete="email"
                  error={!!fieldErrors.correo}
                />
              </Field>

              <Field
                label="Teléfono"
                name="telefono"
                error={fieldErrors.telefono}
              >
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ingresa el teléfono"
                  disabled={loading}
                  autoComplete="tel"
                  error={!!fieldErrors.telefono}
                />
              </Field>

              <Field
                label="Nombre de usuario"
                name="nom_usuario"
                required
                error={fieldErrors.nom_usuario}
              >
                <Input
                  id="nom_usuario"
                  name="nom_usuario"
                  value={formData.nom_usuario}
                  onChange={handleChange}
                  placeholder="Ingresa el nombre de usuario"
                  disabled={loading}
                  autoComplete="username"
                  error={!!fieldErrors.nom_usuario}
                />
              </Field>

              <div className="md:col-span-2">
                <Field
                  label="Rol"
                  name="id_rol"
                  required
                  error={fieldErrors.id_rol}
                >
                  <Select
                    id="id_rol"
                    name="id_rol"
                    value={formData.id_rol}
                    onChange={handleChange}
                    disabled={loading}
                    error={!!fieldErrors.id_rol}
                  >
                    <option value="">Selecciona un rol</option>
                    {roleOptions.map((rol) => (
                      <option key={rol.value} value={rol.value}>
                        {rol.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              {/* Campo de contraseña con opción de mostrar/ocultar */}
              <Field
                label="Contraseña"
                name="password"
                required
                error={fieldErrors.password}
              >
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    disabled={loading}
                    autoComplete="new-password"
                    error={!!fieldErrors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </Field>

              <Field
                label="Confirmar contraseña"
                name="confirm_password"
                required
                error={fieldErrors.confirm_password}
              >
                <div className="relative">
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Repite la contraseña"
                    disabled={loading}
                    autoComplete="new-password"
                    error={!!fieldErrors.confirm_password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar confirmación de contraseña"
                        : "Mostrar confirmación de contraseña"
                    }
                  >
                    {showConfirmPassword ? (
                      <HiOutlineEyeOff size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </Field>
            </div>

            {/* Botones de acción del formulario */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#0E5F63] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(14,95,99,0.22)] transition hover:bg-[#0c6a6e] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loading ? "Guardando..." : "Guardar usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}