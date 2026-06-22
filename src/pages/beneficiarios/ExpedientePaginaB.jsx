import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { Calendar, ArrowLeft, RefreshCw, AlertCircle, Download } from "lucide-react";
import AvatarGeneral from "../../components/shared/AvatarGeneral";
import TabsExpediente from "../../features/beneficiarios/components/detalles/TabsExpediente";
import DatosGenerales from "../../features/beneficiarios/components/detalles/DatosGenerales";
import { useExpedienteData } from "../../features/beneficiarios/hooks/useExpedienteData";
import FamiliaCard from "../../features/beneficiarios/components/detalles/FamiliaCard";
import HistorialEscolarCard from "../../features/beneficiarios/components/detalles/seguimiento/informacionEscolar/HistorialEscolar";
import HistorialObligaciones from "../../features/beneficiarios/components/detalles/seguimiento/Obligaciones/HistorialObligaciones";
import HistorialFotografia from "../../features/beneficiarios/components/detalles/seguimiento/Fotografias/HistorialFotografias";
import ExpedienteDigital from "../../features/beneficiarios/components/detalles/seguimiento/Documentos/Documentos";
import HistorialEconomicoCard from "../../features/beneficiarios/components/detalles/seguimiento/ApoyosEconomicos/HistorialEconomico";
import HistorialServicios from "../../features/beneficiarios/components/detalles/seguimiento//Servicios/HistorialServicios";
import EstudioSos from "../../features/beneficiarios/components/detalles/EstudioSocioeconomico";
import { calcularEdad } from "../../utils/formatters";
import { generarExpedientePDF } from "../../utils/generarExpedientePDF";
import kidsAnimation from "../../assets/imagenes/kid.json";
import Lottie from "lottie-react";
import { ui } from "../../styles/ui/uiClasses";

export default function ExpedientePagina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data,
    loading,
    isFetching,
    error,
    tab,
    setTab,
    refetch,
  } = useExpedienteData(id);

  useEffect(() => {
    const tabUrl = searchParams.get("tab");
    if (tabUrl && tabUrl !== tab) {
      setTab(tabUrl);
    }
  }, [searchParams]);

  const handleTabChange = (nuevoTab) => {
    setTab(nuevoTab);
    setSearchParams({ tab: nuevoTab });
  };

  const edad = calcularEdad(data?.fecha_nacimiento);

  if (!id) return <div className="p-10 text-center text-red-500">ID inválido</div>;

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">

        <div className="w-56">
          <Lottie
            animationData={kidsAnimation}
            loop={true}
          />
        </div>

        <p className="mt-4 text-slate-600 font-medium">
          Cargando los datos del beneficiario...
        </p>

      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-10 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="text-red-500" size={48} />
        <div className="text-center">
          <h3 className="text-lg font-bold text-red-800">Hubo un problem</h3>
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

  const nombreCompleto = `${data.nombre} ${data.apellido_p} ${data.apellido_m || ""}`.trim();

  const formatearFecha = (fecha) => {
    if (!fecha || fecha === "--") return "Sin registro";
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  return (
  <section className={`${ui.layout.page} flex flex-col h-full`}>

    {/* HEADER */}
    <div
            className={`sticky top-0 z-10 pb-2 bg-[#f3f1f4] ${ui.layout.page}`}
          >

      <header className="relative rounded-2xl bg-white p-6 shadow-sm border border-slate-200 overflow-hidden">

        {isFetching && (
          <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/90 shadow-lg rounded-full border border-slate-100">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600"></div>
              <span className="text-[10px] font-bold text-slate-600 uppercase">
                Sincronizando...
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div className="flex items-center gap-5">

            <AvatarGeneral
              nombre={data.nombre}
              apellidoP={data.apellido_p}
              className="h-20 w-20 text-2xl"
            />

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {data.nombre} {data.apellido_p} {data.apellido_m}
              </h2>

              <div className="flex items-center gap-5 text-sm text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar size={16} className="text-slate-400" />
                  {edad} años
                </span>

                <span className="text-slate-300">|</span>

                <span className="font-medium">
                  Desde {formatearFecha(data.fecha_ingreso)}
                </span>
              </div>
            </div>

          </div>

          <button
            onClick={() => generarExpedientePDF(data, edad)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
          >
            <Download size={20} />
          </button>

        </div>
      </header>

      <nav className="border-b border-slate-200">
        <TabsExpediente tab={tab} setTab={handleTabChange} />
      </nav>

    </div>

    {/* SCROLL */}
    <main className="flex-1 overflow-y-auto pr-2 custom-scroll pb-10 space-y-6">

      {tab === "generales" && <DatosGenerales data={data} />}
      {tab === "familia" && <FamiliaCard data={data} />}
      {tab === "escuela" && <HistorialEscolarCard data={data} />}
      {tab === "obligaciones" && <HistorialObligaciones data={data} />}
      {tab === "fotografias" && <HistorialFotografia data={data} />}
      {tab === "documentos" && <ExpedienteDigital data={data} />}
      {tab === "apoyos" && <HistorialEconomicoCard data={data} />}
      {tab === "asistencias" && <HistorialServicios data={data} />}
      {tab === "estudio" && <EstudioSos data={data} />}

    </main>

  </section>
);
}