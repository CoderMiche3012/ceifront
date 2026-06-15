import { useRef, useState } from "react";
import {
  Camera,
  Plus,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Expand,
  Trash2,
} from "lucide-react";

import {
  useSubirFotografia,
  useEliminarFotografia,
} from "../../../expedientes/hooks/useFotografias";

export default function FotosCard({ data }) {
  const id_expediente = data?.id_expediente;

  const { mutateAsync: subirFoto } = useSubirFotografia(id_expediente);
  const { mutateAsync: eliminarFoto } = useEliminarFotografia(id_expediente);

  const inputRef = useRef(null);
  const fotos = data?.fotografias || [];

  const [index, setIndex] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 MODAL
  const [modal, setModal] = useState(null);

  const seleccionar = () => inputRef.current?.click();

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(file);
  };

  const cancelar = () => {
    setPreview(null);
    setDescripcion("");
    inputRef.current.value = null;
  };

  const confirmarSubida = async () => {
    if (!preview) return;
    if (!descripcion.trim()) return alert("Escribe una descripción");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("foto_archivo", preview);
      formData.append("id_expediente", id_expediente);
      formData.append("etapa", "Inicial");
      formData.append("descripcion", descripcion);

      await subirFoto(formData);

      cancelar();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ELIMINAR
  const eliminar = async () => {
    try {
      const foto = modal?.fotos?.[modal?.index];
      if (!foto) return;

      await eliminarFoto(foto.id_foto);

      setModal(null);
    } catch (e) {
      console.error(e);
    }
  };

  const next = () => {
    if (!fotos.length) return;
    setIndex((p) => (p + 1) % fotos.length);
  };

  const prev = () => {
    if (!fotos.length) return;
    setIndex((p) => (p - 1 + fotos.length) % fotos.length);
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Camera size={18} />
          Fotos del expediente
        </h3>

        <button
          onClick={seleccionar}
          className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* VIEWER */}
      <div className="relative h-64 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">

        {fotos.length === 0 ? (
          <div className="text-center p-6">
            <ImagePlus size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500 font-semibold">Sin fotografías</p>
          </div>
        ) : (
          <>
            <img
              src={fotos[index].foto_archivo}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setModal({ fotos, index })}
            />

            {/* EXPAND */}
            <button
              onClick={() => setModal({ fotos, index })}
              className="absolute top-3 right-3 h-8 w-8 bg-black/40 text-white rounded-full flex items-center justify-center"
            >
              <Expand size={16} />
            </button>

            {/* NAV */}
            {fotos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/40 text-white rounded-full"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/40 text-white rounded-full"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* FORM */}
      {preview && (
        <div className="space-y-3 pt-2 border-t border-slate-100">

          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción..."
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />

          <div className="flex gap-2">
            <button
              onClick={confirmarSubida}
              disabled={loading}
              className="flex-1 bg-teal-600 text-white rounded-xl h-10"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" size={16} />
              ) : (
                "Subir foto"
              )}
            </button>

            <button
              onClick={cancelar}
              className="bg-slate-100 px-4 rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* INPUT */}
      <input ref={inputRef} type="file" hidden onChange={onFile} />

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">

          {/* cerrar */}
          <button
            onClick={() => setModal(null)}
            className="absolute top-4 right-4 text-white"
          >
            <X />
          </button>

          {/* eliminar */}
          <button
            onClick={eliminar}
            className="absolute top-4 right-16 text-red-400"
          >
            <Trash2 />
          </button>

          {/* imagen */}
          <img
            src={modal.fotos[modal.index].foto_archivo}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
          />

          {/* nav modal */}
          {modal.fotos.length > 1 && (
            <>
              <button
                onClick={() =>
                  setModal((p) => ({
                    ...p,
                    index:
                      (p.index - 1 + p.fotos.length) % p.fotos.length,
                  }))
                }
                className="absolute left-4 text-white"
              >
                <ChevronLeft size={30} />
              </button>

              <button
                onClick={() =>
                  setModal((p) => ({
                    ...p,
                    index: (p.index + 1) % p.fotos.length,
                  }))
                }
                className="absolute right-4 text-white"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}