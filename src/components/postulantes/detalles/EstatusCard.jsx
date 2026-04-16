import { CheckCircle, Lock, Loader2, AlertCircle, Clock, Check, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { postulantesService } from "../../../services/postulantesService";

export default function EstatusCard({ data, onChangeDecision }) {
  const estudioCompleto = data?.estatus_estudio;
  const [decision, setDecision] = useState(data?.estatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (value) => {
    setLoading(true);
    try {
      await postulantesService.actualizarPostulante(data.id_postulante, { estatus: value });
      setDecision(value);
      if (onChangeDecision) onChangeDecision(value);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Configuraciones de estilo para estados finales
  const statusConfig = {
    aceptado: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle, label: "Aceptado" },
    rechazado: { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", icon: AlertCircle, label: "Rechazado" },
    espera: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: Clock, label: "En espera" },
  };

  const renderContenido = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 animate-pulse">
          <Loader2 className="animate-spin text-indigo-500 mb-3" size={32} />
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Sincronizando...</p>
        </div>
      );
    }

    if (estudioCompleto === "En revision") {
      return (
        <div className="flex flex-col items-center py-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
            <Lock className="text-slate-300" size={32} />
          </div>
          <h3 className="text-slate-700 font-semibold">Acción Restringida</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-[180px] mx-auto">
            El estudio socioeconómico aún no ha sido finalizado.
          </p>
          <div className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 text-sm font-medium border border-slate-200 flex items-center justify-center gap-2">
            <Lock size={14} /> Bloqueado
          </div>
        </div>
      );
    }

    // ESTADO: PENDIENTE (Botón inicial)
    if (decision === "en revisión") {
      return (
        <div className="flex flex-col items-center py-4">
          <div className="bg-indigo-50 p-4 rounded-2xl mb-4">
            <CheckCircle className="text-indigo-500" size={32} />
          </div>
          <h3 className="text-slate-800 font-bold text-lg">Estatus Final</h3>
          <p className="text-sm text-slate-500 mb-6">El postulante espera una resolución</p>
          <button
            onClick={() => setDecision("seleccion")}
            className="group w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-indigo-200 font-medium"
          >
            Definir estatus <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      );
    }

    // ESTADO: MENÚ DE SELECCIÓN
    if (decision === "seleccion") {
      return (
        <div className="w-full">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Cambiar Estatus</h3>
          <div className="space-y-2">
            {[
              { id: "aceptado", label: "Aceptar", color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200", icon: Check },
              { id: "rechazado", label: "Rechazar", color: "hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200", icon: X },
              { id: "espera", label: "Poner en Espera", color: "hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200", icon: Clock },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleChange(opt.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-600 transition-all duration-200 font-medium ${opt.color}`}
              >
                <div className="flex items-center gap-3">
                  <opt.icon size={18} /> {opt.label}
                </div>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100" />
              </button>
            ))}
            <button 
              onClick={() => setDecision(initialStatus)}
              className="text-xs text-slate-400 pt-2 hover:text-slate-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      );
    }

    // ESTADO: RESULTADO FINAL
    const current = statusConfig[decision] || { color: "text-slate-600", bg: "bg-slate-50", icon: CheckCircle, label: decision };
    const Icon = current.icon;

    return (
      <div className="flex flex-col items-center py-2">
        <div className={`${current.bg} ${current.border} border p-4 rounded-3xl mb-4 transition-all duration-500`}>
          <Icon className={current.color} size={36} />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Resultado</span>
        <h3 className={`text-2xl font-black ${current.color} mb-6`}>{current.label}</h3>
        
        <button 
          onClick={() => setDecision("seleccion")}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-indigo-500 transition-colors border-t border-slate-100 w-full justify-center pt-4"
        >
          Rectificar decisión
        </button>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center min-h-[300px] flex flex-col justify-center transition-all duration-300">
      {/* Elemento decorativo sutil */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full opacity-50" />
      
      <div className="relative z-10">
        {renderContenido()}
      </div>
    </div>
  );
}