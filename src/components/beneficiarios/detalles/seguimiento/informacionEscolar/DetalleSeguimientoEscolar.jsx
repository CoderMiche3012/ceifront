import { GraduationCap, PencilLine } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { obtenerSeguimiento } from "../../../../../services/seguimientoService";
import { obtenerGrados } from "../../../../../services/gradosService";
import { obtenerInstituciones } from "../../../../../services/institucionesService";

import ModalDatosEscolares from "./ModalDatosEscolares"; // 🔥 IMPORTANTE

export default function DetalleSeguimiento({ idSeguimiento }) {

  /* ===============================
     🔥 MODAL STATE
  =============================== */
  const [openModal, setOpenModal] = useState(false);

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

  const escolar = data?.datos_escolares;

  const grado = escolar
    ? gradoMap[escolar.id_escolaridad]
    : null;

  const institucion = escolar
    ? institucionMap[escolar.id_institucion]
    : null;

  /* ===============================
     🎯 PROMEDIO
  =============================== */
  const promedioGeneral =
    escolar?.boletas?.length
      ? (
          escolar.boletas.reduce(
            (acc, b) => acc + Number(b.promedio_boleta),
            0
          ) / escolar.boletas.length
        ).toFixed(2)
      : "--";

  return (
    <>
      <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <GraduationCap className="w-4 h-4 text-teal-600" />
            Información Escolar
          </h3>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 group"
          >
            <PencilLine className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            {escolar ? "Editar" : "Agregar"}
          </button>
        </div>

        {/* ===============================
            📭 SIN DATOS
        =============================== */}
        {!escolar ? (
          <div className="text-center py-6">
            <p className="text-slate-400 text-sm mb-3">
              No hay datos escolares registrados
            </p>

            <button
              onClick={() => setOpenModal(true)}
              className="text-teal-600 text-sm font-medium"
            >
              Agregar datos escolares
            </button>
          </div>
        ) : (
          <>
            {/* ===============================
                📊 GRID
            =============================== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 text-sm">

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                  Nivel escolar
                </p>
                <p className="text-slate-700 font-medium">
                  {grado?.nivel_escolar || "--"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                  Grado
                </p>
                <p className="text-slate-700 font-medium">
                  {grado?.grado_escolar || "--"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                  Grupo
                </p>
                <p className="text-slate-700 font-medium">
                  {escolar.grupo || "--"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                  Turno
                </p>
                <p className="text-slate-700 font-medium">
                  {escolar.turno || "--"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                  Modalidad
                </p>
                <p className="text-slate-700 font-medium">
                  {escolar.modalidad_educativa || "--"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                  Promedio general
                </p>
                <p className="text-slate-700 font-bold text-teal-700">
                  {promedioGeneral}
                </p>
              </div>

              <div className="col-span-1 md:col-span-3 border-t border-slate-50 pt-4 mt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                  Institución
                </p>
                <p className="text-slate-700 font-medium">
                  {institucion?.nombre || "--"}
                </p>
              </div>

            </div>

            {/* ===============================
                📄 BOLETAS
            =============================== */}
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
          </>
        )}

      </div>

      {/* ===============================
          🔥 MODAL
      =============================== */}
      <ModalDatosEscolares
        open={openModal}
        onClose={() => setOpenModal(false)}
        id_seguimiento={idSeguimiento}
      />
    </>
  );
}