import { useState } from "react";
import { FileText, Download, Eye, RefreshCw, Upload, } from "lucide-react";
import { HiOutlineX } from "react-icons/hi";

import { ui } from "../../../../../styles/ui/index";

import Field from "../../../../../components/ui/Field";
import Input from "../../../../../components/ui/Input";
import Boton from "../../../../../components/ui/Boton";
import ModalConfirmacion from "../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../components/shared/ModalResultado";
import { usePermissions } from "../../../../../context/PermissionsContext";

export default function EstudioCard({ data, estudio, puedeEditar = true }) {
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

  const nombreDocumento = data
    ? `Estudio_Socioeconómico_${[data.nombre, data.apellido_p, data.apellido_m]
      .filter(Boolean)
      .join("_")}.pdf`
    : "Estudio_Socioeconómico.pdf";

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
      alert("Error al descargar:");
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
        title: modo === "subir" ? "Documento subido" : "Documento actualizado",
        message:
          modo === "subir" ? "El documento se subió correctamente." : "El documento se actualizó correctamente.",
      });

    } catch (error) {
      setResultado({
        open: true,
        type: "error",
        title: "Error",
        message: error.message,
      });
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">

        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase">
            Estudio socioeconómico
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {estudioCompleto ? "Documento cargado correctamente" : "Pendiente de carga"}
          </p>
        </div>

        {/* documento */}
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
            <div className={`grid gap-2 ${puedeEditar ? "grid-cols-3" : "grid-cols-2"}`} >

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
                onClick={() => descargarDocumento(documentoUrl, nombreDocumento)}
                className="rounded-xl bg-emerald-100 px-3 py-2 text-xs font-semibold hover:bg-emerald-200 flex items-center justify-center gap-2"
              >
                <Download size={14} />
                Descargar
              </button>

              {puedeEditar && (
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
          puedeEditar && (
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
                  PDF
                </span>
              </div>
            </button>
          )
        )}
        {/* modal */}
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
                        ? "Selecciona un archivo PDF para el estudio socioeconómico"
                        : "Reemplaza el documento PDF actual del estudio socioeconómico"}
                    </p>
                  </div>

                  <button
                    onClick={cerrarModal}
                    className="p-2 rounded-xl hover:bg-slate-100 transition"
                  >
                    <HiOutlineX size={20} />
                  </button>
                </div>

                {/* contenido */}
                <div className={ui.modal.formBody}>
                  <div className={ui.modal.formScroll}>
                    <div className="space-y-6">
                      <div
                        onClick={() => document.getElementById("fileEstudio").click()}
                        className="
                        w-full border-2 border-dashed border-slate-300
                        rounded-2xl p-10 text-center cursor-pointer hover:border-blue-500
                        hover:bg-blue-50 transition
                       "
                      >
                        <Upload className="mx-auto text-blue-600 mb-2" size={28} />

                        <p className="text-sm font-semibold text-slate-700">
                          Seleccionar documento
                        </p>

                        <p className="text-xs text-slate-400">
                          Solo se admite documentos PDF
                        </p>
                      </div>

                      <input
                        id="fileEstudio"
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (!file) return;

                          if (file.type !== "application/pdf") {
                            setResultado({
                              open: true,
                              type: "error",
                              title: "Archivo inválido",
                              message: "Solo se permiten archivos PDF Max.10MB",
                            });

                            e.target.value = "";
                            return;
                          }

                          estudio.setArchivo(file);
                        }}
                      />

                      {estudio.archivo && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                          <p className="text-sm font-medium text-emerald-700">
                            {estudio.archivo.name}
                          </p>
                        </div>
                      )}

                    </div>
                  </div>

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
        />

        {estudio.loading && (
          <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-xl text-center min-w-[320px]">
              <div className="h-10 w-10 mx-auto mb-4 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <h3 className="font-semibold text-slate-800">
                Procesando documento...
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Esto puede tardar unos segundos.
              </p>
            </div>
          </div>
        )}
        <ModalResultado
          open={resultado.open}
          type={resultado.type}
          title={resultado.title}
          message={
            modo === "subir"
              ? resultado.message
              : resultado.message
          }
          onClose={() => setResultado((prev) => ({ ...prev, open: false }))}
        />
      </div>
    </>
  );
}
