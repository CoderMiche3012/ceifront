import { HandHeart, ChevronRight, Loader2, Heart } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
export default function DonadorCard({ data }) {
  const navigate = useNavigate();

  const donadores = data?.donadores || [];
  const tieneDonadores = donadores.length > 0;

  const irDonador = (id) => {
    navigate(`/App/donadores/donador/${id}`);
  };

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

      {!tieneDonadores ? (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 text-center">
          <Heart className="w-6 h-6 text-amber-600 mx-auto mb-3" />
          <p className="text-sm text-slate-600">
            Sin donadores asignados
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-5">
          <div className="space-y-3">
            {donadores.map((item) => (
              <button
                key={item.id_donador}
                onClick={() => irDonador(item.id_donador)}
                className="w-full group rounded-2xl bg-white p-4 text-left shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                    {item.nombre?.[0]?.toUpperCase() || "D"}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-slate-800">
                      {item.nombre}
                    </p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-600" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}