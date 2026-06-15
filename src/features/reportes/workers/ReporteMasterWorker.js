self.onmessage = async (event) => {
  const { tipoReporte, formato, datos = [], logoBase64, requestId, meta = {} } = event.data;

  try {
    const moduloReporte = await import(
      `../hooks/reportes-config/${tipoReporte}Reporte.js`
    );

    let buffer;

    if (formato === "excel") {
      buffer = await moduloReporte.generarExcelEstrategia(
        datos,
        logoBase64,
        meta
      );
    }

    if (formato === "pdf") {
      buffer = await moduloReporte.generarPdfEstrategia(
        datos,
        logoBase64,
        meta
      );
    }

    if (!buffer) throw new Error("Buffer vacío");

    if (buffer instanceof Uint8Array) {
      buffer = buffer.buffer;
    } else if (!(buffer instanceof ArrayBuffer)) {
      buffer = new Uint8Array(buffer).buffer;
    }

    self.postMessage({ success: true, buffer, requestId }, [buffer]);

  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message,
      requestId
    });
  }
};