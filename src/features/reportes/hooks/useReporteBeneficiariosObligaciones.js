import { useState, useMemo, useEffect } from "react";
import { useBeneficiarios } from "../../beneficiarios/hooks/useBeneficiarios";
import { usePeriodos } from "../../periodos/hooks/usePeriodos";
import { solicitarDescargaReporte } from "../services/reporteService";

// Helper para descarga de archivos
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

export function useReporteObligaciones() {
  const [periodo, setPeriodo] = useState("");
  const [tipoObligacion, setTipoObligacion] = useState("");
  const [estatus, setEstatus] = useState(""); 
  const [search, setSearch] = useState("");

  const { data: beneficiarios = [], isLoading: loadingB } = useBeneficiarios(periodo);
  const { data: periodos = [], isLoading: loadingP } = usePeriodos();
useEffect(() => {
  if (periodos.length > 0 && !periodo) {
    const ultimoPeriodo = periodos[periodos.length - 1];

    setPeriodo(String(ultimoPeriodo.id_periodo));
  }
}, [periodos, periodo]);
  const periodoLabel = useMemo(() => {
  if (!periodo) return "General";
  const p = periodos.find((x) => String(x.id_periodo) === String(periodo));
  return p?.ciclo_escolar || "General";
}, [periodo, periodos]);

  // Procesamiento de datos: Aplanamos para que cada obligación sea una fila
  const dataTabla = useMemo(() => {
    return beneficiarios.flatMap((b) => {
      const exp = b.expediente_resumen || {};
      const seg = b.seguimiento || {};
      const obligaciones = seg.obligaciones || [];

      return obligaciones.map((o) => ({
        id_beneficiario: b.id_beneficiario,
        nombre_completo: exp.nombre_completo || "Sin nombre",
        tipo: o.tipo,
        estatus: o.estatus,
        fecha: o.fecha || "-",
        observaciones: o.observaciones || "-"
      }));
    });
  }, [beneficiarios]);

  const dataFiltrada = useMemo(() => {
    const searchLower = search.toLowerCase();

    return dataTabla.filter((item) => {
      const matchSearch = !search || item.nombre_completo.toLowerCase().includes(searchLower);
      const matchTipo = !tipoObligacion || item.tipo === tipoObligacion;
      const matchEstatus = !estatus || item.estatus === estatus;

      return matchSearch && matchTipo && matchEstatus;
    });
  }, [dataTabla, search, tipoObligacion, estatus]);

  const periodosOptions = useMemo(
  () =>
    periodos.map((p) => ({
      value: String(p.id_periodo),
      label: p.ciclo_escolar,
    })),
  [periodos]
);

  const descargarExcel = async () => {
    try {
      const meta = { periodo: periodoLabel };
      const buffer = await solicitarDescargaReporte("obligaciones", "excel", dataFiltrada, meta);
      ejecutarDescargaBlob(buffer, `ReporteObligaciones_${periodoLabel}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    } catch (error) {
      console.error("Error Excel:", error);
    }
  };

  const descargarPDF = async () => {
    try {
      const buffer = await solicitarDescargaReporte("obligaciones", "pdf", dataFiltrada, { periodoLabel });
      ejecutarDescargaBlob(buffer, `ReporteObligaciones_${periodoLabel}.pdf`, "application/pdf");
    } catch (error) {
      console.error("Error PDF:", error);
    }
  };

  return {
    state: {
      search,
      periodo,
      tipoObligacion,
      estatus,
      dataFiltrada,
      periodosOptions,
    },
    actions: {
      setSearch,
      setPeriodo,
      setTipoObligacion,
      setEstatus,
      descargarExcel,
      descargarPDF,
    },
    loading: loadingB || loadingP,
  };
}