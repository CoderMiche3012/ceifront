import {useMemo,useState,useCallback,} from "react";
import {useQuery,useQueryClient,} from "@tanstack/react-query";
import { obtenerSeguimiento } from "../../../../../../services/seguimientoService";
import {crearObligacion,actualizarObligacion,} from "../../../../../../services/obligacionesService";
import {initialPayload,normalizarFecha,} from "./servicioSocial.helpers";

export default function useServicioSocialCard(idSeguimiento) {
  const queryClient = useQueryClient();
  const [modalForm, setModalForm] = useState(false);
  const [ modalConfirm, setModalConfirm,] = useState(false);
  const [ modalResultado, setModalResultado,] = useState(false);
  const [loading, setLoading] =    useState(false);
  const [alerta, setAlerta] =useState("");

  const [payload, setPayload] =useState(initialPayload(idSeguimiento  ));

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: [
      "seguimiento-servicio-social",
      idSeguimiento,
    ],
    queryFn: () =>
      obtenerSeguimiento(
        idSeguimiento
      ),
    enabled:
      !!idSeguimiento,
  });

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
        initialPayload( idSeguimiento)
      );
      setAlerta("");
      setModalForm(true);
    }, [idSeguimiento]);

  const editar =
    useCallback(
      (item) => {
        setPayload({
          id_servicio_social: item.id_servicio_social,
          id_seguimiento: idSeguimiento,
          tipo: "servicioSocial",
          nombre: item.nombre || "",
          estatus:item.estatus ||"Pendiente",
          fecha:normalizarFecha(item.fecha),
          observaciones:item.observaciones ||"",
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
          id_seguimiento: idSeguimiento,
          tipo:"servicioSocial",
          nombre:payload.nombre.trim(),
          estatus:payload.estatus,
          fecha: payload.fecha,
          observaciones: payload.observaciones?.trim() ||"",
        };

        if (payload.id_servicio_social) {
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
              "seguimiento-servicio-social",
              idSeguimiento,
            ],
          }
        );

        setModalConfirm(
          false
        );
        setModalResultado(
          true
        );

      } catch (error) {
        setModalConfirm(
          false
        );

        setAlerta(
          error?.response
            ?.data?.message ||
            "Error al guardar"
        );

      } finally {
        setLoading(false);
      }
    };

  return {
    servicios,
    isLoading,
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