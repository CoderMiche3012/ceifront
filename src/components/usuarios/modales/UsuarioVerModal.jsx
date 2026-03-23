import { X } from "lucide-react"
import Avatar from "../Avatar"
import InsigniaRol from "../insignias/InsigniaRol"
import InsigniaEstatus from "../insignias/InsigniaEstatus"
//para visualizar información de un usuario
export default function UsuarioVerModal({ open, user, onClose }) {
  //si el modal no está abierto o no hay usuario, no renderiza nada
  if (!open || !user) return null
  return (
    //contenedor principal del modal
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* fondo oscuro que cierra el modal al hacer click */}
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* caja principal del modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-xl">
        {/* header del modal */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            {/* titulo */}
            <h2 className="text-xl font-bold text-slate-800">
              Detalle de usuario
            </h2>
            {/* subtítulo */}
            <p className="mt-1 text-sm text-slate-500">
              Información general del usuario seleccionado
            </p>
          </div>
          {/* botón de cerrar*/}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* contenido del modal */}
        <div className="space-y-6 px-6 py-6">
          {/* sección de avatar y nombre */}
          <div className="flex items-center gap-4">
            {/* componente avatar con nombre y apellido */}
            <Avatar nombre={user.nombre} apellidoP={user.apellido_p} />
            <div>
              {/* nombre completo */}
              <h3 className="text-lg font-semibold text-slate-800">
                {user.nombre} {user.apellido_p} {user.apellido_m}
              </h3>
              <p className="text-sm text-slate-500">@{user.nom_usuario}</p>
            </div>
          </div>
          {/* información del usuario */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Correo electrónico
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {user.correo}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Teléfono
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {user.telefono}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Rol
              </p>
              <div className="mt-2">
                <InsigniaRol roleId={user.id_rol} />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Estatus
              </p>
              <div className="mt-2">
                <InsigniaEstatus status={user.estatus} />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Nombre de usuario
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {user.nom_usuario}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1f8a8a] px-5 text-sm font-semibold text-white transition hover:bg-[#176d6d]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
