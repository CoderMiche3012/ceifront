export default function Inicio() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Inicio</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Usuarios</h3>
          <p className="mt-2 text-sm text-slate-500">
            Administracion de las cuentas del sistema.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Roles y permisos</h3>
          <p className="mt-2 text-sm text-slate-500">
            Controlar accesos y privilegios por módulo.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-700">Otros</h3>
          <p className="mt-2 text-sm text-slate-500">
            Proximos módulos del sistema.
          </p>
        </div>
      </div>
    </section>
  )
}