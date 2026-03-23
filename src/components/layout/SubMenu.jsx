import { useEffect, useRef, useState } from "react"
import {HiOutlineUser,HiOutlineLogout,HiChevronDown,} from "react-icons/hi"

export default function SubMenu({ user, onLogout, onOpenProfile }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const nombreCompleto = user?.apellido_p 
    ? `${user.nombre} ${user.apellido_p} ${user.apellido_m || ''}`.trim()
    : user?.nombre || "Usuario"
// para tomar la inicial de el primer apellido y nombre
  const initials = (() => {
    if (!user?.nombre) return "U"
    const char1 = user.nombre[0]
    const char2 = user.apellido_p ? user.apellido_p[0] : (user.nombre[1] || "")
    return (char1 + char2).toUpperCase()
  })()
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-slate-50"
      >
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-slate-800 leading-tight">
            {nombreCompleto}
          </p>
          <p className="text-xs font-medium text-[#1F8A8A]">
            {user?.rol?.nombre || user?.rol || "Usuario"}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#1F8A8A] to-[#166d6d] font-bold text-white shadow-sm">
          {initials}
        </div>

        <HiChevronDown
          className={`hidden text-slate-400 transition sm:block ${menuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="bg-gradient-to-r from-[#1F8A8A] to-[#166d6d] p-5 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-base" title={nombreCompleto}>
                  {nombreCompleto}
                </p>
                <p className="truncate text-xs text-white/80">
                  {user?.correo || "Sin correo"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => { setMenuOpen(false); onOpenProfile?.(); }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-50 transition"
            >
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <HiOutlineUser size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700">Mi Perfil</p>
                <p className="text-[11px] text-slate-500">Ver y editar tus datos</p>
              </div>
            </button>

            <div className="my-1 border-t border-slate-100" />

            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-red-50 transition"
            >
              <div className="rounded-lg bg-red-100 p-2 text-red-600">
                <HiOutlineLogout size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-red-600">Cerrar Sesión</p>
                <p className="text-[11px] text-red-400">Finalizar </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}