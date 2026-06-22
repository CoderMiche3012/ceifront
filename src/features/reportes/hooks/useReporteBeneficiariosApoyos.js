import { useState, useMemo, useEffect } from "react";
import { useBeneficiarios } from "../../beneficiarios/hooks/useBeneficiarios";
import { usePeriodos } from "../../periodos/hooks/usePeriodos";
import { solicitarDescargaReporte } from "../services/reporteService";

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return "";

  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (
    mes < 0 ||
    (mes === 0 &&
      hoy.getDate() < nacimiento.getDate())
  ) {
    edad--;
  }

  return edad;
};

const ejecutarDescargaBlob = (
  buffer,
  nombreArchivo,
  mimeType
) => {
  if (!buffer) return;

  const realBuffer =
    buffer instanceof ArrayBuffer
      ? buffer
      : buffer.buffer;

  const blob = new Blob([realBuffer], {
    type: mimeType,
  });

  const url =
    window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  a.click();

  window.URL.revokeObjectURL(url);
};

export function useReporteBeneficiariosEconomico() {
  const [periodo, setPeriodo] = useState("");
  const [estatus, setEstatus] = useState("");
  const [search, setSearch] = useState("");

  const {
    data: beneficiarios = [],
    isLoading: loadingB,
  } = useBeneficiarios(periodo);

  const {
    data: periodos = [],
    isLoading: loadingP,
  } = usePeriodos();

  useEffect(() => {
    if (periodos.length > 0 && !periodo) {
      const ultimoPeriodo = periodos[periodos.length - 1];

      setPeriodo(String(ultimoPeriodo.id_periodo));
    }
  }, [periodos, periodo]);

  const periodoLabel = useMemo(() => {
    const p = periodos.find(
      (x) => String(x.id_periodo) === String(periodo)
    );

    return p?.ciclo_escolar || "";
  }, [periodo, periodos]);

  const dataTabla = useMemo(() => {
    return beneficiarios
      .map((b) => {
        const exp = b.expediente_resumen || {};
        const seg = b.seguimiento || b.ultimo_seguimiento || {};
        const apoyos = seg.apoyos_economicos || [];

        const totalRegistrados = apoyos.length;

        const totalEntregados = apoyos.filter(
          (a) => a.estatus?.toLowerCase()?.trim() === "entregado"
        ).length;

        const totalPendientes = totalRegistrados - totalEntregados;

        if (totalRegistrados === 0) {
          return null; 
        }

        return {
          id_beneficiario: b.id_beneficiario,
          nombre_completo: exp.nombre_completo || "Sin nombre",
          edad: calcularEdad(exp.fecha_nacimiento) || "-",
          total_registrados: totalRegistrados,
          total_entregados: totalEntregados,
          total_pendientes: totalPendientes,
          fecha_ultimo_apoyo: "Sin Registro", 
          estatus_apoyos: totalPendientes > 0 ? "Pendiente" : "Entregado",
        };
      })
      .filter(Boolean); 
  }, [beneficiarios]);

  const dataFiltrada = useMemo(() => {
    const searchLower =
      search.toLowerCase();

    return dataTabla.filter((b) => {
      const matchSearch =
        !search ||
        b.nombre_completo
          .toLowerCase()
          .includes(searchLower);

      const matchEstatus =
        !estatus ||
        b.estatus_apoyos ===
        estatus;

      return (
        matchSearch &&
        matchEstatus
      );
    });
  }, [
    dataTabla,
    search,
    estatus,
  ]);

  const periodosOptions = useMemo(
    () =>
      periodos.map((p) => ({
        value: String(p.id_periodo),
        label: p.ciclo_escolar,
      })),
    [periodos]
  );

  const descargarExcel =
    async () => {
      try {
        const meta = {
          periodo: periodoLabel,
          periodoLabel,
        };

        const buffer =
          await solicitarDescargaReporte(
            "apoyos",
            "excel",
            dataFiltrada,
            meta
          );

        ejecutarDescargaBlob(
          buffer,
          `ReporteApoyoEconomico_${periodoLabel}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
      } catch (error) {
        alert("Error al descargar");
      }
    };

  const descargarPDF =
    async () => {
      try {
        const dataCompacta =
          dataFiltrada.map(
            (b) => ({
              nombre_completo:
                b.nombre_completo,
              edad: b.edad,
              total_registrados:
                b.total_registrados,
              total_entregados:
                b.total_entregados,
              total_pendientes:
                b.total_pendientes,
              fecha_ultimo_apoyo:
                b.fecha_ultimo_apoyo,
              estatus_apoyos:
                b.estatus_apoyos,
            })
          );

        const buffer =
          await solicitarDescargaReporte(
            "apoyos",
            "pdf",
            dataCompacta,
            {
              periodoLabel,
            }
          );

        ejecutarDescargaBlob(
          buffer,
          `ReporteApoyoEconomico_${periodoLabel}.pdf`,
          "application/pdf"
        );
      } catch (error) {
        alert("Error al descargar");
      }
    };

  return {
    state: {
      search,
      periodo,
      estatus,
      dataFiltrada,
      periodosOptions,
    },

    actions: {
      setSearch,
      setPeriodo,
      setEstatus,
      descargarExcel,
      descargarPDF,
    },

    loading:
      loadingB || loadingP,
  };
}

