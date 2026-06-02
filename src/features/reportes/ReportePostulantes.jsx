import { useMemo, useState } from "react";
import { Search, Users, Clock3, CheckCircle, XCircle, FileSpreadsheet, FileText, } from "lucide-react";

import { ui } from "../../styles/ui/uiClasses";

import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import TarjetasEstadisticas from "../../components/shared/TarjetasEstadisticas";
import Avatar from "../../components/shared/AvatarGeneral";

import Card from "../../components/ui/Card";
import Boton from "../../components/ui/Boton";

import FiltrosTabla from "../../components/tablas/FiltrosTabla";
import DatosTabla from "../../components/tablas/DatosTabla";
import PaginacionTabla from "../../components/tablas/PaginacionTabla";
import FiltrosReporte from "../../components/tablas/FiltrosReporte";
import { exportarReporte } from "./services/reporteService";

import { useReportePostulantes } from "./hooks/useReportePostulantes";

const PAGE_SIZE = 10;

export default function ReportePostulantes() {

    const [search, setSearch] = useState("");
    const [estatus, setEstatus] = useState("");
    const [page, setPage] = useState(1);

    const { data: postulantes, loading } = useReportePostulantes();

    const postulantesFiltrados =
        useMemo(() => {
            return postulantes.filter(
                (p) => {

                    const coincideBusqueda = p.nombreCompleto.toLowerCase().includes(search.toLowerCase());
                    const coincideEstatus = !estatus || p.estatus === estatus;

                    return (
                        coincideBusqueda && coincideEstatus
                    );
                }
            );
        }, [postulantes, search, estatus]);

    const totalPages = Math.ceil(postulantesFiltrados.length / PAGE_SIZE);
    const datosPaginados = postulantesFiltrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const estadisticas =
        useMemo(
            () => [
                {
                    label: "Total",
                    value: postulantes.length,
                    icon: Users,
                    color: "blue",
                },
                {
                    label: "En Revisión",
                    value: postulantes.filter((p) => p.estatus === "En Revisión").length,
                    icon: Clock3,
                    color: "amber",
                },
                {
                    label: "Aceptados",
                    value: postulantes.filter((p) => p.estatus === "Aceptado").length,
                    icon: CheckCircle,
                    color: "emerald",
                },
                {
                    label: "Rechazados",
                    value: postulantes.filter((p) => p.estatus === "Rechazado").length,
                    icon: XCircle,
                    color: "rose",
                },
            ],
            [postulantes]
        );

    const limpiarFiltros = () => {
        setSearch("");
        setEstatus("");
        setPage(1);
    };

    const columns = [
        {
            key: "nombre",
            label: "Nombre completo",
        },
        {
            key: "estatus",
            label: "Estatus",
        },
        {
            key: "prioridad",
            label: "Prioridad",
        },
        {
            key: "edad",
            label: "Edad",
        },
        {
            key: "genero",
            label: "Género",
        },
        {
            key: "telefono",
            label: "Teléfono",
        },
        {
            key: "tutor",
            label: "Tutor principal",
        },
        {
            key: "telefonoTutor",
            label: "Tel. tutor",
        },
        {
            key: "familiares",
            label: "N° familiares",
        },
        {
            key: "fechaVisita",
            label: "Fecha visita",
        },
    ];

    const renderCell = (row, key) => {
        switch (key) {
            case "nombre":
                return (
                    <div className="flex items-center gap-3">
                        <Avatar
                            nombre={row.nombre}
                            apellidoP={row.apellido_p}
                        />
                        <div>
                            <p className="font-medium">
                                {row.nombreCompleto}
                            </p>
                        </div>
                    </div>
                );

            default:
                return row[key] !== undefined &&
                    row[key] !== null
                    ? row[key]
                    : "-";
        }
    };
    const descargarExcel = async () => {
        try {
            const buffer = await exportarReporte(
                "excel",
                postulantesFiltrados
            );

            const blob = new Blob(
                [buffer],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const a =
                document.createElement("a");

            a.href = url;
            a.download = "postulantes.xlsx";
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };

    const descargarPDF = async () => {
        try {
            const buffer = await exportarReporte(
                "pdf",
                postulantesFiltrados
            );

            const blob = new Blob(
                [buffer],
                {
                    type: "application/pdf",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const a =
                document.createElement("a");

            a.href = url;
            a.download = "postulantes.pdf";
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };
    if (loading) {
        return (
            <div className="p-6">
                Cargando reporte...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <EncabezadoPagina
                titulo="Padrón de Postulantes"
                descripcion="Consulta y exporta información de los postulantes."
            />

            <TarjetasEstadisticas
                items={estadisticas}
            />

            <Card>
                <FiltrosReporte
                    search={search}
                    onSearchChange={(value) => {
                        setSearch(value);
                        setPage(1);
                    }}
                    searchPlaceholder="Buscar postulante..."
                    filtros={[
                        {
                            key: "estatus",
                            value: estatus,
                            onChange: (value) => {
                                setEstatus(value);
                                setPage(1);
                            },
                            options: [
                                {
                                    value: "",
                                    label: "Todos los estatus",
                                },
                                {
                                    value: "En Revisión",
                                    label: "En Revisión",
                                },
                                {
                                    value: "Aceptado",
                                    label: "Aceptado",
                                },
                                {
                                    value: "Rechazado",
                                    label: "Rechazado",
                                },
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
                    columns={columns}
                    data={datosPaginados}
                    rowKey="id_postulante"
                    renderCell={renderCell}
                />

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
