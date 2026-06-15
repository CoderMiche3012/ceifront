import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { aplicarEstilosExcelGlobal } from "../../reporteUtils";

const COLUMNAS_BENEFICIARIOS = [
  { key: "nombre_completo", width: 30 },
  { key: "periodo", width: 15 },
  { key: "tipo", width: 20 },
  { key: "estatus", width: 40 },
  { key: "fecha", width: 30 },
  { key: "observaciones", width: 25 },
];

const HEADERS_BENEFICIARIOS = [
  "Nombre Completo",
  "Periodo",
  "Tipo de Obligacion",
  "Estatus",
  "Fecha programada",
  "Observaciones",
];

const TIPO_LABELS = {
  servicioSocial: "Servicio Social",
  practicaProfesional: "Práctica Profesional",
  carta: "Carta",
};

// EXCEL
export const generarExcelEstrategia = async (datos, logoBase64, meta = {}) => {
  const periodoRaw = (meta.periodoLabel || meta.periodo || "General").toString().trim();
  const titulo = `REPORTE DE OBLIGACIONES - ${periodoRaw}`;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Beneficiarios");

  worksheet.columns = COLUMNAS_BENEFICIARIOS;
  worksheet.getRow(5).values = HEADERS_BENEFICIARIOS;
  worksheet.autoFilter = {
    from: "A5",
    to: "F5",
  };

  datos.forEach((p) => {
    worksheet.addRow([
      p.nombre_completo,
      p.periodo || periodoRaw,
      TIPO_LABELS[p.tipo] || p.tipo,
      p.estatus,
      p.fecha,
      p.observaciones,
    ]);
  });

  await aplicarEstilosExcelGlobal(worksheet, titulo, workbook, logoBase64, { alineacionHeaders: "left" });

  return await workbook.xlsx.writeBuffer();
};

// PDF
export const generarPdfEstrategia = async (datos, logoBase64, meta = {}) => {
  const periodoRaw = (meta.periodoLabel || meta.periodo || "General").toString().trim();
  const doc = new jsPDF({ orientation: "landscape", format: "a3" });

  if (logoBase64) {
    doc.addImage(`data:image/png;base64,${logoBase64}`, "PNG", 14, 8, 25, 25);
  }

  doc.setFontSize(22);
  doc.setTextColor(13, 111, 107);
  doc.text(`REPORTE DE OBLIGACIONES - ${periodoRaw}`, logoBase64 ? 45 : 14, 20);

  autoTable(doc, {
    startY: 40,
    theme: "grid",
    headStyles: { fillColor: [13, 111, 107], fontSize: 8, halign: "center" },
    styles: { fontSize: 7, cellPadding: 2 },
    head: [HEADERS_BENEFICIARIOS],
    body: datos.map((p) => [
      p.nombre_completo,
      p.periodo || periodoRaw,
      TIPO_LABELS[p.tipo] || p.tipo,
      p.estatus,
      p.fecha,
      p.observaciones,
    ]),
  });

  return await doc.output("arraybuffer");
};