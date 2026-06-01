import AvatarGeneral from "../shared/AvatarGeneral";

// el encabezado para detalles 
export default function EncabezadoDetalle({
  nombre,
  apellidoP,
  apellidoM,
  estatus,
  badgeClass,
  avatarClassName = "h-15 w-15 text-2xl",
  children,
}) {
  return (
    <header className="rounded-2xl bg-white p-6 flex items-center justify-between shadow border border-slate-200">

      <div className="flex items-center gap-4">

        <div className="relative">
          <AvatarGeneral
            nombre={nombre || ""}
            apellidoP={apellidoP || ""}
            className={`${avatarClassName} shadow-lg`}
          />

          <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-teal-500 border-2 border-white" />
        </div>

        <div>
          <div className="flex items-center gap-3 flex-wrap">

            <h2 className="text-lg font-semibold text-slate-800">
              {nombre} {apellidoP} {apellidoM}
            </h2>

            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${badgeClass}`}>
              {estatus || "Sin estatus"}
            </span>

          </div>

          {children && (
            <div className="mt-1 text-sm text-slate-500">
              {children}
            </div>
          )}

        </div>
      </div>

    </header>
  );
}