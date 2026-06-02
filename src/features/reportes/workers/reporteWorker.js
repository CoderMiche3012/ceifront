import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoCei from "../../../assets/imagenes/logo.png";

const obtenerBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => { resolve(reader.result.split(",")[1]); };
        reader.readAsDataURL(blob);
    });
};
const logoBase64 = await obtenerBase64(logoCei);

self.onmessage = async (event) => {
    const { tipo, datos } = event.data;
    try {
        // para excel
        if (tipo === "excel") {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = "Centro de Esperanza Infantil";
            workbook.created = new Date();
            const worksheet = workbook.addWorksheet("Nuevos Ingresos");
            // Configurar cuadrícula visible y congelar paneles abajo de los encabezados
            worksheet.views = [{ showGridLines: true, state: "frozen", ySplit: 5 }];
            // agregar el logo del CEI 
            if (logoBase64) {
                try {
                    const imageId = workbook.addImage({
                        base64: logoBase64,
                        extension: "png",
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: 0, row: 0 },
                        ext: { width: 90, height: 65 }
                    });
                } catch (e) {
                    console.error("Error cargando logo en Excel", e);
                }
            }
            // titulo principal 
            worksheet.mergeCells("C2:M2");
            const titulo = worksheet.getCell("C2");
            titulo.value = "REPORTE DE NUEVOS INGRESOS";
            titulo.font = {
                bold: true,
                size: 16,
                color: { argb: "0D6F6B" }, 
                name: "Arial"
            };
            titulo.alignment = { horizontal: "left", vertical: "middle" };
            worksheet.getRow(2).height = 30;
            // subtitulo
            worksheet.mergeCells("C3:M3");
            const subtitulo = worksheet.getCell("C3");
            subtitulo.value = `Centro de Esperanza Infantil A.C.  |  Fecha de generación: ${new Date().toLocaleDateString('es-MX')}`;
            subtitulo.font = { italic: true, size: 10, color: { argb: "4B5563" }, name: "Arial" };
            subtitulo.alignment = { horizontal: "left", vertical: "top" };
            // Columnas y Anchos
            worksheet.columns = [
                { key: "nombreCompleto", width: 35 },
                { key: "estatus", width: 16 },
                { key: "prioridad", width: 14 },
                { key: "edad", width: 10 },
                { key: "genero", width: 14 },
                { key: "telefono", width: 18 },
                { key: "cp", width: 12 },
                { key: "municipio", width: 22 },
                { key: "colonia", width: 25 },
                { key: "tutor", width: 32 },
                { key: "telefonoTutor", width: 18 },
                { key: "familiares", width: 14 },
                { key: "fechaVisita", width: 18 },
            ];
            // encabezados de la Tabla (Fila 5)
            const headers = [
                "Nombre Completo", "Estatus", "Prioridad", "Edad", "Género",
                "Teléfono", "C.P.", "Municipio", "Colonia", "Tutor responsable",
                "Tel. Tutor", "Fam.", "Fecha Visita"
            ];

            const headerRow = worksheet.getRow(5);
            headerRow.values = headers;
            headerRow.height = 26;

            // Estilo del Encabezado
            headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11, name: "Arial" };
            headerRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF0D6F6B" }, 
            };
            headerRow.alignment = { horizontal: "center", vertical: "middle", wrapText: true };

            // inserción de Datos
            datos.forEach((p) => {
                worksheet.addRow([
                    p.nombreCompleto || "",
                    p.estatus || "",
                    p.prioridad || "",
                    p.edad || "",
                    p.genero || "",
                    p.telefono || "",
                    p.cp || "",
                    p.municipio || "",
                    p.colonia || "",
                    p.tutor || "",
                    p.telefonoTutor || "",
                    p.familiares || "",
                    p.fechaVisita || "",
                ]);
            });

            // Auto-filtro en la fila de encabezados
            worksheet.autoFilter = "A5:M5";

            // Aplicar Estilos de Celda, Bordes Finos y Zebra Striping
            const borderStyle = {
                top: { style: "thin", color: { argb: "E5E7EB" } },
                left: { style: "thin", color: { argb: "E5E7EB" } },
                bottom: { style: "thin", color: { argb: "E5E7EB" } },
                right: { style: "thin", color: { argb: "E5E7EB" } }
            };

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber <= 5) return; // Ignorar títulos y logos

                row.height = 22;

                row.eachCell((cell, colNumber) => {
                    cell.border = borderStyle;
                    cell.font = { name: "Arial", size: 10, color: { argb: "374151" } };
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                    // Zebra striping para filas pares
                    if (rowNumber % 2 === 0) {
                        cell.fill = {
                            type: "pattern",
                            pattern: "solid",
                            fgColor: { argb: "F9FAFB" }
                        };
                    }
                    // Forzar alineación centrada en columnas específicas
                    if ([2, 3, 4, 5, 7, 12, 13].includes(colNumber)) {
                        cell.alignment = { horizontal: "center", vertical: "middle" };
                    }
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();
            self.postMessage({ success: true, tipo: "excel", buffer });
        }

        // para el pdf
        if (tipo === "pdf") {
            const doc = new jsPDF({
                orientation: "landscape",
                format: "a3",
            });
            // Logotipo del CEI
            if (logoBase64) {
                try {
                    doc.addImage(`data:image/png;base64,${logoBase64}`, "PNG", 14, 10, 32, 24);
                } catch (e) {
                    console.error("Error agregando el logo al PDF", e);
                }
            }

            // Título Principal en PDF 
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(13, 111, 107);
            doc.text("REPORTE DE NUEVOS INGRESOS", logoBase64 ? 50 : 14, 20);

            // Subtítulo
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(107, 114, 128);
            doc.text(`Centro de Esperanza Infantil A.C.  |  Fecha: ${new Date().toLocaleDateString('es-MX')}`, logoBase64 ? 50 : 14, 27);

            // Construcción de la Tabla con autoTable
            autoTable(doc, {
                startY: 38,
                theme: "striped",
                headStyles: {
                    fillColor: [13, 111, 107],  
                    textColor: [255, 255, 255], 
                    fontSize: 9,
                    fontStyle: "bold",
                    halign: "center",
                    valign: "middle"
                },
                styles: {
                    font: "Helvetica",
                    fontSize: 8.5,
                    cellPadding: 3,
                    textColor: [55, 65, 81],
                    lineColor: [229, 231, 235],
                    lineWidth: 0.2,
                },
                columnStyles: {
                    0: { cellWidth: 45, fontStyle: "bold" },
                    1: { halign: "center" },
                    2: { halign: "center" },
                    3: { halign: "center" },
                    4: { halign: "center" },
                    5: { halign: "left" },
                    6: { halign: "center" },
                    9: { cellWidth: 40 },
                    11: { halign: "center" },
                    12: { halign: "center" },
                },
                head: [[
                    "Nombre Completo", "Estatus", "Prioridad", "Edad", "Género",
                    "Teléfono", "C.P.", "Municipio", "Colonia", "Tutor Responsable",
                    "Tel. Tutor", "Fam.", "Fecha Visita"
                ]],
                body: datos.map((p) => [
                    p.nombreCompleto || "",
                    p.estatus || "",
                    p.prioridad || "",
                    p.edad || "",
                    p.genero || "",
                    p.telefono || "",
                    p.cp || "",
                    p.municipio || "",
                    p.colonia || "",
                    p.tutor || "",
                    p.telefonoTutor || "",
                    p.familiares || "",
                    p.fechaVisita || "",
                ]),
                didDrawPage: function (data) {
                    doc.setFont("Helvetica", "normal");
                    doc.setFontSize(9);
                    doc.setTextColor(156, 163, 175);
                    const str = "Página " + doc.internal.getNumberOfPages();
                    doc.text(str, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
                }
            });

            const buffer = doc.output("arraybuffer");
            self.postMessage({ success: true, tipo: "pdf", buffer }, [buffer]);
        }
    } catch (error) {
        self.postMessage({ success: false, error: error.message });
    }
};

