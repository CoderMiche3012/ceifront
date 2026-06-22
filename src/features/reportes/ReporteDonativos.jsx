import { useState } from "react";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import DonativosPorDonadorTab from "./components/DonativosPorDonadorTab";
import DirectorioDonadoresTab from "./components/DirectorioDonadoresTab";
import { usePermissions } from "../../context/PermissionsContext";

export default function ReporteDonativos() {
    const [tabActiva, setTabActiva] = useState("directorio");
    const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
    const canViewDonativos = hasModulePermission("donativos", "ver");

    const configTabs = {
        directorio: {
            titulo: "Reporte de Donadores",
            descripcion:
                "Consulta y administra el directorio general de donadores registrados.",
        },
        donadores: {
            titulo: "Reporte del Historial de Donativos",
            descripcion:
                "Consulta el historial completo de donativos realizados por los donadores.",
        },
    };

    const { titulo, descripcion } = configTabs[tabActiva];

    return (
        <section className="flex flex-col h-full">

            {/* HEADER FIJO + DINÁMICO */}
            <div className="sticky top-0 z-10 bg-[#f3f1f4]">

                <EncabezadoPagina
                    titulo={titulo}
                    descripcion={descripcion}
                />

                {/* TABS FIJOS */}
                <div className="border-b border-gray-200">
                    <nav className="flex gap-2 overflow-x-auto">

                        <button
                            onClick={() => setTabActiva("directorio")}
                            className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${tabActiva === "directorio"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Reporte de Donadores
                        </button>
                        {canViewDonativos &&(
                            <button
                                onClick={() => setTabActiva("donadores")}
                                className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${tabActiva === "donadores"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Reporte de Donativos
                            </button>
                        )}
                    </nav>
                </div>

            </div>

            {/* CONTENIDO CON SCROLL */}
            <main className="flex-1 overflow-y-auto custom-scroll pt-4 pr-2 pb-6">

                {tabActiva === "directorio" && (
                    <DirectorioDonadoresTab />
                )}

                {tabActiva === "donadores" && (
                    <DonativosPorDonadorTab />
                )}

            </main>

        </section>
    );
}