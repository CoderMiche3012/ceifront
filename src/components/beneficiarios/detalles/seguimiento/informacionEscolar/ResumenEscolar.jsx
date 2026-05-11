export default function ResumenEscolar({
  escolar,
  grado,
  institucion,
  promedioGeneral,
}) {
  const tienePromedio =
    promedioGeneral !== null &&
    promedioGeneral !== undefined &&
    promedioGeneral !== "" &&
    !isNaN(Number(promedioGeneral));

  const promedio = tienePromedio ? Number(promedioGeneral) : null;

  const getEtiqueta = (p) => {
    if (p >= 8) return "BUENO";
    if (p >= 7.5) return "BAJO";
    return "REGULARIZACION";
  };
  const nivelEducativo = (() => {
    const nivel = grado?.nivel_escolar;

    if (
      ["Preescolar", "Primaria", "Secundaria"]
        .includes(nivel)
    ) {
      return "Educación Básica";
    }

    if (nivel === "Preparatoria") {
      return "Educación Media Superior";
    }

    if (nivel === "Universidad") {
      return "Educación Superior";
    }

    return "--";
  })();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">

        {/* IZQUIERDA */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Institución
          </p>

          <h3 className="text-lg font-semibold text-slate-800">
            {institucion?.nombre || "--"}
          </h3>

          {institucion?.clave_escolar && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium mt-1 inline-block">
              {institucion.clave_escolar}
            </span>
          )}
        </div>

        {/* DERECHA - PROMEDIO */}
        <div className="flex items-center gap-4">

          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase">
              Promedio general
            </p>

            {tienePromedio ? (
              <>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-2xl font-bold text-teal-600">
                    {promedio.toFixed(1)}
                  </span>
                </div>

                <span className="text-xs font-semibold text-teal-600 uppercase">
                  {getEtiqueta(promedio)}
                </span>
              </>
            ) : (
              <span className="text-sm text-slate-400 font-medium">
                Sin registro
              </span>
            )}
          </div>

          {/* BARRA */}
          <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${tienePromedio ? "bg-teal-500" : "bg-slate-300"
                }`}
              style={{
                width: tienePromedio ? `${(promedio / 10) * 100}%` : "0%",
              }}
            />
          </div>
        </div>
      </div>

      {/* INFO PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-100 pt-5">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Nivel educativo
          </p>

          <p className="text-slate-700 font-medium">
            {nivelEducativo}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Grado escolar
          </p>
          <p className="text-slate-700 font-medium">
            {grado?.nivel_escolar || "--"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Grado y grupo
          </p>
          <p className="text-slate-700 font-medium">
            {grado?.grado_escolar ? `${grado.grado_escolar}°` : "--"}{" "}
            {escolar?.grupo && `- Grupo ${escolar.grupo}`}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Turno
          </p>
          <p className="text-slate-700 font-medium">
            {escolar?.turno || "--"}
          </p>
        </div>

        {escolar?.especialidad && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
              Licenciatura/ Especialidad
            </p>

            <p className="text-slate-700 font-medium">
              {escolar.especialidad}
            </p>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Periodo académico
          </p>
          <p className="text-slate-700 font-medium">
            {escolar?.modalidad_educativa || "--"}
          </p>
        </div>

      </div>
    </div>
  );
}