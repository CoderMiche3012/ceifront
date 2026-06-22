import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "./../assets/imagenes/logo.png";

export const generarExpedientePDF = (data, edad) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const verdeOscuro = [16, 94, 66];     // #105E42 - Verde Principal
  const grisTexto = [60, 60, 60];        // Gris oscuro para lectura
  const grisBorde = [210, 215, 212];     // Gris claro para líneas

  const seguimientoActivo = data.historial_seguimientos?.find(
    (s) => s.id_periodo === data.periodoActivo?.id_periodo
  );

  const nombreCompleto = `${data.nombre} ${data.apellido_p} ${data.apellido_m || ""}`.trim().toUpperCase();

  const img = new Image();
  img.src = logo;

  img.onload = () => {
    const anchoMaximo = 35; 
    const altoProporcional = (img.height * anchoMaximo) / img.width; 
    
    const logoY = 12;
    doc.addImage(logo, "PNG", 196 - anchoMaximo, logoY, anchoMaximo, altoProporcional);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("SISTEMA DE GESTION DE BENEFICIARIOS", 14, 18);
    
    doc.setFontSize(16);
    doc.setTextColor(verdeOscuro[0], verdeOscuro[1], verdeOscuro[2]);
    doc.text("EXPEDIENTE DIGITAL", 14, 25);

    let inicioContenidoY = Math.max(32, logoY + altoProporcional + 6);

    doc.setFillColor(verdeOscuro[0], verdeOscuro[1], verdeOscuro[2]);
    doc.rect(14, inicioContenidoY, 182, 12, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(nombreCompleto, 18, inicioContenidoY + 7.5);

    autoTable(doc, {
      startY: inicioContenidoY + 16,
      theme: "plain",
      styles: { fontSize: 9.5, cellPadding: 2.5, textColor: grisTexto },
      columnStyles: {
        0: { fontStyle: "bold", textColor: verdeOscuro, width: 32 },
        1: { width: 59 },
        2: { fontStyle: "bold", textColor: verdeOscuro, width: 32 },
        3: { width: 59 },
      },
      body: [
        ["Edad:", `${edad || "N/D"} anos`, "Nivel Escolar:", data.nivel_escolar_inicial || "N/D"],
        ["Genero:", data.genero || "N/D", "Grado Escolar:", data.grado_escolar_inicial || "N/D"],
        ["Telefono:", data.telefono || "N/D", "Periodo Activo:", data.periodoActivo?.ciclo_escolar || "N/D"],
        ["Correo:", data.correo || "N/D", "Fecha Ingreso:", data.fecha_ingreso || "N/D"],
      ],
    });

    let currentY = doc.lastAutoTable.finalY + 10;

    const estructuraTablaElegante = {
      theme: "striped",
      headStyles: { fillColor: verdeOscuro, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9.5 },
      styles: { fontSize: 9, cellPadding: 3, textColor: grisTexto },
      didDrawCell: (data) => {
        if (data.section === "body") {
          doc.setDrawColor(grisBorde[0], grisBorde[1], grisBorde[2]);
          doc.setLineWidth(0.1);
          doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
      },
      margin: { left: 14, right: 14, bottom: 20 },
    };

    const crearTituloSeccion = (titulo, y) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(verdeOscuro[0], verdeOscuro[1], verdeOscuro[2]);
      doc.text(titulo, 14, y);
      
      doc.setDrawColor(verdeOscuro[0], verdeOscuro[1], verdeOscuro[2]);
      doc.setLineWidth(0.3);
      doc.line(14, y + 2, 196, y + 2);
    };

    crearTituloSeccion("Direccion de Residencia", currentY);
    
    autoTable(doc, {
      ...estructuraTablaElegante,
      startY: currentY + 5,
      head: [["Calle y Numero", "Colonia", "Municipio", "C.P."]],
      body: [[
        `${data.direccion?.calle || "-"} ${data.direccion?.numero || ""}`.trim(),
        data.direccion?.colonia || "-",
        data.direccion?.municipio || "-",
        data.direccion?.cp || "-",
      ]],
    });

    currentY = doc.lastAutoTable.finalY + 9;

    crearTituloSeccion("Contacto de Tutor y Verificacion", currentY);

    autoTable(doc, {
      ...estructuraTablaElegante,
      startY: currentY + 5,
      head: [["Nombre del Tutor", "Telefono Tutor", "Fecha Visita", "Estado Visita"]],
      body: [[
        data.tutor_nombre || "-",
        data.tutor_telefono || "-",
        data.visitas?.fecha_visita || "-",
        data.visitas?.estado_visita || "-"
      ]],
    });

    currentY = doc.lastAutoTable.finalY + 9;

    crearTituloSeccion("Resumen de Seguimiento Activo", currentY);

    autoTable(doc, {
      ...estructuraTablaElegante,
      startY: currentY + 5,
      head: [["Indicador del Periodo", "Registro / Estatus"]],
      body: [
        ["Ciclo Escolar Vigente", data.periodoActivo?.ciclo_escolar || "-"],
        ["Estatus del Alumno", seguimientoActivo?.estatus || "-"],
        ["Obligaciones del Beneficiario", `${seguimientoActivo?.obligaciones?.length || 0} asignada(s)`],
        ["Servicios e Infraestructura Usados", `${seguimientoActivo?.usos_servicios?.length || 0} servicio(s)`],
        ["Apoyos Economicos Asignados", `${seguimientoActivo?.apoyos_economicos?.length || 0} apoyo(s)`],
      ],
    });

    currentY = doc.lastAutoTable.finalY + 9;

    crearTituloSeccion("Expediente de Documentos Adjuntos", currentY);

    autoTable(doc, {
      ...estructuraTablaElegante,
      startY: currentY + 5,
      head: [["Nombre del Documento", "Tipo de Archivo", "Fecha de Registro"]],
      body: data.documentos?.length 
        ? data.documentos.map((docu) => [docu.nombre_documento, docu.tipo_documento, docu.fecha_carga])
        : [["No se registran documentos en el sistema", "-", "-"]],
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      doc.setDrawColor(grisBorde[0], grisBorde[1], grisBorde[2]);
      doc.setLineWidth(0.2);
      doc.line(14, 282, 196, 282);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      
      doc.text("Documento confidencial para uso exclusivo institucional.", 14, 287);
      doc.text(`Pagina ${i} de ${totalPages}`, 196, 287, { align: "right" });
    }

    doc.save(`Expediente_${data.nombre}_${data.apellido_p}.pdf`);
  };

  img.onerror = () => {
    alert("Error cargando logo");
    img.onload(); 
  };
};