import { useState, useEffect, useMemo } from "react";
import { useBeneficiarios } from "../../beneficiarios/hooks/useBeneficiarios";
import { usePeriodos } from "../../periodos/hooks/usePeriodos";
import { solicitarDescargaReporte } from "../services/reporteService";

import { Chart } from "chart.js/auto";
const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return "";
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};
const normalizarNivelGrafico = (nivel = "") => {
  const valor = nivel
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (valor.includes("preescolar")) return "Preescolar";
  if (valor.includes("primaria")) return "Primaria";
  if (valor.includes("secundaria")) return "Secundaria";
  if (
    valor.includes("prepa") ||
    valor.includes("bachiller") ||
    valor.includes("media")
  ) return "Media Superior";

  if (
    valor.includes("uni") ||
    valor.includes("licenci")
  ) return "Superior";

  return "Sin Registro";
};
const normalizarNivel = (nivel = "") => {
  const valor = nivel
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (
    ["prepa", "preparatoria", "bachillerato"].includes(valor)
  ) {
    return "Media Superior";
  }

  if (
    ["universidad", "licenciatura"].includes(valor)
  ) {
    return "Superior";
  }

  return valor;
};
const generarGraficaBase64 = (config) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");

    if (config.type === "doughnut") {
      canvas.width = 1200;
      canvas.height = 1200;
    } else {
      canvas.width = 1200;
      canvas.height = 700;
    }

    const chart = new Chart(canvas, {
      ...config,
      options: {
        responsive: false,
        animation: false,
        maintainAspectRatio: true,
        aspectRatio: 1,
        ...(config.options || {}),
      },
    });

    setTimeout(() => {
      const image = canvas.toDataURL("image/png");
      chart.destroy();
      resolve(image);
    }, 100);
  });
};
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

