import { useState, useEffect, useMemo } from "react";
import { useReporteBeneficiariosEconomico } from "../hooks/useReporteBeneficiariosApoyos";

import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";
import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import FiltrosReporte from "../../../components/tablas/FiltrosAvanzados";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";
import AvatarGeneral from "../../../components/shared/AvatarGeneral";
import kidsAnimation from "../../../assets/imagenes/kid.json";
import Lottie from "lottie-react";

import {
  HandCoins,
  Wallet,
  Clock3,
  Users,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

export default function ReporteApoyosEconomicosTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { state, actions, loading } = useReporteBeneficiariosEconomico();

  const { search, periodo, estatus, dataFiltrada, periodosOptions } = state;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, periodo, estatus]);

  const stats = useMemo(() => {
    let totalApoyos = 0;
    let entregado = 0;
    let pendiente = 0;
    const beneficiarios = new Set();

    dataFiltrada.forEach((b) => {
      totalApoyos += b.total_registrados || 0;
      entregado += b.total_entregados || 0;
      pendiente += b.total_pendientes || 0;
      beneficiarios.add(b.id_beneficiario);
    });

    return {
      totalApoyos,
      entregado,
      pendiente,
      beneficiarios: beneficiarios.size,
    };
  }, [dataFiltrada]);

  const totalPages = Math.max(1, Math.ceil(dataFiltrada.length / pageSize));

  const dataPaginada = dataFiltrada.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Definición de columnas
  const COLUMNS = [
    { key: "beneficiario", label: "Beneficiario" },
    { key: "total_registrados", label: "Apoyos Registrados" },
    { key: "total_entregados", label: "Entregados" },
    { key: "total_pendientes", label: "Pendientes" },
    { key: "fecha_ultimo_apoyo", label: "Último Apoyo Recibido" },
  ];

  // Función para renderizar celdas con lógica personalizada
  const renderCell = (item, key) => {
    switch (key) {
      case "beneficiario":
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
      case "total_registrados":
      case "total_entregados":
      case "total_pendientes":
        return <span className="font-medium text-slate-700">{item[key] ?? 0}</span>;
      case "fecha_ultimo_apoyo":
        return <span className="text-sm text-slate-600">{item[key] || "Sin Registro"}</span>;
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
          Cargando y estructurando reporte De Reembolsos...
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          { label: "Total de Apoyos", value: stats.totalApoyos, icon: HandCoins, color: "blue" },
          { label: "Entregados", value: stats.entregado, icon: Wallet, color: "emerald" },
          { label: "Pendientes", value: stats.pendiente, icon: Clock3, color: "amber" },
          { label: "Beneficiarios", value: stats.beneficiarios, icon: Users, color: "violet" },
        ]}
      />

      <Card>
        <FiltrosReporte
          searchValue={search}
          onSearchChange={actions.setSearch}
          searchPlaceholder="Buscar beneficiario..."
          showClearButton={false}
          filters={[
            { key: "periodo", label: "Periodo", value: periodo, onChange: actions.setPeriodo, options: periodosOptions },
            { 
              key: "estatus", 
              label: "Estatus", 
              value: estatus, 
              onChange: actions.setEstatus, 
              options: [
                { value: "", label: "Todos" },
                { value: "Entregado", label: "Entregado" },
                { value: "Pendiente", label: "Pendiente" },
              ] 
            },
          ]}
          extraAction={
            <div className="flex items-center gap-2">
              <Boton variant="secondary" icon={<FileSpreadsheet className="h-4 w-4" />} onClick={actions.descargarExcel}>Excel</Boton>
              <Boton icon={<FileText className="h-4 w-4" />} onClick={actions.descargarPDF}>PDF</Boton>
            </div>
          }
        />

        <DatosTabla
          columns={COLUMNS}
          data={dataPaginada}
          rowKey="id_beneficiario"
          renderCell={renderCell}
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