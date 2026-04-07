import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { HiOutlineUser, HiOutlineLogout, HiChevronDown } from "react-icons/hi";

export default function SubMenu({ user, onLogout, onOpenProfile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  //memorizar el nombre
  // Cambia tu useMemo por este:
  const nombreCompleto = useMemo(() => {
    if (!user) return "Usuario";

    const nombre = user.nombre || "";
    const apellido_p = user.apellido_p || "";
    const apellido_m = user.apellido_m || "";

    return `${nombre} ${apellido_p} ${apellido_m}`.replace(/\s+/g, ' ').trim() || "Usuario";
  }, [user]);

  const initials = useMemo(() => {
    if (!user?.nombre) return "U";
    const char1 = user.nombre[0] || "";
    const char2 = (user.apellido_p && user.apellido_p[0]) || (user.nombre[1] || "");
    return (char1 + char2).toUpperCase();
  }, [user]);
  //manejo de cierre 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  const handleProfileClick = useCallback(() => {
    setMenuOpen(false);
    onOpenProfile?.();
  }, [onOpenProfile]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-haspopup="true"
        className="flex items-center gap-3 rounded-2xl px-3 py-2 transition-all hover:bg-slate-100/80 active:scale-95"
      >
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-slate-800 leading-tight">
            {nombreCompleto}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#1F8A8A]">
            {user?.rol?.nombre || user?.rol || "Invitado"}
          </p>
        </div>
        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1F8A8A] to-[#146666] font-bold text-white shadow-sm ring-2 ring-white ring-offset-2 ring-offset-slate-100">
          {initials}
        </div>
        <HiChevronDown
          className={`hidden text-slate-400 transition-transform duration-300 sm:block ${menuOpen ? "rotate-180" : ""
            }`}
        />
      </button>
      {/* Menu Desplegable */}
      {menuOpen && (
        <div className="absolute right-0 z-[60] mt-3 w-72 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1F8A8A] to-[#146666] p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold backdrop-blur-sm">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-base leading-tight" title={nombreCompleto}>
                  {nombreCompleto}
                </p>
                <p className="truncate text-xs text-teal-50/80 mt-0.5">
                  {user?.correo || "sin_correo@cei.com"}
                </p>
              </div>
            </div>
          </div>
          {/* Acciones */}
          <div className="p-3">
            <button
              type="button"
              onClick={handleProfileClick}
              className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 hover:bg-slate-50 transition-all"
            >
              <div className="rounded-xl bg-slate-100 p-2.5 text-slate-500 group-hover:bg-[#1F8A8A] group-hover:text-white transition-colors">
                <HiOutlineUser size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-700">Mi Perfil</p>
                <p className="text-[10px] text-slate-400">Configuración personal</p>
              </div>
            </button>
            <div className="my-2 border-t border-slate-100 mx-4" />
            <button
              type="button"
              onClick={onLogout}
              className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 hover:bg-red-50 transition-all"
            >
              <div className="rounded-xl bg-red-50 p-2.5 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <HiOutlineLogout size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-red-600">Cerrar Sesión</p>
                <p className="text-[10px] text-red-300">Salir del sistema</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}