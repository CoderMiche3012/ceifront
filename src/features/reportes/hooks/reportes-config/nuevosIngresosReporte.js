import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { aplicarEstilosExcelGlobal } from "../../reporteUtils";

// generar el excel
export const generarExcelEstrategia = async (datos, logoBase64Param, meta = {}) => {
  const logoFinal = logoBase64Param;

  const periodoRaw = (meta.periodoLabel || meta.periodo || "General").trim();
  const esGeneral = periodoRaw.toLowerCase() === "general";
  const nombrePeriodo = esGeneral ? "General" : periodoRaw;

  const tituloReporte = esGeneral
    ? "REPORTE DE NUEVOS INGRESOS"
    : `REPORTE DE NUEVOS INGRESOS - ${nombrePeriodo}`;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Centro de Esperanza Infantil";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Nuevos Ingresos");

  worksheet.columns = [
    { key: "nombreCompleto", width: 35 },
    { key: "estatus", width: 16 },
    { key: "prioridad", width: 14 },
    { key: "edad", width: 10 },
    { key: "genero", width: 14 },
    { key: "telefono", width: 18 },
    { key: "nivelEscolar", width: 18 },
    { key: "cp", width: 12 },
    { key: "municipio", width: 22 },
    { key: "direccionCompleta", width: 32 },
    { key: "tutor", width: 32 },
    { key: "telefonoTutor", width: 18 },
    { key: "familiares", width: 14 },
    { key: "fechaVisita", width: 18 },
    { key: "nota_familiar", width: 25 },
    { key: "notaVisita", width: 25 },
    { key: "notaServicio", width: 25 },
    { key: "referenciaIngreso", width: 25 },
  ];

  const headers = [
    "Nombre Completo",
    "Estatus",
    "Prioridad",
    "Edad",
    "Género",
    "Teléfono",
    "Nivel Inicial",
    "C.P.",
    "Municipio",
    "Direccion",
    "Tutor responsable",
    "Tel. Tutor",
    "N° familiares",
    "Fecha Visita",
    "Nota Familiar",
    "Nota de la visita",
    "Nota de prioridad",
    "Recomendacion",
  ];

  worksheet.getRow(5).values = headers;

  datos.forEach((p) => {
    worksheet.addRow([
      p.nombreCompleto || "",
      p.estatus || "",
      p.prioridad || "",
      p.edad || "",
      p.genero || "",
      p.telefono || "",
      p.nivelEscolar || "",
      p.cp || "",
      p.municipio || "",
      p.direccionCompleta || "",
      p.tutor || "",
      p.telefonoTutor || "",
      p.familiares || "",
      p.fechaVisita || "",
      p.nota_familiar || "",
      p.notaVisita || "",
      p.notaServicio || "",
      p.referenciaIngreso || "",
    ]);
  });

  worksheet.autoFilter = "A5:R5";

  await aplicarEstilosExcelGlobal(
    worksheet,
    tituloReporte,
    workbook,
    logoFinal
  );

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer instanceof ArrayBuffer ? buffer : new Uint8Array(buffer).buffer;
};

// para el pdf

export const generarPdfEstrategia = async (datos, logoBase64Param, meta = {}) => {

  const logoFinal = logoBase64Param;
  const periodoRaw = (meta.periodoLabel || meta.periodo || "General").trim();
  const esGeneral = periodoRaw.toLowerCase() === "general";
  const nombrePeriodo = esGeneral ? "General" : periodoRaw;
  const sufijoTexto = esGeneral ? "General" : "de este periodo";

  const tituloReporte = esGeneral
    ? "REPORTE DE NUEVOS INGRESOS"
    : `REPORTE DE NUEVOS INGRESOS - ${nombrePeriodo}`;

  const doc = new jsPDF({
    orientation: "landscape",
    format: "a3",
  });

  const pageWidth = doc.internal.pageSize.width;

  if (logoFinal) {
    try {
      doc.addImage(`data:image/png;base64,${logoFinal}`, "PNG", 14, 8, 30, 30);
    } catch (e) {
      alert("Error al descargar");
    }
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(13, 111, 107);
  doc.text(tituloReporte, logoFinal ? 50 : 14, 20);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Centro de Esperanza Infantil A.C.  |  Fecha: ${new Date().toLocaleDateString("es-MX")}`,
    logoFinal ? 50 : 14,
    27
  );

  const totalSolicitudes = datos.length;
  const prioridadAlta = datos.filter(p => p.prioridad?.toString().toLowerCase().includes("alta")).length;

  doc.setFontSize(10);
  doc.setTextColor(120);

  const col1 = logoFinal ? 50 : 14;
  const col2 = pageWidth * 0.38;
  const col3 = pageWidth * 0.68;

  doc.text(`Total de Solicitudes : ${totalSolicitudes}`, col1, 33);
  doc.text(`Casos Prioridad Alta: ${prioridadAlta}`, col2, 33);

  autoTable(doc, {
    startY: 42,
    theme: "striped",
    headStyles: {
      fillColor: [13, 111, 107],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
    },
    styles: {
      font: "Helvetica",
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [55, 65, 81],
      lineColor: [229, 231, 235],
      lineWidth: 0.2,
      cellWidth: "wrap",
    },
    columnStyles: {
      13: { cellWidth: 35 },
      14: { cellWidth: 35 },
      15: { cellWidth: 35 },
    },
    head: [[
      "Nombre Completo",
      "Estatus",
      "Prioridad",
      "Edad",
      "Género",
      "Teléfono",
      "Nivel Inicial",
      "C.P.",
      "Municipio",
      "Colonia",
      "Tutor Responsable",
      "Tel. Tutor",
      "Fam.",
      "Fecha Visita",
      "Recomendacion",
    ]],

    body: datos.map((p) => [
      p.nombreCompleto || "",
      p.estatus || "",
      p.prioridad || "",
      p.edad || "",
      p.genero || "",
      p.telefono || "",
      p.nivelEscolar || "",
      p.cp || "",
      p.municipio || "",
      p.colonia || "",
      p.tutor || "",
      p.telefonoTutor || "",
      p.familiares || "",
      p.fechaVisita || "",
      p.referenciaIngreso || "",
    ]),
  });

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

  const pdfBlob = doc.output("blob");
  const buffer = await pdfBlob.arrayBuffer();
  return buffer;
};