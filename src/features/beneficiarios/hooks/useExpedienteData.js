import { useState, useMemo } from "react";

import { useBeneficiario,useAntecedentesIngreso } from "./useBeneficiarios";
import { useExpediente } from "../../expedientes/hooks/useExpedientes";
import {
  usePeriodoActivo,
  usePeriodos,
} from "../../periodos/hooks/usePeriodos";

const mapExpedienteData = ({
  expediente,
  beneficiario,
  estudio,
  visitas,
}) => {
  const familia = expediente?.familia ?? [];
  const donadores = beneficiario?.donadores ?? [];
  const fotografias = expediente?.fotografias ?? [];
  const documentos = expediente?.documentos ?? [];

  const tutor = familia.find(
    (f) => f?.es_tutor_principal
  );

  return {
    ...expediente,

    direccion: {
      cp:
        expediente?.direccion?.geografia?.codigo_postal ??
        "--",
      municipio:
        expediente?.direccion?.geografia?.municipio ??
        "--",
      calle: expediente?.direccion?.calle ?? "--",
      numero: expediente?.direccion?.numero ?? "--",
      colonia:
        expediente?.direccion?.geografia?.colonia ??
        "--",
    },

    familia,
    donadores,
    fotografias,
    documentos,
    visitas,

    tutor_nombre: tutor
      ? `${tutor.nombre} ${tutor.apellido_p} ${
          tutor.apellido_m || ""
        }`.trim()
      : "--",

    tutor_telefono: tutor?.telefono ?? "--",

    id_beneficiario:
      beneficiario?.id_beneficiario ?? null,

    estatus_beneficiario:
      beneficiario?.estatus_beneficiario ??
      beneficiario?.estatus ??
      beneficiario?.estado ??
      null,

    fecha_ingreso:
      beneficiario?.fecha_ingreso ?? "--",

    nota: beneficiario?.notas ?? "--",

    id_estudio: estudio?.id_estudio ?? null,

    fecha_realizacion:
      estudio?.fecha_realizacion ?? "--",

    estatus_estudio:
      estudio?.estatus_estudio ?? "--",

    nota_servicio:
      estudio?.nota_servicio ?? "--",

    prioridad_servicio:
      estudio?.prioridad_servicio ?? "--",

    link_documento:
      estudio?.link_documento ?? null,

    nivel_escolar_inicial:
      estudio?.nivel_escolar_inicial ?? "--",

    grado_escolar_inicial:
      estudio?.grado_escolar_inicial ?? "--",

    referencia_casa:
      estudio?.referencia_casa ?? "--",

    referencia_ingreso:
      estudio?.referencia_ingreso ?? "--",
  };
};

export const useExpedienteData = (id) => {
  const [tab, setTab] = useState("generales");

  // Beneficiario
  const {
    data: beneficiario,
    isLoading: loadingBeneficiario,
  } = useBeneficiario(id);

  // Expediente
  const expedienteId =
    beneficiario?.expediente_resumen?.id_expediente;

  const {
    data: expediente,
    isLoading: loadingExpediente,
  } = useExpediente(expedienteId);

  // Antecedentes de ingreso
  const { data: antecedentesIngreso } =
    useAntecedentesIngreso(id);

  const { data: periodoActivo } =
    usePeriodoActivo();

  const { data: periodos = [] } =
    usePeriodos();

  const historialOrdenado = useMemo(() => {
    const lista =
      beneficiario?.historial_seguimientos ?? [];

    const activo = [];
    const inactivo = [];

    for (const h of lista) {
      if (
        h.id_periodo ===
        periodoActivo?.id_periodo
      ) {
        activo.push(h);
      } else {
        inactivo.push(h);
      }
    }

    const ordenar = (a, b) =>
      b.id_periodo - a.id_periodo;

    return [
      ...activo,
      ...inactivo.sort(ordenar),
    ];
  }, [
    beneficiario?.historial_seguimientos,
    periodoActivo,
  ]);

  const isLoading =
    loadingBeneficiario ||
    loadingExpediente;

  const base = useMemo(() => {
    if (!expediente || !beneficiario)
      return null;

    return mapExpedienteData({
      expediente,
      beneficiario,
      estudio:
        antecedentesIngreso?.estudio_socioeconomico ??
        null,
      visitas:
        antecedentesIngreso?.visita ??
        null,
    });
  }, [
    expediente,
    beneficiario,
    antecedentesIngreso,
  ]);

  const data = useMemo(() => {
    if (!base) return null;

    return {
      ...base,
      historial_seguimientos:
        historialOrdenado,
      periodos,
      periodoActivo,
    };
  }, [
    base,
    historialOrdenado,
    periodos,
    periodoActivo,
  ]);

  return {
    data,
    loading: isLoading,
    tab,
    setTab,
  };
};