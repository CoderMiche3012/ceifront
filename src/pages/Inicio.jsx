import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useBeneficiariosPage } from "../features/beneficiarios/hooks/useBeneficiariosPage";
import { obtenerVisita } from "../features/postulantes/services/visitasService";
import { usePermissions } from "../context/PermissionsContext";


import {
  Calendar,
  Sparkles,
  Inbox,
  Clock,
  Users,
  UserX,
  UserPlus,
  UserMinus,
  CalendarDays,
  PlusCircle,
  AlertTriangle,
  LayoutGrid,
  ChevronRight
} from "lucide-react";

export default function Inicio() {
  const navigate = useNavigate();

  const {
    beneficiarios,
    loading: loadingBeneficiarios,
  } = useBeneficiariosPage();

  const [visitas, setVisitas] = useState([]);
  const [loadingVisitas, setLoadingVisitas] = useState(true);

  const { hasModulePermission } = usePermissions();

  // permisos
  const canCreatePostulantes = useMemo(
    () => hasModulePermission("postulantes", "crear"),
    [hasModulePermission]
  );
  const canCreateDonadores = useMemo(
    () => hasModulePermission("donadores", "crear"),
    [hasModulePermission]
  );

  const canCreateBeneficiarios = useMemo(
    () => hasModulePermission("beneficiarios", "crear"),
    [hasModulePermission]
  );
  useEffect(() => {
    let isMounted = true;

    async function cargarVisitas() {
      try {
        setLoadingVisitas(true);

        const respuesta = await obtenerVisita();

        const dataVisitas = Array.isArray(respuesta)
          ? respuesta
          : respuesta?.data || [];

        if (isMounted) {
          setVisitas(dataVisitas);
        }
      } catch (error) {
        console.error("Error al obtener visitas:", error);
      } finally {
        if (isMounted) {
          setLoadingVisitas(false);
        }
      }
    }

    cargarVisitas();

    return () => {
      isMounted = false;
    };
  }, []);
  //metricas
  const metrics = useMemo(() => {
    if (!beneficiarios || beneficiarios.length === 0) {
      return { activos: 0, sinDonador: 0, nuevosIngresos: 0, bajas: 0 };
    }
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const anioActual = fechaActual.getFullYear();

    return beneficiarios.reduce((acc, b) => {
      const ultimoSeguimiento = b.seguimientos && b.seguimientos.length > 0
        ? b.seguimientos[b.seguimientos.length - 1]
        : null;

      const esActivo = ultimoSeguimiento?.e === "Activo" || b.e === "Activo";
      if (esActivo) acc.activos++;

      const tieneDonador = b.id_donador || b.donador || b.tieneDonador;
      if (esActivo && !tieneDonador) acc.sinDonador++;

      if (b.fecha_ingreso) {
        const fechaIngreso = new Date(b.fecha_ingreso);
        if (fechaIngreso.getMonth() === mesActual && fechaIngreso.getFullYear() === anioActual) {
          acc.nuevosIngresos++;
        }
      }

      const esBaja = ultimoSeguimiento?.e === "Inactivo" || b.e === "Inactivo";
      if (esBaja) acc.bajas++;

      return acc;
    }, { activos: 0, sinDonador: 0, nuevosIngresos: 0, bajas: 0 });

  }, [beneficiarios]);
  const totalVisitasHoy = useMemo(() => {
    if (!visitas || visitas.length === 0) return 0;

    //fecha de hoy local en formato  "YYYY-MM-DD"
    const hoy = new Date();
    const anioHoy = hoy.getFullYear();
    const mesHoy = String(hoy.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
    const diaHoy = String(hoy.getDate()).padStart(2, '0');
    const fechaHoyString = `${anioHoy}-${mesHoy}-${diaHoy}`; // Resultado: "2026-05-20"
    return visitas.filter(visita => {
      const fechaOrigen = visita.fecha_visita;
      if (!fechaOrigen) return false;
      const fechaVisitaString = fechaOrigen.substring(0, 10);
      return fechaVisitaString === fechaHoyString;
    }).length;
  }, [visitas]);

  const agendaVisitas = useMemo(() => {
    if (!visitas || visitas.length === 0) {
      return { tipo: "vacio", totalHoy: 0, proximaVisita: null };
    }
    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);
    const visitasProgramadas = visitas.filter(v => v.fecha_visita && v.estado_visita === "Programada");
    if (visitasProgramadas.length === 0) {
      return { tipo: "vacio", totalHoy: 0, proximaVisita: null };
    }

    //ordenar todas las visitas cronológicamente por su fecha completa
    const visitasOrdenadas = [...visitasProgramadas].sort(
      (a, b) => new Date(a.fecha_visita) - new Date(b.fecha_visita)
    );
    //separar las que caen  hoy
    const visitasDeHoy = visitasOrdenadas.filter(v => {
      const f = new Date(v.fecha_visita);
      return f >= inicioHoy && f <= finHoy;
    });
    //sí hay visitas el día de hoy
    if (visitasDeHoy.length > 0) {
      const proxima = visitasDeHoy[0];
      const horaLimpia = new Date(proxima.fecha_visita).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return {
        tipo: "hoy",
        totalHoy: visitasDeHoy.length,
        proximaVisita: { ...proxima, etiquetaFecha: "hoy", horaLimpia }
      };
    }

    //la siguiente visita futura disponible
    const visitasFuturas = visitasOrdenadas.filter(v => new Date(v.fecha_visita) > finHoy);

    if (visitasFuturas.length > 0) {
      const proximaFutura = visitasFuturas[0];
      const fechaF = new Date(proximaFutura.fecha_visita);
      const horaLimpia = fechaF.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const inicioVisita = new Date(fechaF.getFullYear(), fechaF.getMonth(), fechaF.getDate());
      const diferenciaDias = Math.round((inicioVisita - inicioHoy) / (1000 * 60 * 60 * 24));

      let etiquetaFecha = "";
      if (diferenciaDias === 1) {
        etiquetaFecha = "mañana";
      } else if (diferenciaDias === 2) {
        etiquetaFecha = "pasado mañana";
      } else {
        etiquetaFecha = `el ${fechaF.toLocaleDateString([], { day: '2-digit', month: 'short' })}`; // Ej: "el 25 may"
      }

      return {
        tipo: "futuro",
        totalHoy: 0,
        proximaVisita: { ...proximaFutura, etiquetaFecha, horaLimpia }
      };
    }
    return { tipo: "vacio", totalHoy: 0, proximaVisita: null };
  }, [visitas]);

  const Card = ({ title, value, icon: Icon, type = "default", loading = false }) => {
    const styles = {
      default: { bg: "bg-blue-50", text: "text-blue-600", border: "border-slate-100" },
      danger: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
      success: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-slate-100" },
      warning: { bg: "bg-amber-50", text: "text-amber-600", border: "border-slate-100" },
      info: { bg: "bg-purple-50", text: "text-purple-600", border: "border-slate-100" },
    };

    const currentStyle = styles[type] || styles.default;

    return (
      <div className={`rounded-2xl bg-white border ${currentStyle.border} p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between`}>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">
            {loading ? (
              <span className="inline-block w-12 h-8 bg-slate-200 animate-pulse rounded-lg" />
            ) : (
              value
            )}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${currentStyle.bg} ${currentStyle.text}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-8 p-6 bg-slate-50/50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Inicio</h2>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <Card
          title="Beneficiarios Activos"
          value={metrics.activos}
          icon={Users}
          type="default"
          loading={loadingBeneficiarios}
        />
        <Card
          title="Sin Donador"
          value={metrics.sinDonador}
          icon={UserX}
          type="danger"
          loading={loadingBeneficiarios}
        />
        <Card
          title="Ingresos del Mes"
          value={metrics.nuevosIngresos}
          icon={UserPlus}
          type="success"
          loading={loadingBeneficiarios}
        />
        <Card
          title="Casos de Baja"
          value={metrics.bajas}
          icon={UserMinus}
          type="warning"
          loading={loadingBeneficiarios}
        />
        <Card
          title="Visitas Hoy"
          value={totalVisitasHoy}
          icon={CalendarDays}
          type="info"
          loading={loadingVisitas}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {/* Acciones Rápidas */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <PlusCircle className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-bold text-slate-800">Acciones rápidas</h3>
            </div>

            <div className="mt-5 space-y-3">
              {canCreateBeneficiarios && (
                <button
                  onClick={() => navigate("/app/beneficiarios", { state: { openModal: true } })}
                  className="w-full flex items-center justify-between rounded-xl bg-teal-600 text-white px-4 py-2.5 font-medium hover:bg-teal-700 active:scale-[0.99] transition shadow-sm"
                >
                  <span>Registrar Beneficiario</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {canCreateDonadores && (
                <button
                  onClick={() => navigate("/app/donadores", { state: { openModal: true } })}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 text-slate-700 px-4 py-2.5 font-medium hover:bg-slate-50 active:scale-[0.99] transition"
                >
                  <span>Registrar Donador</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              )}
              {canCreatePostulantes && (
                <button
                  onClick={() => navigate("/app/ingresos", { state: { openModal: true } })}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 text-slate-700 px-4 py-2.5 font-medium hover:bg-slate-50 active:scale-[0.99] transition"
                >
                  <span>Registrar Postulante</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05),0_10px_20px_-12px_rgba(0,0,0,0.04)] transition-all duration-300">

          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">Alertas del Sistema</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Estado actual de prioridades y agenda</p>
              </div>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-sm ${agendaVisitas.tipo === "hoy"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : agendaVisitas.tipo === "futuro"
                ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                : "bg-slate-50 text-slate-500 border-slate-200"
              }`}>
              {agendaVisitas.tipo === "hoy" && "Acción requerida"}
              {agendaVisitas.tipo === "futuro" && "Al día"}
              {agendaVisitas.tipo === "vacio" && "Sin pendientes"}
            </span>
          </div>

          {/* Contenido de las Alertas */}
          <div className="mt-5 space-y-3">

            {agendaVisitas.tipo === "hoy" && (
              <div
                onClick={() => navigate("/app/ingresos")}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50/40 via-emerald-50/10 to-transparent border border-emerald-100 p-4 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-50/20 cursor-pointer transition-all duration-300 flex items-start justify-between gap-4"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl" />

                <div className="flex gap-3.5 pl-1">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200/60 shadow-sm shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-300">
                    <Clock className="w-4 h-4 animate-pulse" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        Agenda de Hoy
                      </p>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>

                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Tienes <strong className="text-slate-900 font-bold">{agendaVisitas.totalHoy} {agendaVisitas.totalHoy === 1 ? 'visita programada' : 'visitas programadas'}</strong>.
                      Inicia a las <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{agendaVisitas.proximaVisita?.horaLimpia} hrs</span>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center self-center shrink-0">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-100 text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-200 group-hover:bg-emerald-50/50 shadow-sm transition-all duration-300 transform group-hover:translate-x-0.5">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}
            {agendaVisitas.tipo === "futuro" && (
              <div
                onClick={() => navigate("/app/ingresos")}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50/30 via-transparent to-transparent border border-slate-200 p-4 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/10 cursor-pointer transition-all duration-300 flex items-start justify-between gap-4"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-l-xl opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="flex gap-3.5 pl-1">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-300">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                        Próxima Cita en Agenda
                      </p>
                      <div className="flex items-center gap-0.5 text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.2 rounded-md font-medium">
                        <Sparkles className="w-2.5 h-2.5" /> Hoy libre
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      Tu siguiente visita está programada para <span className="font-bold text-indigo-900 lowercase">{agendaVisitas.proximaVisita?.etiquetaFecha}</span> a las <span className="font-semibold text-slate-800">{agendaVisitas.proximaVisita?.horaLimpia} hrs</span>.
                    </p>

                  </div>
                </div>

                <div className="flex items-center self-center shrink-0">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-100 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 group-hover:bg-indigo-50/50 shadow-sm transition-all duration-300 transform group-hover:translate-x-0.5">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}

            {agendaVisitas.tipo === "vacio" && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition-colors duration-300">
                <div className="mx-auto w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-400 mb-2.5 shadow-sm">
                  <Inbox className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Agenda totalmente despejada</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto">No hay visitas futuras pendientes de asignación en este ciclo.</p>
              </div>
            )}

          </div>
        </div>
        {/* Módulos del Sistema */}
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-dashed border-slate-200">
            <LayoutGrid className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-bold text-slate-700">Módulos activos</h3>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {["Beneficiarios", "Donadores", "Postulantes", "Reportes", "Configuración"].map((mod) => (
              <div
                key={mod}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-100 px-3 py-2 rounded-xl shadow-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {mod}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}