// src/shared/services/reporteService.js

const workerUrl = new URL("../workers/reporteMasterWorker.js", import.meta.url);
let masterWorkerInstance = null;

function obtenerWorker() {
  if (!masterWorkerInstance) {
    masterWorkerInstance = new Worker(workerUrl, { type: "module" });
  }
  return masterWorkerInstance;
}

/**
 * Disparador universal de reportes asíncronos en segundo plano.
 * @param {string} tipoReporte - Nombre del archivo del reporte (ej: 'donadores', 'beneficiarios')
 * @param {'excel'|'pdf'} formato - Formato de salida solicitado
 * @param {Array} datos - Datos ya procesados listos para estampar
 */
export const solicitarDescargaReporte = (tipoReporte, formato, datos) => {
  const worker = obtenerWorker();

  return new Promise((resolve, reject) => {
    const requestId = crypto.randomUUID();

    const handleMessage = (event) => {
      const { success, buffer, error, requestId: resId } = event.data;

      if (resId !== requestId) return; // Evitar colisiones de descargas simultáneas

      worker.removeEventListener("message", handleMessage);

      if (!success) {
        reject(error);
        return;
      }

      resolve(buffer);
    };

    worker.addEventListener("message", handleMessage);
    console.log("ENVIANDO WORKER:", tipoReporte, formato, datos.length);
    worker.postMessage({
      tipoReporte,
      formato,
      datos,
      requestId,
    });
    
  });
};