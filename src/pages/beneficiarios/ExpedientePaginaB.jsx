import { useParams } from "react-router-dom";
import { useState } from "react";
import { Calendar, Upload, Plus } from "lucide-react";
import AvatarGeneral from "../../components/shared/AvatarGeneral";
import TabsExpediente from "../../components/beneficiarios/detalles/TabsExpediente";
import { useExpedienteData } from "./../../hooks/beneficiarios/useExpedienteData";
import DatosGenerales from "../../components/beneficiarios/detalles/DatosGenerales";
import BotonInterno from "../../components/ui/BotonInterno";
export default function ExpedientePagina() {
  const { id } = useParams();

  const {
    data,
    setData,
    loading,
    tab,
    setTab,
    estatusInfo,
    edad,
  } = useExpedienteData(id);

  // pantalla carga
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
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

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="rounded-2xl bg-white p-6 flex items-center justify-between shadow border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="relative">
            <AvatarGeneral
              nombre={data.nombre}
              apellidoP={data.apellido_p}
            />
            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-teal-500 border-2 border-white"></div>
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-semibold text-slate-800">
                {data.nombre} {data.apellido_p}
              </h2>

              <span
                className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${estatusInfo.className}`}
              >
                {estatusInfo.text}
              </span>

            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {edad} años
              </span>

            </div>
          </div>
        </div>

      </header>

      <TabsExpediente tab={tab} setTab={setTab} />

      <main className="mt-6">
        {tab === "generales" && (
          <DatosGenerales data={data} setData={setData} />
        )}
      </main>
    </section>
  );
}