import { useState, useEffect, useMemo } from "react";

import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";
import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import FiltrosReporte from "../../../components/tablas/FiltrosAvanzados";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";
import AvatarGeneral from "../../../components/shared/AvatarGeneral";
import { useReporteObligaciones } from "../hooks/useReporteBeneficiariosObligaciones";
import kidsAnimation from "../../../assets/imagenes/kid.json";
import Lottie from "lottie-react";

import { CheckCircle2, AlertCircle, FileText, ClipboardList, FileSpreadsheet } from "lucide-react";

export default function ReporteObligacionesTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { state, actions, loading } = useReporteObligaciones();
  const { search, periodo, tipoObligacion, estatus, dataFiltrada, periodosOptions } = state;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, periodo, tipoObligacion, estatus]);
  

  const stats = useMemo(() => {
    const total = dataFiltrada.length;
    const cumplidas = dataFiltrada.filter((o) => o.estatus === "Cumplio").length;
    const pendientes = total - cumplidas;

    return { total, cumplidas, pendientes };
  }, [dataFiltrada]);

  const totalPages = Math.max(1, Math.ceil(dataFiltrada.length / pageSize));
  const dataPaginada = dataFiltrada.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const COLUMNS = [
    { key: "beneficiario", label: "Beneficiario" },
    { key: "tipo", label: "Tipo" },
    { key: "estatus", label: "Estatus" },
    { key: "fecha", label: "Fecha Programada" },
  ];

  const renderCell = (item, key) => {
    switch (key) {
      case "beneficiario":
        return <div className="font-semibold text-slate-800">{item.nombre_completo}</div>;
      case "tipo":
        return <span className="text-sm capitalize">{item.tipo === "servicioSocial" ? "Servicio Social" : "Carta"}</span>;
      case "estatus":
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            item.estatus === "Cumplio" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}>
            {item.estatus}
          </span>
        );
      case "fecha":
        return <span className="text-sm text-slate-600">{item.fecha}</span>;
      default:
        return item[key] ?? "--";
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
          Cargando y estructurando reporte De Obligaciones...
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          { label: "Total Obligaciones", value: stats.total, icon: ClipboardList, color: "blue" },
          { label: "Cumplidas", value: stats.cumplidas, icon: CheckCircle2, color: "emerald" },
          { label: "Pendientes", value: stats.pendientes, icon: AlertCircle, color: "amber" },
        ]}
      />

      <Card>
        <FiltrosReporte
          searchValue={search}
          onSearchChange={actions.setSearch}
          filters={[
            { key: "periodo", label: "Periodo", value: periodo, onChange: actions.setPeriodo, options: periodosOptions },
            { 
              key: "tipo", label: "Tipo", value: tipoObligacion, onChange: actions.setTipoObligacion, 
              options: [{ value: "", label: "Todos" }, { value: "servicioSocial", label: "Servicio Social" }, { value: "carta", label: "Carta" }] 
            },
            { 
              key: "estatus", label: "Estatus", value: estatus, onChange: actions.setEstatus, 
              options: [{ value: "", label: "Todos" }, { value: "Cumplio", label: "Cumplió" }, { value: "Pendiente", label: "Pendiente" }] 
            }
          ]}
          extraAction={
            <div className="flex gap-2">
              <Boton variant="secondary" onClick={actions.descargarExcel}><FileSpreadsheet className="h-4 w-4" /> Excel</Boton>
              <Boton onClick={actions.descargarPDF}><FileText className="h-4 w-4" /> PDF</Boton>
            </div>
          }
        />

        <DatosTabla columns={COLUMNS} data={dataPaginada} renderCell={renderCell} />

        <PaginacionTabla 
          currentPage={currentPage} totalPages={totalPages} totalItems={dataFiltrada.length}
          onPageChange={setCurrentPage} onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
        />
      </Card>
    </div>
  );
}