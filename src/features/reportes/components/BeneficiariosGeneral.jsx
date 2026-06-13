import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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

// 📋 COLUMNAS FIJAS: Ya no agregamos dinámicamente la columna Periodo horizontalmente
const COLUMNS = [
  { key: "beneficiarios", label: "Beneficiarios" },
  { key: "escolaridad", label: "Escolaridad" },
  { key: "escuela", label: "Escuela" },
  { key: "promedio", label: "Promedio" },
  { key: "estatus", label: "Estatus" },
  { key: "donador", label: "Donador" },
];

export default function ReporteBeneficiariosTab() {
  const navigate = useNavigate();
  const { state, actions, loading } = useReporteBeneficiarios();
  const { search, periodo, estatus, nivel, rendimiento, dataFiltrada, stats, periodosOptions } = state;

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [menuData, setMenuData] = useState({ id: null, top: 0, right: 0, haciaArriba: false });

  // Manejo del menú desplegable inteligente (Acciones)
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

  // 🎨 RENDERIZADO DE CELDAS ACTUALIZADO
  const renderCell = (item, key) => {
    switch (key) {
      case "beneficiarios":
        return (
          <div className="flex items-center gap-3">
            <AvatarGeneral nombre={item.nombre_completo} />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-800 uppercase truncate">
                {item.nombre_completo || "--"}
              </span>
              <span className="text-xs text-slate-500">
                {item.edad ? `${item.edad} años` : "--"}
              </span>
            </div>
          </div>
        );

      case "escolaridad":
        return <span className="text-sm font-medium text-slate-600 uppercase">{item.escolaridad || "—"}</span>;

      case "escuela":
        return <span className="text-sm font-medium text-slate-600 uppercase truncate max-w-[180px] block">{item.escuela || "—"}</span>;

      case "promedio": {
        const promedioFinal = item.promedio;
        const valorNumerico = parseFloat(promedioFinal);
        let color = "text-slate-500";

        // 🎨 Aplicación de colores limpia basada en el valor ya calculado por el hook
        if (promedioFinal !== "—" && !isNaN(valorNumerico)) {
          if (valorNumerico < 7.5) color = "text-red-600";
          else if (valorNumerico < 8) color = "text-amber-600";
          else color = "text-emerald-600";
        }
        return <span className={`text-sm font-bold ${color}`}>{promedioFinal}</span>;
      }

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
            <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${estilo}`}>
              {item.estatus || "—"}
            </span>
            {/* 🚀 Muestra el periodo abajo solo si no hay un periodo seleccionado en los filtros ("Todos") */}
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
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase truncate max-w-[120px] ${estilo}`}>
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
        { value: "preparatoria", label: "Preparatoria" },
        { value: "universidad", label: "Universidad" },
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

      <Card>
        <FiltrosReporte
          searchValue={search}
          onSearchChange={actions.setSearch}
          searchPlaceholder="Buscar beneficiario..."
          showClearButton={false}
          filters={filtrosBasicos} 
          extraAction={
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className={`
                    ${ui?.filters?.select || "rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"}
                    min-w-[140px]
                    flex items-center justify-center gap-2
                    transition-colors
                  `}
                >
                  <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                  {showAdvanced ? "Menos filtros" : "Más filtros"}
                </button>

                {showAdvanced && (
                  <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl p-4 z-50">
                    <h3 className="text-sm font-semibold text-slate-800">Filtros avanzados</h3>
                    <p className="mt-1 text-xs text-slate-500">Refina el rendimiento y nivel académico.</p>

                    <div className="mt-4 space-y-4">
                      {filtrosAvanzados.map((filter) => (
                        <div key={filter.key}>
                          <label className="mb-1 block text-xs font-medium text-slate-600">
                            {filter.label}
                          </label>
                          <select
                            value={filter.value}
                            onChange={(e) => filter.onChange(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none text-slate-700"
                          >
                            {filter.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Boton
                variant="secondary"
                icon={<FileSpreadsheet className="h-4 w-4" />}
                onClick={actions.descargarExcel}
              >
                Excel
              </Boton>

              <Boton
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
          data={dataFiltrada}
          renderCell={renderCell}
          rowKey="id_beneficiario"
        />

        <PaginacionTabla
          currentPage={1}
          totalPages={1}
          totalItems={dataFiltrada.length}
          pageSize={10}
          onPageChange={() => {}}
        />
      </Card>
    </div>
  );
}