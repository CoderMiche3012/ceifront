import { useParams } from "react-router-dom";
import { useState } from "react";
import { Calendar, Upload } from "lucide-react";

import EncabezadoDetalle from "../../components/ui/EncabezadoDetalle";
import TabsExpediente from "../../features/postulantes/components/detalles/TabsExpediente";
//import ResultadosCard from "../../features/postulantes/components/detalles/resultados/ResultadosCard";
import VisitasCard from "../../features/postulantes/components/detalles/visitas/VisitasCard";
import DatosGenerales from "../../features/postulantes/components/detalles/generales/DatosGenerales";

import { useExpedienteData } from "../../features/postulantes/hooks/useExpedienteData";
import { ui } from "../../styles/ui/uiClasses";

import { subirDocumentoEstudio } from "../../features/expedientes/services/documentosService";
import { actualizarEstudio } from "../../features/postulantes/services/estudiosService";
import { useSubirEstudio } from "../../features/postulantes/hooks/useSubirEstudio";

export default function ExpedientePagina() {
  const { id } = useParams();
 

  const {
    data,
    loading,
    tab,
    setTab,
    visitasFiltradas,
    estatusInfo,
    edad,
  } = useExpedienteData(id);

   const {
  mostrarSubida,
  setMostrarSubida,
  archivo,
  setArchivo,
  guardarDocumentoEstudio,
  cancelar,
  loading: subiendo,
} = useSubirEstudio(data);
  // loading
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  // no encontrado
  if (!data) {
    return (
      <div className="p-10 text-center text-slate-500">
        Expediente no encontrado o error en la carga.
      </div>
    );
  }

  const estudioCompleto = data.estatus_estudio?.toLowerCase() === "completo";

  return (
    <section className={`${ui.layout.page} flex flex-col h-full`}>

      {/* encabezado */}
      <div
        className={`sticky top-0 z-10 pb-2 bg-[#f3f1f4] ${ui.layout.page}`}
      >

        <EncabezadoDetalle
          nombre={data.nombre}
          apellidoP={data.apellido_p}
          apellidoM={data.apellido_m}
          estatus={estatusInfo.text}
          badgeClass={estatusInfo.className}
          avatarClassName="h-16 w-16 text-3xl"
        >
          <div className="flex items-center gap-4 flex-wrap">

            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {edad} años
            </span>

            <span>
              Tutor:{" "}
              <span className="font-medium text-slate-700">
                {data.tutor_nombre}
              </span>
            </span>

            <span
              className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${estudioCompleto
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
                }`}
            >
              Estudio: {data.estatus_estudio || "Pendiente"}
            </span>
          </div>
        </EncabezadoDetalle>

        <TabsExpediente
          tab={tab}
          setTab={setTab}
        />
      </div>

      {/* contenido */}
      <main className="flex-1 overflow-y-auto pr-2 custom-scroll pb-10 space-y-6">

        {/* subir documento */}
        {mostrarSubida && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow space-y-4">

            <h3 className="text-base font-semibold text-slate-800">
              Subir documento de estudio
            </h3>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 hover:bg-slate-50">

              <Upload size={18} />

              <span className="text-sm text-slate-600">
                {archivo
                  ? archivo.name
                  : "Seleccionar archivo"}
              </span>

              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setArchivo(e.target.files[0])
                }
              />
            </label>

            <div className="flex gap-3">
              <button
                onClick={
                  guardarDocumentoEstudio
                }
                className="rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                Guardar y completar
              </button>

              <button
                onClick={cancelar}
                className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        
        {/* generales */}
        {tab === "generales" && (
          <DatosGenerales data={data} />
        )}

        {/* visitas */}
        {tab === "Visita" && (
          <VisitasCard
            data={data}
            visitas={visitasFiltradas}
            setMostrarSubida={
              setMostrarSubida
            }
          />
        )}

        {/* resultados 
        {tab === "Resultados" && (
          <ResultadosCard data={data} />
        )}
*/}
        
      </main>
    </section>
  );
}