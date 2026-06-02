let worker;

function obtenerWorker() {
    if (!worker) {
        worker = new Worker(
            new URL( "../workers/reporteWorker.js", import.meta.url ),
            { type: "module", }
        );
    }
    return worker;
}

export const exportarReporte = ( tipo, datos ) => {
    return new Promise(
        (resolve, reject) => {
            const worker = obtenerWorker();

            worker.onmessage = ( event ) => {
                const { success, buffer, error, } = event.data;

                if (!success) {
                    reject(error);
                    return;
                }
                resolve(buffer);
            };

            worker.postMessage({ tipo, datos,});
        }
    );
};