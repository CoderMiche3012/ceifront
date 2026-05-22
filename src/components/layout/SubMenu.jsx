import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  HiOutlineUser,
  HiOutlineLogout,
  HiChevronDown,
} from "react-icons/hi";
import { ui } from "../../styles/uiClasses";

export default function SubMenu({ user, onLogout, onOpenProfile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const nombreCompleto = useMemo(() => {
    if (!user) return "Usuario";

    const nombre = user.nombre || "";
    const apellido_p = user.apellido_p || "";
    const apellido_m = user.apellido_m || "";

    return `${nombre} ${apellido_p} ${apellido_m}`
      .replace(/\s+/g, " ")
      .trim() || "Usuario";
  }, [user]);

  const initials = useMemo(() => {
    if (!user?.nombre) return "U";

    const char1 = user.nombre[0] || "";
    const char2 =
      (user.apellido_p && user.apellido_p[0]) ||
      (user.nombre[1] || "");

    return (char1 + char2).toUpperCase();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () =>
      document.removeEventListener(
        "click",
        handleClickOutside
      );
  }, []);

  const toggleMenu = useCallback(
    () => setMenuOpen((prev) => !prev),
    []
  );

  const handleProfileClick = useCallback(() => {
    setMenuOpen(false);
    onOpenProfile?.();
  }, [onOpenProfile]);

  return (
    <div className={ui.userMenu.wrapper} ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-haspopup="true"
        className={ui.userMenu.trigger}
      >
        <div className="hidden text-right sm:block">
          <p className={ui.userMenu.name}>
            {nombreCompleto}
          </p>

          <p className={ui.userMenu.role}>
            {user?.rol?.nombre ||
              user?.rol ||
              "SuperAdmin"}
          </p>
        </div>

        <div className={ui.userMenu.avatar}>
          {initials}
        </div>

        <HiChevronDown
          className={`${ui.userMenu.chevron} ${
            menuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {menuOpen && (
        <div className={ui.userMenu.dropdown}>
          {/* Header */}
          <div className={ui.userMenu.dropdownHeader}>
            <div className="flex items-center gap-4">
              <div className={ui.userMenu.dropdownAvatar}>
                {initials}
              </div>

              <div className="min-w-0">
                <p
                  className={ui.userMenu.dropdownName}
                  title={nombreCompleto}
                >
                  {nombreCompleto}
                </p>

                <p className={ui.userMenu.dropdownEmail}>
                  {user?.correo ||
                    "sin_correo@cei.com"}
                </p>
              </div>
            </div>
          </div>

          {/* acciones */}
          <div className={ui.userMenu.actions}>
            <button
              type="button"
              onClick={handleProfileClick}
              className={ui.userMenu.item}
            >
              <div className="rounded-xl bg-slate-100 p-2.5 text-slate-500 group-hover:bg-[#1F8A8A] group-hover:text-white transition-colors">
                <HiOutlineUser size={18} />
              </div>

              <div className="text-left">
                <p className={ui.text.body + " font-semibold"}>
                  Mi Perfil
                </p>
                <p className={ui.text.caption}>
                  Configuración personal
                </p>
              </div>
            </button>

            <div className="my-2 mx-4 border-t border-slate-100" />

            <button
              type="button"
              onClick={onLogout}
              className={ui.userMenu.itemDanger}
            >
              <div className="rounded-xl bg-red-50 p-2.5 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                <HiOutlineLogout size={18} />
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-red-600">
                  Cerrar Sesión
                </p>
                <p className={ui.text.caption}>
                  Salir del sistema
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}