export const aplicarEstilosExcelGlobal = async (
  worksheet,
  tituloReporte,
  workbook,
  logoBase64,
  options = {}
) => {
  const COLOR_PRIMARIO = "0D6F6B";
  const COLOR_TEXTO_LIGHT = "FFFFFF";
  const COLOR_ZEBRA = "F4FAF8";
  const COLOR_BORDE = "E5E7EB";

  const alineacionHeaders = options.alineacionHeaders || "center";

  const usarHeader = options.usarHeader !== false;
  const usarTabla = options.usarTabla !== false;

  const headerInicioCol = options.headerInicioCol || "D";
  const headerFinCol = options.headerFinCol || "J";

  worksheet.getRow(1).height = 20;
  worksheet.getRow(2).height = 15;
  worksheet.getRow(3).height = 35;
  worksheet.getRow(4).height = 20;
  worksheet.getRow(5).height = 26;

  // logo
  if (logoBase64 && workbook) {
    try {
      const base64Data = logoBase64.startsWith("data:image/")
        ? logoBase64
        : `data:image/png;base64,${logoBase64}`;

      const base64Content = base64Data.includes(",")
        ? base64Data.split(",")[1]
        : base64Data;

      const imageId = workbook.addImage({
        base64: base64Content,
        extension: "png",
      });

      worksheet.addImage(imageId, {
        tl: { col: 1.2, row: 0.2 },
        ext: { width: 85, height: 85 },
      });
    } catch (e) {
      alert("Error insertando logo");
    }
  }

  // titulo
  if (usarHeader) {
    worksheet.mergeCells(
      `${headerInicioCol}3:${headerFinCol}3`
    );

    worksheet.mergeCells(
      `${headerInicioCol}4:${headerFinCol}4`
    );

    const celdaTitulo = worksheet.getCell(
      `${headerInicioCol}3`
    );

    celdaTitulo.value = tituloReporte.toUpperCase();

    celdaTitulo.font = {
      name: "Segoe UI",
      size: 16,
      bold: true,
      color: { argb: COLOR_PRIMARIO },
    };

    celdaTitulo.alignment = {
      vertical: "middle",
      horizontal: alineacionHeaders,
      wrapText: true,
    };

    const celdaSubtitulo = worksheet.getCell(
      `${headerInicioCol}4`
    );

    celdaSubtitulo.value =
      `Centro de Esperanza Infantil A.C. | Fecha: ${new Date().toLocaleDateString("es-MX")}`;

    celdaSubtitulo.font = {
      name: "Segoe UI",
      size: 10,
      color: { argb: "6B7280" },
    };

    celdaSubtitulo.alignment = {
      vertical: "middle",
      horizontal: alineacionHeaders,
      wrapText: true,
    };
  }

  // encabezados
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

  // datos
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

  // congelar encabezado
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