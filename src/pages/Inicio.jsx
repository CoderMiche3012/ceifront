import { useEffect, useState, useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";

import { useNavigate } from "react-router-dom";
import { useBeneficiariosPage } from "../features/beneficiarios/hooks/useBeneficiariosPage";
import { obtenerVisitas } from "../features/postulantes/services/visitasService";
import { usePermissions } from "../context/PermissionsContext";
import { usePeriodoActivo } from "../features/periodos/hooks/usePeriodos";
import { useBeneficiarios } from "../features/beneficiarios/hooks/useBeneficiarios";
import Card from "../components/ui/Card";
import { obtenerUsuario } from "../storage/userStorage";
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
  ChevronRight,
  UserCircle
} from "lucide-react";
const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return "";
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};
const normalizarNivel = (nivel = "") => {
  const valor = nivel
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (
    ["prepa", "preparatoria", "bachillerato"].includes(valor)
  ) {
    return "media superior";
  }

  if (
    ["universidad", "licenciatura"].includes(valor)
  ) {
    return "superior";
  }

  return valor;
};

const formatearNivel = (nivel = "") => {
  const valor = normalizarNivel(nivel);

  const nombres = {
    preescolar: "Preescolar",
    primaria: "Primaria",
    secundaria: "Secundaria",
    "media superior": "Media Superior",
    superior: "Superior",
  };

  return nombres[valor] || nivel;
};

