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
  HandCoins,
  Wallet,
  Clock3,
  Users,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import { obtenerBeneficiarios } from "../../beneficiarios/services/beneficiariosService";
import { obtenerPeriodos } from "../../periodos/services/periodoService";

/**
 * 🔥 MAPEO CON PERIODO
 */
const mapApoyos = (beneficiarios = [], periodo) => {
  const rows = [];

  beneficiarios.forEach((b) => {
    const seguimiento =
      b.historial_seguimientos?.find(
        (s) => String(s.id_periodo) === String(periodo)
      ) || b.historial_seguimientos?.[0];

    const apoyos = seguimiento?.apoyos_economicos || [];

    const nombre =
      b.expediente_resumen?.nombre_completo || "Sin nombre";

    let total = 0;
    let entregados = 0;
    let pendientes = 0;

    apoyos.forEach((a) => {
      const monto = Number(a.monto || 0);

      total += monto;

      if (a.estatus === "Entregado") entregados++;
      if (a.estatus === "Pendiente") pendientes++;
    });

    rows.push({
      id_beneficiario: b.id_beneficiario,
      beneficiario: nombre,
      periodo:
        seguimiento?.periodo?.ciclo_escolar || "Sin periodo",
      total_recibido: total,
      apoyos_entregados: entregados,
      apoyos_pendientes: pendientes,
      ultimo_apoyo:
        apoyos.length > 0
          ? apoyos[apoyos.length - 1].fecha_entrega ||
            apoyos[apoyos.length - 1].fecha_creacion
          : "N/A",
    });
  });

  return rows;
};

export default function ReporteApoyosEconomicosTab() {
  // =========================
  // DATA
  // =========================
  const { data: beneficiarios = [] } = useQuery({
    queryKey: ["beneficiarios"],
    queryFn: obtenerBeneficiarios,
  });

  // 🔥 AQUÍ YA TRAES PERIODOS
  const { data: periodos = [] } = useQuery({
    queryKey: ["periodos"],
    queryFn: obtenerPeriodos,
  });

  // =========================
  // FILTROS STATE
  // =========================
  const [periodo, setPeriodo] = useState("");
  const [estatus, setEstatus] = useState("");
  const [search, setSearch] = useState("");

  // =========================
  // DATA BASE
  // =========================
  const dataBase = useMemo(() => {
    return mapApoyos(beneficiarios, periodo);
  }, [beneficiarios, periodo]);

  // =========================
  // FILTRO FINAL
  // =========================
  const dataFiltrada = useMemo(() => {
    return dataBase.filter((b) => {
      const matchSearch = search
        ? b.beneficiario.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchEstatus =
        estatus === ""
          ? true
          : estatus === "Entregado"
          ? b.apoyos_entregados > 0
          : estatus === "Pendiente"
          ? b.apoyos_pendientes > 0
          : true;

      return matchSearch && matchEstatus;
    });
  }, [dataBase, search, estatus]);

  // =========================
  // STATS
  // =========================
  const stats = useMemo(() => {
    let totalApoyos = 0;
    let entregado = 0;
    let pendiente = 0;
    let beneficiariosUnicos = new Set();

    dataFiltrada.forEach((b) => {
      totalApoyos +=
        (b.apoyos_entregados || 0) +
        (b.apoyos_pendientes || 0);

      entregado += b.apoyos_entregados || 0;
      pendiente += b.apoyos_pendientes || 0;

      beneficiariosUnicos.add(b.id_beneficiario);
    });

    return {
      totalApoyos,
      entregado,
      pendiente,
      beneficiarios: beneficiariosUnicos.size,
    };
  }, [dataFiltrada]);

  // =========================
  // OPTIONS PERIODOS (🔥 NUEVO)
  // =========================
  const periodosOptions = useMemo(() => {
    return [
      { value: "", label: "Todos los periodos" },
      ...periodos.map((p) => ({
        value: p.id_periodo,
        label: p.ciclo_escolar,
      })),
    ];
  }, [periodos]);
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
          "apoyos",
          "excel",
          dataFiltrada // ✅ FIX
        );
  
        ejecutarDescargaBlob(
          buffer,
          `apoyos_${periodo || "todos"}.xlsx`,
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
          "apoyos",
          "pdf",
          dataFiltrada // ✅ FIX
        );
  
        ejecutarDescargaBlob(
          buffer,
          `apoyos_${periodo || "todos"}.pdf`,
          "application/pdf"
        );
      } catch (error) {
        console.error("Error PDF:", error);
      }
    };
  

  return (
    <div className="space-y-6">

      {/* =========================
          TARJETAS
      ========================= */}
      <TarjetasEstadisticas
        items={[
          {
            label: "Total de Apoyos",
            value: stats.totalApoyos,
            icon: HandCoins,
            color: "blue",
          },
          {
            label: "Entregados",
            value: stats.entregado,
            icon: Wallet,
            color: "emerald",
          },
          {
            label: "Pendientes",
            value: stats.pendiente,
            icon: Clock3,
            color: "amber",
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

        {/* =========================
            FILTROS REALES
        ========================= */}
        <FiltrosReporte
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar beneficiario..."
          filtros={[
            {
              key: "periodo",
              value: periodo,
              onChange: setPeriodo,
              options: periodosOptions, // 🔥 YA CON PERIODOS REALES
            },
            {
              key: "estatus",
              value: estatus,
              onChange: setEstatus,
              options: [
                { value: "", label: "Todos" },
                { value: "Entregado", label: "Entregado" },
                { value: "Pendiente", label: "Pendiente" },
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
            {
              component: Boton,
              icon: FileText,
              label: "Descargar PDF",
              onClick: descargarPDF,
            },
          ]}
        />

        {/* =========================
            TABLA
        ========================= */}
        <DatosTabla
          columns={[
            { key: "beneficiario", label: "Beneficiario" },
            { key: "total_recibido", label: "Total Recibido" },
            { key: "apoyos_entregados", label: "Entregados" },
            { key: "apoyos_pendientes", label: "Pendientes" },
            { key: "ultimo_apoyo", label: "Último Apoyo" },
          ]}
          data={dataFiltrada}
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