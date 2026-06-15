import { solicitarDescargaReporte } from "./reporteService";

/**
 * generación de archivos binarios de donadores al Master Worker
 * @param {'excel' | 'pdf'} formato 
 * @param {Array} datosFiltrados 
 * @returns {Promise<ArrayBuffer>}
 */
export const exportarReporte = async (formato, datosFiltrados) => {
  return await solicitarDescargaReporte("donativos", formato, datosFiltrados);
};