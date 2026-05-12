import { useMemo, useState } from "react";
import {
  ClipboardCheck,
  Pencil,
  CalendarDays,
} from "lucide-react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerSeguimiento } from "../../../../../services/seguimientoService";

import {
  crearObligacion,
  actualizarObligacion,
} from "../../../../../services/obligacionesService";

import ModalConfirmacion from "../../../../shared/ModalConfirmacion";
import ModalResultado from "../../../../shared/ModalResultado";
import Alerta from "../../../../ui/AlertaError";

/* ================= MODAL FORMULARIO ================= */
function ModalFormulario({ open, data, setData, onClose, onNext }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-2xl p-6 space-y-4">

        <h2 className="text-xl font-bold">
          Editar obligación
        </h2>

        {/* ESTATUS */}
        <div>
          <label className="text-sm text-slate-600">Estatus</label>
          <select
            className="w-full border p-2 rounded-lg"
            value={data.estatus}
            onChange={(e) =>
              setData({ ...data, estatus: e.target.value })
            }
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Cumplio">Cumplió</option>
            <option value="No cumplio">No cumplió</option>
          </select>
        </div>

        {/* FECHA */}
        <div>
          <label className="text-sm text-slate-600">Fecha</label>
          <input
            type="date"
            className="w-full border p-2 rounded-lg"
            value={data.fecha || ""}
            onChange={(e) =>
              setData({ ...data, fecha: e.target.value })
            }
          />
        </div>

        {/* OBSERVACIONES */}
        <div>
          <label className="text-sm text-slate-600">
            Observaciones
          </label>
          <textarea
            className="w-full border p-2 rounded-lg"
            rows={4}
            value={data.observaciones || ""}
            onChange={(e) =>
              setData({ ...data, observaciones: e.target.value })
            }
          />
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600"
          >
            Cancelar
          </button>

          <button
            onClick={onNext}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTE PRINCIPAL ================= */

export default function ResumenObligacionesCard({
  idSeguimiento,
}) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["seguimiento-obligaciones", idSeguimiento],
    queryFn: () => obtenerSeguimiento(idSeguimiento),
    enabled: !!idSeguimiento,
  });

  const obligaciones = useMemo(() => data?.obligaciones || [], [data]);

  const servicioSocial = obligaciones.find(
    (o) => o.tipo_obligacion === "servicio_social"
  );

  const cartaDonante = obligaciones.find(
    (o) => o.tipo_obligacion === "carta_donante"
  );

  /* ================= ESTADOS ================= */
  const [modalForm, setModalForm] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalResultado, setModalResultado] = useState(false);

  const [alerta, setAlerta] = useState("");
  const [loading, setLoading] = useState(false);

  const [tipoActivo, setTipoActivo] = useState(null);
  const [payload, setPayload] = useState(null);

  /* ================= EDITAR ================= */
  const handleEditar = ({ tipo, obligacion }) => {
    setTipoActivo(tipo);

    setPayload(
      obligacion
        ? {
            ...obligacion,
          }
        : {
            tipo_obligacion: tipo,
            id_seguimiento: idSeguimiento,
            estatus: "Pendiente",
            fecha: "",
            observaciones: "",
          }
    );

    setModalForm(true);
  };

  /* ================= PASO: FORM → CONFIRM ================= */
  const irConfirmacion = () => {
    setModalForm(false);
    setModalConfirm(true);
  };

  /* ================= GUARDAR ================= */
  const confirmarAccion = async () => {
    setLoading(true);
    setAlerta("");

    try {
      if (payload?.id_obligacion) {
        await actualizarObligacion(
          payload.id_obligacion,
          payload
        );
      } else {
        await crearObligacion(payload);
      }

      queryClient.invalidateQueries([
        "seguimiento-obligaciones",
        idSeguimiento,
      ]);

      setModalConfirm(false);
      setModalResultado(true);
    } catch (e) {
      setAlerta(
        e?.response?.data?.message ||
          "Error al guardar la obligación"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="p-4">Cargando...</div>;

  return (
    <>
      {alerta && <Alerta mensaje={alerta} tipo="error" />}

      {/* ================= UI ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* SERVICIO SOCIAL */}
        <div className="bg-white border rounded-3xl p-5">
          <div className="flex justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold">
                Servicio Social
              </h3>
              <p className="text-xs text-slate-400">
                Actividades asignadas
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full border text-xs">
                {servicioSocial?.estatus || "Pendiente"}
              </span>

              <button
                onClick={() =>
                  handleEditar({
                    tipo: "servicio_social",
                    obligacion: servicioSocial,
                  })
                }
                className="flex items-center gap-1 text-teal-700"
              >
                <Pencil size={14} />
                Editar
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border rounded-2xl p-4">
            <p className="text-xs text-slate-400">Fecha</p>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              {servicioSocial?.fecha || "Sin fecha"}
            </div>
          </div>
        </div>

        {/* CARTA DONANTE */}
        <div className="bg-white border rounded-3xl p-5">
          <div className="flex justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold">
                Carta Donante
              </h3>
              <p className="text-xs text-slate-400">
                Comunicación con donante
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full border text-xs">
                {cartaDonante?.estatus || "Pendiente"}
              </span>

              <button
                onClick={() =>
                  handleEditar({
                    tipo: "carta_donante",
                    obligacion: cartaDonante,
                  })
                }
                className="flex items-center gap-1 text-teal-700"
              >
                <Pencil size={14} />
                Editar
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border rounded-2xl p-4">
            <p className="text-xs text-slate-400">Fecha</p>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              {cartaDonante?.fecha || "Sin fecha"}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODALES ================= */}

      <ModalFormulario
        open={modalForm}
        data={payload || {}}
        setData={setPayload}
        onClose={() => setModalForm(false)}
        onNext={irConfirmacion}
      />

      <ModalConfirmacion
        open={modalConfirm}
        title="Guardar cambios"
        description="Se guardará la información de la obligación."
        confirmText="Guardar"
        cancelText="Cancelar"
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