export function useReporteBeneficiariosAcademico() {
  const [periodo, setPeriodo] = useState("");
  const [estatus, setEstatus] = useState("");
  const [search, setSearch] = useState("");
  const [nivel, setNivel] = useState("");
  const [rendimiento, setRendimiento] = useState("");

  const { data: beneficiarios = [], isLoading: loadingB } = useBeneficiarios(periodo);
  const { data: periodos = [], isLoading: loadingP } = usePeriodos();

  const mapaPeriodos = useMemo(() => {
    const mapa = {};
    periodos.forEach((p) => {
      mapa[p.id_periodo] = p.ciclo_escolar;
    });
    return mapa;
  }, [periodos]);

  // Lógica para obtener el label del periodo seleccionado
  const periodoLabel = useMemo(() => {
    if (!periodo) return "General";
    const p = periodos.find((x) => String(x.id_periodo) === String(periodo));
    return p?.ciclo_escolar || "General";
  }, [periodo, periodos]);

  const dataTabla = useMemo(() => {
    return beneficiarios.map((b) => {
      const expResumen = b?.expediente_resumen || {};
      const seg = b?.ultimo_seguimiento || b?.seguimiento || {};
      const datosEscolares = seg?.datos_escolares || {};

      let nivelEscolarBase = "";
      let grado = "Sin Registro";

      if (datosEscolares?.id_escolaridad) {
        nivelEscolarBase =
          datosEscolares.id_escolaridad.nivel_escolar || "";

        grado =
          `${datosEscolares.id_escolaridad.grado_escolar}°`;
      } else if (
        datosEscolares?.nivel &&
        datosEscolares?.grado
      ) {
        nivelEscolarBase = datosEscolares.nivel || "";
        grado = `${datosEscolares.grado}°`;
      }

      const escuela =
        typeof datosEscolares?.id_institucion === "object"
          ? datosEscolares.id_institucion?.nombre
          : datosEscolares?.escuela || "Sin Registro";

      let promedioFinal = "Sin Registro";

      if (datosEscolares) {
        if (datosEscolares.boletas?.length) {
          const suma = datosEscolares.boletas.reduce(
            (acc, x) =>
              acc + Number(x.promedio_boleta || 0),
            0
          );

          promedioFinal = (
            suma / datosEscolares.boletas.length
          ).toFixed(1);
        } else if (
          datosEscolares.Promedio &&
          datosEscolares.Promedio !== "Sin calificaciones"
        ) {
          promedioFinal = Number(
            datosEscolares.Promedio
          ).toFixed(1);
        } else if (b.promedio != null) {
          promedioFinal = Number(b.promedio).toFixed(1);
        }
      }

      let rendimientoCalculado = "Sin Registro";

      const promedioNumerico = parseFloat(promedioFinal);

      if (!isNaN(promedioNumerico)) {
        if (promedioNumerico < 7.5) {
          rendimientoCalculado = "Regularización";
        } else if (promedioNumerico < 8.0) {
          rendimientoCalculado = "Bajo";
        } else {
          rendimientoCalculado = "Bueno";
        }
      }

      const idPeriodo =
        seg?.periodo?.id_periodo ||
        seg?.id_periodo ||
        "";

      const nombrePeriodo =
        mapaPeriodos[idPeriodo] || "N/A";

      const estatusSeguimiento =
        seg?.estatus === "Finalizado"
          ? "Graduado"
          : seg?.estatus || "Desconocido";

      const nivelNormalizado = normalizarNivel(nivelEscolarBase);

      const escolaridad =
        nivelNormalizado && grado
          ? `${nivelNormalizado} ${grado}`
          : "Sin Registro";

      return {
        id_beneficiario: b.id_beneficiario,
        nombre_completo: expResumen.nombre_completo || "Sin nombre",
        edad: calcularEdad(expResumen.fecha_nacimiento) || "-",
        municipio: expResumen.municipio || "Sin Registro",
        estatus: estatusSeguimiento,
        escuela,
        grado,
        nivel: normalizarNivel(nivelEscolarBase) || "Sin Registro",
        escolaridad,
        promedio: promedioFinal,
        rendimiento: rendimientoCalculado,

        id_periodo: idPeriodo,
        periodo_nombre: nombrePeriodo,
        periodo_columna: periodo === "" ? nombrePeriodo : null,

      };
    });
  }, [beneficiarios, mapaPeriodos, periodo]);

  const dataFiltrada = useMemo(() => {
    const searchLower = search.toLowerCase();

    return dataTabla.filter((b) => {
      const estatusBusqueda =
        estatus === "Finalizado"
          ? "Graduado"
          : estatus;

      const matchEstatus = estatusBusqueda
        ? b.estatus === estatusBusqueda
        : true;

      const matchSearch = search
        ? b.nombre_completo.toLowerCase().includes(searchLower)
        : true;

      const matchNivel = nivel
        ? normalizarNivel(b.nivel) === normalizarNivel(nivel)
        : true;

      const matchRendimiento = rendimiento
        ? b.rendimiento.toLowerCase() === rendimiento.toLowerCase()
        : true;

      return (
        matchEstatus &&
        matchSearch &&
        matchNivel &&
        matchRendimiento
      );
    });
  }, [
    dataTabla,
    estatus,
    search,
    nivel,
    rendimiento,
  ]);

  const stats = useMemo(() => {
    let activos = 0;
    let inactivos = 0;
    let graduados = 0;
    let pausa = 0;

    dataFiltrada.forEach((b) => {
      if (b.estatus === "Activo") activos++;
      else if (b.estatus === "Inactivo") inactivos++;
      else if (b.estatus === "Graduado") graduados++;
      else if (
        b.estatus === "Pausa" ||
        b.estatus === "En Pausa"
      ) {
        pausa++;
      }
    });

    return {
      total: dataFiltrada.length,
      activos,
      inactivos,
      graduados,
      pausa,
    };
  }, [dataFiltrada]);

  const periodosOptions = useMemo(() => [
    { value: "", label: "Todos los periodos" },
    ...periodos.map((p) => ({ value: p.id_periodo, label: p.ciclo_escolar }))
  ], [periodos]);

  const descargarExcel = async () => {
    try {
      const meta = { periodo: periodoLabel, periodoLabel };
      const buffer = await solicitarDescargaReporte("academico", "excel", dataFiltrada, meta);
      ejecutarDescargaBlob(buffer, `ReporteAcademico_${periodoLabel}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    } catch (error) { alert("Error al descargar"); }
  };

  const descargarPDF = async () => {
    try {

      const promedioPorNivel = {};
      const rendimientoData = {};

      dataFiltrada.forEach((b) => {
        const r = b.rendimiento || "Sin Registro";
        rendimientoData[r] = (rendimientoData[r] || 0) + 1;
        const nivel = b.nivel || "Sin Registro";
        if (!promedioPorNivel[nivel]) {
          promedioPorNivel[nivel] = {
            suma: 0,
            cantidad: 0,
          };
        }

        const promedio = Number(b.promedio);

        if (!isNaN(promedio)) {
          promedioPorNivel[nivel].suma += promedio;
          promedioPorNivel[nivel].cantidad++;
        }
      });

      const promedioNivelArray = Object.entries(
        promedioPorNivel
      ).map(([nivel, datos]) => [
        nivel,
        datos.cantidad
          ? Number(
            (datos.suma / datos.cantidad).toFixed(2)
          )
          : 0,
      ]);

      const dataCompacta = dataFiltrada.map((b) => ({
        nombre_completo: b.nombre_completo,
        periodo_columna: b.periodo_columna,
        estatus: b.estatus,
        escuela: b.escuela,
        grado: b.grado,
        nivel: b.nivel,
        promedio: b.promedio,
        rendimiento: b.rendimiento,
      }));

      const [gEstatus, gPromedioNivel] =
        await Promise.all([
          generarGraficaBase64({
            type: "doughnut",
            data: {
              labels: Object.keys(rendimientoData),
              datasets: [
                {
                  data: Object.values(
                    rendimientoData
                  ),
                },
              ],
            },
            options: {
              cutout: "65%",
            },
          }),

          generarGraficaBase64({
            type: "bar",
            data: {
              labels: promedioNivelArray.map(
                (x) => x[0]
              ),
              datasets: [
                {
                  label: "Promedio",
                  data: promedioNivelArray.map(
                    (x) => x[1]
                  ),
                  backgroundColor: "#0d6f6b",
                },
              ],
            },
          }),
        ]);

      const buffer =
        await solicitarDescargaReporte(
          "academico",
          "pdf",
          dataCompacta,
          {
            periodoLabel,
            graficas: [
              {
                titulo:
                  "Distribución por Rendimiento Académico",
                imagen: gEstatus,
                tabla: Object.entries(
                  rendimientoData
                ),
              },
              {
                titulo:
                  "Promedio por Nivel Educativo",
                imagen: gPromedioNivel,
                tabla: promedioNivelArray,
              },
            ],
          }
        );

      ejecutarDescargaBlob(
        buffer,
        `ReporteAcademico_${periodoLabel}.pdf`,
        "application/pdf"
      );
    } catch (e) {
      calert("Error al descargar");
    }
  };

  const graficaRendimiento = useMemo(() => {
    const rendimientoData = {};

    dataFiltrada.forEach((b) => {
      const r = (b.rendimiento || "").trim();

      if (!r || r.toLowerCase() === "sin registro") return;

      rendimientoData[r] = (rendimientoData[r] || 0) + 1;
    });

    return {
      labels: Object.keys(rendimientoData),
      datasets: [
        {
          data: Object.values(rendimientoData),
        },
      ],
    };
  }, [dataFiltrada]);

  const graficaPromedioNivel = useMemo(() => {
    const niveles = {};

    dataFiltrada.forEach((b) => {
      const nivel = normalizarNivelGrafico(b.nivel || "");

      if (!nivel || nivel === "Sin Registro") return;

      const promedio = Number(b.promedio);

      if (!niveles[nivel]) {
        niveles[nivel] = {
          suma: 0,
          cantidad: 0,
        };
      }

      if (!isNaN(promedio)) {
        niveles[nivel].suma += promedio;
        niveles[nivel].cantidad++;
      }
    });

    const orden = [
      "Preescolar",
      "Primaria",
      "Secundaria",
      "Media Superior",
      "Superior",
    ];

    const labels = orden.filter((nivel) => niveles[nivel]);

    return {
      labels,
      datasets: [
        {
          label: "Promedio",
          data: labels.map((nivel) =>
            Number((niveles[nivel].suma / niveles[nivel].cantidad).toFixed(2))
          ),
        },
      ],
    };
  }, [dataFiltrada]);
  return {
    state: {
      search,
      periodo,
      estatus,
      nivel,
      rendimiento,
      dataFiltrada,
      stats,
      periodosOptions,
      graficaRendimiento,
      graficaPromedioNivel,
    },
    actions: { setSearch, setPeriodo, setEstatus, setNivel, setRendimiento, descargarExcel, descargarPDF },
    loading: loadingB || loadingP
  };
}