export default function Inicio() {
  const navigate = useNavigate();
  const usuarioActual = obtenerUsuario();
  const nombreCompleto = [
    usuarioActual?.nombre,
    usuarioActual?.apellido_p,
    usuarioActual?.apellido_m
  ]
    .filter(Boolean)
    .join(" ");

  const frases = [
    "Cada registro representa una oportunidad de mejora en la atención a la comunidad.",
    "El seguimiento oportuno permite brindar una atención más efectiva y humana.",
    "La calidad en los procesos contribuye al bienestar de la población atendida.",
  ];

  const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];

  const { periodoActivo, loading: loadingPeriodo } = usePeriodoActivo();

  const {
    data: beneficiariosPeriodo = [],
    isLoading: loadingBeneficiariosPeriodo,
  } = useBeneficiarios(periodoActivo?.id_periodo);

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
  const canViewPostulantes = useMemo(
    () => hasModulePermission("postulantes", "ver"),
    [hasModulePermission]
  );
  const canEditPostulantes = useMemo(
    () => hasModulePermission("postulantes", "crear"),
    [hasModulePermission]
  );
  const verVisitas = canCreatePostulantes && canEditPostulantes
  const canCreateDonadores = useMemo(
    () => hasModulePermission("donadores", "crear"),
    [hasModulePermission]
  );

  const canCreateBeneficiarios = useMemo(
    () => hasModulePermission("beneficiarios", "crear"),
    [hasModulePermission]
  );
  const canViewBeneficiarios = useMemo(
    () => hasModulePermission("beneficiarios", "ver"),
    [hasModulePermission]
  );


  const puedeVerGraficas = canViewBeneficiarios;

  const tieneAccionesRapidas =
    canCreateBeneficiarios ||
    canCreatePostulantes ||
    canCreateDonadores
    ;

  const soloDonadores =
    canCreateDonadores &&
    !canViewBeneficiarios &&
    !canCreateBeneficiarios &&
    !canViewPostulantes;

  const tieneContenidoDashboard =
    canViewBeneficiarios ||
    canCreateBeneficiarios ||
    verVisitas;

  const soloPostulantes =
    canViewPostulantes &&
    !canViewBeneficiarios &&
    !canCreateBeneficiarios &&
    !canCreateDonadores;

  const accesoLimitado = soloDonadores || soloPostulantes;

  const graficaEscolaridad = useMemo(() => {
    const niveles = {};

    beneficiariosPeriodo.forEach((b) => {
      const seg = b?.ultimo_seguimiento || b?.seguimiento || {};
      const datosEscolares = seg?.datos_escolares || {};

      let nivel = "";

      if (datosEscolares?.id_escolaridad) {
        nivel = formatearNivel(
          datosEscolares.id_escolaridad.nivel_escolar
        );
      } else if (datosEscolares?.nivel) {
        nivel = formatearNivel(datosEscolares.nivel);
      }

      if (!nivel) return;

      niveles[nivel] = (niveles[nivel] || 0) + 1;
    });

    return {
      labels: Object.keys(niveles),
      datasets: [
        {
          data: Object.values(niveles),
          backgroundColor: [
            "#99F6E4", // Teal pastel
            "#BAE6FD", // Azul pastel
            "#C4B5FD", // Violeta pastel
            "#FBCFE8", // Rosa pastel
            "#FDE68A", // Amarillo pastel
            "#FED7AA", // Naranja pastel
          ],
          borderColor: "#FFFFFF",
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    };
  }, [beneficiariosPeriodo]);

  const graficaEdades = useMemo(() => {
    const edades = {
      "0-5": 0,
      "6-10": 0,
      "11-15": 0,
      "16-18": 0,
      "19+": 0,
    };

    beneficiariosPeriodo.forEach((b) => {
      const edad = calcularEdad(
        b?.expediente_resumen?.fecha_nacimiento
      );

      if (!edad) return;

      if (edad <= 5) edades["0-5"]++;
      else if (edad <= 10) edades["6-10"]++;
      else if (edad <= 15) edades["11-15"]++;
      else if (edad <= 18) edades["16-18"]++;
      else edades["19+"]++;
    });

    return {
      labels: Object.keys(edades),
      datasets: [
        {
          label: "Beneficiarios",
          data: Object.values(edades),
          backgroundColor: "#0d6f6b",
        },
      ],
    };
  }, [beneficiariosPeriodo]);

  useEffect(() => {
    let isMounted = true;

    async function cargarVisitas() {
      try {
        setLoadingVisitas(true);

        const respuesta = await obtenerVisitas();

        const dataVisitas = Array.isArray(respuesta)
          ? respuesta
          : respuesta?.data || [];

        if (isMounted) {
          setVisitas(dataVisitas);
        }
      } catch (error) {
        alert("Error al obtener visitas");
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
    return beneficiariosPeriodo.reduce((acc, b) => {
      const ultimoSeguimiento = b.seguimientos && b.seguimientos.length > 0
        ? b.seguimientos[b.seguimientos.length - 1]
        : null;
      const esActivo = b.estatus === "Activo";
      if (esActivo) acc.activos++;

      const tieneDonador = b.id_donador || b.donador || b.tieneDonador;
      if (esActivo && !tieneDonador) acc.sinDonador++;

      if (b.fecha_ingreso) {
        const fechaIngreso = new Date(b.fecha_ingreso);
        if (fechaIngreso.getMonth() === mesActual && fechaIngreso.getFullYear() === anioActual) {
          acc.nuevosIngresos++;
        }
      }

      const esBaja = b.estatus === "Inactivo";
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

  const CardInterno = ({ title, value, icon: Icon, type = "default", loading = false }) => {
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
        <div className="flex items-center gap-3">

          <div className="p-5 rounded-2xl bg-teal-50 border border-teal-100">
            <UserCircle className="w-12 h-12 text-teal-600" />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bienvenido, {nombreCompleto}
            </h2>

            <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
              {fraseAleatoria}
            </p>
          </div>

        </div>
      </div>
      {!tieneContenidoDashboard ? (
        accesoLimitado ? (
          soloDonadores ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-200">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <Users className="h-10 w-10 text-emerald-600" />
              </div>

              <h3 className="text-2xl font-bold text-slate-800">
                Acceso limitado al sistema
              </h3>

              <p className="mt-4 max-w-2xl mx-auto text-slate-600 leading-relaxed">
                Actualmente tienes acceso únicamente al módulo de <strong>donadores</strong>.
                Desde aquí podrás administrar la información disponible en ese apartado.
              </p>

              <p className="mt-3 max-w-2xl mx-auto text-slate-500 leading-relaxed">
                Si necesitas acceder a más módulos solicita permisos adicionales al administrador.
              </p>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => navigate("/app/donadores")}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
                >
                  Ir a Donadores
                </button>
              </div>
            </div>
          ) : soloPostulantes ? (
            <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-200">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <UserPlus className="h-10 w-10 text-indigo-600" />
              </div>

              <h3 className="text-2xl font-bold text-slate-800">
                Acceso limitado al sistema
              </h3>

              <p className="mt-4 max-w-2xl mx-auto text-slate-600 leading-relaxed">
                Actualmente tienes acceso únicamente al módulo de <strong>Nuevos Ingresos</strong>.
                Desde aquí podrás gestionar registros y seguimiento de postulantes.
              </p>

              <p className="mt-3 max-w-2xl mx-auto text-slate-500 leading-relaxed">
                Si necesitas acceso a beneficiarios, reportes o visitas, solicita permisos adicionales.
              </p>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => navigate("/app/ingresos")}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
                >
                  Ir a Nuevos Ingresos
                </button>
              </div>
            </div>
          ) : null
        ) : (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-200">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
              <LayoutGrid className="h-10 w-10 text-teal-600" />
            </div>

            <h3 className="text-2xl font-bold text-slate-800">
              Bienvenido al Sistema de Gestión
            </h3>

            <p className="mt-4 max-w-2xl mx-auto text-slate-600 leading-relaxed">
              Este sistema ha sido diseñado para facilitar la administración y el
              seguimiento de beneficiarios, postulantes, donadores, visitas y demás
              procesos relacionados con la operación de la organización.
            </p>
          </div>
        )
      ) : (
        <>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {canViewBeneficiarios && (
              <CardInterno
                title="Beneficiarios Activos"
                value={metrics.activos}
                icon={Users}
                type="default"
                loading={loadingBeneficiarios}
              />
            )}
            {canViewBeneficiarios && (
              <CardInterno
                title="Sin Donador"
                value={metrics.sinDonador}
                icon={UserX}
                type="danger"
                loading={loadingBeneficiarios}
              />
            )}
            {canViewBeneficiarios && (
              <CardInterno
                title="Ingresos del Mes"
                value={metrics.nuevosIngresos}
                icon={UserPlus}
                type="success"
                loading={loadingBeneficiarios}
              />
            )}
            {canViewBeneficiarios && (
              <CardInterno
                title="Casos de Baja"
                value={metrics.bajas}
                icon={UserMinus}
                type="warning"
                loading={loadingBeneficiarios}
              />
            )}
          </div>
          {canViewBeneficiarios && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <h3 className="text-sm font-semibold mb-4">
                  Distribución por edades
                </h3>

                <div className="h-72">
                  <Bar
                    data={graficaEdades}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                  />
                </div>
              </Card>


              <Card>
                <h3 className="text-sm font-semibold mb-4">
                  Nivel educativo
                </h3>

                <div className="h-72">
                  <Doughnut
                    data={graficaEscolaridad}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </div>
              </Card>
            </div>
          )}


          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
            {tieneAccionesRapidas && !soloDonadores && (
              < div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
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
            )}
            {verVisitas && (
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
            )}

          </div>
        </>
      )}
    </section>
  );
}

