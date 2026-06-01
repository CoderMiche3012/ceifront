import {
  FileText,
  Download,
  Eye,
  RefreshCw,
  Upload,
} from "lucide-react";

export default function EstudioCard({
  data,
  onSubirDocumento,
}) {
  const noEditable = [
    "aceptado",
    "rechazado",
  ].includes(
    data?.estatus_postulante?.toLowerCase()
  );

  const estatus =
    data?.estatus_estudio?.toLowerCase();

  const estudioCompleto =
    estatus === "completo";

  const documentoUrl =
    data?.link_documento;

  // sacar nombre del archivo desde la URL
  const nombreDocumento =
    documentoUrl
      ? decodeURIComponent(
          documentoUrl
            .split("/")
            .pop()
        )
      : "documento_estudio.pdf";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase">
          Estudio socioeconómico
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          {estudioCompleto
            ? "Documento cargado correctamente"
            : "Pendiente de carga"}
        </p>
      </div>

      {documentoUrl ? (
        <div className="space-y-4">
          {/* archivo */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText
                size={18}
                className="text-blue-700"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {nombreDocumento}
              </p>

              <p className="text-xs text-slate-500">
                Actualizado recientemente
              </p>
            </div>
          </div>

          {/* acciones */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() =>
                window.open(
                  documentoUrl,
                  "_blank"
                )
              }
              className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold hover:bg-slate-200 flex items-center justify-center gap-2"
            >
              <Eye size={14} />
              Abrir
            </button>

            <a
              href={documentoUrl}
              download
              className="rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold hover:bg-emerald-200 flex items-center justify-center gap-2"
            >
              <Download size={14} />
              Descargar
            </a>

            {!noEditable && (
              <button
                type="button"
                onClick={
                  onSubirDocumento
                }
                className="rounded-xl bg-amber-100 px-3 py-2 text-xs font-semibold hover:bg-amber-200 flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                Cambiar
              </button>
            )}
          </div>
        </div>
      ) : (
        !noEditable && (
          <button
            type="button"
            onClick={
              onSubirDocumento
            }
            className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:bg-slate-50 transition-all flex flex-col items-center gap-2"
          >
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Upload
                size={24}
                className="text-blue-600"
              />
            </div>

            <div className="text-center">
              <span className="text-sm font-bold text-slate-700 block">
                Subir documento
              </span>

              <span className="text-xs text-slate-400">
                PDF o Word
              </span>
            </div>
          </button>
        )
      )}
    </div>
  );
}