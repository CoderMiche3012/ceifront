import { obtenerLogoBase64 } from "../../../utils/imageUrlToBase64";
const workerUrl = new URL("../workers/reporteMasterWorker.js", import.meta.url);
let masterWorkerInstance = null;

function obtenerWorker() {
  if (!masterWorkerInstance) {
    masterWorkerInstance = new Worker(workerUrl, { type: "module" });
  }
  return masterWorkerInstance;
}

/**
 * Disparador universal de reportes en segundo plano.
 * @param {string} tipoReporte - Nombre del archivo del reporte 
 * @param {'excel'|'pdf'} formato - Formato de salida solicitado
 * @param {Array} datos - Datos ya procesados listos para estampar
 */
export const solicitarDescargaReporte = async (
  tipoReporte,
  formato,
  datos,
  meta = {}
) => {
  const worker = obtenerWorker();
  const logoBase64 = await obtenerLogoBase64();

  return new Promise((resolve, reject) => {
    const requestId = crypto.randomUUID();

    const handleMessage = (event) => {
      const { success, buffer, error, requestId: resId } = event.data;

      if (resId !== requestId) return;

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
      meta,
      logoBase64,
      requestId,
    });
  });
};

