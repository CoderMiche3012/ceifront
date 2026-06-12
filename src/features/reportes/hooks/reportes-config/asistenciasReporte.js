import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { aplicarEstilosExcelGlobal } from "../../reporteUtils";
import logoCei from "../../../../assets/imagenes/logo.png";

// ===============================
// LOGO BASE64
// ===============================
const obtenerBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(blob);
  });
};

const LOGO_CEI_BASE64 = await obtenerBase64(logoCei);

// ==========================================
// EXCEL - ASISTENCIAS
// ==========================================
export const generarExcelEstrategia = async (datos) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Centro de Esperanza Infantil";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Asistencias");

  worksheet.columns = [
    { key: "beneficiario", width: 35 },
    { key: "tipo_servicio", width: 20 },
    { key: "acompanantes", width: 18 },
    { key: "fecha", width: 18 },
  ];

  const headers = [
    "Beneficiario",
    "Servicio",
    "Acompañantes",
    "Fecha",
  ];

  worksheet.getRow(5).values = headers;

  datos.forEach((a) => {
    worksheet.addRow([
      a.beneficiario || "",
      a.tipo_servicio || "",
      a.numero_acompanantes || 0,
      a.fecha || "",

    ]);
  });

  worksheet.autoFilter = "A5:F5";

  // LOGO
  if (LOGO_CEI_BASE64) {
    try {
      const cleanBase64 = LOGO_CEI_BASE64.includes("base64,")
        ? LOGO_CEI_BASE64.split("base64,")[1]
        : LOGO_CEI_BASE64;

      const imageId = workbook.addImage({
        base64: cleanBase64,
        extension: "png",
      });

      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 100, height: 70 },
      });
    } catch (e) {
      console.error(e);
    }
  }

  await aplicarEstilosExcelGlobal(
    worksheet,
    "REPORTE DE ASISTENCIAS",
    workbook,
    LOGO_CEI_BASE64
  );

  const buffer = await workbook.xlsx.writeBuffer();

  return buffer instanceof ArrayBuffer
    ? buffer
    : new Uint8Array(buffer).buffer;
};

// ==========================================
// PDF - ASISTENCIAS
// ==========================================
export const generarPdfAsistencias = async (datos) => {
  const doc = new jsPDF({
    orientation: "landscape",
    format: "a3",
  });

  if (LOGO_CEI_BASE64) {
    doc.addImage(
      `data:image/png;base64,${LOGO_CEI_BASE64}`,
      "PNG",
      14,
      10,
      32,
      24
    );
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(13, 111, 107);
  doc.text("REPORTE DE ASISTENCIAS", 50, 20);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Centro de Esperanza Infantil A.C. | Fecha: ${new Date().toLocaleDateString("es-MX")}`,
    50,
    27
  );

  autoTable(doc, {
    startY: 38,
    theme: "striped",
    head: [[
      "Beneficiario",
      "Servicio",
      "Acompañantes",
      "Fecha",

    ]],
    body: datos.map((a) => [
      a.beneficiario || "",
      a.tipo_servicio || "",
      a.numero_acompanantes || 0,
      a.fecha || "",
    ]),
  });

  const blob = doc.output("blob");
  const buffer = await blob.arrayBuffer();

  return buffer;
};