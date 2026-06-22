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

const formatearMoneda = (moneda, valor) => {
  const simbolos = {
    MXN: "$",
    USD: "US$",
    EUR: "€",
  };

  return `${simbolos[moneda] || ""}${Number(valor).toLocaleString("es-MX")}`;
};

export default function DonativosPorDonadorTab() {
  const [periodo, setPeriodo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [descargando, setDescargando] = useState(false);

  // obtener datos
  const { data: resumenGeneral = [] } = useResumenPeriodoTotalesGenerales();
  const { data: periodos = [] } = usePeriodos();
  const { data: resumenPeriodo = [] } = useResumenPeriodoTotales(periodo);
  const [tipo, setTipo] = useState("");

  const periodoLabel = useMemo(() => {
    if (!periodo) return "General";
    const p = periodos.find((x) => String(x.id_periodo) === String(periodo));
    return p?.ciclo_escolar || "General";
  }, [periodo, periodos]);

  const resumen = periodo ? resumenPeriodo : resumenGeneral;

  // tabla final
  const datosTabla = useMemo(() => {
    return resumen
      .filter((item) => {
        const coincideBusqueda =
          !search ||
          item.nombreCompleto
            ?.toLowerCase()
            .includes(search.toLowerCase());

        const coincideTipo =
          !tipo ||
          item.tipo?.toLowerCase() ===
          tipo.toLowerCase();

        return coincideBusqueda && coincideTipo;
      })
      .map((item, index) => ({
        key: `${item.id_donador}-${index}`,
        id_donador: item.id_donador,
        donador: item.nombreCompleto,
        tipo: item.tipo,
        amount: item.cantidad_donativos,
        cantidad_donativos: Number(
          item.cantidad_donativos || 0
        ).toLocaleString("es-MX"),
        ultima_fecha:
          item.ultimaFechaDonacion ||
          item.ultimasFechaDonacion ||
          "Sin donaciones registradas",
        aportaciones:
          Object.entries(item.totales || {})
            .map(
              ([moneda, monto]) =>
                `${moneda}: $${Number(
                  monto || 0
                ).toLocaleString("es-MX")}`
            )
            .join(", ") || "Sin aportaciones registradas",
      }));
  }, [resumen, tipo, search]);
  const totalPages = Math.ceil(datosTabla.length / pageSize) || 1;
  const datosPaginados = useMemo(() => {
    return datosTabla.slice(
      (page - 1) * pageSize,
      page * pageSize
    );
  }, [datosTabla, page, pageSize]);
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
    if (descargando) return;

    try {
      setDescargando(true);

      const meta = {
        periodo: periodoLabel,
        periodoLabel,
      };

      const buffer = await solicitarDescargaReporte(
        "donativos",
        "excel",
        datosTabla,
        meta
      );

      ejecutarDescargaBlob(
        buffer,
        `Reporte_Donativos_${periodoLabel}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (error) {
      alert("Error al descargar");
    } finally {
      setDescargando(false);
    }
  };

  // pdf
  const descargarPDF = async () => {
    if (descargando) return;

    try {
      setDescargando(true);

      const meta = {
        periodo: periodoLabel,
        periodoLabel,
      };

      const buffer = await solicitarDescargaReporte(
        "donativos",
        "pdf",
        datosTabla,
        meta
      );

      ejecutarDescargaBlob(
        buffer,
        `Reporte_Donativos_${periodoLabel}.pdf`,
        "application/pdf"
      );
    } catch (error) {
      alert("Error al descargar");
    } finally {
      setDescargando(false);
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
            value: formatearMoneda(moneda, total),
            icon: HandCoins,
            color: "emerald",
            isCurrency: true,

          })),
        ]}
      />

      <Card>
        <FiltrosReporte
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder="Buscar donador..."
          filtros={[
            {
              key: "periodo",
              value: periodo || "",
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
            {
              key: "tipo",
              value: tipo,
              onChange: (val) => {
                const actualValue = val?.target ? val.target.value : val;
                setTipo(actualValue);
              },
              options: [
                { value: "", label: "Todos los origenes" },
                { value: "CEI", label: "CEI" },
                { value: "OYE", label: "OYE" },
                { value: "CANFRO", label: "CANFRO" },
              ],
            },
          ]}
          acciones={[
            {
              component: Boton,
              variant: "secondary",
              icon: FileSpreadsheet,
              label: descargando ? "Generando..." : "Excel",
              onClick: descargarExcel,
              disabled: descargando,
            },
            {
              component: Boton,
              icon: FileText,
              label: descargando ? "Generando..." : "PDF",
              onClick: descargarPDF,
              disabled: descargando,
            },
          ]}
        />

        <DatosTabla
          columns={[
            { key: "donador", label: "Donador" },
            { key: "tipo", label: "Origen" },
            { key: "cantidad_donativos", label: "Cantidad Donativos" },
            { key: "ultima_fecha", label: "Última Donación" },
            { key: "aportaciones", label: "Aportaciones" },
          ]}
          data={datosPaginados}
          rowKey="key"
        />

        <PaginacionTabla
          currentPage={page}
          totalPages={totalPages}
          totalItems={datosTabla.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(Number(value));
            setPage(1);
          }}
        />
      </Card>
    </div>
  );
}


