import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {obtenerExpedienteIndividual,} from "../../services/expedientesService";
import {obtenerBeneficiarioIndividual,} from "../../services/beneficiariosService";
import { calcularEdad } from "../../utils/formatters";

const mapExpedienteData = (expediente, beneficiario) => {
  const familia = expediente?.familia ?? [];
  const tutor = familia.find((f) => f?.es_tutor_principal);
  return {
    ...expediente,
    direccion: {
      cp: expediente?.id_direccion?.cp ?? "--",
      municipio: expediente?.id_direccion?.municipio ?? "--",
      calle: expediente?.id_direccion?.calle ?? "--",
      numero: expediente?.id_direccion?.numero ?? "--",
      colonia: expediente?.id_direccion?.colonia ?? "--",
    },

    familia,
    tutor_nombre: tutor
      ? `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ""}`.trim()
      : "--",

    tutor_telefono: tutor?.telefono ?? "--",

    id_beneficiario: beneficiario?.id_beneficiario ?? null,

    estatus_beneficiario:
      beneficiario?.estatus_beneficiario ??
      beneficiario?.estatus ??
      beneficiario?.estado ??
      null,

    fecha_ingreso: beneficiario?.fecha_ingreso ?? "--",
    nota: beneficiario?.notas ?? "--",
  };
};

export const useExpedienteData = (id) => {
  const [tab, setTab] = useState("generales");

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["expediente", id],

    enabled: !!id,

    queryFn: async () => {
      const beneficiario = await obtenerBeneficiarioIndividual(id);

      if (!beneficiario) {
        throw new Error("Beneficiario no encontrado");
      }

      if (!beneficiario.id_expediente) {
        throw new Error("El beneficiario no tiene expediente asociado");
      }

      const expediente = await obtenerExpedienteIndividual(
        beneficiario.id_expediente
      );

      if (!expediente) {
        throw new Error("Expediente no encontrado");
      }

      return mapExpedienteData(expediente, beneficiario);
    },

    staleTime: 1000 * 60 * 5,
  });

  const edad = useMemo(() => {
    if (!data?.fecha_nacimiento) return "--";
    return calcularEdad(data.fecha_nacimiento);
  }, [data?.fecha_nacimiento]);

  return {
    data,
    loading: isLoading,
    isFetching,
    error: error?.message || null,

    tab,
    setTab,

    edad,

    refetch,
  };
};