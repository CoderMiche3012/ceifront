import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { aplicarEstilosExcelGlobal } from "../../reporteUtils";

const COLUMNAS_BENEFICIARIOS = [
  { key: "nombre", width: 35 },
  { key: "edad", width: 10 },
  { key: "periodo", width: 15 },
  { key: "estatus", width: 15 },
  { key: "escolaridad", width: 20 },
  { key: "escuela", width: 30 },
  { key: "telefono", width: 15 },
  { key: "tutor", width: 30 },
  { key: "telTutor", width: 15 },
  { key: "municipio", width: 20 },
  { key: "colonia", width: 20 },
  { key: "cp", width: 10 },
  { key: "calle", width: 20 },
  { key: "numero", width: 10 },
  { key: "nota", width: 45 }
];

const HEADERS_BENEFICIARIOS = [
  "Nombre Completo",
  "Edad",
  "Periodo",
  "Estatus",
  "Escolaridad",
  "Escuela",
  "Teléfono",
  "Tutor",
  "Tel. Tutor",
  "Municipio",
  "Colonia",
  "Calle",
  "Número",
  "C.P.",
  "Nota"
];

//Procesamiento de datos 
const procesarMetricas = (datos) => {
  return datos.reduce((acc, b) => {
    // Estatus
    const estatus = b.estatus?.toLowerCase() || "";
    if (estatus === "activo") acc.activos++;
    else if (["graduado", "finalizado"].includes(estatus)) acc.graduados++;
    else if (estatus === "inactivo") acc.inactivos++;
    // Niveles
    const esc = b.escolaridad?.toLowerCase() || "";
    const nivel = esc.includes("preescolar") ? "Preescolar" :
      esc.includes("primaria") ? "Primaria" :
        esc.includes("secundaria") ? "Secundaria" :
          (esc.includes("preparatoria") || esc.includes("bachillerato")) ? "Media Superior" :
            (esc.includes("universidad") || esc.includes("licenciatura")) ? "Superior" : "Sin Registro";
    acc.niveles[nivel] = (acc.niveles[nivel] || 0) + 1;

    // Edades
    const edad = Number(b.edad);
    if (!isNaN(edad)) {
      if (edad <= 5) acc.edades["0-5"]++;
      else if (edad <= 10) acc.edades["6-10"]++;
      else if (edad <= 15) acc.edades["11-15"]++;
      else if (edad <= 18) acc.edades["16-18"]++;
      else acc.edades["19+"]++;
    }
    // Municipios
    const muni = b.municipio || "Sin Registro";
    acc.municipios[muni] = (acc.municipios[muni] || 0) + 1;
    return acc;
  }, {
    activos: 0,
    graduados: 0,
    inactivos: 0,
    niveles: {},
    edades: { "0-5": 0, "6-10": 0, "11-15": 0, "16-18": 0, "19+": 0 },
    municipios: {}
  });
};

