import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { aplicarEstilosExcelGlobal } from "../../reporteUtils";

// generar excel
export const generarExcelEstrategia = async (datos, logoBase64) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Centro de Esperanza Infantil";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Donativos");

  worksheet.columns = [
    { key: "donador", width: 35 },
    { key: "tipo", width: 15 },
    { key: "cantidad_donativos", width: 20 },
    { key: "ultima_fecha", width: 20 },
    { key: "aportaciones", width: 40 },
  ];

  const headers = [
  "Donador",
  "Tipo",
  "Cantidad de Donativos",
  "Última Donación",
  "Aportaciones",
];

  worksheet.getRow(5).values = headers;

  datos.forEach((d) => {
  worksheet.addRow([
    d.donador || "",
    d.tipo || "-",
    d.cantidad_donativos || 0,
    d.ultima_fecha || "Sin donaciones",
    d.aportaciones || "Sin aportaciones registradas",
  ]);
});

  worksheet.autoFilter = "A5:E5";


  await aplicarEstilosExcelGlobal(
    worksheet,
    "REPORTE DE DONADORES",
    workbook,
    logoBase64
  );

  const buffer = await workbook.xlsx.writeBuffer();

  return buffer instanceof ArrayBuffer
    ? buffer
    : new Uint8Array(buffer).buffer;
};

// ==========================================
// PDF - DONADORES
// ==========================================
export const generarPdfEstrategia = async (datos, logoBase64) => {
  const doc = new jsPDF({
    orientation: "landscape",
    format: "a3",
  });

  if (logoBase64) {
    try {
      doc.addImage(
        `data:image/png;base64,${logoBase64}`,
        "PNG",
        14,
        8,
        30,
        30
      );
    } catch (e) {
      console.error("Error agregando logo al PDF", e);
    }
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(13, 111, 107);
  doc.text(
    "REPORTE DE DONADORES",
    logoBase64 ? 50 : 14,
    20
  );

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Centro de Esperanza Infantil A.C. | Fecha: ${new Date().toLocaleDateString("es-MX")}`,
    logoBase64 ? 50 : 14,
    27
  );

  autoTable(doc, {
    startY: 38,
    theme: "striped",
    headStyles: {
      fillColor: [13, 111, 107],
      textColor: [255, 255, 255],
      fontSize: 9,
      halign: "center",
    },
    styles: {
      font: "Helvetica",
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [55, 65, 81],
      lineColor: [229, 231, 235],
      lineWidth: 0.2,
    },
    head: [[
  "Donador",
  "Tipo",
  "Cantidad Donativos",
  "Última Donación",
  "Aportaciones"
]],
    body: datos.map((d) => [
  d.donador || "",
  d.tipo || "-",
  d.cantidad_donativos || 0,
  d.ultima_fecha || "Sin donaciones",
  d.aportaciones || "Sin aportaciones registradas",
]),
  });

  const pdfBlob = doc.output("blob");
  const buffer = await pdfBlob.arrayBuffer();

  return buffer;
};