// src/shared/services/reporteDonadoreService.js
import { solicitarDescargaReporte } from "./reporteService";

/**
 * Solicita la generación de archivos binarios de donadores al Master Worker
 * @param {'excel' | 'pdf'} formato 
 * @param {Array} datosFiltrados 
 * @returns {Promise<ArrayBuffer>}
 */
export const exportarReporte = async (formato, datosFiltrados) => {
  // Envia "donadores" para que el masterWorker importe dinámicamente 'donadoresReporte.js'
  return await solicitarDescargaReporte("donativos", formato, datosFiltrados);
};