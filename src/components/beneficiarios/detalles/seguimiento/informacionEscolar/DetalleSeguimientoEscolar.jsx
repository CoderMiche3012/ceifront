import { GraduationCap, PencilLine } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { obtenerSeguimiento } from "../../../../../services/seguimientoService";
import { obtenerGrados } from "../../../../../services/gradosService";
import { obtenerInstituciones } from "../../../../../services/institucionesService";
import { useMemo } from "react";

export default function DetalleSeguimiento({ idSeguimiento }) {

  /* ===============================
     🔥 QUERY PRINCIPAL
  =============================== */
  const { data, isLoading } = useQuery({
    queryKey: ["seguimiento", idSeguimiento],
    queryFn: () => obtenerSeguimiento(idSeguimiento),
    enabled: !!idSeguimiento,
  });

  /* ===============================
     🔹 CATÁLOGOS
  =============================== */
  const { data: grados = [] } = useQuery({
    queryKey: ["grados"],
    queryFn: obtenerGrados,
  });

  const { data: instituciones = [] } = useQuery({
    queryKey: ["instituciones"],
    queryFn: obtenerInstituciones,
  });

  /* ===============================
     🔥 MAPS
  =============================== */
  const gradoMap = useMemo(() => {
    return Object.fromEntries(
      grados.map((g) => [g.id_escolaridad, g])
    );
  }, [grados]);

  const institucionMap = useMemo(() => {
    return Object.fromEntries(
      instituciones.map((i) => [i.id_institucion, i])
    );
  }, [instituciones]);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando detalle...</p>;
  }

  if (!data?.datos_escolares) {
    return (
      <p className="text-sm text-slate-400">
        No hay datos escolares disponibles
      </p>
    );
  }

  const escolar = data.datos_escolares;

  const grado = gradoMap[escolar.id_escolaridad];
  const institucion = institucionMap[escolar.id_institucion];

  /* ===============================
     🎯 PROMEDIO GENERAL
  =============================== */
  const promedioGeneral =
    escolar.boletas?.length
      ? (
          escolar.boletas.reduce(
            (acc, b) => acc + Number(b.promedio_boleta),
            0
          ) / escolar.boletas.length
        ).toFixed(2)
      : "--";

  return (
    <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">

      {/* HEADER (MISMO ESTILO) */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <GraduationCap className="w-4 h-4 text-teal-600" />
          Información Escolar
        </h3>

        <button className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 group">
          <PencilLine className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Editar
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 text-sm">

        {/* NIVEL */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Nivel escolar
          </p>
          <p className="text-slate-700 font-medium">
            {grado?.nivel_escolar || "--"}
          </p>
        </div>

        {/* GRADO */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Grado
          </p>
          <p className="text-slate-700 font-medium">
            {grado?.grado_escolar || "--"}
          </p>
        </div>

        {/* GRUPO */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Grupo
          </p>
          <p className="text-slate-700 font-medium">
            {escolar.grupo || "--"}
          </p>
        </div>

        {/* TURNO */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Turno
          </p>
          <p className="text-slate-700 font-medium">
            {escolar.turno || "--"}
          </p>
        </div>

        {/* MODALIDAD */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Modalidad
          </p>
          <p className="text-slate-700 font-medium">
            {escolar.modalidad_educativa || "--"}
          </p>
        </div>

        {/* PROMEDIO */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Promedio general
          </p>
          <p className="text-slate-700 font-bold text-teal-700">
            {promedioGeneral}
          </p>
        </div>

        {/* INSTITUCIÓN */}
        <div className="col-span-1 md:col-span-3 border-t border-slate-50 pt-4 mt-2">
          <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
            Institución
          </p>
          <p className="text-slate-700 font-medium">
            {institucion?.nombre || "--"}
          </p>
        </div>

      </div>

      {/* BOLETAS */}
      {escolar.boletas?.length > 0 && (
        <div className="mt-6 border-t pt-4">

          <p className="text-xs font-semibold text-slate-400 uppercase mb-3">
            Boletas
          </p>

          <div className="space-y-2">
            {escolar.boletas.map((b) => (
              <div
                key={b.id_boleta}
                className="flex justify-between items-center text-sm bg-slate-50 px-3 py-2 rounded-lg"
              >
                <span className="text-slate-600">
                  {b.periodo_boleta}
                </span>

                <span className="font-semibold text-teal-700">
                  {b.promedio_boleta}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}