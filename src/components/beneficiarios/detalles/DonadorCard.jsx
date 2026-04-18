import { HandHeart } from "lucide-react";

export default function DonadorCard({ data, setData  }) {
  const tieneDonador = false;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      
      {/* Header */}
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-6">
        <HandHeart className="w-4 h-4 text-teal-600" />
        Donador Asignado
      </h3>

      {/* Contenido */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        
        {!tieneDonador ? (
          <>
            <div className="flex justify-center gap-1 mb-2">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
            </div>

            <p className="text-xs font-bold text-amber-700 tracking-wider mb-2">
              SIN DONADOR
            </p>

            <p className="text-sm text-slate-600">
              Actualmente buscando un donador para{" "}
              <span className="font-semibold">
                {data.nombre || "este beneficiario"}
              </span>.
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-bold text-green-700 tracking-wider mb-2">
              DONADOR ASIGNADO
            </p>

            <p className="text-sm text-slate-700 font-medium">
              {""}
            </p>
          </>
        )}
      </div>
    </div>
  );
}