import {
  GraduationCap,
  PencilLine,
  FileText,
  Star,
  PlusCircle,
  Download,
  Eye,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { obtenerSeguimiento } from "../../../../services/seguimientoService";

import ResumenEscolar from "./ResumenEscolar";
import ModalDatosEscolares from "./ModalDatosEscolares";
import ModalBoleta from "./ModalBoleta";

export default function DetalleSeguimiento({
  idSeguimiento,
  id_expediente,
}) {

  const [openModal,
    setOpenModal] =
    useState(false);

  const [openBoleta,
    setOpenBoleta] =
    useState(false);

  const [boletaSeleccionada,
    setBoletaSeleccionada] =
    useState(null);

  const [indexPeriodo,
    setIndexPeriodo] =
    useState(0);

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [
      "seguimiento",
      idSeguimiento,
    ],

    queryFn: () =>
      obtenerSeguimiento(
        idSeguimiento
      ),

    enabled:
      !!idSeguimiento,
  });

  // =========================
  // LOADING
  // =========================

  if (isLoading) {

    return (
      <p className="text-sm text-slate-500">
        Cargando detalle...
      </p>
    );
  }

  // =========================
  // DATA
  // =========================

  const escolar =
    data?.datos_escolares;

  const grado =
    escolar?.id_escolaridad ||
    null;

  const institucion =
    escolar?.id_institucion ||
    null;

  const boletas =
    escolar?.boletas || [];

  // =========================
  // PERIODOS
  // =========================

  const generarPeriodos =
    (periodicidad) => {

      if (!periodicidad)
        return [];

      const p =
        periodicidad
          .toUpperCase()
          .trim();

      switch (p) {

        case "SEMESTRAL":
          return [
            "Semestre 1",
            "Semestre 2",
          ];

        case "CUATRIMESTRAL":
          return [
            "Cuatrimestre 1",
            "Cuatrimestre 2",
            "Cuatrimestre 3",
          ];

        case "TRIMESTRAL":
          return [
            "Trimestre 1",
            "Trimestre 2",
            "Trimestre 3",
            "Trimestre 4",
          ];

        case "ANUAL":
          return ["Anual"];

        default:
          return [];
      }
    };

  const periodos =
    generarPeriodos(
      escolar?.periodicidad ||
      escolar?.modalidad_educativa
    );

  const getBoleta =
    (periodo) =>
      boletas.find(
        (b) =>
          b.periodo_boleta ===
          periodo
      );

  const periodoActual =
    periodos[indexPeriodo];

  const boleta =
    getBoleta(periodoActual);

  // =========================
  // PROMEDIO
  // =========================

  const promedioGeneral =
    boletas.length > 0
      ? (
          boletas.reduce(
            (acc, b) =>
              acc +
              Number(
                b.promedio_boleta
              ),
            0
          ) / boletas.length
        ).toFixed(2)
      : "--";

  // =========================
  // DESCARGAR
  // =========================

  const descargarArchivo =
    async (
      url,
      nombre = "boleta"
    ) => {

      try {

        const response =
          await fetch(url);

        const blob =
          await response.blob();

        const blobUrl =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href =
          blobUrl;

        link.download =
          nombre;

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          blobUrl
        );

      } catch (error) {

        console.error(
          error
        );
      }
    };

  return (
    <>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">

        {/* ========================= */}
        {/* INFORMACIÓN ESCOLAR */}
        {/* ========================= */}

        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

          <div className="flex items-center justify-between mb-6">

            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">

              <GraduationCap className="w-4 h-4 text-teal-600" />

              Información Escolar
            </h3>

            <button
              onClick={() =>
                setOpenModal(true)
              }
              className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
            >

              <PencilLine className="w-4 h-4" />

              {escolar
                ? "Editar"
                : "Agregar"}
            </button>
          </div>

          {!escolar ? (

            <p className="text-slate-400 text-sm">
              No hay datos escolares registrados
            </p>

          ) : (

            <ResumenEscolar
              escolar={escolar}
              grado={grado}
              institucion={
                institucion
              }
              promedioGeneral={
                promedioGeneral
              }
            />
          )}
        </div>

        {/* ========================= */}
        {/* BOLETAS */}
        {/* ========================= */}

        <div className="lg:col-span-1 rounded-2xl bg-white p-5 shadow-sm border border-slate-200">

          {!escolar ||
          periodos.length === 0 ? (

            <p className="text-slate-400 text-sm">
              No hay periodos disponibles
            </p>

          ) : (
            <>

              {/* HEADER */}

              <div className="flex items-center justify-between mb-5">

                <div>

                  <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                    Periodo
                  </p>

                  <h4 className="font-bold text-slate-800 text-lg">
                    {periodoActual}
                  </h4>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    disabled={
                      indexPeriodo ===
                      0
                    }
                    onClick={() =>
                      setIndexPeriodo(
                        (i) =>
                          i - 1
                      )
                    }
                    className="
                      h-8 w-8 rounded-lg
                      border border-slate-200
                      flex items-center justify-center
                      hover:bg-slate-50
                      disabled:opacity-40
                    "
                  >
                    ←
                  </button>

                  <button
                    disabled={
                      indexPeriodo ===
                      periodos.length -
                        1
                    }
                    onClick={() =>
                      setIndexPeriodo(
                        (i) =>
                          i + 1
                      )
                    }
                    className="
                      h-8 w-8 rounded-lg
                      border border-slate-200
                      flex items-center justify-center
                      hover:bg-slate-50
                      disabled:opacity-40
                    "
                  >
                    →
                  </button>
                </div>
              </div>

              {/* PROMEDIO */}

              <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 p-5 mb-4">

                <div className="flex items-center gap-3">

                  <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center">

                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>

                  <div>

                    <p className="text-xs uppercase font-semibold text-slate-400">
                      Calificación
                    </p>

                    <h3 className="text-3xl font-black text-slate-800 leading-none mt-1">

                      {boleta?.promedio_boleta ??
                        "--"}
                    </h3>
                  </div>
                </div>
              </div>

              {/* DOCUMENTO */}

              {boleta?.link ? (

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-4">

                  <div className="flex items-start gap-3">

                    <div className="h-11 w-11 rounded-xl bg-white flex items-center justify-center shadow-sm">

                      <FileText className="w-5 h-5 text-red-500" />
                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="font-semibold text-slate-700 text-sm">
                        Documento de boleta
                      </p>

                      <p className="text-xs text-slate-400 truncate mt-1">
                        Archivo adjunto del periodo
                      </p>

                      <div className="flex items-center gap-2 mt-4">

                        {/* VER */}

                        <a
                          href={
                            boleta.link
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="
                            flex items-center gap-2
                            px-3 py-2 rounded-xl
                            bg-white border border-slate-200
                            text-sm text-slate-700
                            hover:bg-slate-100
                            transition
                          "
                        >

                          <Eye className="w-4 h-4" />

                          Ver
                        </a>

                        {/* DESCARGAR */}

                        <button
                          onClick={() =>
                            descargarArchivo(
                              boleta.link,
                              `Boleta-${periodoActual}`
                            )
                          }
                          className="
                            flex items-center gap-2
                            px-3 py-2 rounded-xl
                            bg-teal-600 text-white
                            text-sm
                            hover:bg-teal-700
                            transition
                          "
                        >

                          <Download className="w-4 h-4" />

                          Descargar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              ) : (

                <div className="
                  border-2 border-dashed
                  border-slate-200
                  rounded-2xl
                  p-6
                  text-center
                  mb-4
                ">

                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                  <p className="text-sm font-medium text-slate-500">
                    Sin documento de boleta
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Adjunta un archivo para este periodo
                  </p>
                </div>
              )}

              {/* BOTÓN */}

              <button
                onClick={() => {

                  setBoletaSeleccionada({
                    ...boleta,

                    periodo_boleta:
                      periodoActual,

                    tipo_boleta:
                      escolar?.periodicidad,

                    id_datos_escolares:
                      escolar?.id_datos_escolares,
                  });

                  setOpenBoleta(true);
                }}
                className="
                  w-full
                  flex items-center justify-center gap-2
                  rounded-xl
                  py-3
                  text-sm font-medium
                  border border-teal-200
                  bg-teal-50
                  text-teal-700
                  hover:bg-teal-100
                  transition
                "
              >

                {boleta ? (
                  <>
                    <PencilLine className="w-4 h-4" />
                    Editar boleta
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Agregar calificación
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* MODAL DATOS */}
      {/* ========================= */}

      <ModalDatosEscolares
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        id_seguimiento={
          idSeguimiento
        }
        datosIniciales={
          escolar
        }
      />

      {/* ========================= */}
      {/* MODAL BOLETA */}
      {/* ========================= */}

      <ModalBoleta
        open={openBoleta}
        onClose={() =>
          setOpenBoleta(false)
        }
        boleta={
          boletaSeleccionada
        }
        id_expediente={
          id_expediente
        }
      />
    </>
  );
}