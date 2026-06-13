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
  const colorTitulo = "0D6F6B";
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

  // ==========================================
  // DATOS PARA RESUMEN
  // ==========================================

  const activos = datos.filter(
    d => d.estatus?.toLowerCase() === "activo"
  ).length;

  const graduados = datos.filter(
    d =>
      d.estatus?.toLowerCase() === "graduado" ||
      d.estatus?.toLowerCase() === "finalizado"
  ).length;

  const inactivos = datos.filter(
    d => d.estatus?.toLowerCase() === "inactivo"
  ).length;

  const niveles = {};

  datos.forEach((b) => {
    let nivel = "Sin Registro";

    const escolaridad =
      b.escolaridad?.toLowerCase() || "";

    if (escolaridad.includes("preescolar")) {
      nivel = "Preescolar";
    } else if (escolaridad.includes("primaria")) {
      nivel = "Primaria";
    } else if (escolaridad.includes("secundaria")) {
      nivel = "Secundaria";
    } else if (
      escolaridad.includes("preparatoria") ||
      escolaridad.includes("bachillerato")
    ) {
      nivel = "Bachillerato";
    } else if (
      escolaridad.includes("universidad") ||
      escolaridad.includes("licenciatura")
    ) {
      nivel = "Universidad";
    }

    niveles[nivel] =
      (niveles[nivel] || 0) + 1;
  });

  const edades = {
    "0-5": 0,
    "6-10": 0,
    "11-15": 0,
    "16-18": 0,
    "19+": 0,
  };

  datos.forEach((b) => {
    const edad = Number(b.edad);

    if (isNaN(edad)) return;

    if (edad <= 5) edades["0-5"]++;
    else if (edad <= 10) edades["6-10"]++;
    else if (edad <= 15) edades["11-15"]++;
    else if (edad <= 18) edades["16-18"]++;
    else edades["19+"]++;
  });

  // ==========================================
  // HOJA RESUMEN
  // ==========================================

  // ==========================================
// HOJA RESUMEN
// ==========================================
const resumen = workbook.addWorksheet("Resumen");
  const tituloresumen = `RESUMEN DE BENEFICIARIOS - ${periodoRaw}`;

await aplicarEstilosExcelGlobal(
  resumen,
  tituloresumen,
  workbook,
  logoBase64,
  {
    usarHeader: true,
    usarTabla: false
  }
);

// ==========================================
// COLUMNAS (ZONA DASHBOARD)
// ==========================================
resumen.columns = [
  { width: 5 },   // A espacio
  { width: 5 },   // B espacio
  { width: 28 },  // C bloque 1
  { width: 18 },  // D bloque 1
  { width: 5 },   // E espacio
  { width: 28 },  // F bloque 2
  { width: 18 },  // G bloque 2
  { width: 5 },   // H espacio
  { width: 28 },  // I bloque 3
  { width: 18 },  // J bloque 3
];


// ==========================================
// TITULOS DE BLOQUES (MISMA FILA)
// ==========================================

// DATOS GENERALES
resumen.getCell("C7").value = "DATOS GENERALES";
resumen.mergeCells("C7:D7");

// NIVEL EDUCATIVO
resumen.getCell("F7").value = "NIVEL EDUCATIVO";
resumen.mergeCells("F7:G7");

// EDADES
resumen.getCell("I7").value = "RANGOS DE EDAD";
resumen.mergeCells("I7:J7");

// estilos bloques
["C7", "F7", "I7"].forEach((c) => {
  resumen.getCell(c).font = {
    bold: true,
    color: { argb: "FFFFFF" },
  };

  resumen.getCell(c).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0D6F6B" },
  };

  resumen.getCell(c).alignment = {
    horizontal: "center",
    vertical: "middle",
  };
});

// ==========================================
// SUBHEADERS
// ==========================================

// Datos generales
resumen.getCell("C8").value = "Concepto";
resumen.getCell("D8").value = "Cantidad";

// Nivel educativo
resumen.getCell("F8").value = "Nivel";
resumen.getCell("G8").value = "Beneficiarios";

// Edad
resumen.getCell("I8").value = "Rango";
resumen.getCell("J8").value = "Beneficiarios";

// ==========================================
// DATOS GENERALES
// ==========================================
resumen.getCell("C9").value = "Periodo";
resumen.getCell("D9").value = periodoRaw;

resumen.getCell("C10").value = "Total";
resumen.getCell("D10").value = datos.length;

resumen.getCell("C11").value = "Activos";
resumen.getCell("D11").value = activos;

resumen.getCell("C12").value = "Graduados";
resumen.getCell("D12").value = graduados;

resumen.getCell("C13").value = "Inactivos";
resumen.getCell("D13").value = inactivos;

// ==========================================
// NIVEL EDUCATIVO
// ==========================================
let filaNivel = 9;

