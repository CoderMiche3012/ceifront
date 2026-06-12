import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import logoCei from "../../../../assets/imagenes/logo.png";

import { aplicarEstilosExcelGlobal } from "../../reporteUtils";

import { countries } from "../../../../utils/countries";

const obtenerNombrePais = (paisCodigo) => {
  if (!paisCodigo) return "-";

  const pais = countries.find((c) => c.code.toUpperCase() === String(paisCodigo).toUpperCase());
  return pais?.name || paisCodigo;
};

// para excel

export const generarExcelEstrategia = async (datos, logoBase64) => {

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Centro de Esperanza Infantil";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Directorio Donadores");
  // llaves
  worksheet.columns = [
    { key: "nombreCompleto", width: 35 },
    { key: "tipo_donador", width: 15 },
    { key: "correo", width: 25 },
    { key: "telefono", width: 18 },
    { key: "estatus", width: 14 },
    { key: "fecha_ingreso", width: 16 },
    { key: "beneficiarios", width: 50 },
    { key: "direccion", width: 40 },
    { key: "cp", width: 12 },
    { key: "pais", width: 18 },
    { key: "nota", width: 18 },
  ];
  // columna de excel
  const headers = [
    "Nombre Completo",
    "Tipo Donador",
    "Correo Electrónico",
    "Teléfono",
    "Estatus",
    "Fecha Ingreso",
    "Beneficiarios",
    "Domicilio",
    "C.P.",
    "Pais",
    "Nota",
  ];

  worksheet.getRow(5).values = headers;

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "N/D";
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  //obtener los datos
  datos.forEach((d) => {
    console.log(d.domicilio);
    console.log(d.domicilio?.geografia);
    console.log(d.domicilio?.geografia?.pais);
    const calle = d.domicilio?.calle || "";
    const numero = d.domicilio?.numero_exterior || "";
    const estado = d.domicilio?.geografia?.estado || "";
    const direccionCompleta = calle && numero && estado ? `${calle} N° ${numero}, ${estado}` : calle || "-";
    const beneficiariosTexto =
      d.beneficiarios_apoyados?.length > 0
        ? d.beneficiarios_apoyados.map((b) => `${b.nombre} (${calcularEdad(b.fecha_nacimiento)} años)`).join("\n")
        : "Sin beneficiarios";

    worksheet.addRow([
      d.nombreCompleto || "",
      d.tipo_donador || "",
      d.correo || "",
      d.telefono || "",
      d.estatus || "",
      d.fecha_ingreso || "",
      beneficiariosTexto,
      direccionCompleta,
      d.domicilio?.geografia?.codigo_postal || "-",
      obtenerNombrePais(d.domicilio?.geografia?.pais_codigo),
      d.nota || "",
    ]);
  });

  worksheet.getColumn(7).alignment = {
    wrapText: true,
    vertical: "top",
  };
  // para el encabezado  
  worksheet.autoFilter = "A5:J5";
  // para el logo
  await aplicarEstilosExcelGlobal(
    worksheet,
    "DIRECTORIO GLOBAL DE DONADORES",
    workbook,
    logoBase64
  );

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer instanceof ArrayBuffer ? buffer : new Uint8Array(buffer).buffer;
  return buffer instanceof ArrayBuffer ? buffer : new Uint8Array(buffer).buffer;
};

// pdf
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
      console.error("Error logo PDF:", e);
    }
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(13, 111, 107);
  doc.text(
    "DIRECTORIO GLOBAL DE DONADORES",
    logoBase64 ? 50 : 14,
    20
  );

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.text(`Centro de Esperanza Infantil A.C. | Fecha: ${new Date().toLocaleDateString("es-MX")}`,
    logoBase64 ? 50 : 14,
    27
  );

  autoTable(doc, {
    startY: 38,
    theme: "striped",
    headStyles: {
      fillColor: [13, 111, 107],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      font: "Helvetica",
      fontSize: 9,
      cellPadding: 3,
      textColor: [55, 65, 81],
      lineColor: [229, 231, 235],
      lineWidth: 0.2,
    },
    head: [
      [
        "Nombre Completo",
        "Tipo",
        "Correo",
        "Teléfono",
        "Estatus",
        "Fecha",
        "Beneficiarios",
        "Domicilio",
        "C.P.",
        "Pais",
        "Nota"
      ],
    ],
    body: datos.map((d) => {
      const calle = d.domicilio?.calle || "";
      const numero = d.domicilio?.numero_exterior || "";
      const estado = d.domicilio?.geografia?.estado || "";
      const direccionCompleta = calle && numero && estado ? `${calle} N° ${numero}, ${estado}` : calle || "-";
      const calcularEdad = (fechaNacimiento) => {

        if (!fechaNacimiento) return "N/D";

        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
          edad--;
        }
        return edad;
      };

      const beneficiariosTexto =
        d.beneficiarios_apoyados?.length > 0
          ? d.beneficiarios_apoyados.map((b) => `${b.nombre} (${calcularEdad(b.fecha_nacimiento)} años)`).join("\n") : "Sin beneficiarios";

      return [
        d.nombreCompleto || "",
        d.tipo_donador || "",
        d.correo || "",
        d.telefono || "",
        d.estatus || "",
        d.fecha_ingreso || "",
        beneficiariosTexto,
        direccionCompleta,
        d.domicilio?.geografia?.codigo_postal || "-",
        obtenerNombrePais(d.domicilio?.geografia?.pais_codigo),
        d.nota || "",

      ];
    }),
  });

  const buffer = doc.output("arraybuffer");
  return new Uint8Array(buffer).buffer;
};


