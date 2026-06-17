import { useRef, useState } from "react";
import { FileText, Plus, Eye, Download, Upload } from "lucide-react";
import { HiOutlineX } from "react-icons/hi";

import { useSubirDocumento, useActualizarDocumento } from "../../../expedientes/hooks/useDocumentos";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../components/shared/ModalResultado";
import { ui } from "../../../../styles/ui/uiClasses";
import Boton from "../../../../components/ui/Boton";

import { usePermissions } from "../../../../context/PermissionsContext";

export default function EstudioCard({
  data
}) {
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditPostulante = hasModulePermission("postulantes", "editar");

  const uploadMutation = useSubirDocumento();
  const actualizarMutation = useActualizarDocumento();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarSubida, setMostrarSubida] = useState(false);
  const [modo, setModo] = useState("subir");
  const [showConfirm, setShowConfirm] = useState(false);

  const [resultado, setResultado] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
  });
  const documentoEstudio = data?.documentos?.find(
    (doc) =>
      doc.tipo_documento?.toLowerCase() ===
      "estudio"
  );

  const estudioUrl = documentoEstudio?.archivo
    ? `http://localhost:8000${documentoEstudio.archivo}`
    : null;
  const abrirModal = (tipo = "subir") => {
    setModo(tipo);
    setMostrarSubida(true);
  };

  const cerrarModal = () => {
    setMostrarSubida(false);
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const seleccionar = () => { inputRef.current?.click(); };
  const handleFile =
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setPreview(file);
    };

  const confirmarSubida =
    async () => {

      if (!preview) return;
      try {

        setLoading(true);
        const formData = new FormData();
        formData.append("archivo", preview);
        formData.append("nombre_documento", "EstudioSocioeconomico");
        formData.append("tipo_documento", "Estudio");
        formData.append("id_expediente", data?.id_expediente);

        if (modo === "cambiar" && documentoEstudio?.id_documento) {
          await actualizarMutation.mutateAsync({
            id_documento: documentoEstudio.id_documento,
            formData: formData,
          });
        } else {
          await uploadMutation.mutateAsync(formData);
        }

        data.link_documento = URL.createObjectURL(preview);
        setPreview(null);

        if (inputRef.current) {
          inputRef.current.value = "";
        }
        cerrarModal();

        setResultado({
          open: true,
          type: "success",
          title:
            modo === "subir"
              ? "Documento subido"
              : "Documento actualizado",
          message:
            modo === "subir"
              ? "El estudio socioeconómico se subió correctamente."
              : "El estudio socioeconómico se actualizó correctamente.",
        });
      } catch (error) {
        const mensaje =
          error?.errors?.archivo?.[0] ||
          error?.message ||
          "Error al subir documento";
        setResultado({
          open: true,
          type: "error",
          title: "Error",
          message: mensaje,
        });

      } finally {
        setLoading(false);
      }
    };

  const descargarArchivo =
    async (url) => {

      try {

        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "estudio";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);

      } catch (error) {
      }
    };

  return (
    <div className="rounded-3xl bg-white p-5 shadow border border-slate-200 space-y-4">
      <div className="flex items-center justify-between">

        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">

          <FileText
            size={18}
            className="text-teal-600"
          />

          Estudio socioeconómico
        </h3>

      </div>

      {estudioUrl ? (

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div className="flex items-start gap-4">

            <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">

              <FileText
                size={24}
                className="text-red-600"
              />
            </div>

            <div className="flex-1">

              <p className="font-semibold text-slate-800">
                Documento cargado
              </p>

              <p className="text-sm text-slate-500 mt-1">
                El estudio socioeconómico ya fue agregado al expediente.
              </p>

              <div className="flex gap-2 mt-4">

                {/* VER */}

                <a
                  href={estudioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm hover:bg-teal-700 transition"
                >
                  <Eye size={16} />
                  Ver estudio
                </a>

                {/* DESCARGAR */}

                <button
                  onClick={() =>
                    descargarArchivo(
                      estudioUrl
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm hover:bg-slate-100 transition"
                >
                  <Download size={16} />
                  Descargar
                </button>
                {canEditPostulante && (
                  <button
                    onClick={() => abrirModal("cambiar")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-sm hover:bg-amber-200 transition"
                  >
                    <Upload size={16} />
                    Cambiar
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>

      ) : (

        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center">

          <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">

            <Upload
              size={28}
              className="text-slate-500"
            />
          </div>

          <p className="font-semibold text-slate-700">
            No hay estudio cargado
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Agrega el estudio socioeconómico del expediente.
          </p>
          {canEditPostulante && (
            <button
              onClick={() => abrirModal("subir")}
              className="mt-5 inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm hover:bg-teal-700 transition"
            >
              <Plus size={16} />
              Subir estudio
            </button>
          )}
        </div>
      )}

      {/* PREVIEW */}

      {mostrarSubida && (
        <div className={ui.modal.formOverlay}>

          <div className="w-full max-w-2xl">

            <div className={ui.modal.formContainer}>

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

              <div className={ui.modal.formBody}>
                <div className={ui.modal.formScroll}>
                  <div className="space-y-6">

                    <div
                      onClick={seleccionar}
                      className="
                        w-full border-2 border-dashed border-slate-300
                        rounded-2xl p-10 text-center cursor-pointer hover:border-blue-500
                        hover:bg-blue-50 transition
                       "                  >
                      <Upload
                        size={28}
                        className="mx-auto text-blue-600 mb-2" size={28}
                      />

                      <p className="text-sm font-semibold text-slate-700">
                        Seleccionar documento
                      </p>

                      <p className="text-xs text-slate-400">
                        Solo PDF
                      </p>
                    </div>

                    {preview && (
                      <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3">

                        <p className="text-sm font-medium text-emerald-700">
                          {preview.name}
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
                    disabled={!preview}
                    onClick={() => setShowConfirm(true)}
                  >
                    {modo === "subir"
                      ? "Subir documento"
                      : "Actualizar documento"}
                  </Boton>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}
      {loading && (
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
      {/* INPUT */}
      <ModalConfirmacion
        open={showConfirm}
        title={
          modo === "subir"
            ? "Subir documento"
            : "Actualizar documento"
        }
        description={
          modo === "subir"
            ? "¿Deseas subir este estudio socioeconómico?"
            : "¿Deseas reemplazar el estudio socioeconómico actual?"
        }
        confirmText={
          modo === "subir"
            ? "Subir"
            : "Actualizar"
        }
        cancelText="Cancelar"
        color="blue"
        onClose={() => setShowConfirm(false)}
        onConfirm={async () => {
          setShowConfirm(false);
          await confirmarSubida();
        }}
      />
      <ModalResultado
        open={resultado.open}
        type={resultado.type}
        title={resultado.title}
        message={resultado.message}
        onClose={() =>
          setResultado((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.png,.jpeg"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
