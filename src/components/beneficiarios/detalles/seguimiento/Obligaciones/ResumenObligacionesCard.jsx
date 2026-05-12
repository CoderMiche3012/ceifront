import { useMemo, useState } from "react";
import { Pencil, CalendarDays } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Servicios
import { obtenerSeguimiento } from "../../../../../services/seguimientoService";
import {
  crearObligacion,
  actualizarObligacion,
} from "../../../../../services/obligacionesService";

// Componentes UI
import ModalConfirmacion from "../../../../shared/ModalConfirmacion";
import ModalResultado from "../../../../shared/ModalResultado";
import Alerta from "../../../../ui/AlertaError";

/* ==========================================================================
   MODAL FORMULARIO
   ========================================================================== */
function ModalFormulario({ open, data, setData, onClose, onNext }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[520px] rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-slate-800">
          Editar {data?.tipo === "servicio_social" ? "Servicio Social" : "Carta Donante"}
        </h2>

        {/* ESTATUS */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Estatus</label>
          <select
            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            value={data?.estatus || "Pendiente"}
            onChange={(e) => setData({ ...data, estatus: e.target.value })}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Cumplio">Cumplió</option>
            <option value="No cumplio">No cumplió</option>
          </select>
        </div>

        {/* FECHA */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Fecha</label>
          <input
            type="date"
            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            value={data?.fecha || ""}
            onChange={(e) => setData({ ...data, fecha: e.target.value })}
          />
        </div>

        {/* OBSERVACIONES */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Observaciones</label>
          <textarea
            className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
            rows={4}
            value={data?.observaciones || ""}
            onChange={(e) => setData({ ...data, observaciones: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button
            onClick={onNext}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   COMPONENTE PRINCIPAL
   ========================================================================== */
export default function ResumenObligacionesCard({ idSeguimiento }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["seguimiento-obligaciones", idSeguimiento],
    queryFn: () => obtenerSeguimiento(idSeguimiento),
    enabled: !!idSeguimiento,
  });

  const { servicioSocial, cartaDonante } = useMemo(() => {
    const obs = data?.obligaciones || [];
    return {
      servicioSocial: obs.find((o) => o.tipo === "servicio_social"),
      cartaDonante: obs.find((o) => o.tipo === "carta_donante"),
    };
  }, [data]);

  /* ================= ESTADOS ================= */
  const [modalForm, setModalForm] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalResultado, setModalResultado] = useState(false);

  // Payload centralizado: Incluye el tipo de obligación desde el inicio
  const [payload, setPayload] = useState({
    id_obligacion: null,
    id_seguimiento: idSeguimiento,
    tipo: "", 
    estatus: "Pendiente",
    fecha: "",
    observaciones: "",
  });

  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState("");

  /* ================= HELPERS ================= */
  const normalizarFecha = (fecha) => {
    if (!fecha) return "";
    return fecha?.includes("T") ? fecha.split("T")[0] : fecha;
  };

  const obtenerBadge = (estatus) => {
    switch (estatus?.toLowerCase()) {
      case "cumplio": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "no cumplio": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString("es-MX");
  };

  /* ================= MANEJO DE ACCIONES ================= */
  const handleEditar = (tipo, obligacion) => {
    setPayload({
      id_obligacion: obligacion?.id_obligacion || null,
      id_seguimiento: idSeguimiento,
      tipo: tipo, // 🔥 Aquí se inyecta el tipo (servicio_social o carta_donante)
      estatus: obligacion?.estatus || "Pendiente",
      fecha: normalizarFecha(obligacion?.fecha),
      observaciones: obligacion?.observaciones || "",
    });
    setModalForm(true);
  };

  const confirmarAccion = async () => {
    setLoading(true);
    setAlerta("");

    try {
      const cleanPayload = {
        id_seguimiento: idSeguimiento,
        tipo: payload.tipo, // 🔥 Tomado directamente del payload
        estatus: payload.estatus,
        fecha: payload.fecha || null,
        observaciones: payload.observaciones || "",
      };

      if (payload?.id_obligacion) {
        await actualizarObligacion(payload.id_obligacion, cleanPayload);
      } else {
        await crearObligacion(cleanPayload);
      }

      queryClient.invalidateQueries(["seguimiento-obligaciones", idSeguimiento]);
      setModalConfirm(false);
      setModalResultado(true);
    } catch (e) {
      setAlerta(e?.response?.data?.message || "Error al guardar la obligación");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="p-4 text-slate-500">Cargando...</div>;

  return (
    <>
      {alerta && <Alerta mensaje={alerta} tipo="error" />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CARD: SERVICIO SOCIAL */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between mb-5">
            <h3 className="font-bold text-slate-700">Servicio Social</h3>
            <div className="flex gap-3 items-center">
              <span className={`px-3 py-1 rounded-full border text-xs font-medium ${obtenerBadge(servicioSocial?.estatus)}`}>
                {servicioSocial?.estatus || "Pendiente"}
              </span>
              <button
                onClick={() => handleEditar("servicio_social", servicioSocial)}
                className="text-teal-700 hover:text-teal-900 flex items-center gap-1 text-sm transition-colors"
              >
                <Pencil size={14} /> Editar
              </button>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-2 text-slate-600 border border-slate-100">
            <CalendarDays size={16} />
            {formatearFecha(servicioSocial?.fecha)}
          </div>
        </div>

        {/* CARD: CARTA DONANTE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between mb-5">
            <h3 className="font-bold text-slate-700">Carta Donante</h3>
            <div className="flex gap-3 items-center">
              <span className={`px-3 py-1 rounded-full border text-xs font-medium ${obtenerBadge(cartaDonante?.estatus)}`}>
                {cartaDonante?.estatus || "Pendiente"}
              </span>
              <button
                onClick={() => handleEditar("carta_donante", cartaDonante)}
                className="text-teal-700 hover:text-teal-900 flex items-center gap-1 text-sm transition-colors"
              >
                <Pencil size={14} /> Editar
              </button>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-2 text-slate-600 border border-slate-100">
            <CalendarDays size={16} />
            {formatearFecha(cartaDonante?.fecha)}
          </div>
        </div>
      </div>

      {/* MODALES */}
      <ModalFormulario
        open={modalForm}
        data={payload}
        setData={setPayload}
        onClose={() => setModalForm(false)}
        onNext={() => {
          setModalForm(false);
          setModalConfirm(true);
        }}
      />

      <ModalConfirmacion
        open={modalConfirm}
        title="Guardar cambios"
        description={`Se actualizará la información de ${payload.tipo === 'servicio_social' ? 'Servicio Social' : 'Carta Donante'}.`}
        confirmText="Guardar"
        onClose={() => setModalConfirm(false)}
        onConfirm={confirmarAccion}
        loading={loading}
      />

      <ModalResultado
        open={modalResultado}
        type="success"
        title="Guardado"
        message="La obligación se guardó correctamente"
        onClose={() => setModalResultado(false)}
      />
    </>
  );
}