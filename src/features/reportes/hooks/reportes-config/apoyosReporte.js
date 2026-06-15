import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { aplicarEstilosExcelGlobal } from "../../reporteUtils";

const COLUMNAS_BENEFICIARIOS = [
  { key: "nombre", width: 30 },
  { key: "edad", width: 20 },
  { key: "periodo", width: 15 },
  { key: "total_registrados", width: 40 },
  { key: "total_entregados", width: 30 },
  { key: "total_pendientes", width: 25 },
  { key: "fecha_ultimo_apoyo", width: 25 },
];

const HEADERS_BENEFICIARIOS = [
  "Nombre Completo",
  "Edad",
  "Periodo",
  "Total de apoyos",
  "Apoyos entregados",
  "Apoyos Pendientes",
  "Ultimo apoyo entregado",
];

// excel
export const generarExcelEstrategia = async (datos, logoBase64, meta = {}) => {
  const periodoRaw = (meta.periodoLabel || meta.periodo || "General").toString().trim();
  const titulo = `REPORTE DE APOYOS - ${periodoRaw}`;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Beneficiarios");

  worksheet.columns = COLUMNAS_BENEFICIARIOS;
  worksheet.getRow(5).values = HEADERS_BENEFICIARIOS;
  worksheet.autoFilter = {
    from: "A5",
    to: "G5",
  };

  datos.forEach((p) => {
    worksheet.addRow([
      p.nombre_completo,
      p.edad,
      p.periodo || periodoRaw,
      p.total_registrados,
      p.total_entregados,
      p.total_pendientes,
      p.fecha_ultimo_apoyo,
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
  doc.text(`REPORTE DE APOYOS - ${periodoRaw}`, logoBase64 ? 45 : 14, 20);

  autoTable(doc, {
    startY: 40,
    theme: "grid",
    headStyles: { fillColor: [13, 111, 107], fontSize: 8, halign: "center" },
    styles: { fontSize: 7, cellPadding: 2 },
    head: [HEADERS_BENEFICIARIOS],
    body: datos.map((p) => [
      p.nombre_completo,
      p.edad,
      p.periodo || periodoRaw,
      p.total_registrados,
      p.total_entregados,
      p.total_pendientes,
      p.fecha_ultimo_apoyo,
    ]),
  });

  return await doc.output("arraybuffer");
};