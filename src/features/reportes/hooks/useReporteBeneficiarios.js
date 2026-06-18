import { useState, useEffect, useMemo } from "react";
import { useBeneficiarios } from "./../../beneficiarios/hooks/useBeneficiarios";
import { usePeriodos } from "./../../periodos/hooks/usePeriodos";
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
    return "media superior";
  }

  if (
    ["universidad", "licenciatura"].includes(valor)
  ) {
    return "superior";
  }

  return valor;
};

const formatearNivel = (nivel = "") => {
  const valor = normalizarNivel(nivel);

  const nombres = {
    preescolar: "Preescolar",
    primaria: "Primaria",
    secundaria: "Secundaria",
    "media superior": "Media Superior",
    superior: "Superior",
  };

  return nombres[valor] || nivel;
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

export function useReporteBeneficiarios() {
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

  // para obtener el label del periodo seleccionado
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

      let estatusSeguimiento = seg?.estatus === "Finalizado" ? "Graduado" : (seg?.estatus || "Desconocido");

      let nivelEscolarBase = "";
      let escolaridad = "Sin Registro";

      if (datosEscolares?.id_escolaridad) {
        nivelEscolarBase = formatearNivel(
          datosEscolares.id_escolaridad.nivel_escolar || ""
        );

        escolaridad = `${nivelEscolarBase} - ${datosEscolares.id_escolaridad.grado_escolar}°`;
      } else if (datosEscolares?.nivel && datosEscolares?.grado) {
        nivelEscolarBase = formatearNivel(
          datosEscolares.nivel || ""
        );

        escolaridad = `${nivelEscolarBase} - ${datosEscolares.grado}°`;
      }

      const escuela = typeof datosEscolares?.id_institucion === "object"
        ? datosEscolares.id_institucion?.nombre
        : datosEscolares?.escuela || "Sin escuela";

      let promedioFinal = "Sin Registro";
      if (datosEscolares) {
        if (datosEscolares.boletas?.length) {
          const suma = datosEscolares.boletas.reduce((acc, x) => acc + Number(x.promedio_boleta || 0), 0);
          promedioFinal = (suma / datosEscolares.boletas.length).toFixed(1);
        } else if (datosEscolares.Promedio && datosEscolares.Promedio !== "Sin calificaciones") {
          promedioFinal = Number(datosEscolares.Promedio).toFixed(1);
        } else if (b.promedio != null) {
          promedioFinal = Number(b.promedio).toFixed(1);
        }
      }

      let rendimientoCalculado = "N/A";
      const promedioNumerico = parseFloat(promedioFinal);
      if (!isNaN(promedioNumerico)) {
        if (promedioNumerico < 7.5) rendimientoCalculado = "regularizacion";
        else if (promedioNumerico < 8.0) rendimientoCalculado = "bajo";
        else rendimientoCalculado = "bueno";
      }

      let tutorObj = b?.familia?.find((f) => f.es_tutor_principal);
      const nombreTutor = tutorObj
        ? `${tutorObj.nombre} ${tutorObj.apellido_p || ""} ${tutorObj.apellido_m || ""}`.trim()
        : expResumen.tutor || "Sin Registro";
      const telTutor = tutorObj ? tutorObj.telefono : expResumen.telefonoTutor || "Sin Registro";

      const idPeriodo = seg?.periodo?.id_periodo || seg?.id_periodo || "";
      const nombrePeriodo = mapaPeriodos[idPeriodo] || "N/A";

      return {
        id_beneficiario: b.id_beneficiario,
        nombre_completo: expResumen.nombre_completo || "Sin nombre",
        edad: calcularEdad(expResumen.fecha_nacimiento) || "-",
        estatus: estatusSeguimiento,
        donador: b.donadores?.length > 0 ? "Con donador" : "Sin donador",
        escolaridad,
        escuela: escuela !== "Sin escuela" ? escuela : "Sin Registro",
        promedio: promedioFinal,
        nivelEscolarBase,
        rendimientoCalculado,
        municipio: expResumen.municipio || "Sin Registro",
        colonia: expResumen.colonia || "Sin Registro",
        cp: expResumen.codigo_postal || "Sin Registro",
        id_periodo: idPeriodo,
        periodo_nombre: nombrePeriodo,
        calle: expResumen.calle || "Sin Registro",
        numero: expResumen.numero || "Sin Registro",
        telefono: expResumen.telefono || "Sin Registro",
        tutor: nombreTutor,
        telefono_tutor: telTutor,
        nota_seguimiento: seg.nota_seguimiento || "Sin notas",
        periodo_columna: periodo === "" ? nombrePeriodo : null
      };
    });
  }, [beneficiarios, mapaPeriodos, periodo]);

  const dataFiltrada = useMemo(() => {
    const searchLower = search.toLowerCase();
    return dataTabla.filter((b) => {
      const estatusBusqueda = estatus === "Finalizado" ? "Graduado" : estatus;
      const matchEstatus = estatusBusqueda ? b.estatus === estatusBusqueda : true;
      const matchSearch = search ? b.nombre_completo.toLowerCase().includes(searchLower) : true;
      const matchNivel = nivel
        ? normalizarNivel(b.nivelEscolarBase) === normalizarNivel(nivel)
        : true;
      const matchRendimiento = rendimiento ? b.rendimientoCalculado === rendimiento : true;
      return matchEstatus && matchSearch && matchNivel && matchRendimiento;
    });
  }, [dataTabla, estatus, search, nivel, rendimiento]);

  const stats = useMemo(() => {
    let activos = 0, inactivos = 0, graduados = 0, pausa = 0;
    dataFiltrada.forEach((b) => {
      if (b.estatus === "Activo") activos++;
      else if (b.estatus === "Inactivo") inactivos++;
      else if (b.estatus === "Graduado") graduados++;
      else if (b.estatus === "Pausa" || b.estatus === "En Pausa") pausa++;
    });
    return { total: dataFiltrada.length, activos, inactivos, graduados, pausa };
  }, [dataFiltrada]);

  const periodosOptions = useMemo(() => [
    { value: "", label: "Todos los periodos" },
    ...periodos.map((p) => ({ value: p.id_periodo, label: p.ciclo_escolar }))
  ], [periodos]);

  const descargarExcel = async () => {
    try {
      const meta = { periodo: periodoLabel, periodoLabel };
      const buffer = await solicitarDescargaReporte("beneficiarios", "excel", dataFiltrada, meta);
      ejecutarDescargaBlob(buffer, `beneficiarios_${periodoLabel}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    } catch (error) { console.error("Error Excel:", error); }
  };

  const descargarPDF = async () => {
    try {
      //estadisticas
      const escolaridad = {};
      const edades = {
        "0-5": 0,
        "6-10": 0,
        "11-15": 0,
        "16-18": 0,
        "19+": 0,
      };
      const municipios = {};

      dataFiltrada.forEach((b) => {
  if (b.nivelEscolarBase) {
    escolaridad[b.nivelEscolarBase] =
      (escolaridad[b.nivelEscolarBase] || 0) + 1;
  }

  const edad = Number(b.edad);

  if (!isNaN(edad)) {
    if (edad <= 5) edades["0-5"]++;
    else if (edad <= 10) edades["6-10"]++;
    else if (edad <= 15) edades["11-15"]++;
    else if (edad <= 18) edades["16-18"]++;
    else edades["19+"]++;
  }

  const muni = b.municipio || "Sin Registro";
  municipios[muni] = (municipios[muni] || 0) + 1;
});

      const mArray = Object.entries(municipios)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      // datos compactos
      const dataCompacta = dataFiltrada.map((b) => ({
        nombre_completo: b.nombre_completo,
        edad: b.edad,
        estatus: b.estatus,
        escolaridad: b.escolaridad,
        municipio: b.municipio,
        telefono: b.telefono,
        tutor: b.tutor,
        telTutor: b.telTutor,
        escuela: b.escuela,
        telefono_tutor: b.telefono_tutor,
        municipio: b.municipio,
        colonia: b.colonia,
        cp: b.cp,
        calle: b.calle,
        numero: b.numero

      }));

      // generar graficas
      const [gEsc, gEd, gMun] = await Promise.all([
        generarGraficaBase64({
          type: "doughnut",
          data: {
            labels: Object.keys(escolaridad),
            datasets: [{ data: Object.values(escolaridad) }],
          },
          options: { cutout: "65%" },
        }),

        generarGraficaBase64({
          type: "bar",
          data: {
            labels: Object.keys(edades),
            datasets: [
              {
                label: "Beneficiarios",
                data: Object.values(edades),
                backgroundColor: "#0d6f6b",
              },
            ],
          },
        }),

        generarGraficaBase64({
          type: "bar",
          data: {
            labels: mArray.map((m) => m[0]),
            datasets: [
              {
                label: "Beneficiarios",
                data: mArray.map((m) => m[1]),
                backgroundColor: "#0d6f6b",
              },
            ],
          },
        }),
      ]);

      // enviar al warker
      const buffer = await solicitarDescargaReporte(
        "beneficiarios",
        "pdf",
        dataCompacta,
        {
          periodoLabel,
          graficas: [
            {
              titulo: "Escolaridad",
              imagen: gEsc,
              tabla: Object.entries(escolaridad),
            },
            {
              titulo: "Edades",
              imagen: gEd,
              tabla: Object.entries(edades),
            },
            {
              titulo: "Municipios",
              imagen: gMun,
              tabla: mArray,
            },
          ],
        }
      );

      // descarga
      ejecutarDescargaBlob(
        buffer,
        `beneficiarios_${periodoLabel}.pdf`,
        "application/pdf"
      );

    } catch (e) {
      console.error("Error PDF:", e);
    }
  };
  const graficaEdades = useMemo(() => {
    const edades = {
      "0-5": 0,
      "6-10": 0,
      "11-15": 0,
      "16-18": 0,
      "19+": 0,
    };

    dataFiltrada.forEach((b) => {
      const edad = Number(b.edad);

      if (isNaN(edad)) return;

      if (edad <= 5) edades["0-5"]++;
      else if (edad <= 10) edades["6-10"]++;
      else if (edad <= 15) edades["11-15"]++;
      else if (edad <= 18) edades["16-18"]++;
      else edades["19+"]++;
    });

    return {
      labels: Object.keys(edades),
      datasets: [
        {
          label: "Beneficiarios",
          data: Object.values(edades),
          backgroundColor: "#0d6f6b",
        },
      ],
    };
  }, [dataFiltrada]);
  const graficaEscolaridad = useMemo(() => {
    const niveles = {};

    dataFiltrada.forEach((b) => {
      if (!b.nivelEscolarBase) return;

      niveles[b.nivelEscolarBase] =
        (niveles[b.nivelEscolarBase] || 0) + 1;
    });

    return {
      labels: Object.keys(niveles),
      datasets: [
        {
          data: Object.values(niveles),
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
      graficaEdades,
      graficaEscolaridad,
    },
    actions: { setSearch, setPeriodo, setEstatus, setNivel, setRendimiento, descargarExcel, descargarPDF },
    loading: loadingB || loadingP
  };
}


