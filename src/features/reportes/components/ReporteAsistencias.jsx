import { useMemo, useState, useEffect } from "react";
import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";
import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";
import { Users, CalendarDays, FileSpreadsheet, FileText } from "lucide-react";
import { useAsistenciasPorFiltro } from "../../asistencias/hooks/useAsistencia";
import { solicitarDescargaReporte } from "../services/reporteService";
import AvatarGeneral from "../../../components/shared/AvatarGeneral";
import kidsAnimation from "../../../assets/imagenes/kid.json";
import Lottie from "lottie-react";

export default function ReporteUsosServiciosTab() {

  const [pageSize, setPageSize] = useState(10);
  const [pagina, setPagina] = useState(1);
  const hoy = new Date();
  const [isExporting, setIsExporting] = useState(false);
  const [search, setSearch] = useState("");
  const [mes, setMes] = useState((hoy.getMonth() + 1).toString());
  const [anio, setAnio] = useState(hoy.getFullYear().toString());
  const [tipo, setTipo] = useState("comedor");
  const mesFormateado = `${anio}-${mes.padStart(2, "0")}`;

  const { data: asistencias = [], isLoading } = useAsistenciasPorFiltro(mesFormateado, tipo);

  //filtrado
  const dataFiltrada = useMemo(() => {
    // 1. Filtrar primero para dejar solo los registros que asistieron (true)
    const soloAsistidos = asistencias.filter((item) => item.asistencia === true);

    // 2. Si el buscador está vacío, regresar solo los que asistieron
    if (!search) return soloAsistidos;

    // 3. Si escriben en el buscador, filtrar por nombre sobre los que sí asistieron
    return soloAsistidos.filter((item) =>
      item.expediente_resumen?.nombre_completo
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [asistencias, search]);
  useEffect(() => {
    setPagina(1);
  }, [search, mes, anio, tipo]);

  // estadisticas
  const stats = useMemo(() => {
    const beneficiarios = new Set();
    let totalAcompanantes = 0;
    dataFiltrada.forEach((item) => {
      beneficiarios.add(item.expediente_resumen?.nombre_completo);
      totalAcompanantes += Number(item.numero_acompanantes || 0);
    });
    return {
      totalUsos: dataFiltrada.length,
      totalAcompanantes,
      beneficiarios: beneficiarios.size,
    };
  }, [dataFiltrada]);

  // descargar
  const ejecutarDescargaBlob = (buffer, nombreArchivo, mimeType) => {
    if (!buffer) return;
    const realBuffer = buffer instanceof ArrayBuffer ? buffer : buffer.buffer;
    const blob = new Blob([realBuffer], { type: mimeType });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const dataExport = useMemo(() => {
    return dataFiltrada.map((b) => ({
      nombre_completo: b.expediente_resumen?.nombre_completo ?? "--",
      tipo_servicio: b.tipo_servicio ?? "--",
      numero_acompanantes: b.numero_acompanantes ?? 0,
      fecha_realizacion: b.fecha_realizacion ?? "--",
    }));
  }, [dataFiltrada]);
  const descargarExcel = async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);
      const buffer = await solicitarDescargaReporte(
        "asistencias",
        "excel",
        dataExport
      );
      ejecutarDescargaBlob(buffer,
        "ReporteAsistencias.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (error) {
      alert("Error al descargar");
    } finally {
      setIsExporting(false);
    }
  };

  const descargarPDF = async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);
      const buffer = await solicitarDescargaReporte("asistencias",
        "pdf",
        dataExport
      );
      ejecutarDescargaBlob(buffer,
        "ReporteAsistencias.pdf",
        "application/pdf"
      );
    } catch (error) {
      alert("Error al descargar");
    } finally {
      setIsExporting(false);
    }
  };

  //filtros
  const configuracionFiltros = [
    {
      key: "mes",
      value: mes,
      onChange: setMes,
      options: [
        { value: "1", label: "Enero" },
        { value: "2", label: "Febrero" },
        { value: "3", label: "Marzo" },
        { value: "4", label: "Abril" },
        { value: "5", label: "Mayo" },
        { value: "6", label: "Junio" },
        { value: "7", label: "Julio" },
        { value: "8", label: "Agosto" },
        { value: "9", label: "Septiembre" },
        { value: "10", label: "Octubre" },
        { value: "11", label: "Noviembre" },
        { value: "12", label: "Diciembre" },
      ],
    },
    {
      key: "anio",
      value: anio,
      onChange: setAnio,
      options: [
        { value: "2026", label: "2026" },
        { value: "2025", label: "2025" },
      ],
    },
    {
      key: "tipo",
      value: tipo,
      onChange: setTipo,
      options: [
        { value: "comedor", label: "Comedor" },
        { value: "psicologia", label: "Psicología" },
      ],
    },
  ];
  const dataPaginada = useMemo(() => {
    return dataFiltrada.slice(
      (pagina - 1) * pageSize,
      pagina * pageSize
    );
  }, [dataFiltrada, pagina, pageSize]);
  const totalPages = Math.max(
    1,
    Math.ceil(dataFiltrada.length / pageSize)
  );

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">

        <div className="w-56">
          <Lottie
            animationData={kidsAnimation}
            loop={true}
          />
        </div>

        <p className="mt-4 text-slate-600 font-medium">
          Cargando y estructurando reporte De Asistencias...
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          {
            label: "Total Usos",
            value: stats.totalUsos,
            icon: CalendarDays,
            color: "blue",
          },
          {
            label: "Acompañantes Totales",
            value: stats.totalAcompanantes,
            icon: Users,
            color: "emerald",
          },
          {
            label: "Beneficiarios",
            value: stats.beneficiarios,
            icon: Users,
            color: "violet",
          },
        ]}
      />

      <Card>
        <FiltrosReporte
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar beneficiario..."
          filtros={configuracionFiltros}
          acciones={[
            {
              component: Boton,
              variant: "secondary",
              icon: FileSpreadsheet,
              label: isExporting ? "Generando..." : "Excel",
              onClick: descargarExcel,
              disabled: isExporting,
            },
            {
              component: Boton,
              icon: FileText,
              label: isExporting ? "Generando..." : "PDF",
              onClick: descargarPDF,
              disabled: isExporting,
            },
          ]}
        />

        <DatosTabla
          data={dataPaginada}
          columns={[
            { key: "beneficiario", label: "Beneficiario" },
            { key: "tipo_servicio", label: "Servicio" },
            { key: "numero_acompanantes", label: "Acompañantes" },
            { key: "fecha_realizacion", label: "Fecha" },
          ]}
          renderCell={(item, key) => {
            switch (key) {
              case "beneficiario":
                return item.expediente_resumen?.nombre_completo ?? "--";
              case "tipo_servicio":
                return item.tipo_servicio;
              case "numero_acompanantes":
                return item.numero_acompanantes;
              case "fecha_realizacion":
                return item.fecha_realizacion;
              default:
                return item[key];
            }
          }}
        />

        <PaginacionTabla
          currentPage={pagina}
          totalPages={totalPages}
          totalItems={dataFiltrada.length}
          pageSize={pageSize}
          onPageChange={setPagina}
          onPageSizeChange={setPageSize}
        />
      </Card>
    </div>
  );
}

