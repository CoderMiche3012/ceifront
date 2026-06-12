import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";

import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";

import {
  GraduationCap,
  Trophy,
  BookOpen,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

// 📊 GRAFICA
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// services
import { obtenerBeneficiarios } from "../../beneficiarios/services/beneficiariosService";
import { obtenerPeriodos } from "../../periodos/services/periodoService";
import { solicitarDescargaReporte } from "../services/reporteService";

/**
 * 🔥 MAPEO POR PERIODO
 */
const mapBeneficiariosAcademicos = (beneficiarios, periodo) => {
  return beneficiarios.map((b) => {
    const seguimiento =
      b.historial_seguimientos?.find(
        (s) => String(s.id_periodo) === String(periodo)
      ) || b.historial_seguimientos?.[0];

    const datos = seguimiento?.datos_escolares;
    const boletas = datos?.boletas || [];

    const promedio =
      boletas.length > 0
        ? boletas.reduce(
          (acc, b) => acc + parseFloat(b.promedio_boleta || 0),
          0
        ) / boletas.length
        : 0;

    const escuela = datos?.id_institucion?.nombre || "Sin escuela";

    const grado = datos?.id_escolaridad?.grado_escolar
      ? `${datos.id_escolaridad.grado_escolar}°`
      : "N/A";

    let estatusAcademico = "Sin datos";

    if (promedio >= 8) estatusAcademico = "Alto Rendimiento";
    else if (promedio >= 6) estatusAcademico = "Rendimiento Medio";
    else if (promedio > 0) estatusAcademico = "Bajo Rendimiento";

    return {
      id_beneficiario: b.id_beneficiario,
      beneficiario: b.expediente_resumen?.nombre_completo || "Sin nombre",
      escuela,
      grado,
      promedio: Number(promedio.toFixed(1)),
      estatusAcademico,
      seguimientos: b.historial_seguimientos || [],
    };
  });
};

export default function ReporteAcademicoTab() {
  const { data: beneficiarios = [] } = useQuery({
    queryKey: ["beneficiarios"],
    queryFn: obtenerBeneficiarios,
  });

  const { data: periodos = [] } = useQuery({
    queryKey: ["periodos"],
    queryFn: obtenerPeriodos,
  });

  const [periodo, setPeriodo] = useState("");
  const [search, setSearch] = useState("");

  // =========================
  // DATA BASE
  // =========================
  const dataBase = useMemo(() => {
    return mapBeneficiariosAcademicos(beneficiarios, periodo);
  }, [beneficiarios, periodo]);

  // =========================
  // FILTRO
  // =========================
  const dataFiltrada = useMemo(() => {
    return dataBase.filter((b) => {
      const matchPeriodo = periodo
        ? b.seguimientos?.some(
          (s) => String(s.id_periodo) === String(periodo)
        )
        : true;

      const matchSearch = search
        ? b.beneficiario.toLowerCase().includes(search.toLowerCase())
        : true;

      return matchPeriodo && matchSearch;
    });
  }, [dataBase, periodo, search]);

  // =========================
  // ESTADISTICAS
  // =========================
  const stats = useMemo(() => {
    const data = dataFiltrada;

    const alto = data.filter((d) => d.promedio >= 8).length;
    const medio = data.filter((d) => d.promedio >= 6 && d.promedio < 8).length;
    const bajo = data.filter((d) => d.promedio > 0 && d.promedio < 6).length;

    const promedioGeneral =
      data.reduce((acc, d) => acc + (d.promedio || 0), 0) /
      (data.length || 1);

    return {
      alto,
      medio,
      bajo,
      promedioGeneral: promedioGeneral.toFixed(1),
    };
  }, [dataFiltrada]);

  // =========================
  // DATA GRAFICA
  // =========================
  const chartData = useMemo(() => {
    return [
      { name: "Alto", value: stats.alto },
      { name: "Medio", value: stats.medio },
      { name: "Bajo", value: stats.bajo },
    ];
  }, [stats]);

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
        "academico",
        "excel",
        dataFiltrada // ✅ FIX
      );

      ejecutarDescargaBlob(
        buffer,
        `academico_${periodo || "todos"}.xlsx`,
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
        "academico",
        "pdf",
        dataFiltrada // ✅ FIX
      );

      ejecutarDescargaBlob(
        buffer,
        `academico_${periodo || "todos"}.pdf`,
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
            label: "Promedio General",
            value: stats.promedioGeneral,
            icon: GraduationCap,
            color: "blue",
          },
          {
            label: "Alto Rendimiento",
            value: stats.alto,
            icon: Trophy,
            color: "emerald",
          },
          {
            label: "Medio",
            value: stats.medio,
            icon: BookOpen,
            color: "amber",
          },
          {
            label: "Bajo",
            value: stats.bajo,
            icon: AlertTriangle,
            color: "red",
          },
        ]}
      />

      {/* =========================
          GRAFICA
      ========================= */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Distribución de Rendimiento
        </h3>

        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>

        {/* =========================
            FILTROS
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
              options: [
                { value: "", label: "Todos los periodos" },
                ...periodos.map((p) => ({
                  value: p.id_periodo,
                  label: p.ciclo_escolar,
                })),
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
            { key: "escuela", label: "Escuela" },
            { key: "grado", label: "Grado" },
            { key: "promedio", label: "Promedio" },
            { key: "estatusAcademico", label: "Estatus Académico" },
          ]}
          data={dataFiltrada}
          rowKey="id_beneficiario"
        />

        <PaginacionTabla
          currentPage={1}
          totalPages={1}
          totalItems={dataFiltrada.length}
          pageSize={10}
          onPageChange={() => { }}
        />
      </Card>
    </div>
  );
}