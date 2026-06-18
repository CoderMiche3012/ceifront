import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";

import { useReporteBeneficiarios } from "./../hooks/useReporteBeneficiarios";

import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";
import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import FiltrosReporte from "../../../components/tablas/FiltrosAvanzados";
import AvatarGeneral from "../../../components/shared/AvatarGeneral";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";

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
  { key: "escolaridad", label: "Escolaridad" },
  { key: "municipio", label: "Municipio" },
  { key: "tutor", label: "Tutor" },
  { key: "estatus", label: "Estatus" },
  { key: "donador", label: "Donador" },
];

export default function ReporteBeneficiariosTab() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { state, actions, loading } = useReporteBeneficiarios();
  const {
    search,
    periodo,
    estatus,
    nivel,
    rendimiento,
    dataFiltrada,
    stats,
    periodosOptions,
    graficaEdades,
    graficaEscolaridad,
  } = state;

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [menuData, setMenuData] = useState({ id: null, top: 0, right: 0, haciaArriba: false });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, periodo, estatus, nivel, rendimiento]);

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
              <span className="text-xs text-slate-500 ">
                {item.edad ? `${item.edad} años` : "--"}
              </span>
            </div>
          </div>
        );

      case "escolaridad":
        return <span className="text-sm font-medium text-slate-600 ">{item.escolaridad || "—"}</span>;

      case "municipio":
        return (
          <span className="text-sm text-slate-600 ">
            {item.municipio || "Sin Registro"}
          </span>
        );

      case "tutor":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-600">
              {item.tutor || "Sin Registro"}
            </span>

            <span className="text-xs text-slate-500">
              {item.telefono_tutor || "Sin Teléfono"}
            </span>
          </div>
        );

      case "estatus": {
        const estatusNormalizado = item.estatus?.toLowerCase();
        const configEstatus = {
          activo: "bg-amber-100 text-amber-700 border-amber-200",
          inactivo: "bg-slate-100 text-slate-600 border-slate-200",
          finalizado: "bg-violet-100 text-violet-700 border-violet-200",
          graduado: "bg-violet-100 text-violet-700 border-violet-200",
        };
        const estilo = configEstatus[estatusNormalizado] || "bg-slate-100 text-slate-600 border-slate-200";

        return (
          <div className="flex flex-col gap-0.5">
            <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${estilo}`}>
              {item.estatus || "—"}
            </span>
            {periodo === "" && (
              <span className="text-[11px] text-slate-400 font-medium pl-1 truncate max-w-[120px]">
                {item.periodo_nombre || "—"}
              </span>
            )}
          </div>
        );
      }

      case "donador": {
        const tieneDonador = item.donador === "Con donador";
        const estilo = tieneDonador ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-amber-100 text-amber-700 border-amber-200";
        return (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold truncate max-w-[120px] ${estilo}`}>
            {item.donador}
          </span>
        );
      }
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-semibold text-slate-500">
        Cargando y estructurando reporte de beneficiarios...
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

  const filtrosBasicos = opcionesFiltros.filter((f) => ["periodo", "estatus", "nivel"].includes(f.key));

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
      <Card>
        <FiltrosReporte
          searchValue={search}
          onSearchChange={actions.setSearch}
          searchPlaceholder="Buscar beneficiario..."
          showClearButton={false}
          filters={filtrosBasicos}
          extraAction={
            <div className="flex items-center gap-2">
              <Boton
                type="button"
                variant="secondary"
                icon={<FileSpreadsheet className="h-4 w-4" />}
                onClick={actions.descargarExcel}
              >
                Excel
              </Boton>

              <Boton
                type="button"
                icon={<FileText className="h-4 w-4" />}
                onClick={actions.descargarPDF}
              >
                PDF
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
