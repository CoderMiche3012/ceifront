import { useRef, useState } from "react";
import { Camera, Plus, ChevronLeft, ChevronRight, ImagePlus } from "lucide-react";
import { subirFotografia } from "../../../../expedientes/services/fotografiaService";

export default function FotosCard({ data }) {
  const inputRef = useRef(null);

  const fotos = data?.fotografias || [];

  const [index, setIndex] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [preview, setPreview] = useState(null);

  const seleccionar = () => {
    inputRef.current?.click();
  };

  const subirFotos = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(file);

    // aquí NO subes aún, solo preparas
  };

  const confirmarSubida = async () => {
    if (!preview) return;
    if (!descripcion.trim()) return alert("Escribe una descripción");

    try {
      const formData = new FormData();

      formData.append("foto_archivo", preview);
      formData.append("id_expediente", data.id_expediente);
      formData.append("etapa", "Inicial");
      formData.append("descripcion", descripcion);

      await subirFotografia(formData);

      setPreview(null);
      setDescripcion("");
      inputRef.current.value = null;

    } catch (error) {
      console.error("Error subiendo foto:", error);
    }
  };

  const next = () => {
    if (!fotos.length) return;
    setIndex((prev) => (prev + 1) % fotos.length);
  };

  const prev = () => {
    if (!fotos.length) return;
    setIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow border border-slate-200 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Camera size={18} />
          Fotos del expediente
        </h3>

        <button
          onClick={seleccionar}
          className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center hover:scale-105 transition"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* VIEWER */}
      <div className="relative rounded-2xl border border-slate-200 overflow-hidden min-h-[280px] bg-slate-50 flex items-center justify-center">

        {/* NAV */}
        {fotos.length > 0 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full"
            >
              <ChevronRight size={16} />
            </button>

            {/* INDICADOR */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs bg-black/60 text-white px-2 py-1 rounded-full">
              {index + 1} / {fotos.length}
            </div>
          </>
        )}

        {/* EMPTY */}
        {fotos.length === 0 ? (
          <div className="text-center p-6">
            <ImagePlus size={40} className="mx-auto text-slate-400 mb-2" />
            <p className="text-slate-500 font-medium">Sin fotos aún</p>
          </div>
        ) : (
          <img
            src={fotos[index].foto_archivo}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* PREVIEW + FORM */}
      {preview && (
        <div className="space-y-2 p-3 border rounded-xl bg-slate-50">
          <p className="text-sm font-semibold text-slate-700">
            Nueva foto seleccionada
          </p>

          <input
            type="text"
            placeholder="Escribe descripción obligatoria..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <div className="flex gap-2">
            <button
              onClick={confirmarSubida}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
            >
              Subir foto
            </button>

            <button
              onClick={() => {
                setPreview(null);
                setDescripcion("");
              }}
              className="bg-slate-200 px-4 py-2 rounded-lg text-sm"
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
        accept="image/*"
        className="hidden"
        onChange={subirFotos}
      />
    </div>
  );
}