Object.entries(niveles).forEach(([nivel, cantidad]) => {
  resumen.getCell(`F${filaNivel}`).value = nivel;
  resumen.getCell(`G${filaNivel}`).value = cantidad;
  filaNivel++;
});

// ==========================================
// EDADES
// ==========================================
let filaEdad = 9;

Object.entries(edades).forEach(([rango, cantidad]) => {
  resumen.getCell(`I${filaEdad}`).value = rango;
  resumen.getCell(`J${filaEdad}`).value = cantidad;
  filaEdad++;
});

  // ==========================================
// HOJA MUNICIPIOS
// ==========================================
// ==========================================
// HOJA MUNICIPIOS
// ==========================================

const hojaMunicipios = workbook.addWorksheet("Municipios");

await aplicarEstilosExcelGlobal(
  hojaMunicipios,
  titulo,
  workbook,
  logoBase64
);

// ==========================================
// COLUMNAS (ESPACIO + F Y G)
// ==========================================

hojaMunicipios.columns = [
  { width: 15 }, // A
  { width: 15 }, // B
  { width: 15 }, // C
  { width: 15 }, // D
  { width: 15 }, // E (espacio)
  { width: 40 }, // F (Municipio)
  { width: 25 }, // G (Cantidad)
];

// ==========================================
// TÍTULO
// ==========================================

hojaMunicipios.mergeCells("F7:G7");

hojaMunicipios.getCell("F7").value =
  "Distribución de Beneficiarios por Municipio";

hojaMunicipios.getCell("F7").alignment = {
  horizontal: "center",
  vertical: "middle",
};

hojaMunicipios.getCell("F7").font = {
  bold: true,
  size: 14,
};

// ==========================================
// ENCABEZADOS
// ==========================================

hojaMunicipios.getCell("F9").value = "Municipio";
hojaMunicipios.getCell("G9").value = "Cantidad Beneficiarios";

// ✔️ AUTO FILTER CORRECTO
hojaMunicipios.autoFilter = {
  from: { row: 9, column: 6 }, // F
  to: { row: 9, column: 7 },   // G
};

["F9", "G9"].forEach((celdaRef) => {
  const cell = hojaMunicipios.getCell(celdaRef);

  cell.font = {
    bold: true,
    color: { argb: "FFFFFF" },
  };

  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: colorTitulo },
  };

  cell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };
});

// ==========================================
// DATOS
// ==========================================

const municipios = {};

datos.forEach((b) => {
  const municipio = b.municipio || "Sin Registro";

  municipios[municipio] =
    (municipios[municipio] || 0) + 1;
});

let filaMunicipio = 10;

Object.entries(municipios)
  .sort((a, b) => b[1] - a[1])
  .forEach(([municipio, cantidad]) => {
    hojaMunicipios.getCell(`F${filaMunicipio}`).value = municipio;
    hojaMunicipios.getCell(`G${filaMunicipio}`).value = cantidad;

    hojaMunicipios.getCell(`F${filaMunicipio}`).alignment = {
      vertical: "middle",
    };

    hojaMunicipios.getCell(`G${filaMunicipio}`).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    filaMunicipio++;
  });


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
// ÚLTIMA HOJA: GRÁFICOS
// ==========================================

if (meta.graficaEscolaridad || meta.graficaEdades) {
  doc.addPage();

  doc.setFontSize(16);
  doc.setTextColor(13, 111, 107);
  doc.text("Análisis General del Sistema", 14, 20);

  // 🔵 GRÁFICA NIVEL ESCOLAR (IZQUIERDA)
 // 🔵 GRÁFICA NIVEL ESCOLAR
if (meta.graficaEscolaridad) {
  doc.setFontSize(12);
  doc.text("Nivel Escolar", 20, 30);

  doc.addImage(
    meta.graficaEscolaridad,
    "PNG",
    20,
    40,
    160,
    160
  );
}

// 🔵 GRÁFICA EDADES
if (meta.graficaEdades) {
  doc.setFontSize(12);
  doc.text("Rangos de Edad", 230, 30);

  doc.addImage(
    meta.graficaEdades,
    "PNG",
    220,
    40,
    180,
    140
  );
}
}
  // ==========================================
  // DISTRIBUCIÓN POR MUNICIPIO
  // ==========================================

 // ==========================================
// GRÁFICO MUNICIPIOS (TOP 10)
// ==========================================

if (meta.graficaMunicipios) {
  doc.addPage();

  doc.setFontSize(16);
  doc.setTextColor(13, 111, 107);
  doc.text("Top 10 Municipios con más Beneficiarios", 14, 20);

  doc.addImage(
    meta.graficaMunicipios,
    "PNG",
    20,
    35,
    240,
    120
  );
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

