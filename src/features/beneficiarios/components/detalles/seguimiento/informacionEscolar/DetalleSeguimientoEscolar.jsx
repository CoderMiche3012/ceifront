import {
  GraduationCap,
  PencilLine,
  FileText,
  Star,
  PlusCircle,
  Download,
  Eye,
} from "lucide-react";

import { useState } from "react";
import ResumenEscolar from "./ResumenEscolar";
import ModalDatosEscolares from "./ModalDatosEscolares";
import ModalBoleta from "./ModalBoleta";
import NotasSeguimientoCard from "./NotasSeguimientoCard";
import Card from "../../../../../../components/ui/Card";

export default function DetalleSeguimiento({
  seguimiento,
  id_expediente,
}) {

  const [openModal, setOpenModal] = useState(false);
  const [openBoleta, setOpenBoleta] = useState(false);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);
  const [indexPeriodo, setIndexPeriodo] = useState(0);
  const idSeguimiento = seguimiento?.id_seguimiento
  // cargar
  if (!seguimiento) {
    return (
      <p className="text-sm text-slate-500">
        Cargando detalle...
      </p>
    );
  }

  // datos
  const escolar = seguimiento?.datos_escolares;
  const grado = escolar?.id_escolaridad || null;
  const institucion = escolar?.id_institucion || null;
  const boletas = escolar?.boletas || [];

  // =

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

  const periodos = generarPeriodos(escolar?.periodicidad || escolar?.modalidad_educativa);

  const getBoleta =
    (periodo) =>
      boletas.find(
        (b) =>
          b.periodo_boleta === periodo
      );

  const periodoActual = periodos[indexPeriodo];
  const boleta = getBoleta(periodoActual);

  // promedio

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
  // descarga
  const descargarArchivo =
    async (url, nombre = "boleta") => {

      try {

        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = nombre;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);

      } catch (error) {
      }
    };

  return (
    <>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 w-full items-stretch">


        <div className="lg:col-span-2 h-full rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

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
        {/* boletas */}
        <div className="relative h-full">
          

          {/* Dentro de la sección de boletas de tu componente principal */}
<Card className="relative h-full p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
  {!escolar || periodos.length === 0 ? (
    <p className="text-slate-400 text-sm">No hay periodos disponibles</p>
  ) : (
    <>
      {/* Cabecera del periodo: Limpia y Profesional */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Periodo Escolar</p>
          <h4 className="font-bold text-slate-800 text-base">{periodoActual}</h4>
        </div>

        <div className="flex items-center gap-4">
          {/* BOTÓN SUTIL EDITAR */}
          {boleta && (
            <button
              onClick={() => {
                setBoletaSeleccionada({
                  ...boleta,
                  periodo_boleta: periodoActual,
                  tipo_boleta: escolar?.periodicidad,
                  id_datos_escolares: escolar?.id_datos_escolares,
                });
                setOpenBoleta(true);
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              <PencilLine className="w-3.5 h-3.5" />
              Editar
            </button>
          )}

          {/* Flechas de navegación micro-compactas */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <button
              disabled={indexPeriodo === 0}
              onClick={() => setIndexPeriodo((i) => i - 1)}
              className="h-7 w-7 flex items-center justify-center text-slate-500 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              ←
            </button>
            <div className="w-[1px] h-4 bg-slate-200" />
            <button
              disabled={indexPeriodo === periodos.length - 1}
              onClick={() => setIndexPeriodo((i) => i + 1)}
              className="h-7 w-7 flex items-center justify-center text-slate-500 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Si NO hay boleta, mostramos el botón llamativo de Agregar (Estilo limpio) */}
      {!boleta ? (
        <div className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-xl p-8 text-center my-2 flex flex-col items-center justify-center">
          <FileText className="w-9 h-9 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700 mb-1">
            Sin información para este periodo
          </p>
          <p className="text-xs text-slate-400 max-w-xs mb-4">
            Registra la calificación y el archivo adjunto para el {periodoActual}.
          </p>
          <button
            onClick={() => {
              setBoletaSeleccionada({
                periodo_boleta: periodoActual,
                tipo_boleta: escolar?.periodicidad,
                id_datos_escolares: escolar?.id_datos_escolares,
                promedio_boleta: "",
                link: ""
              });
              setOpenBoleta(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0e5f63] text-white font-medium text-xs rounded-lg shadow-sm hover:bg-[#0c4f52] active:scale-95 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Agregar Boleta
          </button>
        </div>
      ) : (
        /* VISTA DE INFORMACIÓN CUANDO SÍ HAY BOLETA */
        <div className="space-y-4">
          
          {/* Bloque de Calificación Ejecutivo */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Calificación General
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Estatus: <span className="text-emerald-600 font-medium">Registrado</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black tracking-tight text-slate-800 tabular-nums">
                {Number(boleta?.promedio_boleta).toFixed(2) ?? "--"}
              </span>
            </div>
          </div>

          {/* Bloque del Archivo Adjunto (Estilo Fila de Documentos de Sistema) */}
          {boleta?.link ? (
            <div className="border border-slate-200 rounded-xl p-3 bg-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-700 text-xs truncate">
                    Boleta_{periodoActual.replace(/\s+/g, "")}.pdf
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Documento oficial adjunto
                  </p>
                </div>
              </div>

              {/* Botones de acción minimalistas */}
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={boleta.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                  title="Ver documento"
                >
                  <Eye className="w-4 h-4" />
                </a>
                <button
                  onClick={() => descargarArchivo(boleta.link, `Boleta-${periodoActual}`)}
                  className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                  title="Descargar"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-xl py-3 px-4 text-left bg-slate-50/30 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <p className="text-[11px] text-slate-400 font-medium">
                No se adjuntó un archivo PDF para esta calificación.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )}
</Card>
        </div>
        <div className="lg:col-span-3">
          <NotasSeguimientoCard
            data={escolar}
          />
        </div>
      </div>

      {/* MODAL DATOS */}
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

      {/* MODAL BOLETA */}

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