// para el excel
export const generarExcelEstrategia = async (datos, logoBase64, meta = {}) => {
  const periodoRaw = (meta.periodoLabel || meta.periodo || "General").toString().trim();
  const titulo = `REPORTE DE BENEFICIARIOS - ${periodoRaw}`;
  const colorTitulo = "0D6F6B";
  const m = procesarMetricas(datos);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Beneficiarios");

  worksheet.columns = COLUMNAS_BENEFICIARIOS;
  worksheet.getRow(5).values = HEADERS_BENEFICIARIOS;
  worksheet.autoFilter = {
    from: { row: 5, column: 1 },
    to: {
      row: 5,
      column: HEADERS_BENEFICIARIOS.length
    }
  };

  datos.forEach((p) => {
    worksheet.addRow([
      p.nombre_completo,
      p.edad,
      p.periodo_columna || periodoRaw,
      p.estatus,
      p.escolaridad,
      p.escuela,
      p.telefono,
      p.tutor,
      p.telefono_tutor,
      p.municipio,
      p.colonia,
      p.calle,
      p.numero,
      p.cp,
      p.nota_seguimiento
    ]);
  });
  await aplicarEstilosExcelGlobal(worksheet, titulo, workbook, logoBase64);
  await aplicarEstilosExcelGlobal(
  worksheet,
  titulo,
  workbook,
  logoBase64,
  {
    alineacionHeaders: "center"
  }
);
  // hoja de resumen
  const resumen = workbook.addWorksheet("Resumen");
  await aplicarEstilosExcelGlobal(
    resumen,
    `RESUMEN DE BENEFICIARIOS - ${periodoRaw}`,
    workbook,
    logoBase64,
    { usarHeader: true, usarTabla: false }
  );

  resumen.columns = [
    { width: 5 },
    { width: 5 },
    { width: 28 },
    { width: 18 },
    { width: 5 },
    { width: 28 },
    { width: 18 },
    { width: 5 },
    { width: 28 },
    { width: 18 }
  ];

  // Títulos
  resumen.getCell("C7").value = "DATOS GENERALES"; resumen.mergeCells("C7:D7");
  resumen.getCell("F7").value = "NIVEL EDUCATIVO"; resumen.mergeCells("F7:G7");
  resumen.getCell("I7").value = "RANGOS DE EDAD"; resumen.mergeCells("I7:J7");

  ["C7", "F7", "I7"].forEach((c) => {
    resumen.getCell(c).font = { bold: true, color: { argb: "FFFFFF" } };
    resumen.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colorTitulo } };
    resumen.getCell(c).alignment = { horizontal: "center", vertical: "middle" };
  });

  // subtitulos
  resumen.getCell("C8").value = "Concepto"; resumen.getCell("D8").value = "Cantidad";
  resumen.getCell("F8").value = "Nivel"; resumen.getCell("G8").value = "Beneficiarios";
  resumen.getCell("I8").value = "Rango"; resumen.getCell("J8").value = "Beneficiarios";

  // Datos
  resumen.getCell("C9").value = "Periodo"; resumen.getCell("D9").value = periodoRaw;
  resumen.getCell("C10").value = "Total"; resumen.getCell("D10").value = datos.length;
  resumen.getCell("C11").value = "Activos"; resumen.getCell("D11").value = m.activos;
  resumen.getCell("C12").value = "Graduados"; resumen.getCell("D12").value = m.graduados;
  resumen.getCell("C13").value = "Inactivos"; resumen.getCell("D13").value = m.inactivos;

  let fN = 9; Object.entries(m.niveles).forEach(([n, c]) => {
    resumen.getCell(`F${fN}`).value = n;
    resumen.getCell(`G${fN}`).value = c; fN++;
  });
  let fE = 9; Object.entries(m.edades).forEach(([r, c]) => {
    resumen.getCell(`I${fE}`).value = r;
    resumen.getCell(`J${fE}`).value = c; fE++;
  });

  //para municipios
  const hojaMunicipios = workbook.addWorksheet("Municipios");
  await aplicarEstilosExcelGlobal(hojaMunicipios, titulo, workbook, logoBase64);
  hojaMunicipios.columns = [
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 40 },
    { width: 25 }
  ];

  hojaMunicipios.mergeCells("F7:G7");
  hojaMunicipios.getCell("F7").value = "Distribución de Beneficiarios por Municipio";
  hojaMunicipios.getCell("F7").alignment = { horizontal: "center", vertical: "middle" };
  hojaMunicipios.getCell("F7").font = { bold: true, size: 14 };

  hojaMunicipios.getCell("F9").value = "Municipio";
  hojaMunicipios.getCell("G9").value = "Cantidad Beneficiarios";
  hojaMunicipios.autoFilter = { from: { row: 9, column: 6 }, to: { row: 9, column: 7 } };

  ["F9", "G9"].forEach((c) => {
    hojaMunicipios.getCell(c).font = { bold: true, color: { argb: "FFFFFF" } };
    hojaMunicipios.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: colorTitulo } };
    hojaMunicipios.getCell(c).alignment = { horizontal: "center", vertical: "middle" };
  });

  let fM = 10;
  Object.entries(m.municipios).sort((a, b) => b[1] - a[1]).forEach(([muni, cant]) => {
    hojaMunicipios.getCell(`F${fM}`).value = muni;
    hojaMunicipios.getCell(`G${fM}`).value = cant;
    hojaMunicipios.getCell(`F${fM}`).alignment = { vertical: "middle" };
    hojaMunicipios.getCell(`G${fM}`).alignment = { horizontal: "center", vertical: "middle" };
    fM++;
  });

  return await workbook.xlsx.writeBuffer();
};
// general el pdf
export const generarPdfEstrategia = async (datos, logoBase64, meta = {}) => {

  const periodoRaw = (meta.periodoLabel || meta.periodo || "General").toString().trim();
  const doc = new jsPDF({ orientation: "landscape", format: "a3" });
  const pageWidth = doc.internal.pageSize.width;

  if (logoBase64) {
    doc.addImage(`data:image/png;base64,${logoBase64}`, "PNG", 14, 8, 25, 25);
  }

  doc.setFontSize(22);
  doc.setTextColor(13, 111, 107);
  doc.text(
    `REPORTE DE BENEFICIARIOS - ${periodoRaw}`,
    logoBase64 ? 45 : 14,
    20
  );


  autoTable(doc, {
    startY: 40,
    theme: "grid",
    headStyles: {
      fillColor: [13, 111, 107],
      fontSize: 8,
      halign: "center",
    },
    styles: {
      fontSize: 7,
      cellPadding: 2,
    },
    head: [[
      "Nombre", "Edad", "Periodo", "Estatus", "Escolaridad",
      "Escuela", "Teléfono", "Tutor", "Tel. Tutor",
      "Municipio", "C.P."
    ]],
    body: datos.map((p) => [
      p.nombre_completo,
      p.edad,
      p.periodo_columna || periodoRaw,
      p.estatus,
      p.escolaridad,
      p.escuela,
      p.telefono,
      p.tutor,
      p.telefono_tutor,
      p.municipio,
      p.cp
    ]),
  });

  // graficas
  if (meta.graficas?.length) {
    meta.graficas.forEach((g) => {
      doc.addPage();

      // titulo
      let titulo = (g.titulo || "Análisis general").toLowerCase();

      if (titulo.includes("edad")) {
        titulo = "Gráfico de barras de beneficiarios por edad";
      }
      else if (titulo.includes("escolaridad")) {
        titulo = "Gráfico de distribución de beneficiarios por nivel educativo";
      }
      else if (titulo.includes("municipio")) {
        titulo = "Top 10 municipios con mayor número de beneficiarios";
      }
      else {
        titulo = g.titulo || "Análisis general";
      }

      doc.setFontSize(16);
      doc.setTextColor(13, 111, 107);
      const textWidth = doc.getTextWidth(titulo);
      const xTitle = (pageWidth - textWidth) / 2;
      doc.text(titulo, xTitle, 20);

      // imagen
      if (g.imagen) {
        const imgWidth = 220;
        const imgHeight = 140;
        const xImg = (pageWidth - imgWidth) / 2;
        doc.addImage(g.imagen, "PNG", xImg, 30, imgWidth, imgHeight);
      }
      // tabla
      const cleanTable = (g.tabla || []).map(([label, value]) => [
        String(label ?? "Sin dato"),
        typeof value === "number" ? value : Number(value) || 0
      ]);

      let header = [["Concepto", "Total"]];

      if (titulo.includes("nivel educativo") || titulo.includes("escolaridad")) {
        header = [["Nivel educativo", "Cantidad de beneficiarios"]];
      }
      else if (titulo.includes("edad")) {
        header = [["Rango de edad", "Cantidad de beneficiarios"]];
      }
      else if (titulo.includes("municipio")) {
        header = [["Municipio", "Cantidad de beneficiarios"]];
      }

      autoTable(doc, {
        startY: 180,
        theme: "grid",
        head: header,
        body: cleanTable,

        styles: {
          fontSize: 10,
          halign: "center",
        },

        headStyles: {
          fillColor: [13, 111, 107],
          halign: "center",
        },

        margin: {
          left: (pageWidth - 200) / 2,
        },

        tableWidth: 200,
      });
    });
  }

  const paginas = doc.internal.getNumberOfPages();

  for (let i = 1; i <= paginas; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120);

    doc.text(
      `Centro de Esperanza Infantil A.C. | Página ${i} de ${paginas}`,
      pageWidth - 95,
      doc.internal.pageSize.height - 10
    );
  }

  return await doc.output("arraybuffer");
};

