import { HandHeart, ChevronRight, Loader2, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerDonador } from "../../../services/donadoresService";

export default function DonadorCard({ data }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [donadores, setDonadores] = useState([]);

  useEffect(() => {
    buscarDonadores();
  }, [data?.id_beneficiario]);

  const buscarDonadores = async () => {
    try {
      setLoading(true);

      const response = await obtenerDonador();

      const lista = Array.isArray(response) ? response : response.results || [];

      const encontrados = lista.filter((item) =>
        item.beneficiarios_apoyados?.includes(data?.id_beneficiario)
      );

      setDonadores(encontrados);
    } catch (error) {
      console.error("Error buscando donadores:", error);
      setDonadores([]);
    } finally {
      setLoading(false);
    }
  };

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
          <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            {donadores.length}
          </span>
        )}
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Buscando donadores...</p>
        </div>
      ) : !tieneDonadores ? (
        /* SIN DONADORES */
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 text-center">
          <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-amber-600" />
          </div>

          <p className="text-xs font-bold text-amber-700 tracking-[0.2em] mb-2">
            SIN DONADORES
          </p>

          <p className="text-sm text-slate-600 leading-6">
            Actualmente buscando apoyo para{" "}
            <span className="font-semibold text-slate-800">
              {data?.nombre || "este beneficiario"}
            </span>
            .
          </p>
        </div>
      ) : (
        /* CON DONADORES */
        <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-5">
          <p className="text-xs font-bold text-green-700 tracking-[0.2em] mb-4 text-center">
            DONADORES ASIGNADOS
          </p>

          <div className="space-y-3">
            {donadores.map((item) => (
              <button
                key={item.id_donador}
                onClick={() => irDonador(item.id_donador)}
                className="w-full group rounded-2xl border border-white bg-white p-4 text-left shadow-sm hover:shadow-md hover:border-green-200 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="h-11 w-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {(item.nombre?.[0] || "").toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {item.nombre || ""} {item.apellido_p || ""}{" "}
                      {item.apellido_m || ""}
                    </p>

                    <p className="text-sm text-slate-500 mt-0.5">
                      {item.tipo || "Donador"}
                    </p>
                  </div>

                  {/* Flecha */}
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}