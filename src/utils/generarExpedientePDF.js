import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "./../assets/imagenes/logo.png";

const cargarImagen = async (url) => {
  const response = await fetch(url, { mode: "cors" });
  const blob = await response.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve(null);

    reader.readAsDataURL(blob);
  });
};

export const generarExpedientePDF = async (data, edad) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const verdeOscuro = [16, 94, 66];
  const grisTexto = [60, 60, 60];
  const grisBorde = [210, 215, 212];

  const seguimientoActivo = data.historial_seguimientos?.find(
    (s) => s.id_periodo === data.periodoActivo?.id_periodo
  );

  const fotosPeriodoActivo =
    data.fotografias?.filter(
      (foto) => foto.etapa === data.periodoActivo?.ciclo_escolar
    ) || [];

  const nombreCompleto = `${data.nombre} ${data.apellido_p} ${data.apellido_m || ""}`
    .trim()
    .toUpperCase();

  const img = new Image();
  img.src = logo;
const fechaGeneracion = new Date().toLocaleString("es-MX", {
  dateStyle: "full",
  timeStyle: "short",
});
  img.onload = async () => {
    const anchoMaximo = 35;
    const altoProporcional = (img.height * anchoMaximo) / img.width;

    // LOGO
    doc.addImage(logo, "PNG", 196 - anchoMaximo, 12, anchoMaximo, altoProporcional);

    // HEADER
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(16, 94, 66);
    doc.text("EXPEDIENTE DIGITAL DE BENEFICIARIO", 14, 25);

    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Fecha y hora de generación: ${fechaGeneracion}`, 14, 31);

    let inicioContenidoY = Math.max(38, 12 + altoProporcional + 10);

    // BARRA NOMBRE
    doc.setFillColor(...verdeOscuro);
    doc.rect(14, inicioContenidoY, 182, 16, "F");

    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("NOMBRE DEL BENEFICIARIO", 18, inicioContenidoY + 5);

    doc.setFontSize(12);
    doc.text(nombreCompleto, 18, inicioContenidoY + 11);

    // TABLA PRINCIPAL
    autoTable(doc, {
      startY: inicioContenidoY + 20,
      theme: "plain",
      styles: {
        fontSize: 9.5,
        cellPadding: 2.5,
        textColor: grisTexto,
        font: "times",
      },
      columnStyles: {
        0: { fontStyle: "bold", textColor: verdeOscuro, width: 32 },
        1: { width: 59 },
        2: { fontStyle: "bold", textColor: verdeOscuro, width: 32 },
        3: { width: 59 },
      },
      body: [
        ["Edad:", `${edad || "N/D"} años`, "Nivel Escolar:", seguimientoActivo?.datos_escolares?.id_escolaridad?.nivel_escolar || "N/D"],
        ["Género:", data.genero || "N/D", "Grado Escolar:", seguimientoActivo?.datos_escolares?.id_escolaridad?.grado_escolar || "N/D"],
        ["Teléfono:", data.telefono || "N/D", "Periodo Activo:", data.periodoActivo?.ciclo_escolar || "N/D"],
        ["Correo:", data.correo || "N/D", "Fecha Ingreso:", data.fecha_ingreso || "N/D"],
      ],
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    const estructuraTabla = {
      theme: "striped",
      headStyles: {
        fillColor: verdeOscuro,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9.5,
        font: "times",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: grisTexto,
        font: "times",
      },
      didDrawCell: (data) => {
        if (data.section === "body") {
          doc.setDrawColor(...grisBorde);
          doc.setLineWidth(0.1);
          doc.line(
            data.cell.x,
            data.cell.y + data.cell.height,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height
          );
        }
      },
      margin: { left: 14, right: 14, bottom: 20 },
    };

    const crearTituloSeccion = (titulo, y) => {
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...verdeOscuro);
      doc.text(titulo, 14, y);

      doc.setLineWidth(0.3);
      doc.line(14, y + 2, 196, y + 2);
    };

    // DIRECCIÓN
    crearTituloSeccion("Dirección de Residencia", currentY);

    autoTable(doc, {
      ...estructuraTabla,
      startY: currentY + 5,
      head: [["Calle y Número", "Colonia", "Municipio", "C.P."]],
      body: [[
        `${data.direccion?.calle || "-"} ${data.direccion?.numero || ""}`.trim(),
        data.direccion?.colonia || "-",
        data.direccion?.municipio || "-",
        data.direccion?.cp || "-",
      ]],
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // TUTOR
    crearTituloSeccion("Contacto de Tutor", currentY);

    autoTable(doc, {
      ...estructuraTabla,
      startY: currentY + 5,
      head: [["Nombre del Tutor", "Teléfono"]],
      body: [[
        data.tutor_nombre || "-",
        data.tutor_telefono || "-",
      ]],
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // SEGUIMIENTO
    crearTituloSeccion("Resumen de Seguimiento", currentY);

    autoTable(doc, {
      ...estructuraTabla,
      startY: currentY + 5,
      head: [["Indicador", "Registro"]],
      body: [
        ["Ciclo Escolar", data.periodoActivo?.ciclo_escolar || "-"],
        ["Estatus", seguimientoActivo?.estatus || "-"],
        ["Obligaciones", `${seguimientoActivo?.obligaciones?.length || 0}`],
        ["Servicios", `${seguimientoActivo?.usos_servicios?.length || 0}`],
        ["Apoyos", `${seguimientoActivo?.apoyos_economicos?.length || 0}`],
      ],
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // FOTOS
    if (fotosPeriodoActivo.length > 0) {

  doc.addPage(); // 👈 SIEMPRE nueva hoja para fotos

  let currentY = 20;

  crearTituloSeccion("Fotografías del Periodo Activo", currentY);
  currentY += 10;

  const ancho = 75;
  const alto = 55;

  let x = 14;
  let columna = 0;

  for (const foto of fotosPeriodoActivo) {

    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
      x = 14;
      columna = 0;
    }

    const imagen = await cargarImagen(foto.foto_archivo);

    if (imagen) {
      doc.setDrawColor(200);
      doc.setLineWidth(0.2);
      doc.rect(x, currentY, ancho, alto);

      doc.addImage(imagen, "JPEG", x, currentY, ancho, alto);
    }

    doc.setFont("times", "normal");
    doc.setFontSize(8);
    doc.text(foto.descripcion || "", x, currentY + alto + 5);

    if (columna === 0) {
      x = 108;
      columna = 1;
    } else {
      x = 14;
      columna = 0;
      currentY += 70;
    }
  }
}

    // FOOTER
    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      doc.setDrawColor(...grisBorde);
      doc.line(14, 282, 196, 282);

      doc.setFont("times", "normal");
      doc.setFontSize(8);
      doc.setTextColor(120);

      doc.text(
        "Documento confidencial Centro de Esperanza Infantil A.C",
        14,
        287
      );

      doc.text(`Página ${i} de ${totalPages}`, 196, 287, { align: "right" });
    }

    doc.save(`Expediente_${data.nombre}_${data.apellido_p}.pdf`);
  };

  img.onerror = () => {
    console.error("Error cargando logo");
    img.onload();
  };
};