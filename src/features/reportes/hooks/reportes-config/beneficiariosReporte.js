import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { aplicarEstilosExcelGlobal } from "../../reporteUtils";

// ==========================================
// EXCEL - BENEFICIARIOS
// ==========================================
export const generarExcelEstrategia = async (datos, logoBase64, meta = {}) => {
  const periodoRaw = (meta.periodoLabel || meta.periodo || "General").toString().trim();
  const titulo = `REPORTE DE BENEFICIARIOS - ${periodoRaw}`;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Beneficiarios");

  // Definición única y ordenada de columnas
  worksheet.columns = [
    { key: "nombre", width: 35 }, { key: "edad", width: 10 }, { key: "periodo", width: 15 },
    { key: "estatus", width: 15 }, { key: "escolaridad", width: 20 }, { key: "escuela", width: 30 },
    { key: "telefono", width: 15 }, { key: "tutor", width: 30 }, { key: "telTutor", width: 15 },
    { key: "municipio", width: 20 }, { key: "colonia", width: 20 }, { key: "cp", width: 10 },
    { key: "calle", width: 20 }, { key: "numero", width: 10 }, { key: "nota", width: 45 }
  ];

  const headers = [
    "Nombre Completo", "Edad", "Periodo", "Estatus", "Escolaridad", "Escuela",
    "Teléfono", "Tutor", "Tel. Tutor", "Municipio", "Colonia", "C.P.", "Calle", "Número", "Nota"
  ];

  worksheet.getRow(5).values = headers;

  worksheet.autoFilter = {
    from: { row: 5, column: 1 },
    to: { row: 5, column: headers.length }
  };

  datos.forEach((p) => {
    worksheet.addRow([
      p.nombre_completo, p.edad, p.periodo_columna || periodoRaw, p.estatus, p.escolaridad,
      p.escuela, p.telefono, p.tutor, p.telefono_tutor, p.municipio, p.colonia, p.cp,
      p.calle, p.numero, p.nota_seguimiento
    ]);
  });

  await aplicarEstilosExcelGlobal(worksheet, titulo, workbook, logoBase64);

  // --- HOJA RESUMEN ---
  const resumen = workbook.addWorksheet("Resumen");
  resumen.columns = [{ width: 30 }, { width: 20 }];

  const addRowStyle = (values, bold = false, size = 11) => {
    const row = resumen.addRow(values);
    row.font = { bold, size };
    return row;
  };

  addRowStyle(["DETALLE DEL REPORTE"], true, 14);
  resumen.addRow(["Generado el:", new Date().toLocaleDateString()]);
  resumen.addRow(["Periodo seleccionado:", periodoRaw]);
  resumen.addRow([]);
  addRowStyle(["MÉTRICAS", "TOTAL"], true);
  resumen.addRow(["Total de Beneficiarios", datos.length]);
  resumen.addRow(["Activos", datos.filter(d => d.estatus === "Activo").length]);
  resumen.addRow(["Graduados", datos.filter(d => d.estatus === "Graduado").length]);
  resumen.addRow(["Pendientes", datos.filter(d => !["Activo", "Graduado"].includes(d.estatus)).length]);

  return await workbook.xlsx.writeBuffer();
};

// ==========================================
// PDF - BENEFICIARIOS
// ==========================================
export const generarPdfEstrategia = async (datos, logoBase64, meta = {}) => {
  const periodoRaw = (
    meta.periodoLabel ||
    meta.periodo ||
    "General"
  ).toString().trim();

  const titulo = `REPORTE DE BENEFICIARIOS - ${periodoRaw}`;

  const doc = new jsPDF({
    orientation: "landscape",
    format: "a3",
  });

  const pageWidth = doc.internal.pageSize.width;

  // ==========================================
  // ENCABEZADO
  // ==========================================

  if (logoBase64) {
    doc.addImage(
      `data:image/png;base64,${logoBase64}`,
      "PNG",
      14,
      8,
      25,
      25
    );
  }

  doc.setFontSize(22);
  doc.setTextColor(13, 111, 107);
  doc.text(titulo, logoBase64 ? 45 : 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);

  doc.text(
    `Periodo: ${periodoRaw} | Emisión: ${new Date().toLocaleDateString(
      "es-MX"
    )}`,
    logoBase64 ? 45 : 14,
    28
  );

  // ==========================================
  // TABLA PRINCIPAL
  // ==========================================

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
      overflow: "linebreak",
    },

    head: [[
      "Nombre",
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
      "C.P.",
      "Calle",
      "Num",
      "Nota",
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
      p.colonia,
      p.cp,
      p.calle,
      p.numero,
      p.nota_seguimiento,
    ]),
  });

  // ==========================================
  // RESUMEN EJECUTIVO
  // ==========================================

  if (meta.resumen) {
    doc.addPage();

    doc.setFontSize(18);
    doc.setTextColor(13, 111, 107);
    doc.text("Resumen Ejecutivo", 14, 20);

    autoTable(doc, {
      startY: 30,
      theme: "grid",

      head: [["Indicador", "Total"]],

      body: [
        ["Beneficiarios", meta.resumen.total],
        ["Activos", meta.resumen.activos],
        ["Graduados", meta.resumen.graduados],
        ["Inactivos", meta.resumen.inactivos],
        ["En Pausa", meta.resumen.pausa],
      ],
    });
  }

  // ==========================================
  // GRÁFICO DE ESTATUS
  // ==========================================

  // ==========================================
// GRÁFICO DE NIVEL ESCOLAR
// ==========================================

if (meta.graficaEscolaridad) {
  doc.addPage();

  doc.setFontSize(16);
  doc.setTextColor(13, 111, 107);
  doc.text("Distribución por Nivel Escolar", 14, 20);

  doc.addImage(
    meta.graficaEscolaridad,
    "PNG",
    20,
    35,
    220,
    110
  );
}

  // ==========================================
  // GRÁFICO DE EDADES
  // ==========================================

  if (meta.graficaEdades) {
    doc.addPage();

    doc.setFontSize(16);
    doc.setTextColor(13, 111, 107);
    doc.text("Distribución por Rangos de Edad", 14, 20);

    doc.addImage(
      meta.graficaEdades,
      "PNG",
      20,
      35,
      220,
      110
    );
  }

  // ==========================================
  // DISTRIBUCIÓN POR MUNICIPIO
  // ==========================================

  if (meta.municipiosTabla?.length) {
    doc.addPage();

    doc.setFontSize(16);
    doc.setTextColor(13, 111, 107);
    doc.text("Distribución por Municipio", 14, 20);

    autoTable(doc, {
      startY: 30,
      theme: "grid",

      headStyles: {
        fillColor: [13, 111, 107],
      },

      head: [["Municipio", "Beneficiarios"]],

      body: meta.municipiosTabla.map(
        ([municipio, cantidad]) => [
          municipio,
          cantidad,
        ]
      ),
    });
  }

  // ==========================================
  // PIE DE PÁGINA
  // ==========================================

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