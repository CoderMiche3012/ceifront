import { useRef, useState } from "react";

import {
  FileText,
  Plus,
  Eye,
  Download,
  Upload,
} from "lucide-react";


import { useSubirDocumento } from "../../../expedientes/hooks/useDocumentos";

export default function EstudioCard({
  data
}) {

  const uploadMutation = useSubirDocumento();

  const inputRef =
    useRef(null);

  const [preview,
    setPreview] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);
  
  const documentoEstudio = data?.documentos?.find(
  (doc) =>
    doc.tipo_documento?.toLowerCase() ===
    "estudio"
);



const estudioUrl = documentoEstudio?.archivo
  ? `http://localhost:8000${documentoEstudio.archivo}`
  : null;

  // =========================
  // SELECCIONAR
  // =========================

  const seleccionar =
    () => {

      inputRef.current?.click();
    };

  // =========================
  // FILE
  // =========================

  const handleFile =
    (e) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      setPreview(file);
    };

  // =========================
  // LIMPIAR NOMBRE
  // =========================

  const limpiarNombreDocumento =
    (nombre) => {

      return nombre
        .replace(
          /\.[^/.]+$/,
          ""
        )
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .replace(
          /[^a-zA-Z0-9]/g,
          ""
        );
    };

  // =========================
  // SUBIR
  // =========================

  const confirmarSubida =
    async () => {

      if (!preview)
        return;

      try {

        setLoading(true);

        const formData =
          new FormData();

        const nombreLimpio =
          limpiarNombreDocumento(
            preview.name
          );

        formData.append(
          "archivo",
          preview
        );

        formData.append(
          "nombre_documento",
          nombreLimpio
        );

        formData.append(
          "tipo_documento",
          "Estudio"
        );

        formData.append(
          "id_expediente",
          data?.id_expediente
        );

        await uploadMutation.mutateAsync(formData);

        // 🔥 SOLO ACTUALIZA LOCALMENTE
        data.link_documento =
          URL.createObjectURL(
            preview
          );

        setPreview(null);

        if (inputRef.current) {

          inputRef.current.value =
            "";
        }

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Error subiendo estudio"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // DESCARGAR
  // =========================

  const descargarArchivo =
    async (url) => {

      try {

        const response =
          await fetch(url);

        const blob =
          await response.blob();

        const blobUrl =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href =
          blobUrl;

        link.download =
          "estudio";

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          blobUrl
        );

      } catch (error) {

        console.error(
          error
        );
      }
    };

  return (
    <div className="rounded-3xl bg-white p-5 shadow border border-slate-200 space-y-4">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">

          <FileText
            size={18}
            className="text-teal-600"
          />

          Estudio socioeconómico
        </h3>

        <button
          onClick={seleccionar}
          className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center hover:scale-105 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* CARD */}

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

          <button
            onClick={seleccionar}
            className="mt-5 inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm hover:bg-teal-700 transition"
          >
            <Plus size={16} />
            Subir estudio
          </button>
        </div>
      )}

      {/* PREVIEW */}

      {preview && (

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">

          <div className="flex items-center gap-3">

            <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center">

              <FileText
                size={20}
                className="text-teal-700"
              />
            </div>

            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold text-slate-700 truncate">
                {preview.name}
              </p>

              <p className="text-xs text-slate-500">
                Archivo listo para subir
              </p>
            </div>
          </div>

          <div className="flex gap-2">

            <button
              onClick={
                confirmarSubida
              }
              disabled={loading}
              className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-teal-700 transition disabled:opacity-50"
            >
              {loading
                ? "Subiendo..."
                : "Guardar estudio"}
            </button>

            <button
              onClick={() => {

                setPreview(null);

                if (
                  inputRef.current
                ) {

                  inputRef.current.value =
                    "";
                }
              }}
              className="px-4 py-2 rounded-xl bg-slate-200 text-sm text-slate-700 hover:bg-slate-300 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* INPUT */}

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
