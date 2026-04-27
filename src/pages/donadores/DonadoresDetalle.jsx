import { useParams } from "react-router-dom";
import { useState } from "react";
import { Calendar, Upload, Plus } from "lucide-react";
import AvatarGeneral from "../../components/shared/AvatarGeneral";
import { useDonadorData } from "../../hooks/donadores/useDonadorData";
import BotonInterno from "../../components/ui/BotonInterno";
import TabsDonador from "../../components/donadores/detalles/TabsDonador";
import DatosGenerales from "../../components/donadores/detalles/DatosGenerales";

export default function DonadoresDetalle() {
  const { id } = useParams();
  const {
    data,
    setData,
    loading,
    tab,
    setTab,
    estatusInfo,
    edad,
  } = useDonadorData(id);
  const estatus = data?.estatus?.toLowerCase();
  const estiloEstatus =
    estatus === "activo"
      ? "bg-green-100 text-green-700"
      : estatus === "inactivo"
        ? "bg-red-100 text-red-700"
        : estatus === "pausa"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-slate-100 text-slate-500";
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="p-10 text-center text-slate-500">
        Donador no encontrado o error en la carga.
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
              nombre={data.nombre || ""}
              apellidoP={data.apellido_p || ""}
              className="h-15 w-15 text-3xl shadow-lg"
            />
            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-teal-500 border-2 border-white"></div>
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg font-semibold text-slate-800">
                {data.nombre || ""} {data.apellido_p || ""} {data.apellido_m || ""}
              </h2>

              <span
                className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${estiloEstatus}`}
              >
                {data?.estatus || "Sin estatus"}
              </span>

            </div>

          </div>
        </div>

      </header>

      <TabsDonador tab={tab} setTab={setTab} />

      <main className="mt-6">
        {tab === "generales" && (
          <DatosGenerales data={data} setData={setData} />
        )}
        
      </main>
    </section>
  );
}