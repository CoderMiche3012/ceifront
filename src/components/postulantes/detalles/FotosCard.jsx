import { useRef } from "react";
import { Camera, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function FotosCard({ data, setData }) {
  const inputRef = useRef(null);

  const fotos = data?.fotos || [];

  const seleccionar = () => {
    inputRef.current?.click();
  };

  const subirFotos = (e) => {
    const archivos = Array.from(e.target.files);

    if (!archivos.length) return;

    const nuevasFotos = archivos.map((file) => ({
      nombre: file.name,
      url: URL.createObjectURL(file),
    }));

    setData((prev) => ({
      ...prev,
      fotos: [...(prev.fotos || []), ...nuevasFotos],
    }));
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow border border-slate-200 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Fotos iniciales
        </h3>

        <button
          onClick={seleccionar}
          className="h-8 w-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center hover:bg-teal-200"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Zona principal */}
      <div className="relative rounded-3xl border-2 border-dashed border-slate-200 min-h-[265px] flex items-center justify-center p-4">

        {/* Flechas */}
        <button className="absolute left-[-14px] top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow border border-slate-200 flex items-center justify-center">
          <ChevronLeft size={16} />
        </button>

        <button className="absolute right-[-14px] top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow border border-slate-200 flex items-center justify-center">
          <ChevronRight size={16} />
        </button>

        {/* Sin fotos */}
        {fotos.length === 0 && (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Camera size={26} className="text-slate-400" />
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-2">
              Sin fotos
            </h4>

            <p className="text-sm text-slate-400 leading-5 mb-6">
              sube la foto correspondiente
              <br />
              para el expediente
            </p>

            <button
              onClick={seleccionar}
              className="rounded-full bg-teal-100 px-6 py-3 text-sm font-semibold text-teal-700 hover:bg-teal-200"
            >
              Examinar archivos
            </button>
          </div>
        )}

        {/* Si hay fotos */}
        {fotos.length > 0 && (
          <img
            src={fotos[0].url}
            alt="foto"
            className="h-full w-full object-cover rounded-2xl"
          />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={subirFotos}
      />
    </div>
  );
}