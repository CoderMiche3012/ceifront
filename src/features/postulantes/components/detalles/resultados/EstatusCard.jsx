import { CheckCircle, Lock, Loader2, AlertCircle, Clock, Check, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

import { ui } from "../../../../../styles/ui/index";

import { useActualizarPostulanteDetalle, useAceptarPostulante, } from "../../../hooks/usePostulantes";
import Card from "../../../../../components/ui/Card";

export default function EstatusCard({ data }) {

  const estatusEstudio = data?.estatus_estudio?.toLowerCase()?.trim();
  const estudioCompleto = estatusEstudio === "completo";
  const tienePrioridad = !!data?.prioridad_servicio;
  const mostrarAdvertenciaPrioridad = estudioCompleto && !tienePrioridad;

  const puedeEditar =
    tienePrioridad && !["aceptado", "rechazado"].includes(
      data?.estatus_postulante?.toLowerCase()
    );

  const obtenerEstatusInicial = () => {
    const valor = data?.estatus_postulante?.toLowerCase()?.trim();

    if (["aceptado", "rechazado"].includes(valor)) {
      return valor;
    }

    return "seleccion";
  };

  const [decision, setDecision] = useState(obtenerEstatusInicial());
  const [loading, setLoading] = useState(false);
  const aceptarPostulanteMutation = useAceptarPostulante();

  const actualizarPostulanteMutation =
    useActualizarPostulanteDetalle(data?.id_postulante);

  useEffect(() => {
    setDecision(obtenerEstatusInicial());
  }, [data?.estatus_postulante]);

  const handleChange = async (value) => {
    setLoading(true);

    try {
      if (value === "aceptado") {
        await aceptarPostulanteMutation.mutateAsync(
          data.id_postulante
        );
      } else {
        await actualizarPostulanteMutation.mutateAsync({
          estatus: "Rechazado",
        });
      }

      setDecision(value);
    } catch (error) {
      console.log(error);
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    seleccion: {
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: Clock,
      label: "Pendiente",
    },

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
  };

  const current = statusConfig[decision] || statusConfig.seleccion;
  const Icon = current.icon;

  return (
    <Card className="h-full overflow-hidden p-0">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              Resolución
            </p>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Estatus del postulante
            </h2>
          </div>
          <div
            className={` ${ui.badge.base} ${current.bg} ${current.color} `}>
            {current.label}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2
            className="animate-spin text-indigo-500"
            size={34}
          />
          <p className="mt-4 text-sm text-slate-500">
            Guardando cambios...
          </p>
        </div>
      ) : !estudioCompleto ? (
        <div className="p-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
              <Lock size={28} className="text-slate-500" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-800">
              Estatus bloqueado
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Debe completarse el estudio socioeconómico antes
              de tomar una decisión.
            </p>
          </div>
        </div>
      ) : mostrarAdvertenciaPrioridad ? (
        <div className="p-6">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h3 className="text-lg font-bold text-amber-800">
              Prioridad pendiente
            </h3>
            <p className="mt-2 text-sm text-amber-700">
              El estudio socioeconómico está completo, pero aún no se ha asignado
              una prioridad de servicio al postulante.
            </p>
          </div>
        </div>
      )
        : decision === "seleccion" ? (
          <>
            {/* PROGRESO */}
            <div className="p-6">
              <h3 className={`${ui.text.label} mb-5`}>
                Progreso
              </h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check
                      size={16}
                      className="text-emerald-600"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      Estudio completado
                    </p>
                    <p className="text-xs text-slate-500">
                      Requisitos validados
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Clock
                      size={16}
                      className="text-indigo-600"
                    />
                  </div>

                  <div>
                    <p className="font-medium text-slate-800">
                      Pendiente de resolución
                    </p>

                    <p className="text-xs text-slate-500">
                      Seleccione una decisión final
                    </p>
                  </div>
                </div>

              </div>

            </div>
            {/* acciones */}
            <div className="px-6 pb-6">
              <h3 className={`${ui.text.label} mb-4`}>
                Acciones disponibles
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleChange("aceptado")}
                  className=" w-full p-4 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition "
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-semibold text-emerald-700">
                        Aceptar postulante
                      </p>
                      <p className="text-xs text-emerald-600 mt-1">
                        Crear beneficiario automáticamente
                      </p>
                    </div>

                    <CheckCircle
                      size={24}
                      className="text-emerald-600"
                    />

                  </div>
                </button>



                <button
                  onClick={() => handleChange("rechazado")}
                  className=" w-full p-4 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 transition "
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-semibold text-rose-700">
                        Rechazar postulante
                      </p>
                      <p className="text-xs text-rose-600 mt-1">
                        Finalizar proceso
                      </p>
                    </div>
                    <X size={24} className="text-rose-600" />
                  </div>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6">

            <div
              className={` rounded-3xl p-6 border ${current.bg} ${current.border}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className=" w-16 h-16 rounded-2xl bg-white flex items-center justify-center"
                >
                  <Icon size={30} className={current.color} />
                </div>

                <div>
                  <p className="text-xs uppercase font-bold text-slate-500">
                    Resultado final
                  </p>

                  <h2
                    className={` text-3xl font-black ${current.color}`}
                  >
                    {current.label}
                  </h2>
                </div>

              </div>
            </div>

            {puedeEditar && (
              <button
                onClick={() => setDecision("seleccion")}
                className={` ${ui.button.base} ${ui.button.secondary} ${ui.button.sm} mt-5 w-full`}
              >
                Cambiar decisión
              </button>
            )}
          </div>
        )}

    </Card>
  );
}
