import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";
import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";

import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";

import {
  Users,
  CalendarDays,
  Utensils,
  Brain,
  FileSpreadsheet,
} from "lucide-react";

import { obtenerBeneficiarios } from "../../beneficiarios/services/beneficiariosService";
import { solicitarDescargaReporte } from "../services/reporteService";

/**
 * 🔥 MAPEO USOS SERVICIOS
 */
const mapUsosServicios = (beneficiarios = []) => {
  const rows = [];

  beneficiarios.forEach((b) => {
    const nombre =
      b.expediente_resumen?.nombre_completo || "Sin nombre";

    (b.historial_seguimientos || []).forEach((seg) => {
      const usos = seg?.usos_servicios || [];

      usos.forEach((u) => {
        rows.push({
          id: `${b.id_beneficiario}-${u.id_servicio}`,
          beneficiario: nombre,

          tipo_servicio: u.tipo_servicio,

          numero_acompanantes: Number(u.numero_acompanantes || 0),

          fecha: u.fecha_realizacion,

          periodo: String(seg?.id_periodo || ""),

          mes: new Date(u.fecha_realizacion).getMonth() + 1,
        });
      });
    });
  });

  return rows;
};

export default function ReporteUsosServiciosTab() {
  // =========================
  // DATA
  // =========================
  const { data: beneficiarios = [] } = useQuery({
    queryKey: ["beneficiarios"],
    queryFn: obtenerBeneficiarios,
  });

  // =========================
  // FILTROS
  // =========================
  const [search, setSearch] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [mes, setMes] = useState("");
  const [tipo, setTipo] = useState("");

  // =========================
  // DATA BASE
  // =========================
  const dataBase = useMemo(() => {
    return mapUsosServicios(beneficiarios);
  }, [beneficiarios]);

  // =========================
  // FILTRO REAL
  // =========================
  const dataFiltrada = useMemo(() => {
    return dataBase.filter((u) => {
      const matchSearch = search
        ? u.beneficiario.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchPeriodo = periodo
        ? String(u.periodo) === String(periodo)
        : true;

      const matchMes = mes ? String(u.mes) === String(mes) : true;

      const matchTipo = tipo ? u.tipo_servicio === tipo : true;

      return matchSearch && matchPeriodo && matchMes && matchTipo;
    });
  }, [dataBase, search, periodo, mes, tipo]);

  // =========================
  // ESTADÍSTICAS
  // =========================
  const stats = useMemo(() => {
    let totalUsos = 0;
    let totalAcompanantes = 0;

    const beneficiariosUnicos = new Set();

    dataFiltrada.forEach((u) => {
      totalUsos += 1;
      totalAcompanantes += u.numero_acompanantes || 0;
      beneficiariosUnicos.add(u.beneficiario);
    });

    return {
      totalUsos,
      totalAcompanantes,
      beneficiarios: beneficiariosUnicos.size,
    };
  }, [dataFiltrada]);

  // =========================
  // OPTIONS MES
  // =========================
  const mesesOptions = [
    { value: "", label: "Todos los meses" },
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];
 const ejecutarDescargaBlob = (buffer, nombreArchivo, mimeType) => {
      if (!buffer) return;
  
      const realBuffer =
        buffer instanceof ArrayBuffer ? buffer : buffer.buffer;
  
      const blob = new Blob([realBuffer], { type: mimeType });
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
  
      a.href = url;
      a.download = nombreArchivo;
      a.click();
  
      window.URL.revokeObjectURL(url);
    };
  
    // EXCEL
    const descargarExcel = async () => {
      try {
        const buffer = await solicitarDescargaReporte(
          "asistencias",
          "excel",
          dataFiltrada // ✅ FIX
        );
  
        ejecutarDescargaBlob(
          buffer,
          `asistencias_${periodo || "todos"}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
      } catch (error) {
        console.error("Error Excel:", error);
      }
    };
  
    // PDF
    const descargarPDF = async () => {
      try {
        const buffer = await solicitarDescargaReporte(
          "asistencias",
          "pdf",
          dataFiltrada // ✅ FIX
        );
  
        ejecutarDescargaBlob(
          buffer,
          `asistencias_${periodo || "todos"}.pdf`,
          "application/pdf"
        );
      } catch (error) {
        console.error("Error PDF:", error);
      }
    };
  
  return (
    <div className="space-y-6">

      {/* 📊 TARJETAS */}
      <TarjetasEstadisticas
        items={[
          {
            label: "Total Usos",
            value: stats.totalUsos,
            icon: CalendarDays,
            color: "blue",
          },
          {
            label: "Acompañantes Totales",
            value: stats.totalAcompanantes,
            icon: Users,
            color: "emerald",
          },
          {
            label: "Beneficiarios",
            value: stats.beneficiarios,
            icon: Users,
            color: "violet",
          },
        ]}
      />

      <Card>

        {/* 🔎 FILTROS */}
        <FiltrosReporte
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar beneficiario..."
          filtros={[
            {
              key: "periodo",
              value: periodo,
              onChange: setPeriodo,
              options: [
                { value: "", label: "Todos los periodos" },
                { value: "1", label: "2024 - 2025" },
              ],
            },
            {
              key: "mes",
              value: mes,
              onChange: setMes,
              options: mesesOptions,
            },
            {
              key: "tipo",
              value: tipo,
              onChange: setTipo,
              options: [
                { value: "", label: "Todos los servicios" },
                { value: "comedor", label: "Comedor" },
                { value: "psicologia", label: "Psicología" },
              ],
            },
          ]}
          acciones={[
            {
              component: Boton,
              variant: "secondary",
              icon: FileSpreadsheet,
              label: "Exportar Excel",
              onClick: descargarExcel,
            },
          ]}
        />

        {/* 📋 TABLA */}
        <DatosTabla
          columns={[
            { key: "beneficiario", label: "Beneficiario" },
            { key: "tipo_servicio", label: "Servicio" },
            { key: "numero_acompanantes", label: "Acompañantes" },
            { key: "fecha", label: "Fecha" },
          ]}
          data={dataFiltrada}
          rowKey="id"
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