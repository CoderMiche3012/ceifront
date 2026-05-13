import { useMemo, useState, useCallback, } from "react";
import { useQuery, useQueryClient, } from "@tanstack/react-query";
import { obtenerSeguimiento } from "../../../../../../services/seguimientoService";
import { crearObligacion, actualizarObligacion, } from "../../../../../../services/obligacionesService";
import { initialPayload, normalizarFecha, } from "./carta.helpers";

export default function useCartaCard(idSeguimiento) {
  const queryClient = useQueryClient();

  const [modalForm, setModalForm,] = useState(false);
  const [modalConfirm, setModalConfirm,] = useState(false);
  const [modalResultado, setModalResultado,] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState("");
  const [payload, setPayload] = useState(initialPayload(idSeguimiento));

  const { data, isLoading, } = useQuery({
    queryKey: [
      "seguimiento-obligaciones",
      idSeguimiento,
    ],
    queryFn: () =>
      obtenerSeguimiento(
        idSeguimiento
      ),
    enabled:
      !!idSeguimiento,
  });

  const carta = useMemo(() => {
    return (
      data?.obligaciones?.find(
        (o) =>
          o.tipo ===
          "carta"
      ) ?? null
    );
  }, [data]);

  const handleEditar =
    useCallback(() => {
      setPayload({
        id_servicio_social:
          carta?.id_servicio_social ||
          null,
        id_seguimiento:
          idSeguimiento,
        tipo: "carta",
        estatus:
          carta?.estatus ||
          "Pendiente",
        fecha:
          normalizarFecha(
            carta?.fecha
          ),
        observaciones:
          carta?.observaciones ||
          "",
      });

      setAlerta("");
      setModalForm(true);
    }, [
      carta,
      idSeguimiento,
    ]);

  const abrirConfirmacion =
    () => {
      if (!payload.fecha) {
        setAlerta(
          "La fecha es obligatoria"
        );
        return;
      }

      setAlerta("");
      setModalConfirm(true);
    };

  const confirmarAccion =
    async () => {
      setLoading(true);

      try {
        const body = {
          id_seguimiento:
            idSeguimiento,
          tipo: "carta",
          estatus:
            payload.estatus,
          fecha:
            payload.fecha,
          observaciones:
            payload.observaciones,
        };

        if (
          payload.id_servicio_social
        ) {
          await actualizarObligacion(
            payload.id_servicio_social,
            body
          );
        } else {
          await crearObligacion(
            body
          );
        }

        await queryClient.invalidateQueries(
          {
            queryKey: [
              "seguimiento-obligaciones",
              idSeguimiento,
            ],
          }
        );

        setModalConfirm(
          false
        );
        setModalForm(false);
        setModalResultado(
          true
        );

      } catch (error) {
        setModalConfirm(
          false
        );

        const mensaje =
          error?.response
            ?.data?.message ||
          error?.response
            ?.data?.mensaje ||
          error?.message ||
          "Error al guardar";

        setAlerta(
          mensaje
        );

      } finally {
        setLoading(false);
      }
    };

  return {
    carta,
    isLoading,
    loading,
    alerta,
    payload,
    setPayload,

    modalForm,
    modalConfirm,
    modalResultado,

    handleEditar,
    abrirConfirmacion,
    confirmarAccion,

    cerrarFormulario:
      () =>
        setModalForm(
          false
        ),

    cerrarConfirmacion:
      () =>
        setModalConfirm(
          false
        ),

    cerrarResultado:
      () =>
        setModalResultado(
          false
        ),
  };
}