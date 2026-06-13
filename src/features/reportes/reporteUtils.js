export const aplicarEstilosExcelGlobal = async (
  worksheet,
  tituloReporte,
  workbook,
  logoBase64,
  options = {} // 👈 NUEVO (no rompe nada)
) => {
  const COLOR_PRIMARIO = "0D6F6B";
  const COLOR_TEXTO_LIGHT = "FFFFFF";
  const COLOR_ZEBRA = "F4FAF8";
  const COLOR_BORDE = "E5E7EB";

  const usarHeader = options.usarHeader !== false; // default: true
  const usarTabla = options.usarTabla !== false;   // default: true

  worksheet.getRow(1).height = 20;
  worksheet.getRow(2).height = 15;
  worksheet.getRow(3).height = 35;
  worksheet.getRow(4).height = 20;
  worksheet.getRow(5).height = 26;

  // ==========================
  // LOGO
  // ==========================
  if (logoBase64 && workbook) {
    try {
      const imageId = workbook.addImage({
        base64: logoBase64,
        extension: "png",
      });

      worksheet.addImage(imageId, {
        tl: { col: 1.2, row: 0.2 },
        ext: { width: 85, height: 85 },
      });
    } catch (e) {
      console.error("Error insertando logo:", e);
    }
  }

  // ==========================
  // TITULO + SUBTITULO (OPCIONAL)
  // ==========================
  if (usarHeader) {
    worksheet.mergeCells("D3:J3");
    worksheet.mergeCells("D4:J4");

    const celdaTitulo = worksheet.getCell("D3");

    celdaTitulo.value = tituloReporte.toUpperCase();
    celdaTitulo.font = {
      name: "Segoe UI",
      size: 16,
      bold: true,
      color: { argb: COLOR_PRIMARIO },
    };

    celdaTitulo.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    const celdaSubtitulo = worksheet.getCell("D4");

    celdaSubtitulo.value =
      `Centro de Esperanza Infantil A.C. | Fecha: ${new Date().toLocaleDateString("es-MX")}`;

    celdaSubtitulo.font = {
      name: "Segoe UI",
      size: 10,
      color: { argb: "6B7280" },
    };

    celdaSubtitulo.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
  }

  // ==========================
  // ENCABEZADOS TABLA (OPCIONAL)
  // ==========================
  if (usarTabla) {
    const filaHeader = worksheet.getRow(5);

    filaHeader.eachCell((celda) => {
      celda.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: COLOR_PRIMARIO },
      };

      celda.font = {
        name: "Segoe UI",
        size: 10,
        bold: true,
        color: { argb: COLOR_TEXTO_LIGHT },
      };

      celda.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };

      celda.border = {
        top: { style: "thin", color: { argb: COLOR_PRIMARIO } },
        left: { style: "thin", color: { argb: "FFFFFF" } },
        bottom: { style: "medium", color: { argb: "0A5451" } },
        right: { style: "thin", color: { argb: "FFFFFF" } },
      };
    });
  }

  // ==========================
  // DATOS
  // ==========================
  worksheet.eachRow({ includeEmpty: false }, (fila, numeroFila) => {
    if (numeroFila <= 5) return;

    fila.height = 22;

    const esFilaPar = numeroFila % 2 === 0;

    fila.eachCell((celda, numeroColumna) => {
      celda.font = {
        name: "Segoe UI",
        size: 10,
        color: { argb: "374151" },
      };

      celda.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: esFilaPar ? COLOR_ZEBRA : "FFFFFF",
        },
      };

      celda.border = {
        top: { style: "thin", color: { argb: COLOR_BORDE } },
        left: { style: "thin", color: { argb: COLOR_BORDE } },
        bottom: { style: "thin", color: { argb: COLOR_BORDE } },
        right: { style: "thin", color: { argb: COLOR_BORDE } },
      };

      celda.alignment = {
        vertical: "middle",
        horizontal:
          numeroColumna === 1
            ? "left"
            : typeof celda.value === "number"
            ? "right"
            : "center",
      };
    });
  });

  // ==========================
  // CONGELAR ENCABEZADO (OPCIONAL)
  // ==========================
  if (usarTabla) {
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 5,
        topLeftCell: "A6",
      },
    ];
  }
};