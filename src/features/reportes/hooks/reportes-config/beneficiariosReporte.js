import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { aplicarEstilosExcelGlobal } from "../../reporteUtils";
import logoCei from "../../../../assets/imagenes/logo.png";

// =========================
// LOGO BASE64
// =========================
const obtenerBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result.split(",")[1]);
    };
    reader.readAsDataURL(blob);
  });
};

const LOGO_CEI_BASE64 = await obtenerBase64(logoCei);

// ==========================================
// EXCEL - BENEFICIARIOS
// ==========================================
export const generarExcelEstrategia = async (datos) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Centro de Esperanza Infantil";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("beneficiarios");

  worksheet.columns = [
    { key: "nombreCompleto", width: 35 },
    { key: "estatus", width: 16 },
    { key: "edad", width: 10 },
    { key: "telefono", width: 18 },

    // 🔥 DIRECCIÓN SEPARADA
    { key: "municipio", width: 22 },
    { key: "colonia", width: 25 },
    { key: "cp", width: 12 },

    { key: "calle", width: 28 },
    { key: "numero", width: 10 },

  ];

  const headers = [
    "Nombre Completo",
    "Estatus",
    "Edad",
    "Teléfono",
    "Municipio",
    "Colonia",
    "C.P.",
    "Calle",
    "Número",

  ];

  worksheet.getRow(5).values = headers;

  datos.forEach((p) => {
    worksheet.addRow([
      p.nombre_completo || "",
      p.estatus || "",
      p.edad || "",
      p.telefono || "",

      p.municipio || "",
      p.colonia || "",
      p.cp || "",

      p.calle || "",
      p.numero || "",

    ]);
  });

  worksheet.autoFilter = "A5:K5";

  // =========================
  // LOGO
  // =========================
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
        editAs: "oneCell",
      });
    } catch (e) {
      console.error("Error cargando logo en Excel", e);
    }
  }

  await aplicarEstilosExcelGlobal(
    worksheet,
    "REPORTE DE BENEFICIARIOS",
    workbook,
    LOGO_CEI_BASE64
  );

  const buffer = await workbook.xlsx.writeBuffer();

  return buffer instanceof ArrayBuffer
    ? buffer
    : new Uint8Array(buffer).buffer;
};

// ==========================================
// PDF - BENEFICIARIOS
// ==========================================
export const generarPdfEstrategia = async (datos) => {
  const doc = new jsPDF({
    orientation: "landscape",
    format: "a3",
  });

  if (LOGO_CEI_BASE64) {
    try {
      doc.addImage(
        `data:image/png;base64,${LOGO_CEI_BASE64}`,
        "PNG",
        14,
        10,
        32,
        24
      );
    } catch (e) {
      console.error("Error agregando logo al PDF", e);
    }
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(13, 111, 107);
  doc.text(
    "REPORTE DE BENEFICIARIOS",
    LOGO_CEI_BASE64 ? 50 : 14,
    20
  );

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Centro de Esperanza Infantil A.C. | Fecha: ${new Date().toLocaleDateString("es-MX")}`,
    LOGO_CEI_BASE64 ? 50 : 14,
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
      "Nombre",
      "Estatus",
      "Edad",
      "Teléfono",
      "Municipio",
      "Colonia",
      "C.P.",
      "Calle",
      "Número",
    ]],
    body: datos.map((p) => [
      p.nombre_completo || "",
      p.estatus || "",
      p.edad || "",
      p.telefono || "",

      p.municipio || "",
      p.colonia || "",
      p.cp || "",

      p.calle || "",
      p.numero || "",

    ]),
  });

  const pdfBlob = doc.output("blob");
  const buffer = await pdfBlob.arrayBuffer();

  return buffer;
};