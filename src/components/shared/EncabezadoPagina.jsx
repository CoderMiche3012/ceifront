export default function EncabezadoPagina({
  titulo,
  descripcion,
  accion,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800">
          {titulo}
        </h1>
        {descripcion ? (
          <p className="mt-1 text-base text-slate-500">
            {descripcion}
          </p>
        ) : null}
      </div>

      {accion ? (
        <div className="w-full md:w-auto">
          {accion}
        </div>
      ) : null}
    </div>
  )
}