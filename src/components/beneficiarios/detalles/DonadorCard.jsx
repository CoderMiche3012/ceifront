import { HandHeart, ChevronRight, Loader2, Heart } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerDonador } from "../../../services/donadoresService";

export default function DonadorCard({ data }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [donadores, setDonadores] = useState([]);
  const buscarDonadores = useCallback(async () => {
    if (!data?.id_beneficiario) return;

    try {
      setLoading(true);
      const response = await obtenerDonador();      
      const lista = Array.isArray(response) ? response : response.results || [];
      const encontrados = lista.filter((item) =>
        item.beneficiarios_apoyados?.includes(data.id_beneficiario)
      );

      setDonadores(encontrados);
    } catch (error) {
      console.error("Error buscando donadores:", error);
      setDonadores([]);
    } finally {
      setLoading(false);
    }
  }, [data?.id_beneficiario]);

  useEffect(() => {
    buscarDonadores();
  }, [buscarDonadores]);

  const irDonador = (id) => {
    navigate(`/App/donadores/donador/${id}`);
  };

  const tieneDonadores = donadores.length > 0;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <HandHeart className="w-4 h-4 text-teal-600" />
          Donadores Asignados
        </h3>

        {tieneDonadores && (
          <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
            {donadores.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-teal-500 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Sincronizando donadores...</p>
        </div>
      ) : !tieneDonadores ? (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 text-center">
          <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-[10px] font-black text-amber-700 tracking-[0.2em] mb-2 uppercase">
            Sin donadores
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Actualmente buscando apoyo para <br />
            <span className="font-bold text-slate-800">
              {data?.nombre || "este beneficiario"}
            </span>
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-5">
          <p className="text-[10px] font-black text-teal-700 tracking-[0.2em] mb-4 text-center uppercase">
            Patrocinadores actuales
          </p>
          <div className="space-y-3">
            {donadores.map((item) => (
              <button
                key={item.id_donador}
                onClick={() => irDonador(item.id_donador)}
                className="w-full group rounded-2xl border border-white bg-white p-4 text-left shadow-sm hover:shadow-md hover:border-teal-200 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    {(item.nombre?.[0] || "D").toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">
                      {item.nombre} {item.apellido_p}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {item.tipo || "Donador Particular"}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}