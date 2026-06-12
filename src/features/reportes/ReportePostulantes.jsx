// src/features/postulantes/ReportePostulantes.jsx
import { useMemo, useState } from "react";
import { Users, Clock3, CheckCircle, XCircle } from "lucide-react";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import TarjetasEstadisticas from "../../components/shared/TarjetasEstadisticas";
import Avatar from "../../components/shared/AvatarGeneral";

import Card from "../../components/ui/Card";

import DatosTabla from "../../components/tablas/DatosTabla";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";

import PostulanteReporteFiltros from "./components/PostulanteReporteFiltros";

import { solicitarDescargaReporte } from "./services/reporteService";
import { useReportePostulantes } from "./hooks/useReportePostulantes";

const PAGE_SIZE = 10;
const INITIAL_FILTERS = {
    decision: "Pendiente",
    prioridad: "todos",
    visita: "todos",
    estudio: "todos",
};

export default function ReportePostulantes() {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [page, setPage] = useState(1);

    const { data: postulantes = [], loading } = useReportePostulantes();

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearch("");
        setFilters(INITIAL_FILTERS);
        setPage(1);
    };

    const postulantesFiltrados = useMemo(() => {
        return postulantes.filter((p) => {
            const coincideBusqueda = !search || p.nombreCompleto
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
                p.tutor?.toLowerCase().includes(search.toLowerCase());

            const coincideEstatus = filters.decision === "todos" || p.estatus === filters.decision;

            const coincidePrioridad = filters.prioridad === "todos" ||
                p.prioridad?.toString().toLowerCase() === filters.prioridad.toLowerCase();

            const coincideVisita = filters.visita === "todos" ||
                p.estadoVisita?.toString().toLowerCase() === filters.visita.toLowerCase();

            const coincideEstudio = filters.estudio === "todos" ||
                p.estatusEstudio?.toString().toLowerCase() === filters.estudio.toLowerCase();

            return coincideBusqueda && coincideEstatus && coincidePrioridad && coincideVisita && coincideEstudio;
        });
    }, [postulantes, search, filters]);

    const totalPages = Math.ceil(postulantesFiltrados.length / PAGE_SIZE) || 1;
    const datosPaginados = useMemo(() => {
        return postulantesFiltrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }, [postulantesFiltrados, page]);

    const estadisticas = useMemo(
        () => [
            { label: "Total", value: postulantes.length, icon: Users, color: "blue" },
            { label: "Pendiente", value: postulantes.filter((p) => p.estatus === "Pendiente").length, icon: Clock3, color: "amber" },
            { label: "Aceptados", value: postulantes.filter((p) => p.estatus === "Aceptado").length, icon: CheckCircle, color: "emerald" },
            { label: "Rechazados", value: postulantes.filter((p) => p.estatus === "Rechazado").length, icon: XCircle, color: "rose" },
        ],
        [postulantes]
    );

    const columns = [
        { key: "nombre", label: "Nombre completo" },
        { key: "estatus", label: "Estatus" },
        { key: "prioridad", label: "Prioridad" },
        { key: "edad", label: "Edad" },
        { key: "genero", label: "Género" },
        { key: "telefono", label: "Teléfono" },
        { key: "tutor", label: "Tutor principal" },
        { key: "telefonoTutor", label: "Tel. tutor" },
        { key: "familiares", label: "N° familiares" },
        { key: "fechaVisita", label: "Fecha visita" },
    ];

    const renderCell = (row, key) => {
        if (key === "nombre") {
            return (
                <div className="flex items-center gap-3">
                    <Avatar nombre={row.nombre} apellidoP={row.apellido_p} />
                    <div>
                        <p className="font-medium">{row.nombreCompleto}</p>
                    </div>
                </div>
            );
        }
        return row[key] !== undefined && row[key] !== null ? row[key] : "-";
    };

    const ejecutarDescargaBlob = (buffer, nombreArchivo, mimeType) => {
        if (!buffer) return console.error("Buffer vacío");
        const realBuffer = buffer instanceof ArrayBuffer ? buffer : buffer.buffer;
        const blob = new Blob([realBuffer], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = nombreArchivo;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const descargarExcel = async () => {
        try {
            const buffer = await solicitarDescargaReporte("nuevosIngresos", "excel", postulantesFiltrados);
            ejecutarDescargaBlob(buffer, "padrón_nuevos_ingresos_cei.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        } catch (error) {
            console.error("Error al descargar Excel:", error);
        }
    };

    const descargarPDF = async () => {
        try {
            const buffer = await solicitarDescargaReporte("nuevosIngresos", "pdf", postulantesFiltrados);
            ejecutarDescargaBlob(buffer, "padrón_nuevos_ingresos_cei.pdf", "application/pdf");
        } catch (error) {
            console.error("Error al descargar PDF:", error);
        }
    };

    if (loading) {
        return <div className="p-6 text-emerald-800 font-medium animate-pulse">Cargando reporte...</div>;
    }

    return (
        <div className="space-y-6">
            <EncabezadoPagina
                titulo="Padrón de Nuevos Ingresos"
                descripcion="Consulta y exporta información de los los postulantes a beneficiarios"
            />

            <TarjetasEstadisticas items={estadisticas} />

            <Card>
                <PostulanteReporteFiltros
                    search={search}
                    filters={filters}
                    onSearchChange={(val) => { setSearch(val); setPage(1); }}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    onDescargarExcel={descargarExcel}
                    onDescargarPDF={descargarPDF}
                />

                <DatosTabla columns={columns} data={datosPaginados} rowKey="id_postulante" renderCell={renderCell} />

                <PaginacionTabla
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={postulantesFiltrados.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setPage}
                />
            </Card>
        </div>
    );
}