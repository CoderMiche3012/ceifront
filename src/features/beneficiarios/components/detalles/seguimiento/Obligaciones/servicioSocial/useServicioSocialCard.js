import {
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  useCrearObligacion,
  useActualizarObligacion,
} from "../../../../../hooks/seguimiento/useobligaciones";

import {
  initialPayload,
  normalizarFecha,
} from "./servicioSocial.helpers";

export default function useServicioSocialCard(
  seguimiento
) {
  const idSeguimiento = seguimiento?.id_seguimiento
  const crearObligacionMutation =
    useCrearObligacion();

  const actualizarObligacionMutation =
    useActualizarObligacion();

  const [modalForm, setModalForm] =
    useState(false);

  const [modalConfirm, setModalConfirm] =
    useState(false);

  const [modalResultado, setModalResultado] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [alerta, setAlerta] =
    useState("");

  const [payload, setPayload] =
    useState(
      initialPayload(idSeguimiento)
    );

  const data = seguimiento

  const servicios =
    useMemo(() => {
      return (
        data?.obligaciones?.filter(
          (o) =>
            o.tipo ===
            "servicioSocial"
        ) ?? []
      );
    }, [data]);

  const abrirNuevo =
    useCallback(() => {
      setPayload(
        initialPayload(
          idSeguimiento
        )
      );

      setAlerta("");
      setModalForm(true);
    }, [idSeguimiento]);

  const editar =
    useCallback(
      (item) => {
        setPayload({
          id_servicio_social:
            item.id_servicio_social,

          id_seguimiento:
            idSeguimiento,

          tipo:
            "servicioSocial",

          nombre:
            item.nombre || "",

          estatus:
            item.estatus ||
            "Pendiente",

          fecha:
            normalizarFecha(
              item.fecha
            ),

          observaciones:
            item.observaciones ||
            "",
        });

        setAlerta("");
        setModalForm(true);
      },
      [idSeguimiento]
    );

  const abrirConfirmacion =
    () => {
      if (!payload.fecha) {
        setAlerta(
          "Debes seleccionar una fecha"
        );
        return;
      }

      setModalForm(false);
      setModalConfirm(true);
    };

  const guardar =
    async () => {
      setLoading(true);

      try {
        const body = {
          id_seguimiento:
            idSeguimiento,

          tipo:
            "servicioSocial",

          nombre:
            payload.nombre.trim(),

          estatus:
            payload.estatus,

          fecha:
            payload.fecha,

          observaciones:
            payload.observaciones?.trim() ||
            "",
        };

        if (
          payload.id_servicio_social
        ) {
          await actualizarObligacionMutation.mutateAsync(
            {
              id:
                payload.id_servicio_social,
              payload: body,
            }
          );
        } else {
          await crearObligacionMutation.mutateAsync(
            body
          );
        }

        setModalConfirm(false);
        setModalResultado(true);

      } catch (error) {
        setModalConfirm(false);

        setAlerta(
          error?.message ||
            "Error al guardar"
        );

      } finally {
        setLoading(false);
      }
    };

  return {
    servicios,
    loading,
    alerta,
    payload,
    setPayload,

    modalForm,
    modalConfirm,
    modalResultado,

    abrirNuevo,
    editar,
    abrirConfirmacion,
    guardar,

    cerrarFormulario:
      () =>
        setModalForm(false),

    cerrarConfirmacion:
      () =>
        setModalConfirm(false),

    cerrarResultado:
      () =>
        setModalResultado(false),
  };
}