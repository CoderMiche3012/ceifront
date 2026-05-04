import {CheckCircle,Lock,Loader2,AlertCircle,Clock,Check,X,ChevronRight,} from "lucide-react";
import { useState, useEffect } from "react";
import { postulantesService } from "../../../../services/postulantesService";
import { crearBeneficiario } from "../../../../services/beneficiariosService";

export default function EstatusCard({ data, onChangeDecision }) {
  const estatusEstudio = data?.estatus_estudio?.toLowerCase()?.trim();
  const estudioCompleto = estatusEstudio === "completo";
  const noEditable = ["aceptado", "rechazado"].includes(data?.estatus_postulante?.toLowerCase());
  const obtenerEstatusInicial = () => {
    const valor = data?.estatus_postulante?.toLowerCase()?.trim();

    if (
      valor === "aceptado" ||
      valor === "rechazado" ||
      valor === "espera" ||
      valor === "en revisión"
    ) {
      return valor;
    }

    return "en revisión";
  };

  const [decision, setDecision] = useState(obtenerEstatusInicial());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDecision(obtenerEstatusInicial());
  }, [data?.estatus]);

  const handleChange = async (value) => {
    setLoading(true);

    try {
      // 1. Actualizar estatus postulante
      await postulantesService.actualizarPostulante(
        data.id_postulante,
        { estatus: value }
      );

      // 2. Si fue aceptado -> crear beneficiario automático
      if (value === "aceptado") {
        await crearBeneficiario({
          estatus: "Activo",
          fecha_ingreso: new Date().toISOString().split("T")[0],
          id_expediente: data.id_expediente,
        });
      }

      setDecision(value);

      if (onChangeDecision) onChangeDecision(value);

    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    aceptado: {
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: CheckCircle,
      label: "Aceptado",
    },
    rechazado: {
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: AlertCircle,
      label: "Rechazado",
    },
    espera: {
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: Clock,
      label: "En espera",
    },
    "en revisión": {
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: Clock,
      label: "En revisión",
    },
  };

  const renderContenido = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin text-indigo-500 mb-3" size={32} />
          <p className="text-sm text-slate-400">Guardando...</p>
        </div>
      );
    }

    if (!estudioCompleto) {
      return (
        <div className="flex flex-col items-center py-4">
          <div className="bg-slate-100 p-4 rounded-2xl mb-4">
            <Lock className="text-slate-400" size={32} />
          </div>

          <h3 className="font-bold text-slate-700">
            Acción restringida
          </h3>

          <p className="text-xs text-slate-400 mt-2 max-w-[200px]">
            El estudio socioeconómico debe estar completado para modificar el estatus.
          </p>

          <div className="mt-6 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-400 border border-slate-200">
            Bloqueado
          </div>
        </div>
      );
    }

    if (decision === "en revisión") {
      return (
        <div className="flex flex-col items-center py-4">
          <div className="bg-indigo-50 p-4 rounded-2xl mb-4">
            <CheckCircle className="text-indigo-500" size={32} />
          </div>

          <h3 className="text-slate-800 font-bold text-lg">
            Estatus final
          </h3>

          <p className="text-sm text-slate-500 mb-6">
            El postulante espera resolución
          </p>

          <button
            onClick={() => setDecision("seleccion")}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3 rounded-xl transition"
          >
            Definir estatus
          </button>
        </div>
      );
    }

    if (decision === "seleccion") {
      const opciones = [
        { id: "aceptado", label: "Aceptar", icon: Check },
        { id: "rechazado", label: "Rechazar", icon: X },
        { id: "espera", label: "En espera", icon: Clock },
      ];

      return (
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">
            Cambiar estatus
          </h3>

          <div className="space-y-2">
            {opciones.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleChange(opt.id)}
                className="w-full flex items-center justify-between p-3 rounded-xl border bg-slate-50 hover:bg-slate-100"
              >
                <div className="flex items-center gap-2">
                  <opt.icon size={16} />
                  {opt.label}
                </div>

                <ChevronRight size={16} />
              </button>
            ))}

            <button
              onClick={() => setDecision(obtenerEstatusInicial())}
              className="text-xs text-slate-400 pt-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      );
    }

    const current =
      statusConfig[decision] || statusConfig["en revisión"];

    const Icon = current.icon;

    return (
      <div className="flex flex-col items-center py-2">
        <div className={`${current.bg} ${current.border} border p-4 rounded-3xl mb-4`}>
          <Icon className={current.color} size={36} />
        </div>

        <span className="text-xs font-bold text-slate-400 uppercase">
          Resultado
        </span>

        <h3 className={`text-2xl font-black ${current.color} mb-6`}>
          {current.label}
        </h3>
        {!noEditable && (
          <button
            onClick={() => setDecision("seleccion")}
            className="text-sm text-slate-400 hover:text-indigo-500"
          >
            Cambiar decisión
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow border border-slate-100 min-h-[300px] flex items-center justify-center text-center">
      {renderContenido()}
    </div>
  );
}