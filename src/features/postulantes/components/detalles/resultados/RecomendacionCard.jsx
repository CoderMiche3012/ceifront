import { useState, useEffect } from "react";
import { ShieldCheck, Lock, Loader2, CheckCircle, Pencil } from "lucide-react";

import { useActualizarEstudioDetalle } from "../../../hooks/usePostulantes";
import Card from "../../../../../components/ui/Card";
import { usePermissions } from "../../../../../context/PermissionsContext";

export default function RecomendacionCard({ data }) {
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();

  const canEditPostulante = hasModulePermission("postulantes", "editar");
  const estudioCompleto = data?.estatus_estudio?.toLowerCase()?.trim() === "completo";
  const puedeEditar = canEditPostulante && !["aceptado"].includes(data?.estatus_postulante?.toLowerCase());


  const [prioridad, setPrioridad] = useState("");
  const [nota, setNota] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [editando, setEditando] = useState(false);

  const { mutateAsync: actualizarRecomendacion, isPending: loading, } = useActualizarEstudioDetalle(data?.id_estudio);

  useEffect(() => {
    if (!data) return;
    setPrioridad(data?.prioridad_servicio || "");
    setNota(data?.nota_servicio || "");
    if (data?.prioridad_servicio) {
      setEditando(false);
    } else {
      setEditando(true);
    }
  }, [data]);

  const guardar = async () => {
    if (!estudioCompleto || !puedeEditar) return;

    if (!prioridad) {
      alert("Selecciona una prioridad");
      return;
    }

    try {
      await actualizarRecomendacion({
        prioridad_servicio: prioridad,
        nota_servicio: nota,
      });

      setEditando(false);
      setGuardado(true);

      setTimeout(() => setGuardado(false), 2500);
    } catch (error) {
      alert("Error al guardar recomendación");
    }
  };

  const opciones = [
    {
      key: "Alta",
      color: "border-red-400 bg-red-50 text-red-600",
    },
    {
      key: "Media",
      color: "border-yellow-400 bg-yellow-50 text-yellow-600",
    },
    {
      key: "Baja",
      color: "border-emerald-400 bg-emerald-50 text-emerald-600",
    },
  ];

  const tienePrioridad = !!prioridad;

  return (
    <Card className="w-full h-full space-y-6 relative">
      {/* editar */}
      {tienePrioridad && estudioCompleto && !editando && puedeEditar && (
        <button
          onClick={() => setEditando(true)}
          className="absolute top-5 right-5 flex items-center gap-1 text-sm font-semibold text-emerald-800 hover:text-emerald-900"
        >
          <Pencil size={15} />
          Editar
        </button>
      )}

      <div className="flex items-center justify-between pr-16">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-teal-600" size={18} />
          <h3 className="font-bold text-slate-800">
            Recomendación del Encargado
          </h3>
        </div>

        {!estudioCompleto && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock size={14} />
            Bloqueado
          </div>
        )}
      </div>

      {/* prioridad */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase">
          Nivel de prioridad
        </p>

        <div className="grid grid-cols-3 gap-3">
          {opciones.map((item) => {
            const activo = prioridad === item.key;

            return (
              <button
                key={item.key}
                type="button"
                disabled={!estudioCompleto || loading || !editando}
                onClick={() => setPrioridad(item.key)}
                className={`rounded-2xl border px-4 py-4 text-sm font-bold transition
                  ${activo
                    ? item.color
                    : "border-slate-200 text-slate-400"
                  }
                  ${!editando ? "cursor-default" : "hover:scale-[1.02]"
                  }
                  ${!estudioCompleto
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                  }`}
              >
                {item.key}
              </button>
            );
          })}
        </div>
      </div>

      {/* nota */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase">
          Justificación de prioridad
        </p>

        <textarea
          rows={5}
          disabled={!estudioCompleto || loading || !editando}
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          placeholder="Escribe una observación..."
          className="w-full rounded-2xl border border-slate-200 p-4 text-sm resize-none disabled:bg-slate-100 disabled:text-slate-400"
        />
      </div>

      {editando && estudioCompleto && (
        <div className="space-y-2">
          {editando && estudioCompleto && puedeEditar && (
            <button
              type="button"
              disabled={loading}
              onClick={guardar}
              className="w-full rounded-2xl bg-teal-600 py-3 text-sm font-bold text-white disabled:bg-slate-300 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}

              {loading ? "Guardando..." : "Guardar recomendación"}
            </button>
          )}
          {guardado && (
            <p className="text-xs text-center text-emerald-600 flex items-center justify-center gap-1">
              <CheckCircle size={14} />
              Guardado correctamente
            </p>
          )}
        </div>
      )}

      {!estudioCompleto && (
        <p className="text-xs text-center text-slate-500">
          Debe completarse el estudio socioeconómico
        </p>
      )}
    </Card>
  );
}