import { useMemo, useState } from "react";
import { useDonadores } from "../../../features/donadores/hooks/useDonadores";
import { exportarReporte } from "../services/reporteDonadoreService";

import Boton from "../../../components/ui/Boton";
import Card from "../../../components/ui/Card";
import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";
import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import kidsAnimation from "../../../assets/imagenes/kid.json";
import Lottie from "lottie-react";

import {
  UserX,
  HeartHandshake,
  UserCheck,
  Users,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

export default function DirectorioDonadoresTab() {
  const { data: donadores = [], isLoading: loading } = useDonadores();
  const [tipoDonador, setTipoDonador] = useState("");

  const [search, setSearch] = useState("");
  const [estatus, setEstatus] = useState("Activo");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [descargando, setDescargando] = useState(false);

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
        !search ||
        d.nombreCompleto.toLowerCase().includes(search.toLowerCase());

      const coincideEstatus =
        !estatus ||
        d.estatus?.toLowerCase() === estatus.toLowerCase();

      const coincideTipo =
        !tipoDonador ||
        d.tipo_donador?.toLowerCase() === tipoDonador.toLowerCase();

      return coincideBusqueda && coincideEstatus && coincideTipo;
    });
  }, [donadoresProcesados, search, estatus, tipoDonador]);

  // Paginación local del set de datos filtrados
  const totalPages = Math.ceil(filtrados.length / pageSize) || 1;

  const datosPaginados = useMemo(() => {
    return filtrados.slice(
      (page - 1) * pageSize,
      page * pageSize
    );
  }, [filtrados, page, pageSize]);

  // Cálculos de KPI de Tarjetas
  const totalDonadores = donadores.length;
  const activos = donadores.filter((d) => d.estatus === "Activo").length;
  const inactivos = donadores.filter((d) => d.estatus !== "Activo").length;
  const totalBeneficiarios = donadores.reduce(
    (acc, d) => acc + (d.beneficiarios_apoyados?.length || 0), 0
  );

  const dispararDescargaCliente = (buffer, nombreArchivo, mimeType) => {
    const blob = new Blob([buffer], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const descargarExcel = async (e) => {
    if (e) e.preventDefault();
    if (descargando) return;
    try {
      setDescargando(true);
      // registros filtrados actuales al Worker Maestro
      const buffer = await exportarReporte("excel", filtrados);
      dispararDescargaCliente(
        buffer,
        "Reporte_donadores_cei.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (error) {
      alert("Error al descargar");
    } finally {
      setDescargando(false);
    }
  };

  const descargarPDF = async (e) => {
    if (e) e.preventDefault();
    if (descargando) return;
    try {
      setDescargando(true);
      const buffer = await exportarReporte("pdf", filtrados);
      dispararDescargaCliente(buffer, "Reporte_donadores_cei.pdf", "application/pdf");
    } catch (error) {
      alert("Error al descargar");
    } finally {
      setDescargando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">

        <div className="w-56">
          <Lottie
            animationData={kidsAnimation}
            loop={true}
          />
        </div>

        <p className="mt-4 text-slate-600 font-medium">
          Cargando y estructurando reporte de donadores...
        </p>

      </div>
    );
  }

  const totalCEI = donadores.filter(
    (d) => d.tipo_donador === "CEI"
  ).length;

  const totalOYE = donadores.filter(
    (d) => d.tipo_donador === "OYE"
  ).length;

  const totalCANFRO = donadores.filter(
    (d) => d.tipo_donador === "CANFRO"
  ).length;
  totalCEI.toLocaleString("en-US")

  const formatoNumero = (valor) =>
    Number(valor || 0).toLocaleString("en-US");
  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          {
            label: "CEI",
            value: formatoNumero(totalCEI),
            icon: Users,
            color: "blue",
          },
          {
            label: "OYE",
            value: formatoNumero(totalOYE),
            icon: HeartHandshake,
            color: "violet",
          },
          {
            label: "CANFRO",
            value: formatoNumero(totalCANFRO),
            icon: Users,
            color: "cyan",
          },
          {
            label: "Activos",
            value: formatoNumero(activos),
            icon: UserCheck,
            color: "emerald",
          },
          {
            label: "Inactivos",
            value: formatoNumero(inactivos),
            icon: UserX,
            color: "amber",
          },
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
            {
              key: "tipo",
              value: tipoDonador,
              onChange: (value) => {
                setTipoDonador(value);
                setPage(1);
              },
              options: [
                { value: "", label: "Todos los origenes" },
                { value: "CEI", label: "CEI" },
                { value: "OYE", label: "OYE" },
                { value: "CANFRO", label: "CANFRO" },
              ],
            },
          ]}
          acciones={[
            {
              component: (props) => <Boton {...props} type="button" />,
              variant: "secondary",
              icon: FileSpreadsheet,
              label: "Excel",
              onClick: descargarExcel,
              disabled: descargando, 
            },
            {
              component: (props) => <Boton {...props} type="button" />,
              icon: FileText,
              label: "PDF",
              onClick: descargarPDF,
              disabled: descargando, 
            },
          ]}
          descargando={descargando}
        />

        <DatosTabla
          columns={[
            { key: "nombreCompleto", label: "Nombre" },
            { key: "tipo_donador", label: "Origen" },
            { key: "telefono", label: "Teléfono" },
            { key: "correo", label: "Correo" },
            { key: "estatus", label: "Estatus" },
            { key: "beneficiariosTexto", label: "Beneficiarios Apoyados" },
          ]}
          data={datosPaginados}
          rowKey="id_donador"
          loading={loading}
        />

        <PaginacionTabla
          currentPage={page}
          totalPages={totalPages}
          totalItems={filtrados.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(Number(value));
            setPage(1);
          }}
        />
      </Card>
    </div>
  );
}