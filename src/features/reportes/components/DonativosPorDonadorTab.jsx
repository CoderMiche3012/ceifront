import { useState, useMemo } from "react";
import { Users, HandCoins, FileSpreadsheet, FileText } from "lucide-react";

import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";
import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";

import { useResumenPeriodoTotalesGenerales, useResumenPeriodoTotales } from "../../donadores/hooks/useDonativos";
import { usePeriodos } from "../../periodos/hooks/usePeriodos";
import { solicitarDescargaReporte } from "../services/reporteService";

export default function DonativosPorDonadorTab() {
  const [periodo, setPeriodo] = useState("");

  // obtener datos
  const { data: resumenGeneral = [] } = useResumenPeriodoTotalesGenerales();
  const { data: periodos = [] } = usePeriodos();
  const { data: resumenPeriodo = [] } = useResumenPeriodoTotales(periodo);

  // 🛠️ CORRECCIÓN 1: Forzamos la comparación a String para evitar fallos de tipo (Numero vs String)
  const periodoLabel = useMemo(() => {
    if (!periodo) return "General";
    const p = periodos.find((x) => String(x.id_periodo) === String(periodo));
    return p?.ciclo_escolar || "General";
  }, [periodo, periodos]);

  const resumen = periodo ? resumenPeriodo : resumenGeneral;

  // tabla final
  const datosTabla = useMemo(() => {
    return resumen.map((item, index) => ({
      key: `${item.id_donador}-${index}`,
      id_donador: item.id_donador,
      donador: item.nombreCompleto,
      tipo: item.tipo,
      amount: item.cantidad_donativos, 
      cantidad_donativos: item.cantidad_donativos,
      ultima_fecha: item.ultimaFechaDonacion || item.ultimasFechaDonacion || "Sin donaciones registradas",
      aportaciones:
        Object.entries(item.totales || {})
          .map(([moneda, monto]) => `${moneda}: $${monto}`)
          .join(", ") || "Sin aportaciones registradas",
    }));
  }, [resumen]);

  // totales
  const totalesPorMoneda = useMemo(() => {
    const acumulado = {};
    resumen.forEach((item) => {
      Object.entries(item.totales || {}).forEach(([moneda, monto]) => {
        acumulado[moneda] = (acumulado[moneda] || 0) + Number(monto || 0);
      });
    });
    return acumulado;
  }, [resumen]);

  const ejecutarDescargaBlob = (buffer, nombreArchivo, mimeType) => {
    if (!buffer) return;
    const realBuffer = buffer instanceof ArrayBuffer ? buffer : buffer.buffer;
    const blob = new Blob([realBuffer], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // excel
  const descargarExcel = async () => {
    try {
      // 🕵️ MIRA LA CONSOLA: Aquí verificarás si el label realmente cambió antes de enviarse
      console.log("Descargando Excel con Periodo ID:", periodo, "Label:", periodoLabel);

      const meta = {
        periodo: periodoLabel,
        periodoLabel: periodoLabel 
      };

      const buffer = await solicitarDescargaReporte(
        "donativos",
        "excel",
        datosTabla,
        meta
      );

      ejecutarDescargaBlob(
        buffer,
        `donativos_${periodoLabel}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (error) {
      console.error("Error Excel:", error);
    }
  };

  // pdf
  const descargarPDF = async () => {
    try {
      console.log("Descargando PDF con Periodo ID:", periodo, "Label:", periodoLabel);

      const meta = {
        periodo: periodoLabel,
        periodoLabel: periodoLabel
      };

      const buffer = await solicitarDescargaReporte(
        "donativos",
        "pdf",
        datosTabla,
        meta
      );

      ejecutarDescargaBlob(
        buffer,
        `donativos_${periodoLabel}.pdf`,
        "application/pdf"
      );
    } catch (error) {
      console.error("Error PDF:", error);
    }
  };

  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          {
            label: "Total Donadores",
            value: resumen.length,
            icon: Users,
            color: "blue",
          },
          {
            label: "Total Donativos",
            value: resumen.reduce((acc, item) => acc + Number(item.cantidad_donativos || 0), 0),
            icon: HandCoins,
            color: "violet",
          },
          ...Object.entries(totalesPorMoneda).map(([moneda, total]) => ({
            label: `Total ${moneda}`,
            value: total,
            icon: HandCoins,
            color: "emerald",
          })),
        ]}
      />

      <Card>
        <FiltrosReporte
          search=""
          onSearchChange={() => {}}
          searchPlaceholder="Buscar donador..."
          filtros={[
            {
              key: "periodo",
              value: periodo || "",
              // 🛠️ CORRECCIÓN 2: Tolerancia a si el componente regresa el evento o el valor puro
              onChange: (val) => {
                const actualValue = val?.target ? val.target.value : val;
                setPeriodo(actualValue);
              },
              options: [
                { value: "", label: "Todos los períodos" },
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

        <DatosTabla
          columns={[
            { key: "donador", label: "Donador" },
            { key: "tipo", label: "Tipo" },
            { key: "cantidad_donativos", label: "Cantidad Donativos" },
            { key: "ultima_fecha", label: "Última Donación" },
            { key: "aportaciones", label: "Aportaciones" },
          ]}
          data={datosTabla}
          rowKey="key"
        />

        <PaginacionTabla
          currentPage={1}
          totalPages={1}
          totalItems={datosTabla.length}
          pageSize={10}
          onPageChange={() => {}}
        />
      </Card>
    </div>
  );
}