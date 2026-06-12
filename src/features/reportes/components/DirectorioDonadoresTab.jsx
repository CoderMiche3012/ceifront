import { useMemo, useState } from "react";
import { useDonadores } from "../../../features/donadores/hooks/useDonadores";
import { exportarReporte } from "../services/reporteDonadoreService";

import Boton from "../../../components/ui/Boton";
import Card from "../../../components/ui/Card";
import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";
import FiltrosReporte from "../../../components/tablas/FiltrosReporte";

import {
  UserX,
  HeartHandshake,
  UserCheck,
  Users,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

const PAGE_SIZE = 10;

export default function DirectorioDonadoresTab() {
  const { data: donadores = [], isLoading: loading } = useDonadores();

  const [search, setSearch] = useState("");
  const [estatus, setEstatus] = useState("Activo");
  const [page, setPage] = useState(1);

  // Normalización del padrón de datos
  const donadoresProcesados = useMemo(() => {
    const calcularEdad = (fechaNacimiento) => {
      if (!fechaNacimiento) return "N/D";

      const hoy = new Date();
      const nacimiento = new Date(fechaNacimiento);

      let edad = hoy.getFullYear() - nacimiento.getFullYear();

      const mes = hoy.getMonth() - nacimiento.getMonth();

      if (
        mes < 0 ||
        (mes === 0 && hoy.getDate() < nacimiento.getDate())
      ) {
        edad--;
      }

      return edad;
    };

    return donadores.map((d) => ({
      ...d,
      nombreCompleto: [d.nombre, d.apellido_paterno, d.apellido_materno]
        .filter(Boolean)
        .join(" "),

      beneficiariosTexto:
        d.beneficiarios_apoyados?.length > 0
          ? d.beneficiarios_apoyados
            .map(
              (b) =>
                `${b.nombre} (${calcularEdad(
                  b.fecha_nacimiento
                )} años)`
            )
            .join(", ")
          : "Sin beneficiarios",
    }));
  }, [donadores]);

  // Aplicación de filtros reactivos
  const filtrados = useMemo(() => {
    return donadoresProcesados.filter((d) => {
      const coincideBusqueda =
        !search || d.nombreCompleto.toLowerCase().includes(search.toLowerCase());
      const coincideEstatus =
        !estatus || d.estatus?.toLowerCase() === estatus.toLowerCase();

      return coincideBusqueda && coincideEstatus;
    });
  }, [donadoresProcesados, search, estatus]);

  // Paginación local del set de datos filtrados
  const totalPages = Math.ceil(filtrados.length / PAGE_SIZE) || 1;
  const datosPaginados = useMemo(() => {
    return filtrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filtrados, page]);

  // Cálculos de KPI de Tarjetas
  const totalDonadores = donadores.length;
  const activos = donadores.filter((d) => d.estatus === "Activo").length;
  const inactivos = donadores.filter((d) => d.estatus !== "Activo").length;
  const totalBeneficiarios = donadores.reduce(
    (acc, d) => acc + (d.beneficiarios_apoyados?.length || 0), 0
  );

  // Helper nativo para bajar los bytes devueltos por el worker sin bloquear la UI
  const dispararDescargaCliente = (buffer, nombreArchivo, mimeType) => {
    const blob = new Blob([buffer], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const descargarExcel = async () => {
    try {
      // Pasamos los registros filtrados actuales al Worker Maestro
      const buffer = await exportarReporte("excel", filtrados);
      dispararDescargaCliente(
        buffer,
        "padrón_donadores_cei.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (error) {
      console.error("Error al descargar Excel de donadores desde el worker:", error);
    }
  };

  const descargarPDF = async () => {
    try {
      const buffer = await exportarReporte("pdf", filtrados);
      dispararDescargaCliente(buffer, "padrón_donadores_cei.pdf", "application/pdf");
    } catch (error) {
      console.error("Error al descargar PDF de donadores desde el worker:", error);
    }
  };

  if (loading) {
    return <div className="p-6 text-emerald-800 font-medium animate-pulse">Cargando reporte de donadores...</div>;
  }

  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          { label: "Donadores Totales", value: totalDonadores, icon: Users, color: "blue" },
          { label: "Activos", value: activos, icon: UserCheck, color: "emerald" },
          { label: "Inactivos", value: inactivos, icon: UserX, color: "amber" },
          { label: "Beneficiarios Apoyados", value: totalBeneficiarios, icon: HeartHandshake, color: "violet" },
        ]}
      />

      <Card>
        <FiltrosReporte
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder="Buscar donador..."
          filtros={[
            {
              key: "estatus",
              value: estatus,
              onChange: (value) => {
                setEstatus(value);
                setPage(1);
              },
              options: [
                { value: "Activo", label: "Activos" },
                { value: "Inactivo", label: "Inactivos" },
              ],
            },
          ]}
          acciones={[
            { component: Boton, variant: "secondary", icon: FileSpreadsheet, label: "Exportar Excel", onClick: descargarExcel },
            { component: Boton, icon: FileText, label: "Descargar PDF", onClick: descargarPDF },
          ]}
        />

        <DatosTabla
          columns={[
            { key: "nombreCompleto", label: "Nombre" },
            { key: "tipo_donador", label: "Tipo" },
            { key: "telefono", label: "Teléfono" },
            { key: "correo", label: "Correo" },
            { key: "estatus", label: "Estatus" },
            { key: "beneficiariosTexto", label: "Beneficiarios Apoyados" },
          ]}
          data={datosPaginados} // Renderiza únicamente los 10 correspondientes
          rowKey="id_donador"
          loading={loading}
        />

        <PaginacionTabla
          currentPage={page}
          totalPages={totalPages}
          totalItems={filtrados.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
}