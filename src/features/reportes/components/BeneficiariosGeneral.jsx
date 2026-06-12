import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";

import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";

import {
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  PauseCircle,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

// services
import { obtenerBeneficiarios } from "../../beneficiarios/services/beneficiariosService";
import { obtenerPeriodos } from "../../periodos/services/periodoService";
import { solicitarDescargaReporte } from "../services/reporteService";
import { obtenerExpedientes } from "../../expedientes/services/expedientesService";

/**
 * MAPEO
 */
const mapBeneficiarios = (data = [], expedientes = []) => {
  return data.map((b) => {
    const expediente = b?.expediente_resumen || {};
    const seguimientos = b.historial_seguimientos || [];
    const expedienteCompleto = expedientes.find(
      (e) => e.id_beneficiario === b.id_beneficiario
    );
    const tutorPrincipal = expedienteCompleto?.familia?.find(
      (f) => f.es_tutor_principal
    );


    const calcularEdad = (fechaNacimiento) => {

      if (!fechaNacimiento) return "";
      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();

      const mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      return edad;
    };

    return {
      id_beneficiario: b.id_beneficiario,

      // 🔥 UNIFICADO (IMPORTANTE)
      nombre_completo: expediente.nombre_completo || "Sin nombre",

      edad: calcularEdad(expediente.fecha_nacimiento) || "-",
      estatus: b.estatus || "Desconocido",
      donador: b.donadores?.length > 0 ? "Con donador" : "Sin donador",

      municipio: expediente.municipio || "N/A",
      colonia: expediente.colonia || "N/A",
      cp: expediente.codigo_postal || "N/A",

      calle: expediente.calle || "",
      numero: expediente.numero || "",

      telefono: expediente.telefono || "",

      tutor: tutorPrincipal
        ? `${tutorPrincipal.nombre} ${tutorPrincipal.apellido_p} ${tutorPrincipal.apellido_m}`
        : "",

      telefonoTutor: tutorPrincipal?.telefono || "",

      parentescoTutor: tutorPrincipal?.parentesco || "",

      familiares: expedienteCompleto?.familia?.length || 0,

      escolaridad: seguimientos?.[0]?.datos_escolares?.id_escolaridad
        ? `${seguimientos[0].datos_escolares.id_escolaridad.nivel_escolar} - ${seguimientos[0].datos_escolares.id_escolaridad.grado_escolar}°`
        : "N/A",

      escuela:
        seguimientos?.[0]?.datos_escolares?.id_institucion?.nombre ||
        "Sin escuela",

      seguimientos,
    };
  });
};

export default function ReporteBeneficiariosTab() {
  // DATA
  const { data: beneficiarios = [] } = useQuery({
    queryKey: ["beneficiarios"],
    queryFn: obtenerBeneficiarios,
  });

  const { data: expedientes = [] } = useQuery({
    queryKey: ["expedientes"],
    queryFn: obtenerExpedientes,
  });


  const { data: periodos = [] } = useQuery({
    queryKey: ["periodos"],
    queryFn: obtenerPeriodos,
  });

  // FILTROS
  const [periodo, setPeriodo] = useState("");
  const [estatus, setEstatus] = useState("");
  const [search, setSearch] = useState("");

  // DATA NORMALIZADA
  const dataTabla = useMemo(() => {
    return mapBeneficiarios(beneficiarios, expedientes);
  }, [beneficiarios]);

  // OPTIONS PERIODOS
  const periodosOptions = useMemo(() => {
    return [
      { value: "", label: "Todos los periodos" },
      ...periodos.map((p) => ({
        value: p.id_periodo,
        label: p.ciclo_escolar,
      })),
    ];
  }, [periodos]);

  // FILTRO FINAL
  const dataFiltrada = useMemo(() => {
    return dataTabla.filter((b) => {
      const matchPeriodo = periodo
        ? b.seguimientos?.some(
          (s) => String(s.id_periodo) === String(periodo)
        )
        : true;

      const matchEstatus = estatus ? b.estatus === estatus : true;

      const matchSearch = search
        ? b.nombre_completo.toLowerCase().includes(search.toLowerCase())
        : true;

      return matchPeriodo && matchEstatus && matchSearch;
    });
  }, [dataTabla, periodo, estatus, search]);

  // STATS
  const stats = useMemo(() => {
    return {
      total: dataFiltrada.length,
      activos: dataFiltrada.filter((b) => b.estatus === "Activo").length,
      inactivos: dataFiltrada.filter((b) => b.estatus === "Inactivo").length,
      graduados: dataFiltrada.filter((b) => b.estatus === "Graduado").length,
      pausa: dataFiltrada.filter((b) => b.estatus === "Pausa").length,
    };
  }, [dataFiltrada]);

  // DESCARGA
  const ejecutarDescargaBlob = (buffer, nombreArchivo, mimeType) => {
    if (!buffer) return;

    const realBuffer =
      buffer instanceof ArrayBuffer ? buffer : buffer.buffer;

    const blob = new Blob([realBuffer], { type: mimeType });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = nombreArchivo;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  // EXCEL
  const descargarExcel = async () => {
    try {
      const buffer = await solicitarDescargaReporte(
        "beneficiarios",
        "excel",
        dataTabla // ✅ FIX
      );

      ejecutarDescargaBlob(
        buffer,
        `beneficiarios_${periodo || "todos"}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (error) {
      console.error("Error Excel:", error);
    }
  };

  // PDF
  const descargarPDF = async () => {
    try {
      const buffer = await solicitarDescargaReporte(
        "beneficiarios",
        "pdf",
        dataTabla // ✅ FIX
      );

      ejecutarDescargaBlob(
        buffer,
        `beneficiarios_${periodo || "todos"}.pdf`,
        "application/pdf"
      );
    } catch (error) {
      console.error("Error PDF:", error);
    }
  };

  return (
    <div className="space-y-6">

      <TarjetasEstadisticas
        items={[
          { label: "Total", value: stats.total, icon: Users, color: "blue" },
          { label: "Activos", value: stats.activos, icon: UserCheck, color: "emerald" },
          { label: "Inactivos", value: stats.inactivos, icon: UserX, color: "red" },
          { label: "Graduados", value: stats.graduados, icon: GraduationCap, color: "violet" },
          { label: "En Pausa", value: stats.pausa, icon: PauseCircle, color: "amber" },
        ]}
      />

      <Card>

        <FiltrosReporte
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar beneficiario..."
          filtros={[
            {
              key: "periodo",
              value: periodo,
              onChange: setPeriodo,
              options: periodosOptions,
            },
            {
              key: "estatus",
              value: estatus,
              onChange: setEstatus,
              options: [
                { value: "", label: "Todos" },
                { value: "Activo", label: "Activo" },
                { value: "Inactivo", label: "Inactivo" },
                { value: "Graduado", label: "Graduado" },
                { value: "Pausa", label: "En Pausa" },
              ],
            },
          ]}
          acciones={[
            {
              component: Boton,
              variant: "secondary",
              icon: FileSpreadsheet,
              label: "Exportar Excel",
              onClick: descargarExcel,
            },
            {
              component: Boton,
              icon: FileText,
              label: "Descargar PDF",
              onClick: descargarPDF,
            },
          ]}
        />

        <DatosTabla
          columns={[
            { key: "nombre_completo", label: "Nombre" },
            { key: "edad", label: "Edad" },
            { key: "escolaridad", label: "Escolaridad" },
            { key: "escuela", label: "Escuela" },
            { key: "estatus", label: "Estatus" },
            { key: "donador", label: "Donador" },
          ]}
          data={dataFiltrada}
          rowKey="id_beneficiario"
        />

        <PaginacionTabla
          currentPage={1}
          totalPages={1}
          totalItems={dataFiltrada.length}
          pageSize={10}
          onPageChange={() => { }}
        />

      </Card>
    </div>
  );
}