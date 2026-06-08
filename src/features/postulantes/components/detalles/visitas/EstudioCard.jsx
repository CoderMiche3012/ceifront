import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  RefreshCw,
  Upload,
} from "lucide-react";
import { ui } from "../../../../../styles/ui/index";
import Field from "../../../../../components/ui/Field";
import Input from "../../../../../components/ui/Input";
import Boton from "../../../../../components/ui/Boton";
import { HiOutlineX } from "react-icons/hi";
import ModalConfirmacion from "../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../components/shared/ModalResultado";

export default function EstudioCard({ data, estudio }) {
  const noEditable = [
    "aceptado",
    "rechazado",
  ].includes(data?.estatus_postulante?.toLowerCase());
const [showConfirm, setShowConfirm] = useState(false);
const [modo, setModo] = useState("subir"); 

const [resultado, setResultado] = useState({
  open: false,
  type: "",
  title: "",
  message: "",
});
  const estatus = data?.estatus_estudio?.toLowerCase();
  const estudioCompleto = estatus === "completo";
  const documentoUrl = data?.link_documento;

  const nombreDocumento = documentoUrl
  ? decodeURIComponent(documentoUrl.split("/").pop())
  : "documento_estudio.pdf";
  const descargarDocumento = async (url, nombre) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = nombre || "documento.pdf";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error al descargar:", error);
    }
  };

  const abrirModal = (tipo = "subir") => {
  setModo(tipo);
  estudio.setMostrarSubida(true);
};

  const cerrarModal = () => {
  estudio.setMostrarSubida(false);
  estudio.setArchivo(null);
};

 const confirmarSubida = async () => {
  try {
    await estudio.guardarDocumentoEstudio();

    cerrarModal();

    setResultado({
      open: true,
      type: "success",
      title: modo === "subir"
        ? "Documento subido"
        : "Documento actualizado",
      message:
        modo === "subir"
          ? "El documento se subió correctamente."
          : "El documento se actualizó correctamente.",
    });

  } catch (error) {
    setResultado({
      open: true,
      type: "error",
      title: "Error",
      message: "No fue posible guardar el documento.",
    });
  }
};

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">

      {/* HEADER */}
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

      {/* DOCUMENTO */}
      {documentoUrl ? (
        <div className="space-y-4">

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText size={18} className="text-blue-700" />
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

          {/* ACTIONS */}
          <div className="grid grid-cols-3 gap-2">

            <button
              type="button"
              onClick={() => window.open(documentoUrl, "_blank")}
              className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold hover:bg-slate-200 flex items-center justify-center gap-2"
            >
              <Eye size={14} />
              Abrir
            </button>

            <button
              type="button"
              onClick={() =>
                descargarDocumento(documentoUrl, nombreDocumento)
              }
              className="rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold hover:bg-emerald-200 flex items-center justify-center gap-2"
            >
              <Download size={14} />
              Descargar
            </button>

            {!noEditable && (
              <button
                type="button"
                onClick={() => abrirModal("cambiar")}
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
            onClick={() => abrirModal("subir")}
            className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:bg-slate-50 transition-all flex flex-col items-center gap-2"
          >
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Upload size={24} className="text-blue-600" />
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

      {/* MODAL */}
      {estudio.mostrarSubida && (
  <div className={ui.modal.formOverlay}>
    <div className="w-full max-w-2xl">
      <div className={ui.modal.formContainer}>

        {/* HEADER */}
        <div className={ui.modal.formHeader}>
          <div className={`${ui.modal.iconWrapper} bg-blue-100 text-blue-700`}>
            <Upload size={22} />
          </div>

          <div className="flex-1">
            <h2 className={ui.modal.title}>
  {modo === "subir" ? "Subir documento" : "Cambiar documento"}
</h2>

            <p className={ui.modal.description}>
  {modo === "subir"
    ? "Selecciona un archivo PDF o Word para el estudio socioeconómico"
    : "Reemplaza el documento actual del estudio socioeconómico"}
</p>
          </div>

          <button
            onClick={cerrarModal}
            className="p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className={ui.modal.formBody}>
          <div className={ui.modal.formScroll}>
            <div className="space-y-6">

              {/* DROPZONE / INPUT */}
              <div
                onClick={() => document.getElementById("fileEstudio").click()}
                className="
                  w-full
                  border-2 border-dashed border-slate-300
                  rounded-2xl
                  p-10
                  text-center
                  cursor-pointer
                  hover:border-blue-500
                  hover:bg-blue-50
                  transition
                "
              >
                <Upload className="mx-auto text-blue-600 mb-2" size={28} />

                <p className="text-sm font-semibold text-slate-700">
                  Seleccionar documento
                </p>

                <p className="text-xs text-slate-400">
                  PDF, DOC o DOCX
                </p>
              </div>

              <input
                id="fileEstudio"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => estudio.setArchivo(e.target.files?.[0])}
              />

              {/* FILE SELECTED */}
              {estudio.archivo && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <p className="text-sm font-medium text-emerald-700">
                    {estudio.archivo.name}
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* FOOTER */}
          <div className={ui.modal.formActions}>
            <Boton variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Boton>

            <Boton
              onClick={() => setShowConfirm(true)}
              disabled={!estudio.archivo}
            >
              Subir documento
            </Boton>
          </div>

        </div>

      </div>
    </div>
  </div>
)}
<ModalConfirmacion
  open={showConfirm}
  title={modo === "subir" ? "Subir documento" : "Actualizar documento"}
  description={
    modo === "subir"
      ? "¿Deseas subir este documento al estudio?"
      : "¿Deseas reemplazar el documento actual?"
  }
  confirmText={modo === "subir" ? "Subir" : "Actualizar"}
  cancelText="Cancelar"
  color="blue"
  onClose={() => setShowConfirm(false)}
  onConfirm={async () => {
    setShowConfirm(false);
    await confirmarSubida();
  }}
/><ModalResultado
  open={resultado.open}
  type={resultado.type}
  title={resultado.title}
  message={
    modo === "subir"
      ? resultado.message
      : resultado.message
  }
  onClose={() =>
    setResultado((prev) => ({ ...prev, open: false }))
  }
/>
    </div>
  );
}   