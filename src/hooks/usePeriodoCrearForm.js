import { useState } from "react";

import {
  crearPeriodo,
  actualizarPeriodo,
  obtenerPeriodos,
  eliminarPeriodo,
} from "../services/periodoService";

import {
  obtenerSeguimientos,
  crearSeguimiento,
  eliminarSeguimiento,
} from "../services/seguimientoService";

import {
  crearDatosEscolaresInd,
} from "../services/escuelaService";

export const usePeriodoCrearForm = (
  onSuccess,
  onClose
) => {

  const [form, setForm] = useState({
    ciclo_escolar: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [resultModal, setResultModal] =
    useState({
      open: false,
      type: "success",
      title: "",
      message: "",
    });
  const escolaridades = [
    {
      id_escolaridad: 1,
      grado_escolar: "1",
      nivel_escolar: "Preescolar",
    },
    {
      id_escolaridad: 2,
      grado_escolar: "2",
      nivel_escolar: "Preescolar",
    },
    {
      id_escolaridad: 3,
      grado_escolar: "3",
      nivel_escolar: "Preescolar",
    },

    {
      id_escolaridad: 4,
      grado_escolar: "1",
      nivel_escolar: "Primaria",
    },
    {
      id_escolaridad: 5,
      grado_escolar: "2",
      nivel_escolar: "Primaria",
    },
    {
      id_escolaridad: 6,
      grado_escolar: "3",
      nivel_escolar: "Primaria",
    },
    {
      id_escolaridad: 7,
      grado_escolar: "4",
      nivel_escolar: "Primaria",
    },
    {
      id_escolaridad: 8,
      grado_escolar: "5",
      nivel_escolar: "Primaria",
    },
    {
      id_escolaridad: 9,
      grado_escolar: "6",
      nivel_escolar: "Primaria",
    },

    {
      id_escolaridad: 10,
      grado_escolar: "1",
      nivel_escolar: "Secundaria",
    },
    {
      id_escolaridad: 11,
      grado_escolar: "2",
      nivel_escolar: "Secundaria",
    },
    {
      id_escolaridad: 12,
      grado_escolar: "3",
      nivel_escolar: "Secundaria",
    },

    {
      id_escolaridad: 13,
      grado_escolar: "1",
      nivel_escolar: "Preparatoria",
    },
    {
      id_escolaridad: 14,
      grado_escolar: "2",
      nivel_escolar: "Preparatoria",
    },
    {
      id_escolaridad: 15,
      grado_escolar: "3",
      nivel_escolar: "Preparatoria",
    },

    {
      id_escolaridad: 16,
      grado_escolar: "1",
      nivel_escolar: "Universidad",
    },
    {
      id_escolaridad: 17,
      grado_escolar: "2",
      nivel_escolar: "Universidad",
    },
    {
      id_escolaridad: 18,
      grado_escolar: "3",
      nivel_escolar: "Universidad",
    },
    {
      id_escolaridad: 19,
      grado_escolar: "4",
      nivel_escolar: "Universidad",
    },
    {
      id_escolaridad: 20,
      grado_escolar: "5",
      nivel_escolar: "Universidad",
    },
    {
      id_escolaridad: 21,
      grado_escolar: "6",
      nivel_escolar: "Universidad",
    },
    {
      id_escolaridad: 22,
      grado_escolar: "7",
      nivel_escolar: "Universidad",
    },
  ];

  const handlePreSubmit = (e) => {

    e.preventDefault();

    setError("");

    if (
      !form.ciclo_escolar.trim() ||
      !form.fecha_inicio ||
      !form.fecha_fin
    ) {
      setError(
        "Todos los campos son obligatorios."
      );

      return;
    }

    const inicio = new Date(
      form.fecha_inicio + "T00:00:00"
    );

    const fin = new Date(
      form.fecha_fin + "T00:00:00"
    );

    if (fin <= inicio) {
      setError(
        "La fecha de fin debe ser posterior al inicio."
      );

      return;
    }

    setShowConfirm(true);
  };
  const handleConfirmSave = async () => {

    setShowConfirm(false);

    setLoading(true);

    setError("");

    let nuevoPeriodo = null;

    let periodoAnterior = null;

    const seguimientosCreados = [];

    try {

      const periodosActuales =
        await obtenerPeriodos();

      const nombreNuevo =
        form.ciclo_escolar
          .trim()
          .toLowerCase();

      if (
        periodosActuales.some(
          (p) =>
            p.ciclo_escolar
              .trim()
              .toLowerCase() === nombreNuevo
        )
      ) {
        throw new Error(
          `El periodo "${form.ciclo_escolar}" ya existe.`
        );
      }
      const inicioNuevo = new Date(
        form.fecha_inicio + "T00:00:00"
      );

      const finNuevo = new Date(
        form.fecha_fin + "T00:00:00"
      );

      const conflicto =
        periodosActuales.find((p) => {

          const i = new Date(
            p.fecha_inicio + "T00:00:00"
          );

          const f = new Date(
            p.fecha_fin + "T00:00:00"
          );

          return (
            inicioNuevo <= f &&
            finNuevo >= i
          );
        });

      if (conflicto) {
        throw new Error(
          `Choca con el periodo "${conflicto.ciclo_escolar}".`
        );
      }

      periodoAnterior =
        periodosActuales.find(
          (p) => Number(p.estado) === 1
        );

      if (periodoAnterior) {

        await actualizarPeriodo(
          periodoAnterior.id_periodo,
          {
            ...periodoAnterior,
            estado: 0,
          }
        );
      }
      nuevoPeriodo =
        await crearPeriodo({
          ...form,
          ciclo_escolar:
            form.ciclo_escolar.trim(),
          estado: 1,
        });

      const seguimientos =
        await obtenerSeguimientos();
      const seguimientosActivos =
        seguimientos.filter(
          (s) =>
            s.id_periodo ===
              periodoAnterior?.id_periodo &&
            s.estatus === "Activo"
        );

      for (const seg of seguimientosActivos) {

        const existe =
          seguimientos.some(
            (s) =>
              s.id_beneficiario ===
                seg.id_beneficiario &&
              s.id_periodo ===
                nuevoPeriodo.id_periodo
          );

        if (existe) continue;

        const nuevoSeguimiento =
          await crearSeguimiento({
            id_beneficiario:
              seg.id_beneficiario,

            id_periodo:
              nuevoPeriodo.id_periodo,

            estatus: "Activo",

            nota_seguimiento:
              "Seguimiento creado automáticamente",
          });

        seguimientosCreados.push(
          nuevoSeguimiento.id_seguimiento
        );
        if (seg.datos_escolares) {

          const escolaridadActual =
            seg.datos_escolares
              .id_escolaridad
              ?.id_escolaridad;

          const siguienteEscolaridad =
            escolaridades.find(
              (e) =>
                e.id_escolaridad ===
                escolaridadActual + 1
            );

          const escolaridadFinal =
            siguienteEscolaridad ||
            escolaridades.find(
              (e) =>
                e.id_escolaridad ===
                escolaridadActual
            );

          const esBasica = [
            "Preescolar",
            "Primaria",
            "Secundaria",
          ].includes(
            escolaridadFinal?.nivel_escolar
          );

          await crearDatosEscolaresInd({

            id_seguimiento:
              nuevoSeguimiento.id_seguimiento,

            id_escolaridad:
              escolaridadFinal?.id_escolaridad,

            id_institucion:
              seg.datos_escolares
                .id_institucion
                ?.id_institucion,

            grupo:
              seg.datos_escolares.grupo,

            especialidad:
              seg.datos_escolares
                .especialidad,

            turno:
              seg.datos_escolares.turno,

            modalidad_educativa:
              esBasica
                ? "ANUAL"
                : "SEMESTRAL",

            nota_escolar:
              seg.datos_escolares
                .nota_escolar || "",
          });
        }
      }
      setResultModal({
        open: true,
        type: "success",
        title: "¡Registro Exitoso!",
        message:
          `El periodo ${form.ciclo_escolar} ` +
          `ha sido creado y los seguimientos ` +
          `activos fueron generados automáticamente.`,
      });

      setForm({
        ciclo_escolar: "",
        fecha_inicio: "",
        fecha_fin: "",
      });

    } catch (err) {
      try {

        await Promise.all(
          seguimientosCreados.map((id) =>
            eliminarSeguimiento(id)
          )
        );

        if (nuevoPeriodo?.id_periodo) {

          await eliminarPeriodo(
            nuevoPeriodo.id_periodo
          );
        }

        if (periodoAnterior) {

          await actualizarPeriodo(
            periodoAnterior.id_periodo,
            {
              ...periodoAnterior,
              estado: 1,
            }
          );
        }

      } catch (rollbackError) {

        console.error(
          "Error rollback:",
          rollbackError
        );
      }

      setResultModal({
        open: true,
        type: "error",
        title: "Error",
        message:
          err.message ||
          "Ocurrió un error inesperado.",
      });

    } finally {

      setLoading(false);
    }
  };

  const handleFinalClose = () => {

    setResultModal({
      ...resultModal,
      open: false,
    });

    if (resultModal.type === "success") {

      onSuccess();

      onClose();
    }
  };

  return {
    form,
    setForm,
    error,
    loading,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  };
};