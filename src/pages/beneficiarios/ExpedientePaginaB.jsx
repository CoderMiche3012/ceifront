import { useParams, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import AvatarGeneral from "../../components/shared/AvatarGeneral";
import TabsExpediente from "../../features/beneficiarios/components/detalles/TabsExpediente";
import DatosGenerales from "../../features/beneficiarios/components/detalles/DatosGenerales";
import { useExpedienteData } from "../../features/beneficiarios/hooks/useExpedienteData";
import { useBeneficiariosPage } from "../../features/beneficiarios/hooks/useBeneficiariosPage";
import { useQueryClient } from "@tanstack/react-query";

{/*
import FamiliaCard from "../../features/beneficiarios/components/detalles/FamiliaCard";
import HistorialEscolarCard from "../../features/beneficiarios/components/detalles/seguimiento/informacionEscolar/HistorialEscolar";
import HistorialServicios from "../../features/beneficiarios/components/detalles/seguimiento//Servicios/HistorialServicios";
import HistorialEconomicoCard from "../../features/beneficiarios/components/detalles/seguimiento/ApoyosEconomicos/HistorialEconomico";
import HistorialObligaciones from "../../features/beneficiarios/components/detalles/seguimiento/Obligaciones/HistorialObligaciones";
import HistorialFotografia from "../../features/beneficiarios/components/detalles/seguimiento/Fotografias/HistorialFotografias";
import ExpedienteDigital from "../../features/beneficiarios/components/detalles/seguimiento/Documentos/Documentos";
import EstudioSos from "../../features/beneficiarios/components/detalles/EstudioSocioeconomico";
*/}
export default function ExpedientePagina() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    loading,
    isFetching,
    error,
    tab,
    setTab,
    edad,
    refetch,
  } = useExpedienteData(id);

  // Validación de ID (se queda igual)
  if (!id) return <div className="p-10 text-center text-red-500">ID inválido</div>;

  if (loading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600"></div>
        <p className="text-slate-500 animate-pulse font-medium">Preparando expediente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-10 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="text-red-500" size={48} />
        <div className="text-center">
          <h3 className="text-lg font-bold text-red-800">Hubo un problema</h3>
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          <RefreshCw size={18} />
          Reintentar cargar
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-20 text-center space-y-4">
        <p className="text-slate-500 text-lg">El expediente no existe o fue eliminado.</p>
        <button onClick={() => navigate(-1)} className="text-teal-600 hover:underline font-medium">
          Volver al listado
        </button>
      </div>
    );
  }

  // Lógica de visualización (Se mantiene igual, ¡tu diseño es excelente!)
  const nombreCompleto = `${data.nombre} ${data.apellido_p} ${data.apellido_m || ""}`.trim();

  const formatearFecha = (fecha) => {
    if (!fecha || fecha === "--") return "Sin registro";
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
    <section className="w-full px-6 lg:px-10 space-y-4 pb-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Volver a Beneficiarios
      </button>

      <header className="relative rounded-2xl bg-white p-6 shadow-sm border border-slate-200 overflow-hidden">
        {/* Overlay de actualización sutil */}
        {isFetching && (
          <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/90 shadow-lg rounded-full border border-slate-100">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600"></div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Sincronizando...</span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <AvatarGeneral nombre={data.nombre} apellidoP={data.apellido_p} className="h-20 w-20 text-2xl" />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">{nombreCompleto}</h2>
              <div className="flex items-center gap-5 text-sm text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar size={16} className="text-slate-400" /> {edad} años
                </span>
                <span className="text-slate-300">|</span>
                <span className="font-medium">Desde {formatearFecha(data.fecha_ingreso)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all disabled:opacity-50"
          >
            <RefreshCw size={20} className={isFetching ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      <nav className="border-b border-slate-200">
        <TabsExpediente tab={tab} setTab={setTab} />
      </nav>

      <main className="min-h-[400px] mt-4">
        {tab === "generales" && <DatosGenerales data={data} />}
        {/*
        {tab === "familia" && (
          <FamiliaCard data={data} refetch={refetch} />
        )}
        {tab === "escuela" && <HistorialEscolarCard data={data} />}
        {tab === "apoyos" && <HistorialEconomicoCard data={data} />}
        {tab === "obligaciones" && <HistorialObligaciones data={data} />}
        {tab === "asistencias" && <HistorialServicios data={data} />}
        {tab === "fotografias" && <HistorialFotografia data={data} refetch={refetch} />}
        {tab === "documentos" && <ExpedienteDigital data={data} />}
        {tab === "estudio" && <EstudioSos data={data} refetch={refetch}/>}
      */}
      </main>
    </section>
  );
}