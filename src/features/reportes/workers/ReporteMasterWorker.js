import { obtenerLogoBase64 } from "../../../utils/imageUrlToBase64 ";

self.onmessage = async (event) => {
  const logoBase64 = await obtenerLogoBase64();
  const { tipoReporte, formato, datos = [], requestId, meta = {} } = event.data;
  
  // 🛡️ TRUCO DE PROTECCIÓN: Si algún script heredado busca 'periodoLabel' de forma global en el worker,
  // lo definimos globalmente apuntando al meta para que nunca más lance un "is not defined".
  self.periodoLabel = meta.periodoLabel || meta.periodo || "General";

  try {
    const moduloReporte = await import(
      `../hooks/reportes-config/${tipoReporte}Reporte.js`
    );

    let buffer;

    if (formato === "excel") {
      // Pasamos 'meta' explícitamente a la estrategia
      buffer = await moduloReporte.generarExcelEstrategia(datos, logoBase64, meta);
    }

    if (formato === "pdf") {
      // Pasamos 'meta' explícitamente a la estrategia
      buffer = await moduloReporte.generarPdfEstrategia(datos, logoBase64, meta);
    }

    if (!buffer) throw new Error("Buffer vacío");

    if (buffer instanceof Uint8Array) {
      buffer = buffer.buffer;
    } else if (!(buffer instanceof ArrayBuffer)) {
      buffer = new Uint8Array(buffer).buffer;
    }

    self.postMessage(
      { success: true, buffer, requestId },
      [buffer]
    );

  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message,
      requestId
    });
  }
};