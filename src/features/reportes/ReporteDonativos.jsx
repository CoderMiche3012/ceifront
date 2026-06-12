import { useState } from "react";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import DonativosPorDonadorTab from "./components/DonativosPorDonadorTab";
import DirectorioDonadoresTab from "./components/DirectorioDonadoresTab";

export default function ReporteDonativos() {
    const [tabActiva, setTabActiva] = useState("directorio");
    return (
        <div className="space-y-6">
            <EncabezadoPagina
                titulo="Reporte de Donadores"
                descripcion="Consulta, filtra y exporta información relacionada con los donadores registrados."
            />

            <div className="border-b border-gray-200">
                <nav className="flex gap-2">
                    <button
                        onClick={() => setTabActiva("directorio")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tabActiva === "directorio"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Reporte de Donadores
                    </button>


                    <button
                        onClick={() => setTabActiva("donadores")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tabActiva === "donadores"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Historial de Donativos
                    </button>
                </nav>
            </div>

            {tabActiva === "donadores" && <DonativosPorDonadorTab />}

            {tabActiva === "directorio" && <DirectorioDonadoresTab />}
        </div>
    );
}