import { useParams } from "react-router-dom";
import { useState } from "react";
import { Calendar, Upload, Plus } from "lucide-react";
import AvatarGeneral from "../../components/shared/AvatarGeneral";
import TabsExpediente from "../../components/postulantes/detalles/TabsExpediente";
import CitaTab from "../../components/postulantes/detalles/CitaTab";
import { useExpedienteData } from "./../../hooks/postulantes/useExpedienteData";
import DatosGenerales from "../../components/postulantes/detalles/DatosGenerales";
import RecomendacionCard from "../../components/postulantes/detalles/RecomendacionCard";
import FotosCard from "../../components/postulantes/detalles/FotosCard";
import BotonInterno from "../../components/ui/BotonInterno";
export default function ExpedientePagina() {
  const { id } = useParams();

  const {
    data,
    setData,
    loading,
    tab,
    setTab,
    visitasFiltradas,
    estatusInfo,
    edad,
  } = useExpedienteData(id);

  const [mostrarSubida, setMostrarSubida] = useState(false);
  const [archivo, setArchivo] = useState(null);

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

  // subir documento
  const handleSubirDocumento = () => {
    if (!archivo) return alert("Selecciona un archivo");

    // aquí luego conectas backend o drive
    const nuevoDocumento = {
      nombre: archivo.name,
      fecha: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      estatus_estudio: "Completo",
      documento_estudio: nuevoDocumento,
    }));

    setMostrarSubida(false);
    setArchivo(null);
  };

  const estudioCompleto =
    data.estatus_estudio?.toLowerCase() === "completo";

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

              {/* Estado estudio */}
              <span
                className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${estudioCompleto
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
                  }`}
              >
                Estudio: {data.estatus_estudio || "Pendiente"}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
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
            </div>
          </div>
        </div>

        {/* Botón agregar estudio */}

      </header>

      {/* Caja subir documento */}
      {mostrarSubida && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow space-y-4">
          <h3 className="text-base font-semibold text-slate-800">
            Subir documento de estudio
          </h3>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 hover:bg-slate-50">
            <Upload size={18} />
            <span className="text-sm text-slate-600">
              {archivo ? archivo.name : "Seleccionar archivo"}
            </span>

            <input
              type="file"
              className="hidden"
              onChange={(e) => setArchivo(e.target.files[0])}
            />
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleSubirDocumento}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              Guardar y completar
            </button>

            <button
              onClick={() => {
                setMostrarSubida(false);
                setArchivo(null);
              }}
              className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <TabsExpediente tab={tab} setTab={setTab} />

      <main className="mt-6">
        {tab === "generales" && (
          <DatosGenerales data={data} setData={setData} />
        )}

        {tab === "Visita" && (
          <div className="space-y-6">

            <div className="grid grid-cols-3 gap-6">

              <div className="col-span-2">
                <RecomendacionCard
                  data={data}
                  setData={setData}
                />
              </div>

              <div className="col-span-1">
                <FotosCard
                  data={data}
                  setData={setData}
                />
              </div>

            </div>

            <CitaTab
              visitas={visitasFiltradas}
              onRefresh={() => window.location.reload()}
            />

          </div>
        )}
      </main>
    </section>
  );
}