import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { aplicarEstilosExcelGlobal } from "../../reporteUtils";

// para el excel
export const generarExcelEstrategia = async (datos, logoBase64, meta = {}) => {
  const periodoRaw = (meta.periodoLabel || meta.periodo || "General").trim();
  const esGeneral = periodoRaw.toLowerCase() === "general";
  const nombrePeriodo = esGeneral ? "General" : periodoRaw;
  const sufijoTexto = esGeneral ? "General" : "de este periodo";

  // Si es general se limpia el guion y la palabra
  const tituloReporte = esGeneral
    ? "REPORTE DE DONATIVOS"
    : `REPORTE DE DONATIVOS - ${nombrePeriodo}`;

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
    "Origen",
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
    tituloReporte,
    workbook,
    logoBase64
  );
  // Guardar estilos originales
  const estiloTitulo = { ...worksheet.getCell("D3").style };
  const estiloSubtitulo = { ...worksheet.getCell("D4").style };
  // Solo este reporte
  worksheet.unMergeCells("D3:J3");
  worksheet.unMergeCells("D4:J4");
  worksheet.mergeCells("C3:H3");
  worksheet.mergeCells("C4:H4");
  worksheet.getCell("C3").value = tituloReporte.toUpperCase();
  worksheet.getCell("C3").style = estiloTitulo;
  worksheet.getCell("C3").alignment = {
    horizontal: "left",
    vertical: "middle",
  };

  worksheet.getCell("C4").value = `Centro de Esperanza Infantil A.C. | Fecha: ${new Date().toLocaleDateString("es-MX")}`;
  worksheet.getCell("C4").style = estiloSubtitulo;
  worksheet.getCell("C4").alignment = {
    horizontal: "left",
    vertical: "middle",
  };
  // para resumen
  const resumen = workbook.addWorksheet("Resumen");
  resumen.getColumn(2).alignment = { horizontal: "center" };
  resumen.mergeCells("A1:B1");
  resumen.getCell("A1").value = esGeneral ? "RESUMEN GENERAL" : "RESUMEN DEL PERIODO";
  resumen.getCell("A1").font = { bold: true, size: 14, color: { argb: "0D6F6B" } };
  resumen.getCell("A1").alignment = { horizontal: "center" };
  resumen.addRow([]);
  resumen.addRow(["Indicador", "Total"]);

  ["A3", "B3"].forEach((cell) => {
    resumen.getCell(cell).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0D6F6B" },
    };
    resumen.getCell(cell).font = { bold: true, color: { argb: "FFFFFF" } };
    resumen.getCell(cell).alignment = { horizontal: "center" };
  });

  const totalDonadores = datos.length;
  const totalDonativos = datos.reduce((acc, d) => acc + (Number(d.cantidad_donativos) || 0), 0);
  const promedioDonativos = totalDonadores > 0 ? Number((totalDonativos / totalDonadores).toFixed(2)) : 0;

  const donadorMasActivo = datos.reduce(
    (max, actual) => (actual.cantidad_donativos || 0) > (max.cantidad_donativos || 0) ? actual : max,
    {}
  ) || {};

  resumen.addRow([`Total de donadores ${sufijoTexto}`, totalDonadores]);
  resumen.addRow([`Total de donativos ${sufijoTexto}`, totalDonativos]);
  resumen.addRow(["Promedio por donador", promedioDonativos]);
  resumen.addRow(["Donador más activo", donadorMasActivo.donador || "N/A"]);
  resumen.addRow(["Donativos del Donador más activo", donadorMasActivo.cantidad_donativos || 0]);

  // tipo
  resumen.addRow([]);
  resumen.addRow([]);
  const distribucion = {};
  datos.forEach((d) => {
    const tipo = d.tipo || "Sin tipo";
    distribucion[tipo] = (distribucion[tipo] || 0) + (Number(d.cantidad_donativos) || 0);
  });
  const filaTitulo = resumen.addRow(["DISTRIBUCIÓN DE DONACIONES POR ORIGEN"]);
  resumen.mergeCells(`A${filaTitulo.number}:B${filaTitulo.number}`);
  filaTitulo.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "0D6F6B" } };
  filaTitulo.getCell(1).font = { bold: true, color: { argb: "FFFFFF" } };
  filaTitulo.getCell(1).alignment = { horizontal: "center" };

  const encabezado = resumen.addRow(["Origen", "Cantidad de Donativos"]);
  encabezado.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "0D6F6B" } };
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.alignment = { horizontal: "center" };
  });

  Object.entries(distribucion).forEach(([tipo, cantidad]) => {
    const row = resumen.addRow([tipo, cantidad]);
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "D1D5DB" } },
        left: { style: "thin", color: { argb: "D1D5DB" } },
        bottom: { style: "thin", color: { argb: "D1D5DB" } },
        right: { style: "thin", color: { argb: "D1D5DB" } },
      };
    });
  });

  resumen.columns = [{ width: 35 }, { width: 25 }];
  const buffer = await workbook.xlsx.writeBuffer();

  return buffer instanceof ArrayBuffer ? buffer : new Uint8Array(buffer).buffer;
};

// para el pdf
export const generarPdfEstrategia = async (datos, logoBase64, meta = {}) => {
  const periodoRaw = (meta.periodoLabel || meta.periodo || "General").trim();
  const esGeneral = periodoRaw.toLowerCase() === "general";
  const nombrePeriodo = esGeneral ? "General" : periodoRaw;
  const sufijoTexto = esGeneral ? "General" : "de este periodo";

  const tituloReporte = esGeneral
    ? "REPORTE DE DONATIVOS"
    : `REPORTE DE DONATIVOS - ${nombrePeriodo}`;

  const doc = new jsPDF({
    orientation: "landscape",
    format: "a3",
  });

  const pageWidth = doc.internal.pageSize.width;

  if (logoBase64) {
    try {
      doc.addImage(`data:image/png;base64,${logoBase64}`, "PNG", 14, 8, 30, 30);
    } catch (e) {
      console.error("Error agregando logo al PDF", e);
    }
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(13, 111, 107);

  // título controlado condicionalmente
  doc.text(
    tituloReporte,
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

  const totalDonadores = datos.length;
  const totalDonativos = datos.reduce((acc, d) => acc + (Number(d.cantidad_donativos) || 0), 0);
  const donadorMasActivo = datos.reduce(
    (max, actual) => (actual.cantidad_donativos || 0) > (max.cantidad_donativos || 0) ? actual : max,
    {}
  ) || {};

  doc.setFontSize(10);
  doc.setTextColor(120);

  const col1 = logoBase64 ? 50 : 14;
  const col2 = pageWidth * 0.38;
  const col3 = pageWidth * 0.68;

  doc.text(`Total de Donadores  ${sufijoTexto}: ${totalDonadores}`, col1, 33);
  doc.text(`Total Donativos Registrados ${sufijoTexto}: ${totalDonativos}`, col2, 33);
  doc.text(`Donador con más donaciones: ${donadorMasActivo.donador || "N/A"}`, col3, 33);

  autoTable(doc, {
    startY: 42,
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
    head: [["Donador", "Origen", "Cantidad Donativos", "Última Donación", "Aportaciones"]],
    body: datos.map((d) => [
      d.donador || "",
      d.tipo || "-",
      d.cantidad_donativos || 0,
      d.ultima_fecha || "Sin donaciones",
      d.aportaciones || "Sin aportaciones registradas",
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

