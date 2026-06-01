import { useState, useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import {
  obtenerExpedientePorId,
} from "../../expedientes/services/expedientesService";

import {
  obtenerBeneficiarioId,
} from "../services/beneficiariosService";

import { obtenerEstudios } from "../../postulantes/services/estudiosService";
import { obtenerVisitas } from "../../postulantes/services/visitasService";
import { calcularEdad } from "../../../utils/formatters";

const mapExpedienteData = ({
  expediente,
  beneficiario,
  estudio,
  visitas,
}) => {

  const familia =
    expediente?.familia ?? [];

  const fotografias =
    expediente?.fotografias ?? [];

  const tutor =
    familia.find(
      (f) => f?.es_tutor_principal
    );

  return {

    ...expediente,

    direccion: {
      cp:
        expediente?.id_direccion?.cp ??
        "--",

      municipio:
        expediente?.id_direccion?.municipio ??
        "--",

      calle:
        expediente?.id_direccion?.calle ??
        "--",

      numero:
        expediente?.id_direccion?.numero ??
        "--",

      colonia:
        expediente?.id_direccion?.colonia ??
        "--",
    },

    familia,

    fotografias,

    visitas,

    tutor_nombre: tutor
      ? `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ""}`.trim()
      : "--",

    tutor_telefono:
      tutor?.telefono ?? "--",

    id_beneficiario:
      beneficiario?.id_beneficiario ??
      null,

    estatus_beneficiario:
      beneficiario?.estatus_beneficiario ??
      beneficiario?.estatus ??
      beneficiario?.estado ??
      null,

    fecha_ingreso:
      beneficiario?.fecha_ingreso ??
      "--",

    nota:
      beneficiario?.notas ??
      "--",

    // =========================
    // ESTUDIO
    // =========================

    id_estudio:
      estudio?.id_estudio ??
      null,

    fecha_realizacion:
      estudio?.fecha_realizacion ??
      "--",

    estatus_estudio:
      estudio?.estatus_estudio ??
      "--",

    nota_servicio:
      estudio?.nota_servicio ??
      "--",

    prioridad_servicio:
      estudio?.prioridad_servicio ??
      "--",

    link_documento:
      estudio?.link_documento ??
      null,

    nivel_escolar_inicial:
      estudio?.nivel_escolar_inicial ??
      "--",

    grado_escolar_inicial:
      estudio?.grado_escolar_inicial ??
      "--",

    referencia_casa:
      estudio?.referencia_casa ??
      "--",

    referencia_ingreso:
      estudio?.referencia_ingreso ??
      "--",
  };
};

export const useExpedienteData = (
  id
) => {

  const [tab, setTab] =
    useState("generales");

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({

    queryKey: [
      "expediente",
      id,
    ],

    enabled: !!id,

    queryFn:
      async () => {

        // =====================
        // BENEFICIARIO
        // =====================

        const beneficiario =
          await obtenerBeneficiarioId(
            id
          );

        if (!beneficiario) {

          throw new Error(
            "Beneficiario no encontrado"
          );
        }

        if (
          !beneficiario.id_expediente
        ) {

          throw new Error(
            "El beneficiario no tiene expediente asociado"
          );
        }

        // =====================
        // EXPEDIENTE
        // =====================

        const expediente =
          await obtenerExpedientePorId(
            beneficiario.id_expediente
          );

        if (!expediente) {

          throw new Error(
            "Expediente no encontrado"
          );
        }

        // =====================
        // ESTUDIOS
        // =====================

        const estudiosData =
          await obtenerEstudios();

        const listaEstudios =
          Array.isArray(
            estudiosData
          )
            ? estudiosData
            : estudiosData?.results ||
              [];

        const estudio =
          listaEstudios.find(
            (e) =>
              String(
                e.id_expediente
              ) ===
              String(
                expediente?.id_expediente
              )
          ) || null;

        // =====================
        // VISITAS
        // =====================

        const visitasData =
          await obtenerVisitas();

        const listaVisitas =
          Array.isArray(
            visitasData
          )
            ? visitasData
            : visitasData?.results ||
              [];

        const visitas =
          listaVisitas.filter(
            (v) =>
              String(
                v.id_postulante
              ) === String(id)
          );

        // =====================
        // MAPEAR DATA
        // =====================

        return mapExpedienteData({
          expediente,
          beneficiario,
          estudio,
          visitas,
        });
      },

    staleTime:
      1000 * 60 * 5,
  });

  // =========================
  // EDAD
  // =========================

  const edad =
    useMemo(() => {

      if (
        !data?.fecha_nacimiento
      ) {
        return "--";
      }

      return calcularEdad(
        data.fecha_nacimiento
      );

    }, [
      data?.fecha_nacimiento,
    ]);

  return {

    data,

    loading:
      isLoading,

    isFetching,

    error:
      error?.message ||
      null,

    tab,

    setTab,

    edad,

    refetch,
  };
};

