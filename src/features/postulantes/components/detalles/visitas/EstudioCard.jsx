import { useState, useRef } from "react";
import { FileText, Download, Eye, RefreshCw, Upload } from "lucide-react";
import ModalResultado from "../../../../../components/shared/ModalResultado";
import { actualizarEstudio } from "../../../services/estudiosService";
export default function EstudioCard({ data, setData }) {
  const fileInputRef = useRef(null);
  const [modalConfig, setModalConfig] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const noEditable = ["aceptado", "rechazado"].includes(data?.estatus_postulante?.toLowerCase());
  const estatus = data?.estatus_estudio?.toLowerCase();
  const estudioCompleto = estatus === "completo";
  const documento = data?.documento_estudio;

  const handleTriggerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const archivo = e.target.files[0];

    if (!archivo) return;

    try {
      //preparar datos
      const formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("estatus_estudio", "Completo");
      await actualizarEstudio(data.id_estudio, { estatus_estudio: "Completo" });
      const nuevoDocumento = {
        nombre: archivo.name,
        fecha: new Date().toISOString(),
        url: URL.createObjectURL(archivo),
      };

      setData((prev) => ({
        ...prev,
        estatus_estudio: "Completo",
        documento_estudio: nuevoDocumento,
      }));

      setModalConfig({
        open: true,
        type: "success",
        title: "¡Actualización exitosa!",
        message: "El estudio socioeconómico se ha cargado correctamente.",
      });

    } catch (error) {
      setModalConfig({
        open: true,
        type: "error",
        title: "Error al subir",
        message: error.response?.data?.message || "No se pudo procesar el archivo. Intente de nuevo.",
      });
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase">
            Estudio socioeconómico
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {estudioCompleto ? "Documento cargado correctamente" : "Pendiente de carga"}
          </p>
        </div>

        {estudioCompleto ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText size={18} className="text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {documento?.nombre || "documento_estudio.pdf"}
                </p>
                <p className="text-xs text-slate-500">Actualizado recientemente</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => documento?.url && window.open(documento.url, "_blank")}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold hover:bg-slate-200 flex items-center justify-center gap-2"
              >
                <Eye size={14} /> Abrir
              </button>

              <a
                href={documento?.url}
                download={documento?.nombre}
                className="rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold hover:bg-emerald-200 flex items-center justify-center gap-2"
              >
                <Download size={14} /> Descargar
              </a>
              {!noEditable && (
                <button
                  type="button"
                  onClick={handleTriggerClick}
                  className="rounded-xl bg-amber-100 px-3 py-2 text-xs font-semibold hover:bg-amber-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} /> Cambiar
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleTriggerClick}
            className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:bg-slate-50 transition-all flex flex-col items-center gap-2"
          >
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Upload size={24} className="text-blue-600" />
            </div>
            {!noEditable && (
              <div className="text-center">
                <span className="text-sm font-bold text-slate-700 block">Subir documento</span>
                <span className="text-xs text-slate-400">PDF o Word (Máx. 10MB)</span>
              </div>
            )}
          </button>
        )}
      </div>

      <ModalResultado
        open={modalConfig.open}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalConfig((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}