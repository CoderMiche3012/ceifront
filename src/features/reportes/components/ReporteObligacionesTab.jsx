import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";

import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";
import { solicitarDescargaReporte } from "../services/reporteService";

import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  FileSpreadsheet,
} from "lucide-react";

import { obtenerBeneficiarios } from "../../beneficiarios/services/beneficiariosService";

/**
 * 🔥 MAPEO OBLIGACIONES (CON PERIODO)
 */
const mapObligaciones = (beneficiarios = []) => {
  const rows = [];

  beneficiarios.forEach((b) => {
    const nombre =
      b.expediente_resumen?.nombre_completo || "Sin nombre";

    (b.historial_seguimientos || []).forEach((seg) => {
      const obligaciones = seg?.obligaciones || [];

      obligaciones.forEach((o) => {
        rows.push({
          id_obligacion: o.id_obligacion,
          beneficiario: nombre,
          tipo: o.tipo,
          obligacion:
            o.tipo === "carta"
              ? "Carta Donante"
              : o.tipo === "servicio"
              ? "Servicio Social"
              : o.tipo || "N/A",

          estatus: o.estatus,
          fecha: o.fecha || "Sin fecha",

          // 🔥 CLAVE PARA FILTRO
          periodo: String(seg?.id_periodo || ""),
        });
      });
    });
  });

  return rows;
};

export default function ReporteObligacionesTab() {
  // =========================
  // DATA
  // =========================
  const { data: beneficiarios = [] } = useQuery({
    queryKey: ["beneficiarios"],
    queryFn: obtenerBeneficiarios,
  });

  // =========================
  // STATE FILTROS
  // =========================
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [estatus, setEstatus] = useState("");
  const [periodo, setPeriodo] = useState("");

  // =========================
  // DATA BASE
  // =========================
  const dataBase = useMemo(() => {
    return mapObligaciones(beneficiarios);
  }, [beneficiarios]);

  // =========================
  // FILTRADO REAL
  // =========================
  const dataFiltrada = useMemo(() => {
    return dataBase.filter((o) => {
      const matchSearch = search
        ? o.beneficiario.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchTipo = tipo ? o.tipo === tipo : true;

      const matchEstatus = estatus ? o.estatus === estatus : true;

      const matchPeriodo = periodo
        ? String(o.periodo) === String(periodo)
        : true;

      return matchSearch && matchTipo && matchEstatus && matchPeriodo;
    });
  }, [dataBase, search, tipo, estatus, periodo]);

  // =========================
  // STATS
  // =========================
  const stats = useMemo(() => {
    let total = 0;
    let entregadas = 0;
    let pendientes = 0;
    let canceladas = 0;

    dataFiltrada.forEach((o) => {
      total++;

      if (o.estatus === "Entregado") entregadas++;
      if (o.estatus === "Pendiente") pendientes++;
      if (o.estatus === "Cancelado") canceladas++;
    });

    return { total, entregadas, pendientes, canceladas };
  }, [dataFiltrada]);
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
          "obligaciones",
          "excel",
          dataFiltrada // ✅ FIX
        );
  
        ejecutarDescargaBlob(
          buffer,
          `obligaciones_${periodo || "todos"}.xlsx`,
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
          "obligaciones",
          "pdf",
          dataFiltrada // ✅ FIX
        );
  
        ejecutarDescargaBlob(
          buffer,
          `obligaciones_${periodo || "todos"}.pdf`,
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
            label: "Total Obligaciones",
            value: stats.total,
            icon: FileText,
            color: "blue",
          },
          {
            label: "Entregadas",
            value: stats.entregadas,
            icon: CheckCircle,
            color: "emerald",
          },
          {
            label: "Pendientes",
            value: stats.pendientes,
            icon: Clock,
            color: "amber",
          },
          {
            label: "Canceladas",
            value: stats.canceladas,
            icon: XCircle,
            color: "red",
          },
        ]}
      />

      <Card>

        {/* 🔎 FILTROS CON PERIODO */}
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
              key: "tipo",
              value: tipo,
              onChange: setTipo,
              options: [
                { value: "", label: "Todas las obligaciones" },
                { value: "carta", label: "Carta Donante" },
                { value: "servicio", label: "Servicio Social" },
              ],
            },
            {
              key: "estatus",
              value: estatus,
              onChange: setEstatus,
              options: [
                { value: "", label: "Todos los estatus" },
                { value: "Pendiente", label: "Pendiente" },
                { value: "Entregado", label: "Entregado" },
                { value: "Cancelado", label: "Cancelado" },
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
            { key: "obligacion", label: "Obligación" },
            { key: "estatus", label: "Estatus" },
            { key: "fecha", label: "Fecha" },
          ]}
          data={dataFiltrada}
          rowKey="id_obligacion"
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