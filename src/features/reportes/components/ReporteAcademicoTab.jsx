import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import { useReporteBeneficiariosAcademico } from "../hooks/useReporteBeneficiariosAcademico";
import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";
import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import FiltrosReporte from "../../../components/tablas/FiltrosAvanzados";
import AvatarGeneral from "../../../components/shared/AvatarGeneral";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";
import kidsAnimation from "../../../assets/imagenes/kid.json";
import Lottie from "lottie-react";
import { ui } from "../../../styles/ui/index";

import {
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  HeartHandshake,
  Camera,
  Folder,
  FileText,
  Coins,
  Utensils,
  SlidersHorizontal,
  FileSpreadsheet,
  MoreVertical,
  Eye
} from "lucide-react";

// columnas
const COLUMNS = [
  { key: "beneficiarios", label: "Beneficiario" },
  { key: "escuela", label: "Escuela" },
  { key: "escolaridad", label: "Escolaridad" },
  { key: "promedio", label: "Promedio" },
  { key: "rendimiento", label: "Rendimiento" },
];

export default function ReporteAcademicoTab() {

  const navigate = useNavigate();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const advancedRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [menuData, setMenuData] = useState({
    id: null,
    top: 0,
    right: 0,
    haciaArriba: false
  });
  const [descargando, setDescargando] = useState(false);

  const descargarExcel = async () => {
    if (descargando) return;

    try {
      setDescargando(true);
      await actions.descargarExcel();
    } finally {
      setDescargando(false);
    }
  };

  const descargarPDF = async () => {
    if (descargando) return;

    try {
      setDescargando(true);
      await actions.descargarPDF();
    } finally {
      setDescargando(false);
    }
  };

  const { state, actions, loading } = useReporteBeneficiariosAcademico();

  const {
    search,
    periodo,
    estatus,
    nivel,
    rendimiento,
    dataFiltrada,
    stats,
    periodosOptions,
    graficaRendimiento,
    graficaPromedioNivel,
  } = state;


  useEffect(() => {
    setCurrentPage(1);
  }, [search, periodo, estatus, nivel, rendimiento]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showAdvanced &&
        advancedRef.current &&
        !advancedRef.current.contains(event.target)
      ) {
        setShowAdvanced(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAdvanced]);
  // para el menu
  const handleToggleMenu = (e, id) => {
    if (menuData.id === id) {
      setMenuData({ id: null, top: 0, right: 0, haciaArriba: false });
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const alturaMenu = 380;
      const espacioDisponibleAbajo = window.innerHeight - rect.bottom;
      const abrirHaciaArriba = espacioDisponibleAbajo < alturaMenu;
      setMenuData({
        id: id,
        top: abrirHaciaArriba ? rect.top + window.scrollY : rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right,
        haciaArriba: abrirHaciaArriba
      });
    }
  };

  const irASeccion = (idBeneficiario, tabName) => {
    setMenuData({ id: null, top: 0, right: 0, haciaArriba: false });
    navigate(`/App/beneficiarios/expediente/${idBeneficiario}?tab=${tabName}`);
  };

  const renderCell = (item, key) => {
    switch (key) {
      case "beneficiarios":
        return (
          <div className="flex items-center gap-3">
            <AvatarGeneral nombre={item.nombre_completo} />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-800 truncate">
                {item.nombre_completo || "--"}
              </span>
              <span className="text-xs text-slate-500">
                {item.edad ? `${item.edad} años` : "--"}
              </span>
            </div>
          </div>
        );

      case "escolaridad":
        return <span className="text-sm font-medium text-slate-600">{item.escolaridad || "—"}</span>;

      case "escuela":
        return (
          <span className="text-sm font-medium text-slate-600">
            {item.escuela || "Sin Registro"}
          </span>
        );

      case "promedio":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-600">
              {item.promedio || "Sin Registro"}
            </span>
          </div>
        );
      case "rendimiento":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-600">
              {item.rendimiento || "Sin Registro"}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

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
          Cargando y estructurando reporte Academico...
        </p>

      </div>
    );
  }

  const opcionesFiltros = [
    { key: "periodo", label: "Periodo", value: periodo, onChange: actions.setPeriodo, options: periodosOptions },
    {
      key: "estatus",
      label: "Estatus",
      value: estatus,
      onChange: actions.setEstatus,
      options: [
        { value: "", label: "Todos los estatus" },
        { value: "Activo", label: "Activo" },
        { value: "Inactivo", label: "Inactivo" },
        { value: "Finalizado", label: "Graduado" },
      ],
    },
    {
      key: "nivel",
      label: "Nivel Escolar",
      value: nivel,
      onChange: actions.setNivel,
      options: [
        { value: "", label: "Todos los niveles" },
        { value: "preescolar", label: "Preescolar" },
        { value: "primaria", label: "Primaria" },
        { value: "secundaria", label: "Secundaria" },
        { value: "Media Superior", label: "Media Superior" },
        { value: "Superior", label: "Superior" },
      ],
    },
    {
      key: "rendimiento",
      label: "Rendimiento",
      value: rendimiento,
      onChange: actions.setRendimiento,
      options: [
        { value: "", label: "Todos los rendimientos" },
        { value: "bueno", label: "Bueno" },
        { value: "bajo", label: "Bajo" },
        { value: "regularizacion", label: "Regularización" },
      ],
    },
  ];

  const filtrosBasicos = opcionesFiltros.filter((f) => ["periodo", "estatus"].includes(f.key));
  const filtrosAvanzados = opcionesFiltros.filter((f) => ["nivel", "rendimiento"].includes(f.key));

  const totalPages = Math.max(
    1,
    Math.ceil(dataFiltrada.length / pageSize)
  );

  const dataPaginada = dataFiltrada.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          { label: "Total", value: stats.total, icon: Users, color: "blue" },
          { label: "Activos", value: stats.activos, icon: UserCheck, color: "emerald" },
          { label: "Inactivos", value: stats.inactivos, icon: UserX, color: "red" },
          { label: "Graduados", value: stats.graduados, icon: GraduationCap, color: "violet" },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-semibold mb-4">
            Distribución por Rendimiento Académico
          </h3>

          <div className="h-72">
            <Doughnut
              data={graficaRendimiento}
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

        <Card>
          <h3 className="text-sm font-semibold mb-4">
            Promedio por Nivel Educativo
          </h3>

          <div className="h-72">
            <Bar
              data={graficaPromedioNivel}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 10,
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>
      <Card>
        <FiltrosReporte
          searchValue={search}
          onSearchChange={actions.setSearch}
          searchPlaceholder="Buscar beneficiario..."
          showClearButton={false}
          filters={filtrosBasicos}
          extraAction={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative" ref={advancedRef}>
                <button
                  type="button"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className={`
                     ${ui?.filters?.select ||
                    "rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"}
                    min-w-[140px]
                    flex items-center justify-center gap-2
                     `}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {showAdvanced ? "Menos filtros" : "Más filtros"}
                </button>

                {showAdvanced && (
                  <>
                    {/* Fondo oscuro */}
                    <div
                      className="fixed inset-0 bg-black/30 z-40"
                      onClick={() => setShowAdvanced(false)}
                    />

                    {/* Modal móvil / Dropdown desktop */}
                    <div
                      className="
              fixed
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              w-[92vw]
              max-w-md
              max-h-[85vh]
              overflow-y-auto

              md:absolute
              md:left-auto
              md:right-0
              md:top-full
              md:w-80
              md:max-w-none
              md:translate-x-0
              md:translate-y-0
              md:mt-2

              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-xl
              z-50
            "
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">
                            Filtros avanzados
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            Refina el rendimiento y nivel académico.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowAdvanced(false)}
                          className="rounded-lg p-1 hover:bg-slate-100"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="mt-4 space-y-4">
                        {filtrosAvanzados.map((filter) => (
                          <div key={filter.key}>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              {filter.label}
                            </label>

                            <select
                              value={filter.value}
                              onChange={(e) => filter.onChange(e.target.value)}
                              className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-2
                      text-sm
                      text-slate-700
                      focus:border-slate-400
                      focus:outline-none
                    "
                            >
                              {filter.options.map((opt) => (
                                <option
                                  key={opt.value}
                                  value={opt.value}
                                >
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            actions.setNivel("");
                            actions.setRendimiento("");
                          }}
                          className="
                  flex-1
                  rounded-xl
                  border
                  border-slate-200
                  py-2
                  text-sm
                  font-medium
                  hover:bg-slate-50
                "
                        >
                          Limpiar
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowAdvanced(false)}
                          className="
                  flex-1
                  rounded-xl
                  bg-slate-900
                  py-2
                  text-sm
                  font-medium
                  text-white
                  hover:bg-slate-800
                "
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Boton
                type="button"
                variant="secondary"
                icon={<FileSpreadsheet className="h-4 w-4" />}
                onClick={() => {
                  if (!descargando) descargarExcel();
                }}
                disabled={descargando}
              >
                {descargando ? "Generando..." : "Excel"}
              </Boton>

              <Boton
                type="button"
                icon={<FileText className="h-4 w-4" />}
                onClick={() => {
                  if (!descargando) descargarPDF();
                }}
                disabled={descargando}
              >
                {descargando ? "Generando..." : "PDF"}
              </Boton>
            </div>
          }
        />

        <DatosTabla
          columns={COLUMNS}
          data={dataPaginada}
          renderCell={renderCell}
          rowKey="id_beneficiario"
        />

        <PaginacionTabla
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={dataFiltrada.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />

      </Card>
    </div>
  );
}
